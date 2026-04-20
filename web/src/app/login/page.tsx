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

      if (data.session) {
        window.location.href = "/";
      } else {
        setMsg("Check your email.");
      }
    } catch (err: any) {
      setMsg(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function signInOAuth(e: React.MouseEvent, provider: "google" | "azure") {
    e.preventDefault();
    if (!supabase) {
      setMsg("Missing Supabase env vars.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: any) {
      setMsg(err?.message || "SSO not configured.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex min-h-screen items-center justify-center p-8">
        <main className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/lumenflow-logo.jpg"
              alt="LumenFlow"
              className="h-10 w-auto"
            />
            <h1 className="text-lg font-semibold">Sign-in</h1>
            <div className="text-xs text-zinc-500">
              Don’t have an account?{" "}
              <button onClick={signUp} className="font-medium text-zinc-900 underline underline-offset-2">
                Sign up
              </button>
            </div>
          </div>

          <form className="mt-5 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={signInPassword}
              disabled={loading}
              className="h-11 w-full rounded-lg bg-fuchsia-600 px-4 text-sm font-medium text-white hover:bg-fuchsia-700 disabled:opacity-60"
            >
              {loading ? "…" : "Continue"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-zinc-200" />
              <div className="text-xs text-zinc-500">or sign in with</div>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => signInOAuth(e, "google")}
                disabled={loading}
                className="h-11 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
              >
                Google
              </button>
              <button
                onClick={(e) => signInOAuth(e, "azure")}
                disabled={loading}
                className="h-11 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
              >
                Microsoft
              </button>
            </div>

            {msg ? <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{msg}</div> : null}

            <div className="pt-1 text-center text-xs text-zinc-500">
              For help: contact support@lumenflow.com
            </div>
          </form>

          <div className="mt-4 text-center text-[11px] text-zinc-400">Powered by LumenFlow</div>
        </main>
      </div>
    </div>
  );
}
