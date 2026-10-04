import Link from "next/link";
import MarketplacePreview from "./components/MarketplacePreview";

const entryPoints = [
  {
    eyebrow: "For security companies",
    title: "Set up your operation",
    body: "Start company onboarding, move into Guard administration, and connect the commercial lifecycle through LEOS.",
    href: "/get-started",
    cta: "Onboard my company",
  },
  {
    eyebrow: "For sales professionals",
    title: "Join Signal One Sales",
    body: "Apply to join the sales network, then move through approval, training, sales packs and activation into Sales OS.",
    href: "/join/sales",
    cta: "Apply to join sales",
  },
  {
    eyebrow: "For security officers",
    title: "Enter the Guard Marketplace",
    body: "Create an opportunity profile, control marketplace visibility and surface verified skills to security companies.",
    href: "/guards/join",
    cta: "Create guard profile",
  },
];

const operatingLayer = [
  ["Acquire", "Leads, sales intake and client onboarding"],
  ["Staff", "Guard Marketplace and workforce matching"],
  ["Deploy", "Sites, posts, shifts and operational setup"],
  ["Operate", "Control room, patrol, attendance and incidents"],
  ["Verify", "Proof of service, audit trail and client visibility"],
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#080d13] text-white">
      <section className="relative min-h-[760px] border-b border-white/10 px-5 pb-20 pt-40 md:pt-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(56,189,248,.16),transparent_30%),radial-gradient(circle_at_25%_45%,rgba(14,165,233,.08),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-[92rem] items-center gap-14 xl:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs uppercase tracking-[.2em] text-white/55">
              Security operations · workforce · sales
            </div>
            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[.96] tracking-[-.04em] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              Run your security operation from
              <span className="block text-[#6dd3ff]">one connected system.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
              Find opportunities. Build teams. Deploy guards. Run control. Prove service. Signal One connects the public acquisition journey to Guard operations and LEOS commercial workflows.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/get-started" className="rounded-full bg-[#39bdf8] px-6 py-3 text-sm font-semibold text-[#061019] shadow-[0_0_40px_rgba(56,189,248,.2)] transition hover:bg-[#7dd3fc]">
                Start my company
              </Link>
              <Link href="/guards" className="rounded-full border border-white/15 bg-white/[.025] px-6 py-3 text-sm text-white/75 transition hover:border-white/30 hover:text-white">
                Browse Guard Marketplace
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#39bdf8]/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-[#0c131c]/85 p-5 shadow-[0_40px_140px_rgba(0,0,0,.5)] backdrop-blur-xl md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-white/35">Signal One operating layer</p>
                  <p className="mt-2 text-lg font-semibold">From first enquiry to live operation</p>
                </div>
                <span className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,.7)]" />
              </div>
              <div className="mt-5 space-y-2">
                {operatingLayer.map(([name, text], index) => (
                  <div key={name} className="flex items-start gap-4 rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#39bdf8]/20 bg-[#39bdf8]/5 text-xs font-semibold text-[#7dd3fc]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="mt-1 text-xs leading-5 text-white/42">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Choose your path</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">The website is now the front door to the platform.</h2>
            <p className="mt-4 text-sm leading-6 text-white/50 md:text-base">
              Start with the role that matches you. Each journey is designed to hand off into the correct operating system rather than creating a disconnected website account.
            </p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {entryPoints.map((item) => (
              <article key={item.title} className="group rounded-3xl border border-white/10 bg-white/[.03] p-7 transition hover:-translate-y-1 hover:border-[#39bdf8]/30 hover:bg-white/[.045]">
                <p className="text-xs uppercase tracking-[.18em] text-white/35">{item.eyebrow}</p>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 min-h-20 text-sm leading-6 text-white/52">{item.body}</p>
                <Link href={item.href} className="mt-7 inline-flex text-sm font-semibold text-[#7dd3fc]">
                  {item.cta} <span className="ml-2 transition group-hover:translate-x-1">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-white/10 bg-[#0a1119] px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[92rem] gap-12 xl:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Connected platform</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Sales OS brings the work in. Guard runs it.</h2>
            <p className="mt-5 text-sm leading-7 text-white/50">
              A staffing enquiry can become a lead, an opportunity and a contract in LEOS. Once commercially active, Guard takes over the operational truth: sites, posts, guards, devices, shifts, patrol and evidence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/solutions/security" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75">Explore Guard operations</Link>
              <Link href="/platforms" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75">View platforms</Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Sales OS", "Lead intake, sales execution, quoting, conversion and account ownership."],
              ["Guard Admin", "Company setup, people, sites, devices, staffing and operational administration."],
              ["Control Room", "Live operational awareness, communication, exceptions and response."],
              ["Client Experience", "Service proof and customer visibility without exposing internal operations."],
            ].map(([name, text]) => (
              <div key={name} className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
                <h3 className="font-semibold">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Guard Marketplace</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Workforce supply connected to the operation.</h2>
              <p className="mt-4 text-sm leading-6 text-white/50">
                Guards opt into marketplace visibility. Public profiles expose only safe professional fields, while Guard Admin gets the operational search, shortlist and staffing workflow.
              </p>
            </div>
            <Link href="/guards" className="text-sm font-semibold text-[#7dd3fc]">Open marketplace →</Link>
          </div>
          <div className="mt-10">
            <MarketplacePreview limit={6} />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-20">
        <div className="mx-auto max-w-[92rem] rounded-[2rem] border border-[#39bdf8]/20 bg-[linear-gradient(120deg,rgba(56,189,248,.12),rgba(255,255,255,.02))] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#7dd3fc]">Start now</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-.03em] md:text-4xl">Build the commercial relationship and the operation in the same ecosystem.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/52">Start company onboarding, join the sales network, or create a Guard Marketplace profile.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/get-started" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#071018]">Onboard company</Link>
              <Link href="/join/sales" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white">Join sales</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
