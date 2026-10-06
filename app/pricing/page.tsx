import type { Metadata } from "next";
import Link from "next/link";
import GuardDayCalculator from "../components/GuardDayCalculator";
import { Arrow, ButtonLink, Kicker, Status } from "../components/ui";

export const metadata: Metadata = {
  title: "Pricing: R2 per Guard per Day",
  description:
    "Signal One Security costs R2 per guard per day, excluding VAT. No tiers or packages. Minimum purchase 10 guard days; unused guard days carry over. Calculate your guard cost.",
  alternates: { canonical: "/pricing" },
};

const examples = [
  { guards: 10, days: 30 },
  { guards: 50, days: 30 },
  { guards: 200, days: 31 },
] as const;

function rand(value: number) {
  return "R" + value.toLocaleString("en-ZA");
}

export default function PricingPage() {
  return (
    <main id="main">
      <section className="surface-ink">
        <div className="wrap grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-end lg:gap-16">
          <div>
            <Kicker tone="dark">Signal One Security pricing</Kicker>
            <h1 className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-2">
              <span className="t-num text-[7rem] text-signal-bright sm:text-[10rem] lg:text-[12rem]">R2</span>
              <span className="pb-4 font-display text-[1.75rem] font-semibold leading-tight sm:text-[2.25rem]">
                per guard
                <br />
                per day
              </span>
            </h1>
            <p className="t-lead mt-4 text-text-inv-2">Excluding VAT. One price for the whole platform. No tiers, no packages.</p>
          </div>

          <div>
            <h2 className="t-h3">What is a guard day?</h2>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center sm:gap-3">
              {[
                ["1", "allocated guard"],
                ["1", "on-site shift, clocked in and out"],
                ["1", "guard day"],
              ].map(([num, label], index) => (
                <div key={label} className="contents">
                  <div className="rounded-card border border-line-dark bg-graphite px-2 py-4 sm:px-4">
                    <p className="t-num text-[2.5rem] text-text-inv">{num}</p>
                    <p className="mt-2 text-[0.9375rem] leading-snug text-text-inv-2">{label}</p>
                  </div>
                  {index < 2 ? (
                    <span aria-hidden="true" className="font-display text-[1.5rem] font-bold text-text-inv-2">
                      {index === 0 ? "×" : "="}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="t-small mt-5 text-text-inv-2">
              A guard day is used when an allocated guard clocks in and out of an on-site shift.
            </p>
          </div>
        </div>
      </section>

      <section id="calculator" className="surface-paper section scroll-mt-[72px]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <GuardDayCalculator heading="Calculate your guard cost" />

          <div>
            <h2 className="t-h2">The rules, in full.</h2>
            <dl className="mt-8">
              {[
                ["Price", "R2 per guard per day, excluding VAT."],
                ["Minimum purchase", "10 guard days."],
                ["Unused guard days", "Carry over. They stay available to your company."],
                ["Tiers or packages", "None. The rate is the same for 10 guard days or 10,000."],
                ["No-shows, cancellations, partial and multiple shifts", "Handled under your customer terms, agreed before you start."],
              ].map(([term, detail]) => (
                <div key={term} className="border-t border-line py-4">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="t-small m-0 mt-1 text-text-2">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="surface-white section">
        <div className="wrap">
          <h2 className="t-h2">Worked examples</h2>
          <p className="t-body mt-3 text-text-2">Plain arithmetic: guards × days × R2, excluding VAT.</p>
          <div className="mt-8 overflow-hidden rounded-card ring-1 ring-line">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Guard day cost examples</caption>
              <thead className="bg-paper-2 text-[0.9375rem]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Guards</th>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Days</th>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Guard days</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">Excl. VAT</th>
                </tr>
              </thead>
              <tbody className="tabular text-[1.0625rem]">
                {examples.map(({ guards, days }) => (
                  <tr key={guards + "-" + days} className="border-t border-line">
                    <td className="px-4 py-4 sm:px-6">{guards}</td>
                    <td className="px-4 py-4 sm:px-6">{days}</td>
                    <td className="px-4 py-4 sm:px-6">{(guards * days).toLocaleString("en-ZA")}</td>
                    <td className="px-4 py-4 text-right font-semibold sm:px-6">{rand(guards * days * 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="surface-paper section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Priced separately</h2>
            <p className="t-body mt-4 text-text-2">
              Guard days cover the platform. These are optional and are never bundled into the R2 rate.
            </p>
          </div>
          <ul className="m-0 list-none p-0">
            {[
              { name: "Radios, PTT, tracking and body cameras", status: <Status kind="quote">By quote</Status>, body: "Rental on 12, 24 or 36 month terms for radios. Quoted for your deployment.", href: "/radios-equipment" },
              { name: "Accounting", status: <Status kind="beta">Beta</Status>, body: "Priced separately when activated for your company." },
              { name: "Payroll", status: <Status kind="soon">Coming soon</Status>, body: "Not available yet. Priced separately when it launches." },
            ].map((item) => (
              <li key={item.name} className="grid gap-2 border-t border-line py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6">
                <div>
                  <h3 className="t-h4">{item.name}</h3>
                  <p className="t-small mt-1 text-text-2">{item.body}</p>
                  {item.href ? (
                    <Link href={item.href} className="link-arrow text-signal">
                      Radios & Tracking <Arrow />
                    </Link>
                  ) : null}
                </div>
                <div>{item.status}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-ink section">
        <div className="wrap flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="t-h2">Ready to start with guard days?</h2>
            <p className="t-lead mt-4 text-text-inv-2">
              Tell us about your company and sites. We set up your workspace with you and confirm your customer terms.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="ghost-dark" size="lg">
              Talk to Signal One
            </ButtonLink>
            <ButtonLink href="/get-started" size="lg">
              Start company onboarding
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
