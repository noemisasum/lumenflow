export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between">
          <img src="/lumenflow-logo.jpg" alt="LumenFlow" className="h-7 w-auto" />
          <a
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Get started
          </a>
        </header>

        <main className="mx-auto mt-20 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-zinc-700 ring-1 ring-zinc-100">
            <span className="h-2 w-2 rounded-full bg-[#B8942E]" />
            Approvals • Audit trail • Automation
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            Procure-to-pay, without the chaos.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-zinc-700">
            LumenFlow helps teams run purchasing workflows with approvals, audit trail, and automation—end to end.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-black px-7 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
            >
              Start free
            </a>
            <a href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">
              Sign in
            </a>
          </div>

          <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
            {[
              { title: "Approvals", desc: "Flexible routing with clear ownership." },
              { title: "Audit trail", desc: "Every change captured automatically." },
              { title: "Automation", desc: "Ready for integrations when you are." },
            ].map((x) => (
              <div key={x.title} className="rounded-xl bg-white p-5 ring-1 ring-zinc-100">
                <div className="text-sm font-semibold text-zinc-900">{x.title}</div>
                <div className="mt-1 text-sm text-zinc-600">{x.desc}</div>
              </div>
            ))}
          </div>
        </main>

        <footer className="mt-16 py-10 text-center text-xs text-zinc-400">© {new Date().getFullYear()} LumenFlow</footer>
      </div>
    </div>
  );
}
