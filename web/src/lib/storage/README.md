# Storage abstraction

Goal: future-proof invoice file storage so we can move from Supabase Storage to S3/R2 later without refactoring business logic.

## Design

Store only provider/bucket/key in the database:

```ts
{
  provider: "supabase" | "s3" | "r2",
  bucket: string,
  key: string
}
```

When the UI needs a file URL, resolve an adapter:

```ts
const adapter = getStorageAdapter(ref)
const url = await adapter.getSignedUrl({ ref })
```

## Notes

- Current implementation provides a Supabase Storage adapter (client-side).
- For production-grade control, we should sign URLs server-side (API route / Edge Function) and enforce auth/RLS checks.
- S3/R2 adapters will be added later.
