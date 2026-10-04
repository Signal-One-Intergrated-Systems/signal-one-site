import Image from "next/image";
import Link from "next/link";
import PeopleSceneBriefs from "./components/PeopleSceneBriefs";
import PlatformProof from "./components/PlatformProof";

const risks = [
  {
    title: "A post is short and management finds out too late.",
    body: "Coverage needs to be visible before a staffing gap becomes a client problem.",
    tag: "Coverage risk",
  },
  {
    title: "A client disputes what happened on site.",
    body: "Attendance, patrol and incident evidence should be available without reconstructing the day from messages.",
    tag: "Evidence risk",
  },
  {
    title: "The control room sees fragments, not the operation.",
    body: "SOS, exceptions, site activity and response need one operational picture.",
    tag: "Visibility risk",
  },
  {
    title: "Supervisors spend time chasing facts instead of acting.",
    body: "Signal One is designed to surface what needs attention and preserve the operational record.",
    tag: "Management load",
  },
];

const pillars = [
  {
    title: "Workforce attendance",
    body: "Clock-in and clock-out tied to the operational site, with geofence policy and an evidence trail.",
  },
  {
    title: "Patrol verification",
    body: "Patrol routes, QR or NFC checkpoints, GPS policy and offline synchronisation for field continuity.",
  },
  {
    title: "Digital occurrence book",
    body: "A chronological operational record built from real events, incidents, corrections and exceptions.",
  },
  {
    title: "Operational intelligence",
    body: "Control-room awareness, post coverage and proof of service derived from the same operational facts.",
  },
];

