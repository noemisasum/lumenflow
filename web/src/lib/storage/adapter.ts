import type { StoredObjectRef, StorageProvider } from "./types";

export type GetSignedUrlParams = {
  ref: StoredObjectRef;
  expiresInSeconds?: number;
  // In future: method (GET/PUT), contentType, etc.
};

export type StorageAdapter = {
  provider: StorageProvider;
  /** Return a URL the browser can use to download/view the object. */
  getSignedUrl(params: GetSignedUrlParams): Promise<string>;
};
