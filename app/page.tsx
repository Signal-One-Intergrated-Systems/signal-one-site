import Image from "next/image";
import Link from "next/link";
import GuardDayCalculator from "./components/GuardDayCalculator";
import HeroVideo from "./components/HeroVideo";

const salesCapabilities = [
  "Leads and pipeline",
  "Next actions and follow-ups",
  "Quotes and customer conversations",
  "Sales coaching and performance",
] as const;

const guardCapabilities = [
  ["Attendance", "Know who arrived and where the service is being delivered."],
  ["Patrols", "Verify routes and checkpoints with QR or NFC, with offline continuity."],
  ["Occurrence", "Keep incidents, corrections and exceptions in one chronological record."],
  ["Control Room", "Bring SOS, site activity and operational exceptions into the response workspace."],
] as const;

const clientCapabilities = [
  "Authorised sites",
  "Scheduled service coverage",
  "Patrol and checkpoint evidence",
  "Incidents and proof-of-service reports",
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

function RailLabel({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
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
      {/* CINEMATIC HERO */}
      <section className="relative isolate min-h-[760px] overflow-hidden border-b border-white/10 md:min-h-[820px]">
        <Image
          src="/images/story/hero.webp"
          alt="Security officer working at an active site"
          fill
          priority
          className="object-cover object-[66%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0D12_0%,rgba(10,13,18,.96)_27%,rgba(10,13,18,.74)_52%,rgba(10,13,18,.18)_78%,rgba(10,13,18,.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.22)_0%,rgba(10,13,18,.05)_55%,#0A0D12_100%)]" />
        <div className="absolute left-[38%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#0EA5E9]/[.055] blur-[110px]" />

        <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] items-center px-5 pb-20 pt-32 md:min-h-[820px] md:pt-36">
          <div className="max-w-[760px]">
            <p className="s1-eyebrow">For South African security companies</p>
            <h1 className="mt-6 text-[clamp(3rem,6.3vw,6.5rem)] font-semibold leading-[.94] tracking-[-.055em] text-[#F1F5F9]">
              Run the business
              <span className="block">of security.</span>
              <span className="mt-2 block text-[#38BDF8]">One platform.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/68">
              Win contracts. Hire guards. Run sites. Equip your teams. Prove
              the service. Build the next opportunity from the same operating
              record.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/get-started"
                className="s1-primary-action px-6 py-3 text-sm font-semibold"
              >
                Get started
              </Link>
              <Link
                href="/#platform"
                className="s1-secondary-action border-white/25 bg-black/20 px-6 py-3 text-sm font-semibold backdrop-blur-[12px]"
              >
                See the operating system ↓
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-white/15 bg-black/10 backdrop-blur-[10px]">
              {[
                ["01", "FIELD", "Guards · posts · patrols"],
                ["02", "CONTROL", "Exceptions · SOS · response"],
                ["03", "PROOF", "Reports · client evidence"],
              ].map(([number, title, detail], index) => (
                <div
                  key={title}
                  className={
                    "py-4 pr-4 " +
                    (index ? "border-l border-white/15 pl-4" : "")
                  }
                >
                  <p className="s1-mono text-[7px] text-[#7DD3FC]">
                    {number} / {title}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-white/48">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden items-center gap-3 text-right lg:flex">
          <div>
            <p className="s1-mono text-[7px] text-white/32">Signal One</p>
            <p className="mt-1 text-xs font-medium text-white/60">
              Security company operating platform
            </p>
          </div>
          <span className="h-10 w-px bg-white/18" />
          <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_18px_rgba(56,189,248,.72)]" />
        </div>
      </section>

      {/* EDITORIAL STORY */}
      <section className="relative px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="s1-eyebrow">The contract is the start</p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] md:text-6xl">
                Winning the work is only the beginning.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/56 lg:pb-1">
              A security company still has to staff the site, get the guards
              there, verify the patrols, respond to exceptions and give the
              client evidence. Signal One is built around that whole chain.
            </p>
          </div>

          <div className="mt-14 grid auto-rows-[220px] gap-4 md:grid-cols-12 md:auto-rows-[250px]">
            <article className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0A0D12] md:col-span-7 md:row-span-2">
              <Image
                src="/images/story/checkpoint.webp"
                alt="Security officer verifying a checkpoint"
                fill
                className="object-cover object-center"
                sizes="(min-width:768px) 58vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.04)_35%,rgba(10,13,18,.92)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="s1-mono text-[8px] text-[#7DD3FC]">
                  02 / STAFF + RUN
                </p>
                <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-.03em] md:text-3xl">
                  Put the right people on the right site — then know the work
                  happened.
                </h3>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0A0D12] md:col-span-5">
              <Image
                src="/images/story/sales.webp"
                alt="Sales professional working on a security-company opportunity"
                fill
                className="object-cover object-center"
                sizes="(min-width:768px) 42vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.08)_10%,rgba(10,13,18,.88)_100%)]" />
              <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
                <p className="s1-mono text-[8px] text-[#7DD3FC]">01 / WIN</p>
                <div>
                  <p className="text-3xl font-semibold tracking-[-.04em]">
                    Lead → quote → contract.
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/58">
                    Sales OS keeps leads, pipeline, next actions, quotes and
                    customer conversations in one commercial operating rhythm.
                  </p>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0A0D12] md:col-span-5">
              <Image
                src="/images/story/control-room.webp"
                alt="Security control room operator monitoring active operations"
                fill
                className="object-cover object-center"
                sizes="(min-width:768px) 42vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.86),rgba(10,13,18,.2))]" />
              <div className="relative flex h-full max-w-[60%] flex-col justify-end p-6 md:p-7">
                <p className="s1-mono text-[8px] text-[#7DD3FC]">
                  03 / CONTROL
                </p>
                <p className="mt-3 text-xl font-semibold tracking-[-.025em]">
                  See the exception while it can still be acted on.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-[20px] border border-white/10 bg-[#0F131A] p-7 md:p-9">
              <p className="s1-mono text-[8px] text-[#7DD3FC]">04 / PROVE</p>
              <p className="mt-4 max-w-xl text-2xl font-semibold tracking-[-.03em] md:text-3xl">
                The service record should be created by the operation — not
                reconstructed after it.
              </p>
            </div>
            <div className="flex items-center rounded-[20px] border border-[#0EA5E9]/20 bg-[#0EA5E9]/[.045] p-7 md:p-9">
              <p className="max-w-2xl text-base leading-8 text-white/60">
                That is the Signal One flywheel: win the contract, staff it,
                operate it, prove it, then take stronger evidence into the next
                commercial conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM RAIL */}
      <section id="platform" className="border-y border-white/10 bg-[#0F131A] px-5 py-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="s1-eyebrow">One business · one operating system</p>
              <p className="mt-2 text-sm text-white/44">
                Commercial → workforce → operations → equipment → proof → growth
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-6">
              {["Win", "Hire", "Run", "Equip", "Prove", "Grow"].map(
                (label, index) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="s1-mono text-[7px] text-[#38BDF8]">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-semibold text-white/66">
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SALES OS */}
      <section className="relative px-5 py-24 md:py-32">
        <div className="pointer-events-none absolute right-[-8%] top-[8%] h-[500px] w-[500px] rounded-full bg-[#0EA5E9]/[.055] blur-[130px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
          <div>
            <RailLabel number="01" label="Win" />
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] md:text-6xl">
              Turn leads into contracts.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/56">
              Signal One Sales OS gives the security company&apos;s own sales
              team a working system for leads, pipeline, next actions, quotes,
              conversations and coaching.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/40">
              Signal One provides the sales operating system. Your company
              provides the sales team.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0D12] p-7 shadow-[0_35px_90px_rgba(0,0,0,.38)] md:p-9">
            <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[#0EA5E9]/10 blur-[80px]" />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="s1-mono text-[8px] text-[#7DD3FC]">
                    Sales OS
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/72">
                    Commercial operating rhythm
                  </p>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_14px_rgba(34,197,94,.45)]" />
              </div>

              <div className="mt-5 divide-y divide-white/[.07]">
                {salesCapabilities.map((capability, index) => (
                  <div
                    key={capability}
                    className="flex items-center justify-between gap-6 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="s1-mono text-[7px] text-white/22">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-medium text-white/70">
                        {capability}
                      </span>
                    </div>
                    <span className="text-xs text-[#38BDF8]">→</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-[12px] border border-[#38BDF8]/18 bg-[#0EA5E9]/[.035] px-4 py-3.5">
                <span className="text-sm font-medium text-white/66">
                  Calendar / appointments
                </span>
                <Status tone="planned">Planned</Status>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIRE */}
      <section className="px-5 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0D12]">
          <div className="grid lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[420px] lg:min-h-[610px]">
              <Image
                src="/images/story/female-guard.webp"
                alt="Security officer using a mobile device at a site checkpoint"
                fill
                className="object-cover object-center"
                sizes="(min-width:1024px) 54vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.04),rgba(10,13,18,.38))]" />
              <div className="absolute bottom-6 left-6 rounded-[12px] border border-white/14 bg-[#0A0D12]/74 px-4 py-3 backdrop-blur-[14px]">
                <p className="s1-mono text-[7px] text-[#7DD3FC]">
                  PRIVATE CLIENT WORKSPACE
                </p>
                <p className="mt-1.5 text-xs text-white/62">
                  Guard profiles stay behind authenticated access.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
              <div className="flex items-center gap-3">
                <RailLabel number="02" label="Hire" />
                <Status tone="planned">Target product</Status>
              </div>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.045em] md:text-5xl">
                Won the contract?
                <span className="block text-[#38BDF8]">Staff it.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-white/54">
                Guard Marketplace is the planned hiring layer: client security
                companies browse eligible profiles, send a request to hire and
                the guard accepts or declines from the Guard app.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/40">
                Guard already contains live PSiRA verification against
                PSiRA&apos;s official individual verification service.
                Marketplace eligibility enforcement is part of the planned
                hiring workflow.
              </p>
              <Link
                href="/guard-marketplace"
                className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]"
              >
                Explore the Guard Marketplace model →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RUN */}
      <section className="relative border-y border-white/10 bg-[#0F131A] px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <RailLabel number="03" label="Run" />
                <Status>Current</Status>
              </div>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.045em] md:text-6xl">
                From contract
                <span className="block">to live site.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/54">
              Set up sites, shifts and allocations. Guards work from their own
              phones or an authorised Central Device. Attendance, patrols,
              incidents, SOS and exceptions feed the same operational record.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[24px] border border-white/10 shadow-[0_40px_110px_rgba(0,0,0,.38)]">
            <HeroVideo />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["/images/story/central-device.webp", "Central Device", "Shared authorised device at a fixed security post."],
              ["/images/story/incident-response.webp", "Incident response", "Field communication when an exception needs action."],
              ["/images/story/field-supervisor.webp", "Supervision", "Operational oversight across active posts and teams."],
            ].map(([src, title, body]) => (
              <article key={title} className="group relative min-h-[250px] overflow-hidden rounded-[18px] border border-white/10">
                <Image src={src} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.025]" sizes="(min-width:768px) 33vw,100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.05)_28%,rgba(10,13,18,.92)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-base font-semibold text-white/88">{title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-white/52">{body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guardCapabilities.map(([title, body], index) => (
              <article key={title} className="border-l border-white/12 pl-5">
                <p className="s1-mono text-[7px] text-[#38BDF8]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-base font-semibold text-white/82">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/42">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROL ROOM */}
      <section className="relative min-h-[680px] overflow-hidden border-b border-white/10">
        <Image
          src="/images/story/control-room.webp"
          alt="Control room operator monitoring security operations"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0D12_0%,rgba(10,13,18,.94)_30%,rgba(10,13,18,.54)_58%,rgba(10,13,18,.08)_100%)]" />
        <div className="relative mx-auto flex min-h-[680px] max-w-[1440px] items-center px-5 py-24">
          <div className="max-w-[590px]">
            <p className="s1-eyebrow">Control Room</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-.045em] md:text-6xl">
              Attention goes where the operation needs it.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/62">
              SOS, incidents, short posts and operational exceptions belong in
              the same response workspace — with the site context needed to
              act.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {["SOS", "Incidents", "Exceptions", "Site activity"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-[12px] border border-white/14 bg-black/20 px-4 py-3 text-sm font-medium text-white/68 backdrop-blur-[12px]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <div className="mt-6 relative h-[150px] overflow-hidden rounded-[16px] border border-white/12 bg-black/20 sm:h-[170px]">
              <Image
                src="/images/story/female-control.webp"
                alt="Control room operator monitoring multiple security feeds"
                fill
                className="object-cover object-center"
                sizes="(min-width:1024px) 520px,90vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.08),rgba(10,13,18,.45))]" />
            </div>
          </div>
        </div>
      </section>

      {/* EQUIP + PROVE */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
            <article className="relative min-h-[560px] overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0D12]">
              <Image
                src="/images/Devices/poc/hero-radios.jpg"
                alt="Professional push-to-talk radio equipment"
                fill
                className="object-cover object-center opacity-78"
                sizes="(min-width:1024px) 45vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.12)_15%,rgba(10,13,18,.92)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <RailLabel number="04" label="Equip" />
                <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] md:text-4xl">
                  Add what the contract needs.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/52">
                  Signal One can supply radios, PTT, tracking and body-worn
                  equipment alongside the operating platform. Direct on/off
                  controls inside Guard are planned.
                </p>
                <Link
                  href="/radios-equipment"
                  className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8]"
                >
                  Radios & equipment →
                </Link>
              </div>
            </article>

            <article className="relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0D12] p-7 md:p-10">
              <Image
                src="/images/story/proof.webp"
                alt="Security-company client reviewing proof of service"
                fill
                className="object-cover object-center opacity-55"
                sizes="(min-width:1024px) 55vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.32)_0%,rgba(10,13,18,.78)_45%,#0A0D12_100%)]" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <RailLabel number="05" label="Prove" />
                  <Status>Current</Status>
                </div>
                <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.03] tracking-[-.045em] md:text-5xl">
                  Give the client evidence — without giving away your
                  operation.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/54">
                  Client users sign into Guard with credentials supplied by
                  their security company and see the service information
                  authorised for them.
                </p>
              </div>

              <div className="relative mt-10 grid gap-3 sm:grid-cols-2">
                {clientCapabilities.map((capability) => (
                  <div
                    key={capability}
                    className="rounded-[13px] border border-white/10 bg-white/[.025] px-4 py-3.5 text-sm text-white/58"
                  >
                    {capability}
                  </div>
                ))}
                <div className="rounded-[13px] border border-[#38BDF8]/18 bg-[#0EA5E9]/[.035] px-4 py-3.5 sm:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-white/58">
                      Live map, clock status and live patrol progress
                    </span>
                    <Status tone="planned">Planned extension</Status>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* GROW */}
      <section className="border-y border-white/10 bg-[#0F131A] px-5 py-20 md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_.85fr] lg:items-center">
          <div>
            <RailLabel number="06" label="Grow" />
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-.045em] md:text-5xl">
              Close the loop with better evidence and a stronger next sale.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/52">
              Add Payroll and Accounting when the business needs them. More
              importantly, the record created in Guard gives management a
              stronger client-retention story and better commercial proof for
              the next opportunity.
            </p>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0A0D12]">
            <Image
              src="/images/story/operations-director.webp"
              alt="Security operations director reviewing service performance"
              fill
              className="object-cover object-center"
              sizes="(min-width:1024px) 44vw,100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.04)_22%,rgba(10,13,18,.92)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-3 p-5 md:p-6">
              {[
                ["Payroll", "Available"],
                ["Accounting", "Available"],
              ].map(([title, state]) => (
                <div key={title} className="rounded-[13px] border border-white/12 bg-[#0A0D12]/76 p-4 backdrop-blur-[12px]">
                  <p className="s1-mono text-[7px] text-[#86EFAC]">{state}</p>
                  <p className="mt-2 text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-[11px] text-white/38">Extra cost</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <p className="s1-eyebrow">Simple Guard pricing</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-.045em] md:text-5xl">
              R2 per guard per day.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/54">
              Buying guard days gives your security company access to the Guard
              platform. Pricing is excluding VAT. Guard days carry over and
              the minimum purchase is 10 guard days.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8]"
            >
              See full pricing details →
            </Link>
          </div>
          <GuardDayCalculator compact />
        </div>
      </section>

      {/* CLOSING */}
      <section className="px-5 pb-24 md:pb-32">
        <div className="relative mx-auto min-h-[420px] max-w-[1440px] overflow-hidden rounded-[24px] border border-white/10">
          <Image
            src="/images/story/hero.webp"
            alt=""
            fill
            className="object-cover object-[64%_center] opacity-55"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0D12_0%,rgba(10,13,18,.88)_42%,rgba(10,13,18,.28)_100%)]" />
          <div className="relative flex min-h-[420px] max-w-3xl flex-col justify-center p-7 md:p-12">
            <p className="s1-eyebrow">Start the flywheel</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.045em] md:text-6xl">
              Win it. Staff it.
              <span className="block text-[#38BDF8]">
                Run it. Prove it. Repeat.
              </span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/get-started"
                className="s1-primary-action px-6 py-3 text-sm font-semibold"
              >
                Get started
              </Link>
              <Link
                href="/contact"
                className="s1-secondary-action border-white/20 bg-black/20 px-6 py-3 text-sm font-semibold backdrop-blur-[12px]"
              >
                Talk to Signal One
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