const buyerOutcomes = [
  ["Know", "See site coverage, guards on duty, patrol state and exceptions without waiting for a manual update."],
  ["Act", "Move attention to the posts, SOS events and operational exceptions that need intervention now."],
  ["Prove", "Turn attendance, patrols and occurrence records into service evidence for management and clients."],
];

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
];

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
                    For private security companies
                  </span>
                </div>

                <h1 className="mt-6 max-w-3xl text-[clamp(2.6rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-.025em] text-[#F1F5F9]">
                  Control every site.
                  <span className="block text-[#0EA5E9]">Know what happened.</span>
                  <span className="block">Prove the service.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg md:leading-8">
                  Signal One gives security-company owners and operations leaders one operational picture across people, posts, patrols, exceptions, evidence, devices and client service.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/#proof"
                    className="s1-primary-action px-6 py-3.5 text-sm font-semibold"
                  >
                    See Signal One in action
                  </Link>
                  <Link
                    href="/contact"
                    className="s1-secondary-action px-6 py-3.5 text-sm font-semibold"
                  >
                    Book an operational review
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

      <section id="problem" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">The operating problem</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
              The risk is not lack of activity. It is not knowing what is true soon enough.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/55">
              Security operations fail quietly first: a post goes short, a patrol cannot be proven, an SOS sits unresolved, or a client asks for evidence that lives across messages and spreadsheets.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {risks.map((risk) => (
              <article key={risk.title} className="rounded-[1.65rem] border border-white/[.075] bg-[var(--s1-surface)] p-6 md:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-amber-200/72">{risk.tag}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-.025em] text-white/92">{risk.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/47">{risk.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[.07] bg-[#0c131a] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">The Signal One answer</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
                One operational record from the post to the client.
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-white/54">
              Signal One Guard turns field activity into operational state: attendance, patrols, incidents, SOS, post coverage, occurrence records and proof of service. The point is not another dashboard. The point is a clearer answer to three management questions.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/[.08] bg-white/[.08] lg:grid-cols-3">
            {buyerOutcomes.map(([title, body], index) => (
              <div key={title} className="bg-[#0d151d] p-7 md:p-9">
                <span className="text-xs font-semibold tabular-nums text-white/28">0{index + 1}</span>
                <h3 className="mt-8 text-3xl font-semibold tracking-[-.04em]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/48">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">Product proof</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
                Do not take the capability on trust. See the operating system.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/43">
              These are real Signal One Guard product captures from controlled QA/demo states using synthetic test data.
            </p>
          </div>
          <PlatformProof />
        </div>
      </section>

      <section id="platform" className="border-y border-white/[.07] bg-[#0a1016] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-12 xl:grid-cols-[.7fr_1.3fr]">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">Signal One Guard</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
                Built around four operational pillars.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/50">
                The platform is structured around the evidence a security company needs to run the operation, respond to exceptions and stand behind the service delivered.
              </p>
              <Link href="/solutions/security" className="mt-7 inline-flex text-sm font-semibold text-[#9fc8da]">
                Explore security operations →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar, index) => (
                <article key={pillar.title} className="rounded-[1.7rem] border border-white/[.075] bg-[var(--s1-surface)] p-6 md:p-7">
                  <span className="text-xs font-semibold text-white/26">0{index + 1}</span>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-.025em]">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/47">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-4">
            {roles.map((role) => (
              <article key={role.eyebrow} className="border-t border-white/[.09] pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-[var(--s1-accent)]">{role.eyebrow}</p>
                <h3 className="mt-4 text-lg font-semibold tracking-[-.02em]">{role.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/43">{role.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">People in the operation</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
              The product should be seen where the work actually happens.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/50">
              Stage 1 uses explicit production briefs rather than generic stock photography. These slots are reserved for consistent, realistic Signal One scenes with fictional, non-recognisable people and no real client data.
            </p>
          </div>
          <div className="mt-10">
            <PeopleSceneBriefs />
          </div>
        </div>
      </section>

      <section id="marketplace" className="border-y border-white/[.07] bg-[#0c131a] px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">Signal One Marketplace</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
              Equip the operation after you understand the operation.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
              Buy or rent radios, choose SIM subscriptions and source connected sensors and platform services. Marketplace supports the security operation; it is not the main reason to choose Signal One.
            </p>
            <Link href="/marketplace" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#071018]">
              Browse marketplace
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["/images/Devices/poc/D21.jpg", "Radios", "Buy or rent"],
              ["/images/products/sim-card.jpg", "Connectivity", "Subscribe"],
              ["/images/Devices/Lorawan/hero-sensors.jpg", "Sensors", "Buy or quote"],
            ].map(([src, title, mode]) => (
              <div key={title} className="overflow-hidden rounded-[1.55rem] border border-white/[.075] bg-[#0a1016]">
                <div className="relative h-48">
                  <Image src={src} alt="" fill className="object-contain p-6" />
                </div>
                <div className="border-t border-white/[.07] p-4">
                  <p className="font-semibold text-white/86">{title}</p>
                  <p className="mt-1 text-xs text-white/35">{mode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">Implementation & trust</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
                A controlled path into live operations.
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/[.08] bg-white/[.08] sm:grid-cols-2">
              {[
                ["01", "Operational review", "Understand sites, people, operating model and the first risks Signal One needs to address."],
                ["02", "Company setup", "Create the company administration layer and controlled access for the people responsible for the operation."],
                ["03", "Sites & people", "Set up clients, sites, posts, supervisors, guards and operational devices."],
                ["04", "Go live", "Move attendance, patrols, exceptions and service evidence into the live Signal One workflow."],
              ].map(([number, title, body]) => (
                <div key={number} className="bg-[#0d151d] p-6 md:p-8">
                  <span className="text-xs font-semibold text-white/26">{number}</span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/44">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Role-based access", "People see the operational scope appropriate to their role."],
              ["Audit-preserving records", "Deactivation and corrections preserve the operational history rather than deleting it."],
              ["Offline field continuity", "Guard flows are designed to continue through connectivity loss and reconcile later."],
              ["Evidence-led client service", "Service proof is derived from the same operational record used to run the work."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5">
                <h3 className="text-sm font-semibold text-white/82">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/39">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[.07] px-5 py-20">
        <div className="mx-auto max-w-[92rem] rounded-[2rem] border border-[#5f9fbd]/24 bg-[linear-gradient(120deg,rgba(95,159,189,.13),rgba(255,255,255,.018))] p-8 md:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9fc8da]">Next step</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.04em] md:text-5xl">
                Start with the operational problem you need to control.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                We can review your current operating model first, or you can begin company onboarding directly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#071018]">
                Book operational review
              </Link>
              <Link href="/get-started" className="rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white/82">
                Start company onboarding
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/[.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/38">Looking to work with Signal One instead?</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/guards/join" className="font-semibold text-white/62 hover:text-white">Guard onboarding →</Link>
              <Link href="/join/sales" className="font-semibold text-white/62 hover:text-white">Join Signal One Sales →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
