export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lumenflow-logo.jpg" alt="LumenFlow" className="h-7 w-auto" />
          </div>
          <nav className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-white hover:text-zinc-950"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Get started
            </a>
          </nav>
        </header>

        <main className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <section className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Procure-to-pay, simplified.
              <span className="block text-[#B8942E]">Approvals, audit trail, and automation.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-700">
              LumenFlow streamlines purchasing requests, approvals, vendor onboarding, invoice capture, and payment
              readiness—without losing control.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Start free
              </a>
              <a
                href="#features"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                See features
              </a>
            </div>

            <div className="grid max-w-xl grid-cols-2 gap-4 pt-4 text-sm text-zinc-700">
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
                <div className="font-medium text-zinc-900">Approval workflows</div>
                <div className="mt-1 text-zinc-600">Multi-step routing & limits.</div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
                <div className="font-medium text-zinc-900">Invoice capture</div>
                <div className="mt-1 text-zinc-600">Centralize docs & status.</div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
                <div className="font-medium text-zinc-900">Controls & audit</div>
                <div className="mt-1 text-zinc-600">Every action, tracked.</div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
                <div className="font-medium text-zinc-900">Automation-ready</div>
                <div className="mt-1 text-zinc-600">Integrations when ready.</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="space-y-3">
              <div className="text-sm font-medium text-zinc-900">What you can manage</div>
              <ul className="space-y-2 text-sm text-zinc-700">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#B8942E]" />
                  Purchase requests → approvals → PO readiness
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#B8942E]" />
                  Vendor onboarding, documents, and contacts
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#B8942E]" />
                  Invoice intake, matching, and payable queue
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#B8942E]" />
                  Entity/cost-center visibility and reporting
                </li>
              </ul>
              <div className="mt-6 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                <div className="text-xs font-medium text-zinc-700">Status</div>
                <div className="mt-1 text-sm text-zinc-900">MVP in progress</div>
                <div className="mt-1 text-xs text-zinc-600">Next: PR → vendor → invoice → approvals.</div>
              </div>
            </div>
          </section>
        </main>

        <section id="features" className="mt-20">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <h2 className="text-2xl font-semibold">Features</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Request", desc: "Create purchase requests with attachments and cost centers." },
                { title: "Approve", desc: "Route approvals with thresholds and role-based access." },
                { title: "Track", desc: "See status across vendors, invoices, and payments." },
                { title: "Control", desc: "Policies and audit trail built-in." },
                { title: "Integrate", desc: "Connect accounting and messaging when ready." },
                { title: "Report", desc: "Monthly spend views per entity and vendor." },
              ].map((x) => (
                <div key={x.title} className="rounded-xl bg-zinc-50 p-5 ring-1 ring-zinc-100">
                  <div className="text-sm font-semibold text-zinc-900">{x.title}</div>
                  <div className="mt-1 text-sm text-zinc-600">{x.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <a
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Create account
              </a>
              <a
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Sign in
              </a>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-xs text-zinc-500">© {new Date().getFullYear()} LumenFlow</footer>
      </div>
    </div>
  );
}
