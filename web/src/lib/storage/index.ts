import type { StorageAdapter } from "./adapter";
import type { StoredObjectRef } from "./types";
import { supabaseStorageAdapter } from "./supabaseStorageAdapter";

/**
 * Central place to resolve storage providers.
 *
 * Today: Supabase Storage.
 * Later: add S3/R2 adapters and migrate objects gradually.
 */
export function getStorageAdapter(ref: StoredObjectRef): StorageAdapter {
  switch (ref.provider) {
    case "supabase":
      return supabaseStorageAdapter;
    case "s3":
    case "r2":
      // Future implementation: server-side signer via AWS SDK / R2 S3-compatible API.
      throw new Error(`${ref.provider} adapter not implemented yet`);
    default: {
      const _exhaustive: never = ref.provider;
      return _exhaustive;
    }
  }
}
