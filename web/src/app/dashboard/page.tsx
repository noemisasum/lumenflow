"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type SessionInfo = {
  userId: string;
  email: string | null;
};

export default function DashboardPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;

    (async () => {
      try {
        if (!supabase) {
          setError("Missing Supabase env vars.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!data.session) {
          window.location.replace("/login");
          return;
        }

        setSession({
          userId: data.session.user.id,
          email: data.session.user.email ?? null,
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
          if (!sess) {
            window.location.replace("/login");
            return;
          }
          setSession({ userId: sess.user.id, email: sess.user.email ?? null });
        });
        unsub = sub.subscription;
      } catch (e: any) {
        setError(e?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      try {
        unsub?.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, [supabase]);

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.replace("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lumenflow-logo.jpg" alt="LumenFlow" className="h-7 w-auto" />
            <div className="text-sm font-medium text-zinc-700">Dashboard</div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Sign out
          </button>
        </header>

        <main className="mt-10 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-sm font-semibold">Welcome</div>
            {loading ? (
              <div className="mt-2 text-sm text-zinc-600">Loading…</div>
            ) : error ? (
              <div className="mt-2 text-sm text-amber-700">{error}</div>
            ) : session ? (
              <div className="mt-2 text-sm text-zinc-600">
                Signed in as <span className="font-medium text-zinc-900">{session.email || session.userId}</span>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a href="#" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100 hover:bg-zinc-50">
              <div className="text-sm font-semibold">Create request</div>
              <div className="mt-1 text-sm text-zinc-600">Start a purchase request with attachments.</div>
            </a>
            <a href="#" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100 hover:bg-zinc-50">
              <div className="text-sm font-semibold">Approvals</div>
              <div className="mt-1 text-sm text-zinc-600">Review items awaiting approval.</div>
            </a>
            <a href="#" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100 hover:bg-zinc-50">
              <div className="text-sm font-semibold">Invoices</div>
              <div className="mt-1 text-sm text-zinc-600">Track invoice intake and payable queue.</div>
            </a>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-sm font-semibold">Next steps</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              <li>Define roles (Requester / Approver / AP).</li>
              <li>Create core tables with RLS (requests, vendors, invoices).</li>
              <li>Add workflow states and an approval timeline.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
