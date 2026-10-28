import Link from "next/link";

const journeys = [
  { audience: "Security company", title: "Run your security operation", detail: "Explore 1GUARD, calculate guard-day costs and request a guided company setup.", href: "/get-started", action: "Start company onboarding", tag: "1GUARD" },
  { audience: "Security officer", title: "Join as a guard", detail: "Register your interest in guard opportunities. Marketplace matching is still in development.", href: "/guards/join", action: "Create a guard profile", tag: "Guard" },
  { audience: "Equipment buyer", title: "Find the right field equipment", detail: "Discuss two-way radios, body cameras and tracking for your operating environment.", href: "/radios-equipment", action: "Explore equipment", tag: "Hardware" },
  { audience: "Sales candidate", title: "Work with Signal One", detail: "Explore available representative opportunities and submit an application.", href: "/join/sales", action: "View sales opportunities", tag: "Careers" },
] as const;

export default function AudienceJourneys() {
  return (
    <section aria-labelledby="audience-title" className="surface-white border-b border-line py-16 md:py-20">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="t-kicker text-signal-ink">Your next step</p>
            <h2 id="audience-title" className="t-h2 mt-3">Find your place in Signal One.</h2>
            <p className="t-body mt-4 text-text-2">Choose the experience that matches what you need. No account or purchase is required to explore.</p>
          </div>
          <Link href="/contact" className="btn btn-ghost-light">Talk to our team <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journeys.map((journey) => (
            <article key={journey.audience} className="group flex min-w-0 flex-col rounded-card border border-line bg-light p-6 transition-colors hover:border-signal-600 focus-within:border-signal-600">
              <p className="t-caption font-semibold text-signal-ink">{journey.tag} · {journey.audience}</p>
              <h3 className="t-h3 mt-5">{journey.title}</h3>
              <p className="t-small mt-3 flex-1 text-text-2">{journey.detail}</p>
              <Link href={journey.href} className="btn btn-primary mt-7 w-full justify-center text-center">
                {journey.action} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
        <p className="t-small mt-6 text-text-2">Already a customer? Use your existing workspace invitation, or <Link href="/contact" className="font-semibold text-signal-ink underline underline-offset-4">contact support for access</Link>. Sales OS is reserved for Signal One representatives.</p>
      </div>
    </section>
  );
}
