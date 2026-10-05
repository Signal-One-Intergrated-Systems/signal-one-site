import Link from "next/link";
import FlywheelThread from "./components/FlywheelThread";
import GuardDayCalculator from "./components/GuardDayCalculator";
import HeroVideo from "./components/HeroVideo";

const operatingProblems = [
  ["Win", "Leads, quotes and follow-ups are scattered across inboxes, calls and spreadsheets."],
  ["Staff", "A contract can be won before the right guards are ready for the site."],
  ["Run", "Attendance, patrols, incidents and exceptions become separate stories."],
  ["Prove", "Client reporting is rebuilt after the shift instead of coming from the operation itself."],
] as const;

const salesCapabilities = [
  "Leads and pipeline",
  "Next actions and follow-ups",
  "Quotes and customer conversations",
  "Sales coaching and performance",
] as const;

const guardCapabilities = [
  ["Attendance", "Site-linked clock-in and clock-out with operational evidence."],
  ["Patrols", "Routes plus QR or NFC checkpoint verification and offline continuity."],
  ["Occurrence", "Chronological incidents, corrections and operational exceptions."],
  ["Control Room", "SOS, site activity and exceptions that need intervention."],
] as const;

const clientCapabilities = [
  "Authorised sites",
  "Scheduled service coverage",
  "Patrol and checkpoint evidence",
  "Incidents and proof-of-service reports",
] as const;

const equipmentCapabilities = [
  ["PTT", "Managed push-to-talk communications and compatible field devices."],
  ["Tracking", "Vehicle tracking, asset tracking and tracking devices for operational deployments."],
  ["Body Cam", "Body-worn video can be supplied as part of the wider equipment relationship."],
] as const;

function Status({
  children,
  tone = "current",
}: {
  children: React.ReactNode;
  tone?: "current" | "planned";
}) {
  return (
    <span
      className={
        "s1-mono inline-flex rounded-[8px] border px-2.5 py-1 text-[8px] font-semibold " +
        (tone === "current"
          ? "border-[#22C55E]/25 bg-[#22C55E]/[.06] text-[#86EFAC]"
          : "border-[#38BDF8]/25 bg-[#0EA5E9]/[.06] text-[#7DD3FC]")
      }
    >
      {children}
    </span>
  );
}

function StageLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="s1-mono text-[8px] text-white/28">{number}</span>
      <span className="s1-eyebrow">{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-[var(--s1-surface-base)] text-[var(--s1-text-strong)]">
      <section className="relative isolate min-h-[720px] overflow-hidden border-b border-white/10 px-5 pb-20 pt-32 md:min-h-[760px] md:pb-24 md:pt-40">
        <div className="s1-ambient absolute inset-0 -z-30" />
        <div className="s1-grid absolute inset-0 -z-20 opacity-35" />
        <div className="absolute -right-[8%] top-[12%] -z-10 h-[560px] w-[560px] rounded-full bg-[#0EA5E9]/[.08] blur-[120px]" />

        <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[1.06fr_.94fr] lg:gap-16">
          <div className="max-w-4xl">
            <p className="s1-eyebrow">For South African security companies</p>
            <h1 className="s1-display mt-6 max-w-4xl font-semibold text-[#F1F5F9]">
              Run the business of security
              <span className="block text-[#38BDF8]">from one platform.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
              Win contracts. Hire guards. Run sites. Equip your teams. Prove the service. Then use that operating evidence to strengthen the next sale.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/get-started" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
              <Link href="/#platform" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                See how it works ↓
              </Link>
            </div>

            <div className="mt-12 flex max-w-2xl flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              {["Win", "Hire", "Run", "Equip", "Prove", "Grow"].map((label, index) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="s1-mono text-[8px] text-white/24">0{index + 1}</span>
                  <span className="text-xs font-medium text-white/52">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] lg:min-h-[500px]" aria-hidden="true">
            <div className="absolute inset-[12%] rounded-full border border-white/[.07]" />
            <div className="absolute inset-[21%] rounded-full border border-[#0EA5E9]/15" />
            <div className="absolute inset-[31%] rounded-full border border-white/[.07]" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0EA5E9]/10 blur-[28px]" />
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#0EA5E9]/30 bg-[#0F131A]/82 shadow-[0_0_70px_rgba(14,165,233,.12)] backdrop-blur-[20px]">
              <span className="text-center text-sm font-semibold leading-5">SIGNAL<br /><span className="text-[#38BDF8]">ONE</span></span>
            </div>

            {[
              ["WIN", "left-[4%] top-[18%]"],
              ["HIRE", "right-[2%] top-[28%]"],
              ["RUN", "right-[8%] bottom-[17%]"],
              ["PROVE", "left-[7%] bottom-[12%]"],
            ].map(([label, position]) => (
              <div key={label} className={"absolute " + position}>
                <span className="s1-mono rounded-[8px] border border-white/10 bg-[#0F131A]/78 px-3 py-2 text-[8px] text-white/56 backdrop-blur-[12px]">
                  {label}
                </span>
              </div>
            ))}

            <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="hero-signal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7DD3FC" stopOpacity=".16" />
                  <stop offset="45%" stopColor="#38BDF8" stopOpacity=".76" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity=".12" />
                </linearGradient>
              </defs>
              <path
                d="M74 150 C132 54 302 48 389 126 C470 198 454 347 356 414 C250 486 103 427 64 316 C42 252 45 202 74 150Z"
                fill="none"
                stroke="url(#hero-signal)"
                strokeWidth="2"
              />
              <circle cx="74" cy="150" r="4" fill="#38BDF8" />
              <circle cx="389" cy="126" r="4" fill="#38BDF8" />
              <circle cx="356" cy="414" r="4" fill="#38BDF8" />
              <circle cx="64" cy="316" r="4" fill="#38BDF8" />
            </svg>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-4xl">
            <p className="s1-eyebrow">The business problem</p>
            <h2 className="s1-h1 mt-5 max-w-4xl font-semibold">
              Winning the contract is only the beginning.
            </h2>
            <p className="s1-body mt-5 max-w-3xl">
              Security companies do not run one process. They win work, find people, deploy guards, manage sites, support field communications and then have to prove to the client that the contracted service actually happened.
            </p>
          </div>

          <div className="mt-12 grid border-y border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {operatingProblems.map(([title, body], index) => (
              <article key={title} className="border-white/10 py-6 sm:px-6 sm:first:pl-0 lg:border-r lg:last:border-r-0">
                <p className="s1-mono text-[8px] text-white/26">0{index + 1}</p>
                <h3 className="mt-5 text-xl font-semibold tracking-[-.025em]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/48">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="relative isolate px-5 pb-28 pt-8 md:pb-36">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,.07),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1440px]">
          <FlywheelThread />

          <header className="mx-auto max-w-4xl text-center">
            <p className="s1-eyebrow">One business · one operating system</p>
            <h2 className="s1-h1 mt-5 font-semibold">
              One continuous operating record from the first lead to the next contract.
            </h2>
            <p className="s1-body mx-auto mt-5 max-w-3xl">
              Signal One connects the commercial and operational lifecycle instead of making a security company stitch it together from unrelated tools.
            </p>
          </header>

          <div className="mt-20 space-y-20 md:space-y-28 xl:space-y-36">
            <section className="grid gap-8 xl:grid-cols-[1fr_160px_1fr] xl:items-center">
              <div className="xl:pr-12">
                <StageLabel number="01" label="Win" />
                <h3 className="mt-5 text-3xl font-semibold tracking-[-.035em] md:text-5xl">Turn leads into contracts.</h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
                  Signal One Sales OS gives the security company's own sales team a working system for leads, pipeline, next actions, quotes, conversations and coaching.
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/44">
                  Signal One provides the sales operating system. Your company provides the sales team.
                </p>
              </div>
              <div className="hidden xl:block" />
              <div className="grid gap-3 sm:grid-cols-2 xl:pl-12">
                {salesCapabilities.map((capability) => (
                  <div key={capability} className="rounded-[14px] border border-white/10 bg-white/[.025] px-5 py-4 text-sm font-medium text-white/72">
                    {capability}
                  </div>
                ))}
                <div className="rounded-[14px] border border-[#38BDF8]/18 bg-[#0EA5E9]/[.035] px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white/72">Calendar / appointments</span>
                    <Status tone="planned">Planned</Status>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_160px_1fr] xl:items-center">
              <div className="order-2 xl:order-1 xl:pr-12">
                <div className="rounded-[18px] border border-white/10 bg-[#0F131A] p-6 md:p-7">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="s1-mono text-[8px] text-white/30">Guard Marketplace</p>
                      <p className="mt-2 text-sm font-semibold text-white/82">Client-only hiring workspace</p>
                    </div>
                    <Status tone="planned">Target product</Status>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {["Location", "PSiRA grade", "Experience", "Availability", "Skills", "Profile photo"].map((field) => (
                      <div key={field} className="rounded-[12px] border border-white/[.07] bg-white/[.025] px-4 py-3 text-xs text-white/50">{field}</div>
                    ))}
                  </div>
                  <p className="mt-5 text-xs leading-6 text-white/36">
                    Profiles will only be visible to paying Signal One client companies. Ratings are omitted until the combined scoring model is implemented.
                  </p>
                </div>
              </div>
              <div className="hidden xl:order-2 xl:block" />
              <div className="order-1 xl:order-3 xl:pl-12">
                <StageLabel number="02" label="Hire" />
                <h3 className="mt-5 text-3xl font-semibold tracking-[-.035em] md:text-5xl">Won the contract? Staff it.</h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
                  Guard Marketplace is the next step in the Signal One flywheel: client security companies will browse eligible guards, send a request to hire and let the guard accept or decline in the Guard app.
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/44">
                  Guard already includes live PSiRA verification against PSiRA's official individual verification service. Marketplace eligibility enforcement is part of the planned hiring flow.
                </p>
                <Link href="/guard-marketplace" className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]">
                  Guard Marketplace roadmap →
                </Link>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_160px_1fr] xl:items-center">
              <div className="xl:pr-12">
                <StageLabel number="03" label="Run" />
                <div className="mt-4 flex items-center gap-3">
                  <h3 className="text-3xl font-semibold tracking-[-.035em] md:text-5xl">From contract to live site.</h3>
                  <Status>Current</Status>
                </div>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
                  Set up sites, shifts and allocations. Guards work from their own phones or an authorised Central Device at the site. Attendance, patrols, incidents, SOS and exceptions feed the same operational record.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {guardCapabilities.map(([title, body]) => (
                    <div key={title} className="border-l border-white/10 pl-4">
                      <p className="text-sm font-semibold text-white/78">{title}</p>
                      <p className="mt-1 text-xs leading-6 text-white/42">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden xl:block" />
              <div className="xl:pl-12">
                <HeroVideo />
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_160px_1fr] xl:items-center">
              <div className="order-2 grid gap-3 xl:order-1 xl:pr-12">
                {equipmentCapabilities.map(([title, body]) => (
                  <div key={title} className="rounded-[16px] border border-white/10 bg-[#0F131A] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-base font-semibold">{title}</h4>
                      <Status>Available alongside Guard</Status>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/46">{body}</p>
                  </div>
                ))}
              </div>
              <div className="hidden xl:order-2 xl:block" />
              <div className="order-1 xl:order-3 xl:pl-12">
                <StageLabel number="04" label="Equip" />
                <h3 className="mt-5 text-3xl font-semibold tracking-[-.035em] md:text-5xl">Add what the contract needs.</h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
                  Signal One can supply radios, PTT, tracking and body-worn equipment alongside the operating platform. Guard already has Devices & Services catalogue/request foundations; direct PTT, Tracking and Body Cam on/off controls inside Guard are planned.
                </p>
                <Link href="/radios-equipment" className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]">
                  Radios & equipment →
                </Link>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_160px_1fr] xl:items-center">
              <div className="xl:pr-12">
                <StageLabel number="05" label="Prove" />
                <div className="mt-4 flex items-center gap-3">
                  <h3 className="text-3xl font-semibold tracking-[-.035em] md:text-5xl">Give the client evidence.</h3>
                  <Status>Current</Status>
                </div>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
                  Client users sign into Guard with credentials supplied by their security company. The current client experience is deliberately scoped to service assurance rather than exposing the security company's internal workspace.
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/42">
                  Live map/location, clock status and live patrol progress are the target next extension of the client experience, not a current public claim.
                </p>
              </div>
              <div className="hidden xl:block" />
              <div className="grid gap-3 sm:grid-cols-2 xl:pl-12">
                {clientCapabilities.map((capability) => (
                  <div key={capability} className="rounded-[14px] border border-white/10 bg-white/[.025] px-5 py-4 text-sm font-medium text-white/66">
                    {capability}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_160px_1fr] xl:items-center">
              <div className="order-2 xl:order-1 xl:pr-12">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Payroll", "Available", "Extra cost"],
                    ["Accounting", "Available", "Extra cost"],
                  ].map(([title, status, meta]) => (
                    <div key={title} className="rounded-[16px] border border-white/10 bg-[#0F131A] p-6">
                      <p className="s1-mono text-[8px] text-[#86EFAC]">{status}</p>
                      <h4 className="mt-4 text-xl font-semibold">{title}</h4>
                      <p className="mt-2 text-sm text-white/40">{meta}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden xl:order-2 xl:block" />
              <div className="order-1 xl:order-3 xl:pl-12">
                <StageLabel number="06" label="Grow" />
                <h3 className="mt-5 text-3xl font-semibold tracking-[-.035em] md:text-5xl">Close the loop.</h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
                  Add Payroll and Accounting when the business needs them. More importantly, the operational evidence created in Guard gives management a stronger client-retention story and better commercial proof for the next opportunity.
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/42">
                  The flywheel returns to Sales OS: better evidence, better conversations, another contract.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0F131A] px-5 py-20 md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="s1-eyebrow">Simple Guard pricing</p>
            <h2 className="s1-h1 mt-5 font-semibold">R2 per guard per day.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">
              Buying guard days gives your security company access to the Guard platform. Pricing is excluding VAT. Guard days carry over and the minimum purchase is 10 guard days.
            </p>
            <Link href="/pricing" className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]">
              See full pricing details →
            </Link>
          </div>
          <GuardDayCalculator compact />
        </div>
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(125deg,rgba(14,165,233,.07),rgba(255,255,255,.025)_45%,rgba(15,19,26,.7))] p-7 md:p-10 lg:p-12">
            <p className="s1-eyebrow">Start the flywheel</p>
            <h2 className="mt-5 max-w-4xl text-3xl font-semibold tracking-[-.035em] md:text-5xl">
              Win it. Staff it. Run it. Prove it. Repeat.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/56">
              Start with Guard, add the commercial and equipment layers your company needs, and build one operating record around the contracts you serve.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/get-started" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
              <Link href="/contact" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                Talk to Signal One
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
