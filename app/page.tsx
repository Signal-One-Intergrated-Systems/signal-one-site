import Image from "next/image";
import Link from "next/link";
import HeroVideo from "./components/HeroVideo";
import PeopleSceneBriefs from "./components/PeopleSceneBriefs";
import PlatformProof from "./components/PlatformProof";

const risks = [
  {
    title: "A post is short and management finds out too late.",
    body: "Coverage needs to be visible before a staffing gap becomes a client problem.",
    tag: "Coverage risk",
    image: "/images/security.jpg",
    alt: "Security officer communicating by radio while working on site",
  },
  {
    title: "A client disputes what happened on site.",
    body: "Attendance, patrol and incident evidence should be available without reconstructing the day from messages.",
    tag: "Evidence risk",
    image: "/images/industries/security.jpg",
    alt: "Security control room with operators monitoring multiple screens",
  },
  {
    title: "The control room sees fragments, not the operation.",
    body: "SOS, exceptions, site activity and response need one operational picture.",
    tag: "Visibility risk",
    image: "/images/What-we-deliver/platforms.jpg",
    alt: "Connected operational screens showing a unified digital platform",
  },
  {
    title: "Supervisors spend time chasing facts instead of acting.",
    body: "Signal One is designed to surface what needs attention and preserve the operational record.",
    tag: "Management load",
    image: "/images/managed.jpg",
    alt: "Operations team reviewing connected systems and operational data",
  },
] as const;

const pillars = [
  {
    title: "Workforce attendance",
    body: "Clock-in and clock-out tied to the operational site, with geofence policy and an evidence trail.",
    image: "/images/logistics.jpg",
    alt: "Field supervisor using a radio inside an operational site",
  },
  {
    title: "Patrol verification",
    body: "Patrol routes, QR or NFC checkpoints, GPS policy and offline synchronisation for field continuity.",
    image: "/images/security.jpg",
    alt: "Security officer using a handheld radio during field operations",
  },
  {
    title: "Digital occurrence book",
    body: "A chronological operational record built from real events, incidents, corrections and exceptions.",
    image: "/images/industries/security.jpg",
    alt: "Security control-room operator working with monitoring screens",
  },
  {
    title: "Operational intelligence",
    body: "Control-room awareness, post coverage and proof of service derived from the same operational facts.",
    image: "/images/What-we-deliver/platforms.jpg",
    alt: "Operational platform displayed across connected screens",
  },
] as const;

const buyerOutcomes = [
  ["Know", "See site coverage, guards on duty, patrol state and exceptions without waiting for a manual update."],
  ["Act", "Move attention to the posts, SOS events and operational exceptions that need intervention now."],
  ["Prove", "Turn attendance, patrols and occurrence records into service evidence for management and clients."],
] as const;

const roles = [
  {
    eyebrow: "Owners & directors",
    title: "Control without living in the control room.",
    body: "See the operational picture, understand risk and give clients a stronger evidence story without depending on fragmented reports.",
  },
  {
    eyebrow: "Operations managers",
    title: "One place to see what needs attention.",
    body: "Work from My operation, Control Room, post coverage, people and access, occurrence records and service proof.",
  },
  {
    eyebrow: "Supervisors",
    title: "Run the sites, not the spreadsheet.",
    body: "See assigned sites, roster or map, shortfalls, team state and operational actions from the same environment.",
  },
  {
    eyebrow: "Your clients",
    title: "Give the buyer evidence, not internal noise.",
    body: "Client-facing service views can show coverage and service proof without exposing the security company's internal operating workspace.",
  },
] as const;

const marketplace = [
  {
    image: "/images/Devices/poc/D21.jpg",
    title: "PoC radios",
    mode: "Buy or rent",
    alt: "Professional push-to-talk radio available through Signal One Marketplace",
  },
  {
    image: "/images/products/dispatch-console.jpg",
    title: "Dispatch",
    mode: "Control room",
    alt: "Dispatch console for operational communications",
  },
  {
    image: "/images/products/sim-card.jpg",
    title: "Connectivity",
    mode: "Subscribe",
    alt: "Managed connectivity SIM product",
  },
  {
    image: "/images/Devices/Lorawan/hero-sensors.jpg",
    title: "Sensors",
    mode: "Buy or quote",
    alt: "Connected LoRaWAN sensors for operational sites",
  },
  {
    image: "/images/products/sos-button.jpg",
    title: "SOS devices",
    mode: "Buy or quote",
    alt: "Connected SOS device for operational safety",
  },
] as const;

