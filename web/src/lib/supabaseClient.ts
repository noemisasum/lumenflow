import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anon };
}

/**
 * Safe client factory for server components.
 * Returns null instead of throwing during build if env vars are missing.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anon } = getEnv();
  if (!url || !anon) return null;
  return createClient(url, anon);
}

/**
 * Browser client (for client components like /login).
 * Returns null if env vars are missing (keeps build/deploy safe).
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const { url, anon } = getEnv();
  if (!url || !anon) return null;
  return createClient(url, anon);
}
