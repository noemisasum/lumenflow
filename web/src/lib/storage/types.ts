export type StorageProvider = "supabase" | "s3" | "r2";

export type StoredObjectRef = {
  provider: StorageProvider;
  bucket: string;
  key: string; // object path/key
};

export type StoredObjectMeta = StoredObjectRef & {
  contentType?: string;
  sizeBytes?: number;
  sha256?: string;
};
