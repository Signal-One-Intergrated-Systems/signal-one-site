import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Understand how Signal One Guard is packaged for security companies and what determines commercial pricing.",
};

const packages = [
  {
    name: "Guard Core",
    fit: "For companies digitising the frontline operating record.",
    includes: [
      "Site-linked attendance",
      "Patrol routes and checkpoint verification",
      "Incident and occurrence records",
      "Offline field continuity",
      "Service-proof foundation",
    ],
  },
  {
    name: "Control",
    fit: "For operations teams that need live exception visibility and stronger command.",
    includes: [
      "Everything in Guard Core",
      "Control Room operating view",
      "SOS and operational exceptions",
      "Post coverage visibility",
      "Supervisor operating views",
    ],
  },
  {
    name: "Connected Operations",
    fit: "For companies that want the software and field communications stack managed together.",
    includes: [
      "Signal One Guard operating layer",
      "Critical Connect / push-to-talk options",
      "Compatible PoC devices",
      "Managed connectivity options",
      "Deployment configuration",
    ],
  },
  {
    name: "Enterprise",
    fit: "For larger or more complex operations requiring a tailored rollout.",
    includes: [
      "Multi-site / multi-branch operating design",
      "Role and access design",
      "Integration scoping",
      "Tailored implementation plan",
      "Commercial and support structure agreed for the rollout",
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <section className="s1-glass rounded-[24px] p-7 md:p-10 lg:p-12">
          <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Packages & commercial structure</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-.04em] md:text-6xl">
              Understand the package before you ask for a quote.
            </h1>
            <div>
              <p className="max-w-2xl text-base leading-7 text-white/62">
                Signal One does not publish a single flat price because the commercial model depends on the operational footprint and the services selected. The packages below show how the solution is structured before final pricing is confirmed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact?intent=pricing" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                  Request pricing
                </Link>
                <Link href="/tour" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                  Take product tour
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-4 lg:grid-cols-2">
            {packages.map((pkg, index) => (
              <article key={pkg.name} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-7 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">0{index + 1}</p>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(14,165,233,.4),transparent)]" />
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-[-.035em]">{pkg.name}</h2>
                <p className="mt-3 text-sm leading-6 text-white/52">{pkg.fit}</p>
                <ul className="mt-7 space-y-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-white/64">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5E9]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 border-y border-white/10 py-20 lg:grid-cols-[.85fr_1.15fr] lg:items-start md:py-24">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">What determines pricing</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">
              Pricing follows the operation you need to run.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Active workforce", "The number of guards and operational users in scope."],
              ["Sites & posts", "The footprint and complexity of the deployed operation."],
              ["Platform scope", "The Guard capabilities and management layers selected."],
              ["Devices & communications", "Any radios, managed devices, connectivity or Critical Connect services included."],
              ["Implementation", "The setup, migration, configuration and rollout work required."],
              ["Integration", "Any agreed connection to other operational or enterprise systems."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[14px] border border-white/10 bg-white/[.025] p-5">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/46">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="rounded-[24px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/[.06] p-7 md:p-10">
            <p className="s1-mono text-[9px] font-semibold text-[#7DD3FC]">Commercial transparency</p>
            <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">
              We will not invent a public number that ignores your operating footprint.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
              Tell us the approximate guard count, site count and the package you are evaluating. Signal One can then return the relevant commercial structure instead of forcing every buyer through a generic software quote.
            </p>
            <Link href="/contact?intent=pricing" className="s1-primary-action mt-7 inline-flex px-6 py-3 text-sm font-semibold">
              Request pricing for my operation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
