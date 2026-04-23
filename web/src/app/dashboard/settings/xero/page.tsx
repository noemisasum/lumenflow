"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type OrgRow = { id: string; name: string; slug: string };
type EntityRow = { id: string; org_id: string; name: string; code: string | null; xero_tenant_id: string | null };
type XeroTenantRow = { tenant_id: string; tenant_name: string; tenant_type: string | null };

export default function XeroSettingsPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [orgId, setOrgId] = useState<string>("");
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [tenants, setTenants] = useState<XeroTenantRow[]>([]);

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
      if (!supabase) throw new Error("Missing Supabase env vars");
      const sess = await ensureSession();
      if (!sess) return;

      const { data: o, error: oErr } = await supabase.from("orgs").select("id,name,slug").order("name");
      if (oErr) throw oErr;
      const orgRows = (o || []) as OrgRow[];
      setOrgs(orgRows);
      const currentOrgId = orgId || orgRows[0]?.id || "";
      if (currentOrgId && currentOrgId !== orgId) setOrgId(currentOrgId);

      if (!currentOrgId) {
        setEntities([]);
        setTenants([]);
        return;
      }

      const { data: e, error: eErr } = await supabase
        .from("entities")
        .select("id,org_id,name,code,xero_tenant_id")
        .eq("org_id", currentOrgId)
        .order("name");
      if (eErr) throw eErr;
      setEntities((e || []) as EntityRow[]);

      const { data: t, error: tErr } = await supabase
        .from("xero_tenants")
        .select("tenant_id,tenant_name,tenant_type")
        .eq("org_id", currentOrgId)
        .order("tenant_name");

      // If table doesn't exist yet, just show empty.
      if (tErr && !String(tErr.message || "").includes("Could not find")) throw tErr;
      setTenants(((t as any) || []) as XeroTenantRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  async function connectXero() {
    if (!orgId) return;
    window.location.href = `/api/xero/oauth/start?orgId=${encodeURIComponent(orgId)}`;
  }

  async function updateEntityTenant(entityId: string, tenantId: string) {
    try {
      if (!supabase) throw new Error("Missing Supabase env vars");
      setError(null);
      const { error } = await supabase
        .from("entities")
        .update({ xero_tenant_id: tenantId || null })
        .eq("id", entityId);
      if (error) throw error;
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update entity");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lumenflow-logo.jpg" alt="LumenFlow" className="h-7 w-auto" />
            <div className="text-sm font-medium text-zinc-700">Xero</div>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">Connect Xero</div>
                <div className="mt-1 text-sm text-zinc-600">One connection per org. Map tenants per entity.</div>
              </div>

              <div className="flex items-center gap-2">
                {orgs.length ? (
                  <select
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
                  >
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                ) : null}

                <button
                  onClick={connectXero}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Connect
                </button>
              </div>
            </div>

            {error ? <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</div> : null}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-sm font-semibold">Tenant mapping</div>
            <div className="mt-1 text-sm text-zinc-600">Select a Xero tenant for each entity.</div>

            {loading ? (
              <div className="mt-4 text-sm text-zinc-600">Loading…</div>
            ) : tenants.length === 0 ? (
              <div className="mt-4 text-sm text-zinc-600">No Xero tenants loaded yet. Click Connect first.</div>
            ) : entities.length === 0 ? (
              <div className="mt-4 text-sm text-zinc-600">No entities found in this org.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {entities.map((e) => (
                  <div key={e.id} className="flex flex-col gap-2 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-100 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{e.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">{e.code || e.id}</div>
                    </div>

                    <select
                      value={e.xero_tenant_id || ""}
                      onChange={(ev) => updateEntityTenant(e.id, ev.target.value)}
                      className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
                    >
                      <option value="">(Not mapped)</option>
                      {tenants.map((t) => (
                        <option key={t.tenant_id} value={t.tenant_id}>
                          {t.tenant_name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
