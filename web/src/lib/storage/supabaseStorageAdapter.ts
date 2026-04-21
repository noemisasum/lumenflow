import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { StorageAdapter } from "./adapter";

/**
 * Supabase Storage adapter.
 *
 * Note: This is a browser-side helper for MVP usage.
 * For production, prefer a server-side signer endpoint for tighter control.
 */
export const supabaseStorageAdapter: StorageAdapter = {
  provider: "supabase",
  async getSignedUrl({ ref, expiresInSeconds = 60 * 10 }) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Missing Supabase env vars");

    const { data, error } = await supabase.storage
      .from(ref.bucket)
      .createSignedUrl(ref.key, expiresInSeconds);

    if (error) throw error;
    if (!data?.signedUrl) throw new Error("Failed to create signed URL");
    return data.signedUrl;
  },
};
