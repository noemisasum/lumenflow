"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { StoredObjectRef } from "@/lib/storage/types";
import { getStorageAdapter } from "@/lib/storage";

type InvoiceRow = {
  id: string;
  status: string;
  vendor_name: string | null;
  description: string | null;
  currency: string | null;
  total: number | null;
  created_at: string;
};

type InvoiceFileRow = {
  id: string;
  invoice_id: string;
  provider: StoredObjectRef["provider"];
  bucket: string;
  object_key: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export default function InvoicesPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [filesByInvoice, setFilesByInvoice] = useState<Record<string, InvoiceFileRow[]>>({});

  async function ensureSession() {
    if (!supabase) throw new Error("Missing Supabase env vars");
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) {
      window.location.replace("/login");
      return null;
    }
    return data.session;
  }

  async function load() {
    try {
      if (!supabase) {
        setError("Missing Supabase env vars");
        return;
      }

      const sess = await ensureSession();
      if (!sess) return;

      const { data: invs, error: invErr } = await supabase
        .from("invoices")
        .select("id,status,vendor_name,description,currency,total,created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (invErr) throw invErr;
      const rows = (invs || []) as InvoiceRow[];
      setInvoices(rows);

      const ids = rows.map((r) => r.id);
      if (!ids.length) {
        setFilesByInvoice({});
        return;
      }

      const { data: files, error: fErr } = await supabase
        .from("invoice_files")
        .select("id,invoice_id,provider,bucket,object_key,mime_type,size_bytes,created_at")
        .in("invoice_id", ids)
        .order("created_at", { ascending: false });

      if (fErr) throw fErr;

      const grouped: Record<string, InvoiceFileRow[]> = {};
      for (const f of (files || []) as any[]) {
        const invId = f.invoice_id as string;
        grouped[invId] = grouped[invId] || [];
        grouped[invId].push(f as InvoiceFileRow);
      }
      setFilesByInvoice(grouped);
    } catch (e: any) {
      setError(e?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onUpload(file: File) {
    try {
      if (!supabase) throw new Error("Missing Supabase env vars");
      const sess = await ensureSession();
      if (!sess) return;

      setUploading(true);
      setError(null);

      // 1) Create invoice row
      const { data: created, error: cErr } = await supabase
        .from("invoices")
        .insert({
          created_by: sess.user.id,
          status: "UPLOADED",
          currency: "USD",
        })
        .select("id")
        .single();

      if (cErr) throw cErr;
      const invoiceId = (created as any).id as string;

      // 2) Upload file to storage
      const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
      const safeExt = ext.replace(/[^a-z0-9]/g, "") || "pdf";
      const objectKey = `${sess.user.id}/${invoiceId}/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

      const { error: uErr } = await supabase.storage.from("invoices").upload(objectKey, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (uErr) throw uErr;

      // 3) Create invoice_files row (future-proof ref)
      const { error: fErr } = await supabase.from("invoice_files").insert({
        invoice_id: invoiceId,
        created_by: sess.user.id,
        provider: "supabase",
        bucket: "invoices",
        object_key: objectKey,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
      if (fErr) throw fErr;

      await load();
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function openFile(f: InvoiceFileRow) {
    const ref: StoredObjectRef = { provider: f.provider, bucket: f.bucket, key: f.object_key };
    const adapter = getStorageAdapter(ref);
    const url = await adapter.getSignedUrl({ ref, expiresInSeconds: 60 * 10 });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lumenflow-logo.jpg" alt="LumenFlow" className="h-7 w-auto" />
            <div className="text-sm font-medium text-zinc-700">Invoices</div>
          </div>
          <a
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Back
          </a>
        </header>

        <main className="mt-8 space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">Upload invoice</div>
                <div className="mt-1 text-sm text-zinc-600">PDF or image.</div>
              </div>
              <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800">
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                    e.currentTarget.value = "";
                  }}
                />
                {uploading ? "Uploading…" : "Upload"}
              </label>
            </div>

            {error ? <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</div> : null}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-sm font-semibold">Recent</div>

            {loading ? (
              <div className="mt-3 text-sm text-zinc-600">Loading…</div>
            ) : invoices.length === 0 ? (
              <div className="mt-3 text-sm text-zinc-600">No invoices yet.</div>
            ) : (
              <div className="mt-4 divide-y divide-zinc-100">
                {invoices.map((inv) => {
                  const files = filesByInvoice[inv.id] || [];
                  return (
                    <div key={inv.id} className="py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{inv.description || "Invoice"}</div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {new Date(inv.created_at).toLocaleString()} • {inv.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {files[0] ? (
                            <button
                              onClick={() => openFile(files[0])}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium hover:bg-zinc-50"
                            >
                              View file
                            </button>
                          ) : null}
                          <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                            {inv.currency || "USD"} {inv.total ?? "—"}
                          </div>
                        </div>
                      </div>

                      {files.length > 1 ? (
                        <div className="mt-2 text-xs text-zinc-500">{files.length} files attached</div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
