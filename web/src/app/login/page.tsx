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
      setMsg("Missing Supabase env vars.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "/";
    } catch (err: any) {
      setMsg(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMsg("Missing Supabase env vars.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // If email confirmations are enabled, there may be no session yet.
      if (data.session) {
        window.location.href = "/";
      } else {
        setMsg("Check your email to confirm your account.");
      }
    } catch (err: any) {
      setMsg(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <main className="mx-auto w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">lumenflow</h1>

        <form className="space-y-3">
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

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={signInPassword}
              disabled={loading}
              className="h-11 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "…" : "Sign in"}
            </button>
            <button
              onClick={signUp}
              disabled={loading}
              className="h-11 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
            >
              {loading ? "…" : "Sign up"}
            </button>
          </div>
        </form>

        {msg ? <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{msg}</div> : null}

        {!supabase ? (
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            Missing Supabase env vars.
          </div>
        ) : null}
      </main>
    </div>
  );
}
