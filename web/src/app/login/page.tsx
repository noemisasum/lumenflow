"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signInPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMsg("Missing Supabase env vars on this deployment.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "/";
    } catch (err: any) {
      setMsg(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // OAuth login (Google/Microsoft) intentionally deferred until credentials are set up.

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <main className="mx-auto w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-zinc-600">Sign in with email + password.</p>
        {!supabase ? (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Supabase env vars are missing on this deployment. Check Vercel env vars:
            <div className="mt-1 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</div>
            <div className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
          </div>
        ) : null}

        <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">
          SSO (Google/Microsoft) is disabled for now. We’ll enable it later once OAuth credentials are set up.
        </div>

        <form onSubmit={signInPassword} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm"
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {msg ? <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{msg}</div> : null}

        <div className="text-xs text-zinc-500">SSO will be enabled later.</div>
      </main>
    </div>
  );
}
