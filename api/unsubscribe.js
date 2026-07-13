import { createClient } from "@supabase/supabase-js";

export default async function handler(request, response) {
  const token = request.query?.token;

  if (!token || typeof token !== "string") {
    return response.status(400).send("Missing unsubscribe token.");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return response.status(500).send("Unsubscribe is not configured yet.");
  }

  const supabase = createClient(process.env.SUPABASE_URL || "https://icxemskklrnipakvpuoc.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token);

  if (error) {
    return response.status(500).send("Could not unsubscribe right now.");
  }

  return response
    .status(200)
    .send(`<!doctype html>
<html>
  <head>
    <title>Unsubscribed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;background:#302830;color:#2d2430;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <main style="max-width:660px;margin:0 auto;padding:70px 20px;">
      <section style="background:#f8f4ef;border:1px solid #e9ccd0;">
        <div style="background:#302830;color:#f8f4ef;padding:28px 30px;border-bottom:6px solid #d8b7bf;">
          <p style="margin:0;text-transform:uppercase;letter-spacing:2.7px;color:#d9a8b6;font-size:10px;font-weight:700;">Notes from Flyness</p>
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:42px;line-height:1.05;margin:14px 0 0;letter-spacing:-.4px;">You’re unsubscribed.</h1>
        </div>
        <div style="padding:32px 30px;">
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 18px;">No hard feelings. The inbox has spoken, and I respect its boundaries.</p>
          <p style="font-size:17px;line-height:1.75;color:#5c505b;margin:0 0 26px;">You won’t receive new post alerts anymore. The tiny research salon will keep the lights on if you ever want to wander back in.</p>
          <p style="margin:28px 0;">
            <a href="https://flynessnamatama.com/" style="display:inline-block;background:#2d2430;color:#fff;text-decoration:none;padding:14px 18px;font-weight:700;">Return to the site</a>
          </p>
          <p style="margin:28px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:1.5px;color:#b9647d;">F<span style="color:#6d3655;">✦</span>N</p>
        </div>
      </section>
    </main>
  </body>
</html>`);
}
