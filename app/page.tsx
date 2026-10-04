import Image from "next/image";
import Link from "next/link";

const entryPoints = [
  {
    eyebrow: "For security companies",
    title: "Run the operation",
    body: "Onboard your company, set up sites and people, manage post coverage and move into live security operations with Signal One Guard.",
    href: "/get-started",
    cta: "Onboard my company",
  },
  {
    eyebrow: "For sales professionals",
    title: "Work from Signal One Sales OS",
    body: "Apply to join the sales network and move through screening, training, sales packs, commission setup and activation.",
    href: "/join/sales",
    cta: "Apply to join sales",
  },
  {
    eyebrow: "For security officers",
    title: "Join Signal One Guard",
    body: "Complete guard onboarding for field work built around shifts, attendance, patrol verification, incidents and SOS.",
    href: "/guards/join",
    cta: "Start guard onboarding",
  },
];

const operatingLayer = [
  ["Acquire", "Leads, customer conversations, pipeline and quoting"],
  ["Equip", "Radios, connectivity, sensors and Signal One services"],
  ["Deploy", "Sites, posts, shifts, people and operational setup"],
  ["Operate", "My operation, Control Room, patrols, attendance and incidents"],
  ["Prove", "Occurrence records, exceptions, reports and proof of service"],
];

const guardModules = [
  ["My operation", "Sites, roster or map, post coverage and what needs attention."],
  ["Control Room", "Live operational awareness, SOS, exceptions and response."],
  ["Patrol verification", "QR and NFC checkpoints with GPS policy and offline synchronisation."],
  ["Proof of service", "What was scheduled, what happened and what can be proven."],
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#080d13] text-white">
      <section className="relative min-h-[780px] border-b border-white/9 px-5 pb-20 pt-40 md:pt-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(56,189,248,.17),transparent_28%),radial-gradient(circle_at_20%_58%,rgba(99,102,241,.08),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-[92rem] items-center gap-14 xl:grid-cols-[1.02fr_.98fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs uppercase tracking-[.2em] text-white/55 backdrop-blur-xl">
              Signal One · Security operations · Sales · Marketplace
            </div>
            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[.95] tracking-[-.045em] sm:text-6xl lg:text-7xl xl:text-[5.3rem]">
              Run the security business.
              <span className="block text-[#6dd3ff]">Run the operation.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
              Signal One brings commercial work, security operations, field teams, proof of service, devices and connectivity into one connected ecosystem.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/get-started" className="rounded-full bg-[#39bdf8] px-6 py-3 text-sm font-semibold text-[#061019] shadow-[0_0_40px_rgba(56,189,248,.2)] transition hover:bg-[#7dd3fc]">
                Start my company
              </Link>
              <Link href="/marketplace" className="rounded-full border border-white/15 bg-white/[.025] px-6 py-3 text-sm text-white/75 transition hover:border-white/30 hover:text-white">
                Open marketplace
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-12 rounded-full bg-[#39bdf8]/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-[#0c131c]/82 p-5 shadow-[0_42px_140px_rgba(0,0,0,.52)] backdrop-blur-xl md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-white/35">Signal One operating layer</p>
                  <p className="mt-2 text-lg font-semibold">From first opportunity to proven service</p>
                </div>
                <span className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,231,183,.7)]" />
              </div>
              <div className="mt-5 space-y-2">
                {operatingLayer.map(([name, text], index) => (
                  <div key={name} className="flex items-start gap-4 rounded-2xl border border-white/[.07] bg-white/[.025] p-4 transition hover:border-white/14 hover:bg-white/[.045]">
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
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Choose your world</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">
              One Signal One ecosystem. Different working experiences.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/50 md:text-base">
              Security companies, sales representatives and guards each enter through a focused journey built around the work they actually need to do.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {entryPoints.map((item) => (
              <article key={item.title} className="group rounded-[1.8rem] border border-white/9 bg-white/[.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#39bdf8]/28 hover:bg-white/[.045]">
                <p className="text-xs uppercase tracking-[.18em] text-white/35">{item.eyebrow}</p>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 min-h-24 text-sm leading-6 text-white/50">{item.body}</p>
                <Link href={item.href} className="mt-7 inline-flex text-sm font-semibold text-[#7dd3fc]">
                  {item.cta} <span className="ml-2 transition group-hover:translate-x-1">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-white/9 bg-[#0a1119] px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[92rem] gap-12 xl:grid-cols-[.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Signal One Guard</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">
              The operational truth lives where the work happens.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/50">
              Signal One Guard is built around workforce attendance, patrol verification, the digital occurrence book and operational intelligence. Supervisors work from My operation, control rooms work from the live operational picture, guards work from the mobile field experience, and clients see proof of service.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/solutions/security" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75">Explore security operations</Link>
              <Link href="/guards" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/75">For guards</Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {guardModules.map(([name, text]) => (
              <div key={name} className="rounded-3xl border border-white/9 bg-white/[.025] p-6">
                <h3 className="font-semibold">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[92rem] gap-8 overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0b121a] p-6 md:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#7dd3fc]">Signal One Marketplace</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">
              Equip teams without leaving the Signal One world.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/50">
              Browse radios available to buy or rent, choose SIM subscriptions, and source sensors and platform services. The catalogue is structured to grow as Signal One adds products.
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
              <div key={title} className="overflow-hidden rounded-3xl border border-white/9 bg-black/20">
                <div className="relative h-44">
                  <Image src={src} alt="" fill className="object-contain p-5" />
                </div>
                <div className="border-t border-white/8 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-white/36">{mode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/9 px-5 py-20">
        <div className="mx-auto max-w-[92rem] rounded-[2rem] border border-[#39bdf8]/20 bg-[linear-gradient(120deg,rgba(56,189,248,.12),rgba(255,255,255,.02))] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#7dd3fc]">Start now</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                Start with the role you actually play in the operation.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/52">
                Onboard your company, apply to join Signal One Sales, or begin guard onboarding.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/get-started" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#071018]">Onboard company</Link>
              <Link href="/join/sales" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white">Join sales</Link>
              <Link href="/guards/join" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white">Guard onboarding</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
