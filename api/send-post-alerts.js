import { createClient } from "@supabase/supabase-js";

const siteUrl = process.env.SITE_URL || "https://flynessnamatama.com";
const fromEmail = process.env.ALERT_FROM_EMAIL || "Flyness Namatama <notes@flynessnamatama.com>";

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const decodeXml = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

const readTag = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1]?.trim() || "");
};

const parseFeedItems = (xml) =>
  [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const itemXml = match[1];
      const title = readTag(itemXml, "title");
      const link = readTag(itemXml, "link");
      const guid = readTag(itemXml, "guid") || link;
      const description = readTag(itemXml, "description");
      const pubDate = readTag(itemXml, "pubDate");

      return { title, link, guid, description, pubDate };
    })
    .filter((item) => item.title && item.link && item.guid)
    .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

const sendEmail = async ({ to, subject, html, text }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend failed: ${response.status} ${detail}`);
  }
};

const buildEmail = ({ subscriber, post }) => {
  const name = subscriber.name?.trim() || "there";
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`;
  const safeTitle = escapeHtml(post.title);
  const safeDescription = escapeHtml(post.description);
  const safeName = escapeHtml(name);

  return {
    subject: `New note from Flyness: ${post.title}`,
    text: `Hi ${name},

I published a new note:

${post.title}

${post.description}

Read it here: ${post.link}

Warmly,
Flyness

Unsubscribe: ${unsubscribeUrl}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#f8f4ef;color:#2d2430;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:40px 24px;">
      <p style="text-transform:uppercase;letter-spacing:2px;color:#6d3655;font-size:11px;">Notes from Flyness</p>
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:36px;line-height:1.1;margin:14px 0 18px;">${safeTitle}</h1>
      <p style="font-size:16px;line-height:1.7;color:#5c505b;">Hi ${safeName},</p>
      <p style="font-size:16px;line-height:1.7;color:#5c505b;">I published a new note — careful systems writing, with a little blush in the margins.</p>
      <p style="font-size:16px;line-height:1.7;color:#5c505b;">${safeDescription}</p>
      <p style="margin:30px 0;">
        <a href="${post.link}" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:14px 18px;">Read the note</a>
      </p>
      <p style="font-size:15px;line-height:1.7;color:#5c505b;">Warmly,<br />Flyness</p>
      <p style="font-size:12px;line-height:1.6;color:#897c84;margin-top:34px;">
        No spam. No content confetti. Just new essays when they exist.<br />
        <a href="${unsubscribeUrl}" style="color:#6d3655;">Unsubscribe</a>
      </p>
    </div>
  </body>
</html>`,
  };
};

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return response.status(500).json({ error: "Email alerts are missing server environment variables." });
  }

  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.authorization || "";
    const querySecret = request.query?.secret;
    const validSecret = authHeader === `Bearer ${process.env.CRON_SECRET}` || querySecret === process.env.CRON_SECRET;

    if (!validSecret) {
      return response.status(401).json({ error: "Unauthorized" });
    }
  }

  const supabase = createClient(process.env.SUPABASE_URL || "https://icxemskklrnipakvpuoc.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const feedResponse = await fetch(`${siteUrl}/feed.xml`);
  if (!feedResponse.ok) {
    return response.status(502).json({ error: "Could not read the site feed." });
  }

  const items = parseFeedItems(await feedResponse.text());
  const latestPost = items[0];

  if (!latestPost) {
    return response.status(200).json({ sent: false, reason: "No posts found." });
  }

  const { data: alreadySent, error: sentLookupError } = await supabase
    .from("sent_post_alerts")
    .select("id")
    .eq("post_guid", latestPost.guid)
    .maybeSingle();

  if (sentLookupError) {
    return response.status(500).json({ error: sentLookupError.message });
  }

  if (alreadySent) {
    return response.status(200).json({ sent: false, reason: "Latest post was already sent." });
  }

  const { data: subscribers, error: subscribersError } = await supabase
    .from("subscribers")
    .select("email, name, unsubscribe_token")
    .is("unsubscribed_at", null);

  if (subscribersError) {
    return response.status(500).json({ error: subscribersError.message });
  }

  if (!subscribers?.length) {
    await supabase.from("sent_post_alerts").insert({
      post_guid: latestPost.guid,
      post_title: latestPost.title,
    });

    return response.status(200).json({ sent: false, reason: "No active subscribers." });
  }

  const failures = [];
  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        to: subscriber.email,
        ...buildEmail({ subscriber, post: latestPost }),
      });
    } catch (error) {
      failures.push({ email: subscriber.email, message: error.message });
    }
  }

  if (failures.length === subscribers.length) {
    return response.status(502).json({ error: "No emails were sent.", failures });
  }

  await supabase.from("sent_post_alerts").insert({
    post_guid: latestPost.guid,
    post_title: latestPost.title,
  });

  return response.status(200).json({
    sent: true,
    post: latestPost.title,
    recipients: subscribers.length - failures.length,
    failures,
  });
}
