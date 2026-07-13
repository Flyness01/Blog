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
  <body style="margin:0;background:#f8f4ef;color:#2d2430;font-family:Arial,sans-serif;">
    <main style="max-width:620px;margin:0 auto;padding:80px 24px;">
      <p style="text-transform:uppercase;letter-spacing:2px;color:#6d3655;font-size:11px;">Notes from Flyness</p>
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:44px;line-height:1.1;">You’re unsubscribed.</h1>
      <p style="font-size:17px;line-height:1.7;color:#5c505b;">You will not receive new post alerts anymore.</p>
      <p><a href="https://flynessnamatama.com/" style="color:#6d3655;">Return to the site</a></p>
    </main>
  </body>
</html>`);
}
