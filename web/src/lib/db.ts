import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export function getDbClient() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Missing Supabase env vars");
  return supabase;
}
