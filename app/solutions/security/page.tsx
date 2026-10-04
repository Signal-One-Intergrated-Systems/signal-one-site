import Link from "next/link";
import PlatformProof from "../../components/PlatformProof";

const pillars = [
  {
    title: "Attendance",
    body: "Record clock-in and clock-out against the operational site, with geofence policy and preserved evidence.",
  },
  {
    title: "Post coverage",
    body: "See what each post requires, what is allocated, what is verified and where a shortfall needs action.",
  },
  {
    title: "Patrol verification",
    body: "Run routes and checkpoints with QR or NFC verification, GPS policy and offline synchronisation.",
  },
  {
    title: "Occurrence & incidents",
    body: "Keep a chronological operational record of incidents, exceptions, corrections and response.",
  },
  {
    title: "Control Room",
    body: "Bring SOS, operational exceptions and live site awareness into the workspace used to respond.",
  },
  {
    title: "Proof of service",
    body: "Give management and authorised clients a clearer record of what was scheduled, what happened and what can be proven.",
  },
];

export default function SecuritySolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-40 text-white md:pt-48">
      <div className="mx-auto max-w-[92rem]">
        <section className="grid gap-12 border-b border-white/[.07] pb-16 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">
              Signal One Guard for security companies
            </p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[.95] tracking-[-.05em] md:text-7xl">
              Run security operations from evidence, not assumptions.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-7 text-white/58 md:text-lg">
              Signal One Guard connects attendance, posts, patrol verification, incidents, SOS, occurrence records and proof of service so operations teams can see what is happening and preserve what happened.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/#proof" className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white/76">
              See product proof
            </Link>
            <Link href="/contact" className="rounded-full bg-[var(--s1-accent)] px-5 py-3 text-sm font-semibold text-[#071018]">
              Book operational review
            </Link>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article key={pillar.title} className="rounded-[1.7rem] border border-white/[.075] bg-[var(--s1-surface)] p-6">
                <span className="text-xs font-semibold text-white/26">0{index + 1}</span>
                <h2 className="mt-6 text-xl font-semibold tracking-[-.025em]">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/47">{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/[.07] py-16 md:py-20">
          <div className="mb-9 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">Inside the product</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] md:text-5xl">
              The same operational facts serve management, control and client proof.
            </h2>
          </div>
          <PlatformProof />
        </section>

        <section className="py-16 md:py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              ["Owners & directors", "A clearer operating picture, stronger evidence and less dependence on fragmented manual reporting."],
              ["Operations & control", "Live attention on coverage gaps, SOS, patrol exceptions and the sites that need intervention."],
              ["Your clients", "Authorised service visibility and proof without opening the security company's internal operational workspace."],
            ].map(([title, body]) => (
              <div key={title} className="border-t border-white/[.09] pt-5">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/44">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#5f9fbd]/22 bg-[linear-gradient(120deg,rgba(95,159,189,.12),rgba(255,255,255,.018))] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9fc8da]">Next step</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-.04em] md:text-4xl">
                Review the operation before choosing the rollout.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                Start with the sites, people, control-room workflow and service evidence you need to bring under control.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#071018]">
                Book operational review
              </Link>
              <Link href="/get-started" className="rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white/82">
                Start onboarding
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
