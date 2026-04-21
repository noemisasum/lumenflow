# Supabase setup (MVP)

This folder contains SQL you can run in the Supabase SQL Editor to create the initial schema + RLS policies for LumenFlow.

## 1) Create Storage bucket

In Supabase Dashboard → Storage:
- Create a bucket named: `invoices`
- Set to **private** (recommended)

## 2) Apply schema + RLS

In Supabase Dashboard → SQL Editor:
- Run `supabase/schema.sql`

## Notes

- This MVP schema scopes invoice access to the **signed-in user** (`created_by = auth.uid()`), which is safe and simple.
- We can expand to Organizations/Teams later.
