import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://icxemskklrnipakvpuoc.supabase.co";
const supabasePublishableKey = "sb_publishable_c1xK1zQ_HBqf4gm4R5MDTg_qbJmRIat";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
