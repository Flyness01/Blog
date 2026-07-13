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
  <body style="margin:0;background:#302830;color:#2d2430;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">A new systems note from Flyness is ready.</div>
    <div style="max-width:680px;margin:0 auto;padding:34px 18px;">
      <div style="background:#f8f4ef;border:1px solid #e9ccd0;">
        <div style="background:#302830;color:#f8f4ef;padding:28px 30px;border-bottom:6px solid #d8b7bf;">
          <p style="margin:0;text-transform:uppercase;letter-spacing:2.7px;color:#d9a8b6;font-size:10px;font-weight:700;">New note from Flyness</p>
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:40px;line-height:1.06;margin:14px 0 0;letter-spacing:-.5px;">${safeTitle}</h1>
        </div>
        <div style="padding:32px 30px;">
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">Hi ${safeName},</p>
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">A new note just left the lab bench. It has systems, safety, and a small amount of intellectual mischief — academically supervised, of course.</p>
          <div style="background:#eee2d7;border-left:4px solid #6d3655;padding:22px;margin:28px 0;">
            <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:1.9px;color:#6d3655;font-size:10px;font-weight:700;">Today’s question</p>
            <p style="font-size:16px;line-height:1.68;color:#675b64;margin:0;">${safeDescription}</p>
          </div>
          <p style="margin:30px 0;">
            <a href="${post.link}" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:14px 18px;font-weight:700;letter-spacing:.2px;">Read the note</a>
          </p>
          <p style="font-size:15px;line-height:1.7;color:#5c505b;margin:24px 0 0;">Warmly,<br /><strong>Flyness</strong></p>
          <p style="font-size:12px;line-height:1.6;color:#897c84;margin-top:30px;border-top:1px solid #e2d6d2;padding-top:18px;">
            No spam. No content confetti. Just new essays when they exist.<br />
            <a href="${unsubscribeUrl}" style="color:#6d3655;">Unsubscribe</a>
          </p>
          <p style="margin:20px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:1.5px;color:#b9647d;">F<span style="color:#6d3655;">✦</span>N</p>
        </div>
      </div>
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
