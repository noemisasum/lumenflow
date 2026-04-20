import { getSupabaseClient } from "@/lib/supabaseClient";

export default async function Home() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
        <main className="mx-auto max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">lumenflow</h1>
          <p className="text-sm text-zinc-600">Supabase connection check.</p>
          <div className="rounded-lg bg-amber-50 p-4 text-amber-900">
            Missing environment variables:
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
            <p className="mt-2 text-sm">
              If you linked Supabase to Vercel via the integration, redeploy and confirm these exist in Vercel Project
              Settings → Environment Variables.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const { data, error } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <main className="mx-auto max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">lumenflow</h1>
        <p className="text-sm text-zinc-600">
          Supabase connection check (server-rendered). If env vars are set correctly on Vercel, this page should render
          without errors.
        </p>

        <div className="rounded-lg bg-zinc-950 p-4 text-zinc-50">
          <pre className="overflow-auto text-xs leading-5">
            {JSON.stringify(
              {
                ok: !error,
                error: error ? { message: error.message, name: error.name } : null,
                session: data?.session
                  ? {
                      userId: data.session.user.id,
                      email: data.session.user.email,
                      expiresAt: data.session.expires_at,
                    }
                  : null,
              },
              null,
              2
            )}
          </pre>
        </div>

        <p className="text-xs text-zinc-500">Next steps: add a /login page and protected routes with Supabase SSR helpers.</p>
      </main>
    </div>
  );
}
