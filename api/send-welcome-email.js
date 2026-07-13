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

const buildWelcomeEmail = (subscriber) => {
  const name = subscriber.name?.trim() || "there";
  const safeName = escapeHtml(name);
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`;
  const latestArticleUrl = `${siteUrl}/#/writing/hidden-human`;
  const latestArticleTitle = "The Hidden Human in System Design";

  return {
    subject: "Welcome to Notes from Flyness ✦",
    text: `Hi ${name},

Welcome to Notes from Flyness.

You are officially in the tiny research salon: systems notes, careful questions, and the occasional well-behaved sparkle.

I’ll send a small inbox note when I publish something new — usually about systems, safety, memory, parallelism, and the human side of computing.

Start here: ${latestArticleTitle}
${latestArticleUrl}

Warmly,
Flyness

Visit the site: ${siteUrl}
Unsubscribe: ${unsubscribeUrl}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#302830;color:#2d2430;font-family:Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">You’re in — careful systems notes with a little blush in the margins.</div>
    <div style="max-width:680px;margin:0 auto;padding:34px 18px;">
      <div style="background:#f8f4ef;border:1px solid #e9ccd0;">
        <div style="background:#302830;color:#f8f4ef;padding:28px 30px;border-bottom:6px solid #d8b7bf;">
          <p style="margin:0;text-transform:uppercase;letter-spacing:2.4px;color:#d9a8b6;font-size:11px;font-weight:bold;">Notes from Flyness</p>
          <h1 style="font-family:Georgia,serif;font-weight:400;font-size:42px;line-height:1.05;margin:14px 0 0;">Welcome to the tiny research salon.</h1>
        </div>
        <div style="padding:32px 30px;">
          <p style="font-size:16px;line-height:1.75;color:#5c505b;margin:0 0 18px;">Hi ${safeName},</p>
          <p style="font-size:16px;line-height:1.75;color:#5c505b;margin:0 0 18px;">You’re officially on the list: systems notes, careful questions, and the occasional well-behaved sparkle.</p>
          <p style="font-size:16px;line-height:1.75;color:#5c505b;margin:0 0 24px;">I write about operating systems, parallelism, memory, safety, and the humans trying very hard not to be surprised by their abstractions.</p>
          <div style="background:#eee2d7;border-left:4px solid #6d3655;padding:22px;margin:28px 0;">
            <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:1.8px;color:#6d3655;font-size:10px;font-weight:bold;">Start here</p>
            <h2 style="font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.15;margin:0 0 10px;color:#2d2430;">${latestArticleTitle}</h2>
            <p style="font-size:15px;line-height:1.65;color:#675b64;margin:0 0 18px;">A note on API design, cognitive load, and why “safe parallel code” keeps asking humans to hold too much in their heads.</p>
            <a href="${latestArticleUrl}" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:13px 17px;">Read the latest article</a>
          </div>
          <p style="font-size:15px;line-height:1.7;color:#5c505b;margin:24px 0 0;">Warmly,<br /><strong>Flyness</strong></p>
          <p style="font-size:12px;line-height:1.6;color:#897c84;margin-top:30px;border-top:1px solid #e2d6d2;padding-top:18px;">
            No spam. No content confetti. Just new essays when they exist.<br />
            <a href="${unsubscribeUrl}" style="color:#6d3655;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>`,
  };
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return response.status(500).json({ error: "Welcome emails are missing server environment variables." });
  }

  const email = request.body?.email?.trim().toLowerCase();

  if (!email) {
    return response.status(400).json({ error: "Missing email." });
  }

  const supabase = createClient(process.env.SUPABASE_URL || "https://icxemskklrnipakvpuoc.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: subscriber, error: lookupError } = await supabase
    .from("subscribers")
    .select("email, name, unsubscribe_token, welcome_sent_at, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return response.status(500).json({ error: lookupError.message });
  }

  if (!subscriber || subscriber.unsubscribed_at) {
    return response.status(404).json({ error: "Subscriber not found." });
  }

  if (subscriber.welcome_sent_at) {
    return response.status(200).json({ sent: false, reason: "Welcome email was already sent." });
  }

  await sendEmail({
    to: subscriber.email,
    ...buildWelcomeEmail(subscriber),
  });

  const { error: updateError } = await supabase
    .from("subscribers")
    .update({ welcome_sent_at: new Date().toISOString() })
    .eq("email", subscriber.email);

  if (updateError) {
    return response.status(500).json({ error: updateError.message });
  }

  return response.status(200).json({ sent: true });
}