const implementation = [
  ["01", "Operational review", "Understand sites, people, operating model and the first risks Signal One needs to address."],
  ["02", "Company setup", "Create the company administration layer and controlled access for the people responsible for the operation."],
  ["03", "Sites & people", "Set up clients, sites, posts, supervisors, guards and operational devices."],
  ["04", "Go live", "Move attendance, patrols, exceptions and service evidence into the live Signal One workflow."],
] as const;

const trust = [
  ["Role-based access", "People see the operational scope appropriate to their role."],
  ["Audit-preserving records", "Deactivation and corrections preserve the operational history rather than deleting it."],
  ["Offline field continuity", "Guard flows are designed to continue through connectivity loss and reconcile later."],
  ["Evidence-led client service", "Service proof is derived from the same operational record used to run the work."],
] as const;

export default function Home() {
  return (
    <main className="overflow-hidden bg-[var(--s1-bg)] text-[var(--s1-text)]">
      <section className="relative isolate overflow-hidden border-b border-white/10 px-5 pb-20 pt-32 md:pb-28 md:pt-36">
        <div className="s1-ambient absolute inset-0 -z-20" />
        <div className="s1-grid absolute inset-0 -z-10 opacity-55" />
        <div className="absolute left-1/2 top-0 -z-10 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-[#0EA5E9]/[.065] blur-[120px]" />

        <div className="mx-auto max-w-[90rem]">
          <div className="s1-glass relative overflow-hidden rounded-[24px] p-5 sm:p-7 lg:p-10 xl:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(14,165,233,.07),transparent_36%,rgba(255,255,255,.018))]" />

            <div className="relative grid items-center gap-10 xl:grid-cols-[.92fr_1.08fr] xl:gap-12">
              <div className="py-2 xl:py-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/[.075] px-3.5 py-2">
                  <span className="relative h-2 w-2 rounded-full bg-[#0EA5E9] shadow-[0_0_16px_rgba(14,165,233,.7)]" />
                  <span className="s1-mono text-[9px] font-medium text-[#7DD3FC]">
                    Security operations software for South African guarding companies
                  </span>
                </div>

                <h1 className="mt-6 max-w-3xl text-[clamp(2.6rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-.025em] text-[#F1F5F9]">
                  Control every site.
                  <span className="block text-[#0EA5E9]">Know what happened.</span>
                  <span className="block">Prove the service.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg md:leading-8">
                  Run attendance, posts, patrols, incidents, SOS, control-room visibility and client proof from one operational record. Add push-to-talk communications, managed devices and connectivity when the operation needs them.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/tour" className="s1-primary-action px-6 py-3.5 text-sm font-semibold">
                    Watch product tour
                  </Link>
                  <Link href="/contact?intent=demo" className="s1-secondary-action px-6 py-3.5 text-sm font-semibold">
                    Book a 30-minute demo
                  </Link>
                  <Link href="/pricing" className="px-3 py-3.5 text-sm font-semibold text-white/58 transition hover:text-[#38BDF8]">
                    See packages →
                  </Link>
                </div>

                <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                  {[
                    ["Attendance", "Know who is actually on site."],
                    ["Patrols", "Verify rounds and checkpoints."],
                    ["Service proof", "Show what was delivered."],
                  ].map(([label, text]) => (
                    <div key={label} className="rounded-xl border border-white/[.065] bg-white/[.025] p-3.5">
                      <p className="text-sm font-semibold text-white/88">{label}</p>
                      <p className="mt-1 text-xs leading-5 text-white/44">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 -z-10 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
                <HeroVideo />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 px-1 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
            <p>One operating record across attendance, patrols, incidents, SOS and service proof.</p>
            <p className="s1-mono text-[9px] text-white/30">Signal One · Security Operations</p>
          </div>
        </div>
      </section>

      <section id="problem" className="relative px-5 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(14,165,233,.055),transparent_27%)]" />
        <div className="relative mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[.92fr_1.08fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">The operating problem</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                The risk is not lack of activity. It is not knowing what is true soon enough.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-white/56">
              Security operations fail quietly first: a post goes short, a patrol cannot be proven, an SOS sits unresolved, or a client asks for evidence that lives across messages and spreadsheets.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {risks.map((risk) => (
              <article
                key={risk.title}
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] shadow-[0_24px_70px_rgba(0,0,0,.24)] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:-translate-y-1 hover:border-[#0EA5E9]/30"
              >
                <div className="relative h-52 overflow-hidden sm:h-60">
                  <Image
                    src={risk.image}
                    alt={risk.alt}
                    fill
                    className="object-cover transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.035]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.04),rgba(10,13,18,.68))]" />
                  <p className="s1-mono absolute bottom-4 left-5 text-[9px] font-semibold text-[#7DD3FC]">{risk.tag}</p>
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-xl font-semibold tracking-[-.025em] text-white/94">{risk.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">{risk.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-white/10 px-5 py-24 md:py-32">
        <Image
          src="/images/systems-overview-bg.jpg"
          alt=""
          fill
          className="-z-20 object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(10,13,18,.97),rgba(10,13,18,.90)_48%,rgba(21,26,33,.84))]" />

        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">The Signal One answer</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                One operational record from the post to the client.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-white/60">
              Signal One Guard turns field activity into operational state: attendance, patrols, incidents, SOS, post coverage, occurrence records and proof of service. The point is not another dashboard. The point is a clearer answer to three management questions.
            </p>
          </div>

          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            {buyerOutcomes.map(([title, body], index) => (
              <div
                key={title}
                className="s1-glass rounded-[18px] p-7 md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="s1-mono text-[9px] text-white/30">0{index + 1}</span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(14,165,233,.45),transparent)]" />
                </div>
                <h3 className="mt-8 text-3xl font-semibold tracking-[-.04em] text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/54">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Product proof</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                Do not take the capability on trust. See the operating system.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/46">
              These are real Signal One Guard product captures from controlled QA/demo states using synthetic test data.
            </p>
          </div>
          <PlatformProof />
        </div>
      </section>

      <section id="platform" className="border-y border-white/10 bg-[var(--s1-deep)] px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div className="max-w-xl">
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Signal One Guard</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                Built around four operational pillars.
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm leading-7 text-white/54">
                The platform is structured around the evidence a security company needs to run the operation, respond to exceptions and stand behind the service delivered.
              </p>
              <Link href="/solutions/security" className="mt-5 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]">
                Explore security operations →
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:border-[#0EA5E9]/30"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.alt}
                    fill
                    className="object-cover transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.035]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.06),rgba(10,13,18,.68))]" />
                  <span className="s1-mono absolute bottom-4 left-5 text-[9px] font-semibold text-white/56">0{index + 1}</span>
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-xl font-semibold tracking-[-.025em]">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">{pillar.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <article key={role.eyebrow} className="rounded-[16px] border border-white/[.075] bg-white/[.025] p-5 md:p-6">
                <p className="s1-mono text-[8px] font-semibold text-[#38BDF8]">{role.eyebrow}</p>
                <h3 className="mt-4 text-lg font-semibold tracking-[-.02em]">{role.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/44">{role.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[.86fr_1.14fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">People in the operation</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                The product should be seen where the work actually happens.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/52">
              Signal One is designed around the people who run security operations: management, control-room teams and field supervisors working from the same operational record.
            </p>
          </div>

          <div className="mt-12">
            <PeopleSceneBriefs />
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Signal One point of view</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                Security operations should produce earlier truth, not more reporting.
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm leading-7 text-white/52">
                Our insights focus on the operating problems behind guard management: delayed truth, exception overload, fragmented occurrence records and weak service evidence.
              </p>
              <Link href="/insights" className="mt-5 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]">
                Read Signal One insights →
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              ["/insights/security-contracts-fail-quietly", "Operating risk", "Security contracts usually fail quietly before they fail visibly."],
              ["/insights/control-room-exception-management", "Control room", "A control room should manage exceptions, not stare at everything."],
              ["/insights/digital-occurrence-book", "Operational record", "A digital occurrence book is not just a paper book on a screen."],
            ].map(([href, tag, title]) => (
              <Link key={href} href={href} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0EA5E9]/35">
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{tag}</p>
                <h3 className="mt-5 text-xl font-semibold leading-7 tracking-[-.025em]">{title}</h3>
                <span className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8] transition duration-300 group-hover:translate-x-1">
                  Read insight →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--s1-deep)] px-5 py-20 md:py-24">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Evaluate before you engage</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                Build most of the business case before the sales call.
              </h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-white/54">
              See the operating system, understand how Signal One is packaged and review the deployment principles procurement will ask about. The live conversation should focus on fit, not basic discovery.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              ["/tour", "Product tour", "See Control Room, My operation, People & access and Proof of service using controlled demo captures.", "Tour the product"],
              ["/pricing", "Packages & pricing", "Understand Guard Core, Control, Connected Operations and Enterprise before requesting commercial pricing.", "See packages"],
              ["/trust", "Trust & deployment", "Review access, audit-preserving records, offline field continuity and the implementation path.", "Review trust"],
            ].map(([href, title, body, cta]) => (
              <Link key={href} href={href} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-7 transition duration-300 hover:border-[#0EA5E9]/35">
                <span className="mb-5 block h-1 w-8 rounded-full bg-[#0EA5E9]" />
                <h3 className="text-2xl font-semibold tracking-[-.03em]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/48">{body}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-[#38BDF8] transition duration-300 group-hover:translate-x-1">
                  {cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="border-y border-white/10 bg-[var(--s1-deep)] px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Signal One Marketplace</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">
                Equip the operation after you understand the operation.
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm leading-7 text-white/54">
                Buy or rent radios, choose SIM subscriptions and source connected sensors and platform services. Marketplace supports the security operation; it is not the main reason to choose Signal One.
              </p>
              <Link href="/marketplace" className="s1-primary-action mt-6 inline-flex px-6 py-3 text-sm font-semibold">
                Browse marketplace
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {marketplace.map((item) => (
              <Link
                key={item.title}
                href="/marketplace"
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:-translate-y-1 hover:border-[#0EA5E9]/35"
              >
                <div className="relative h-48 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(14,165,233,.11),transparent_52%)]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-contain p-5 transition duration-500 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.045]"
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="border-t border-white/10 p-5">
                  <p className="font-semibold text-white/90">{item.title}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-white/40">{item.mode}</p>
                    <span className="text-[#38BDF8] transition duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
            <div className="relative min-h-[380px] overflow-hidden rounded-[18px] border border-white/10">
              <Image
                src="/images/managed.jpg"
                alt="Operations team reviewing connected systems during implementation"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.04),rgba(10,13,18,.82))]" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Implementation & trust</p>
                <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                  A controlled path into live operations.
                </h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {implementation.map(([number, title, body]) => (
                <div key={number} className="rounded-[18px] border border-white/10 bg-white/[.025] p-6 md:p-7">
                  <div className="flex items-center gap-3">
                    <span className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{number}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/46">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map(([title, body]) => (
              <div key={title} className="rounded-[16px] border border-white/[.075] bg-[#0A0D12] p-5">
                <span className="mb-4 block h-1 w-8 rounded-full bg-[#0EA5E9] shadow-[0_0_14px_rgba(14,165,233,.45)]" />
                <h3 className="text-sm font-semibold text-white/84">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/40">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-20 md:py-24">
        <div className="relative mx-auto min-h-[430px] max-w-[90rem] overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] shadow-[var(--s1-shadow-card)]">
          <Image
            src="/images/industries/security.jpg"
            alt="Security control room supporting active field operations"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.98)_0%,rgba(10,13,18,.95)_42%,rgba(10,13,18,.58)_72%,rgba(10,13,18,.32)_100%)]" />

          <div className="relative flex min-h-[430px] max-w-4xl flex-col justify-between p-7 md:p-12">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Next step</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.035em] md:text-5xl">
                Start with the operational problem you need to control.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58">
                Take the self-guided tour first, then use a live demo to map Signal One to your own sites, guard count, control-room workflow and client-service requirements.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/tour" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                  Take product tour
                </Link>
                <Link href="/contact?intent=demo" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                  Book a 30-minute demo
                </Link>
                <Link href="/pricing" className="px-3 py-3 text-sm font-semibold text-white/62 transition hover:text-[#38BDF8]">
                  See packages →
                </Link>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/40">Need technical or procurement information before a demo?</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/trust" className="font-semibold text-white/66 transition hover:text-[#38BDF8]">
                  Trust & deployment →
                </Link>
                <Link href="/marketplace" className="font-semibold text-white/66 transition hover:text-[#38BDF8]">
                  Connected operations →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
