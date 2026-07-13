const siteUrl = process.env.SITE_URL || "https://flynessnamatama.com";
const fromEmail = process.env.ALERT_FROM_EMAIL || "Flyness Namatama <notes@flynessnamatama.com>";
const replyToEmail = process.env.REPLY_TO_EMAIL;

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
      ...(replyToEmail ? { reply_to: replyToEmail } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend failed: ${response.status} ${detail}`);
  }
};

const footer = () => `
          <p style="font-size:15px;line-height:1.7;color:#5c505b;margin:24px 0 0;">Warmly,<br /><strong>Flyness</strong></p>
          <p style="margin:30px 0 0;border-top:1px solid #e2d6d2;padding-top:18px;font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:1.6px;color:#6d3655;">F ✦ N</p>
          <p style="font-size:12px;line-height:1.6;color:#897c84;margin-top:12px;">
            Test email only. No subscriber list was contacted.<br />
            <a href="${siteUrl}" style="color:#6d3655;">Return to the site</a>
          </p>`;

const emailShell = ({ eyebrow, title, preview, body }) => `<!doctype html>
<html>
  <body style="margin:0;background:#302830;color:#2d2430;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preview)}</div>
    <div style="max-width:680px;margin:0 auto;padding:34px 18px;">
      <div style="background:#f8f4ef;border:1px solid #e9ccd0;">
        <div style="background:#302830;color:#f8f4ef;padding:28px 30px;border-bottom:6px solid #d8b7bf;">
          <p style="margin:0;text-transform:uppercase;letter-spacing:2.7px;color:#d9a8b6;font-size:10px;font-weight:700;">${escapeHtml(eyebrow)}</p>
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:42px;line-height:1.05;margin:14px 0 0;letter-spacing:-.5px;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:32px 30px;">
          ${body}
          ${footer()}
        </div>
      </div>
    </div>
  </body>
</html>`;

const buildWelcomeTest = ({ name }) => {
  const safeName = escapeHtml(name || "there");
  const latestArticleUrl = `${siteUrl}/writing/hidden-human`;
  const latestArticleTitle = "The Hidden Human in System Design";

  return {
    subject: "[Test] Welcome to Notes from Flyness ✦",
    text: `Hi ${name || "there"},

This is a test welcome email.

You are officially in the tiny research salon: systems notes, careful questions, and the occasional well-behaved sparkle.

Start here: ${latestArticleTitle}
${latestArticleUrl}

This test was sent only to you.`,
    html: emailShell({
      eyebrow: "Test welcome email",
      title: "Welcome to the tiny research salon.",
      preview: "Test welcome email from Notes from Flyness.",
      body: `
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">Hi ${safeName},</p>
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">This is the welcome email preview. Systems notes, careful questions, and the occasional well-behaved sparkle, all behaving themselves in your inbox.</p>
          <div style="background:#eee2d7;border-left:4px solid #6d3655;padding:22px;margin:28px 0;">
            <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:1.9px;color:#6d3655;font-size:10px;font-weight:700;">Start here</p>
            <h2 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:29px;line-height:1.12;margin:0 0 10px;color:#2d2430;letter-spacing:-.25px;">${latestArticleTitle}</h2>
            <p style="font-size:15px;line-height:1.65;color:#675b64;margin:0 0 18px;">A note on API design, cognitive load, and why safe parallel code keeps asking humans to hold too much in their heads.</p>
            <a href="${latestArticleUrl}" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:13px 17px;font-weight:700;letter-spacing:.2px;">Read the latest article</a>
          </div>`,
    }),
  };
};

const buildPostTest = ({ name }) => {
  const safeName = escapeHtml(name || "there");
  const postTitle = "Test dispatch from the margins";
  const postDescription = "A pretend new-post alert, sent only to you, so we can inspect the design without disturbing the subscriber list.";
  const postLink = `${siteUrl}/writing/hidden-human`;

  return {
    subject: `[Test] New note from Flyness: ${postTitle}`,
    text: `Hi ${name || "there"},

This is a test new-post alert.

${postTitle}

${postDescription}

Read it here: ${postLink}

This test was sent only to you.`,
    html: emailShell({
      eyebrow: "Test post alert",
      title: postTitle,
      preview: "Test new-post email from Notes from Flyness.",
      body: `
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">Hi ${safeName},</p>
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">A pretend note just left the lab bench. It has systems, safety, and a small amount of intellectual mischief, academically supervised, of course.</p>
          <div style="background:#eee2d7;border-left:4px solid #6d3655;padding:22px;margin:28px 0;">
            <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:1.9px;color:#6d3655;font-size:10px;font-weight:700;">Today’s question</p>
            <p style="font-size:16px;line-height:1.68;color:#675b64;margin:0;">${postDescription}</p>
          </div>
          <p style="margin:30px 0;">
            <a href="${postLink}" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:14px 18px;font-weight:700;letter-spacing:.2px;">Read the note</a>
          </p>`,
    }),
  };
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.TEST_EMAIL_SECRET) {
    return response.status(500).json({ error: "Test email secret is not configured." });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(500).json({ error: "Resend is not configured." });
  }

  const authHeader = request.headers.authorization || "";
  if (authHeader !== `Bearer ${process.env.TEST_EMAIL_SECRET}`) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const email = request.body?.email?.trim().toLowerCase();
  const name = request.body?.name?.trim() || "Flyness";
  const type = request.body?.type === "post" ? "post" : "welcome";

  if (!email) {
    return response.status(400).json({ error: "Missing email." });
  }

  const emailPayload = type === "post" ? buildPostTest({ name }) : buildWelcomeTest({ name });

  await sendEmail({
    to: email,
    ...emailPayload,
  });

  return response.status(200).json({ sent: true, type, to: email });
}
