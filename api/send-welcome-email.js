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

  return {
    subject: "You’re on the list — Notes from Flyness",
    text: `Hi ${name},

You’re subscribed to Notes from Flyness.

I’ll send a small inbox note when I publish something new — usually about systems, safety, memory, parallelism, and the human side of computing.

No spam. No content confetti. Just new essays when they exist.

Warmly,
Flyness

Visit the site: ${siteUrl}
Unsubscribe: ${unsubscribeUrl}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#f8f4ef;color:#2d2430;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:40px 24px;">
      <p style="text-transform:uppercase;letter-spacing:2px;color:#6d3655;font-size:11px;">Notes from Flyness</p>
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:40px;line-height:1.1;margin:14px 0 18px;">You’re on the list.</h1>
      <p style="font-size:16px;line-height:1.7;color:#5c505b;">Hi ${safeName},</p>
      <p style="font-size:16px;line-height:1.7;color:#5c505b;">Welcome to the tiny research salon. I’ll send a small inbox note when I publish something new — usually about systems, safety, memory, parallelism, and the human side of computing.</p>
      <p style="font-size:16px;line-height:1.7;color:#5c505b;">Expect careful little essays from the place where operating systems meet human expectation, with a little blush in the margins.</p>
      <p style="margin:30px 0;">
        <a href="${siteUrl}" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:14px 18px;">Visit the site</a>
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
