import Image from "next/image";
import Link from "next/link";
import GuardDayCalculator from "./components/GuardDayCalculator";
import HeroVideo from "./components/HeroVideo";
import PlatformProof from "./components/PlatformProof";

const startCapabilities = [
  "See Guard in action",
  "Calculate Guard cost",
  "Request a radio or tracking quote",
  "Talk to a Signal One sales representative",
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
  const heroVariant = process.env.NEXT_PUBLIC_SIGNAL_ONE_HERO_VARIANT === "sme-pain" ? "sme-pain" : "outcome";

  return (
    <main className="overflow-hidden bg-[var(--s1-surface-base)] text-[var(--s1-text-strong)]">
      {/* CINEMATIC HERO */}
      <section className="relative isolate min-h-[620px] overflow-hidden border-b border-white/10 md:min-h-[660px]">
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

        <div className="relative mx-auto flex min-h-[620px] max-w-[1440px] items-center px-5 pb-16 pt-28 md:min-h-[660px] md:pt-32">
          <div className="max-w-[760px]">
            <p className="s1-eyebrow">For growing South African security companies</p>
            <h1 className="mt-6 max-w-[880px] text-[clamp(2.9rem,5.6vw,5.7rem)] font-semibold leading-[.95] tracking-[-.055em] text-[#F1F5F9]">
              {heroVariant === "sme-pain" ? (
                <>
                  Replace the spreadsheets,
                  <span className="block">WhatsApp groups</span>
                  <span className="mt-2 block text-[#38BDF8]">and paper trail.</span>
                </>
              ) : (
                <>
                  Win more contracts.
                  <span className="block">Run every site.</span>
                  <span className="mt-2 block text-[#38BDF8]">Prove the service.</span>
                </>
              )}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">
              Signal One is the operating system for your security company,
              connecting guard hiring, sites, shifts, patrols, control room,
              PTT radios, tracking and client reporting in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#proof"
                className="s1-primary-action px-6 py-3 text-sm font-semibold"
              >
                See Signal One in action
              </Link>
              <Link
                href="/pricing#calculator"
                className="s1-secondary-action border-white/25 bg-black/20 px-6 py-3 text-sm font-semibold backdrop-blur-[12px]"
              >
                Calculate guard cost: R2 per guard per day
              </Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/60">
              Your guards can use their own phones or an authorised Central Device.
            </p>
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

      <section aria-label="Signal One buyer facts" className="border-b border-white/10 bg-[#0F131A] px-5">
        <div className="mx-auto grid max-w-[1440px] divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
          {[
            ["R2 / guard / day", "Ex VAT · Guard", "Live"],
            ["Phone or Central Device", "Guard attendance", "Live"],
            ["PSiRA registration rules", "Recorded at assignment", "Live"],
            ["Client portal + proof", "Authorised client access", "Live"],
            ["Radios by quote", "PTT equipment", "Live"],
          ].map(([title, detail, state]) => (
            <div key={title} className="px-4 py-4 first:pl-0 lg:px-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/82">{title}</span>
                <span className="rounded-full border border-[#22C55E]/25 bg-[#22C55E]/[.06] px-2 py-0.5 text-[11px] font-semibold text-[#86EFAC]">
                  {state}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/55">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EDITORIAL STORY */}
      <section className="relative px-5 py-16 md:py-20">
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

          <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-12 md:auto-rows-[250px]">
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
                    Win the contract. Then operationalise it.
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/58">
                    Signal One starts where the contract becomes operational:
                    staffing, equipment, site control and evidence your client can understand.
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
                Contract → workforce → operations → equipment → proof → growth
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

      <section id="proof" className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 max-w-3xl">
            <p className="s1-eyebrow">See the product</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-5xl">
              See what your operations team and clients actually work with.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
              These are controlled Signal One Guard QA and demo states using synthetic data.
              They are product evidence, not customer claims.
            </p>
          </div>
          <PlatformProof />
        </div>
      </section>

      {/* START */}
      <section className="relative border-y border-white/10 bg-[#0F131A] px-5 py-16 md:py-20">
        <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
          <div>
            <RailLabel number="01" label="Start" />
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] md:text-6xl">
              Start with the operational need.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/58">
              See Guard, calculate your operating cost, request radios or tracking,
              or ask a Signal One sales representative to help scope the requirement.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
              Signal One Sales OS is our internal sales workspace. It is not a sales-rep service
              sold to your company.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0D12] p-7 shadow-[0_35px_90px_rgba(0,0,0,.38)] md:p-9">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="s1-eyebrow">Choose your next step</p>
                <p className="mt-2 text-sm font-semibold text-white/72">
                  No enterprise buying maze.
                </p>
              </div>
              <Status>Live</Status>
            </div>
            <div className="mt-5 divide-y divide-white/[.07]">
              {startCapabilities.map((capability, index) => (
                <div key={capability} className="flex items-center justify-between gap-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="s1-mono text-white/55">0{index + 1}</span>
                    <span className="text-sm font-medium text-white/72">{capability}</span>
                  </div>
                  <span className="text-xs text-[#38BDF8]">→</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing#calculator" className="s1-secondary-action px-5 py-2.5 text-sm font-semibold">
                Calculate Guard cost
              </Link>
              <Link href="/contact" className="s1-primary-action px-5 py-2.5 text-sm font-semibold">
                Request consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HIRE */}
      <section className="px-5 pb-16 md:pb-20">
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
                <Status tone="planned">Coming soon</Status>
              </div>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.045em] md:text-5xl">
                Won the contract?
                <span className="block text-[#38BDF8]">Staff it.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-white/54">
                Guard Marketplace is part of the Signal One MVP. The client-facing
                browse, shortlist and request-to-hire experience is being built now;
                accepted requests will connect into the existing Guard workforce and shift flow.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/40">
                Guard currently records PSiRA number, grade and expiry and applies
                registration rules when a guard is assigned. External PSiRA verification
                is not presented as live until that integration is proven.
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
      <section className="relative border-y border-white/10 bg-[#0F131A] px-5 py-16 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <RailLabel number="03" label="Run" />
                <Status>Live</Status>
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
      <section className="px-5 py-16 md:py-20">
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
                  Signal One supplies PTT radio services, tracking and body-camera
                  products from its commercial catalogue. Switching these capabilities
                  on and managing them directly inside Guard is coming soon.
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
                  <Status>Live</Status>
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
                    <Status tone="planned">Coming soon</Status>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* GROW */}
      <section className="border-y border-white/10 bg-[#0F131A] px-5 py-16 md:py-20">
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
                ["Payroll", "Coming soon"],
                ["Accounting", "Beta"],
              ].map(([title, state]) => (
                <div key={title} className="rounded-[13px] border border-white/12 bg-[#0A0D12]/76 p-4 backdrop-blur-[12px]">
                  <p className={"s1-mono " + (state === "Beta" ? "text-[#FCD34D]" : "text-[#7DD3FC]")}>{state}</p>
                  <p className="mt-2 text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-[11px] text-white/38">Extra cost</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-5 py-16 md:py-20">
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
      <section className="px-5 pb-16 md:pb-20">
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
