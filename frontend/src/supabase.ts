import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vyoqyrqsgqzqmtkmvort.supabase.co";

const supabasePublishableKey = "sb_publishable_M-O_YiDHxTUNM_A_F7X9bg_vhGLqu3B";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);