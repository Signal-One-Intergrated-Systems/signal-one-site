import type { Metadata } from "next";
import Link from "next/link";
import GuardDayCalculator from "../../components/GuardDayCalculator";
import ProductSignature from "../../components/brand/ProductSignature";
import { Arrow, ButtonLink, Kicker, Status } from "../../components/ui";
import { guardOnboardingLine } from "../../lib/guardStatus";
import { num, rand } from "../../lib/format";
import { exVat, guardDayPrice, guardDayPricePhrase, minimumPhrase } from "../../lib/pricing";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "1GUARD Pricing: " + guardDayPrice + " per Guard per Day",
  description:
    "1GUARD is " + guardDayPricePhrase + ", excluding VAT. No tiers or packages. Minimum " + minimumPhrase + "; unused days carry over. Calculate your cost.",
  alternates: { canonical: "/pricing" },
});

const examples = [
  { guards: 10, days: 30 },
  { guards: 50, days: 30 },
  { guards: 200, days: 31 },
] as const;


export default function PricingPage() {
  return (
    <main id="main" className="s1-premium-pricing s1-scene-page s1-scene-page--pricing">
      <section className="split-hero surface-deep mat-silver">
        {/* Two columns only from xl: at 1024 the price column left ~250 px for the three-part guard-day equation,
            which broke its words one per line (AUDW-07). Below xl the equation sits under the price. */}
        <div className="wrap grid gap-12 py-16 md:py-24 lg:py-32 xl:grid-cols-[minmax(0,var(--hero-col))_minmax(0,1fr)] xl:items-center xl:gap-20">
          <div>
            <Kicker tone="dark"><ProductSignature name="GUARD" tone="dark" /> · Security Business OS pricing</Kicker>
            <h1 className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-2">
              <span className="t-num text-[7rem] text-accent sm:text-[10rem] lg:text-[12rem]">{guardDayPrice}</span>
              <span className="pb-4 font-display text-[1.75rem] font-semibold leading-tight sm:text-[2.25rem]">
                per guard
                <br />
                per day
              </span>
            </h1>
            <p className="t-lead mt-4 text-ink-2">Excluding VAT. A straightforward guard-day rate for the currently offered 1GUARD service. Future business OS capabilities and separately quoted equipment are not implied to be included.</p>
            {guardOnboardingLine ? <p className="t-small mt-3 font-semibold text-ink">{guardOnboardingLine}</p> : null}
            {/* The next step is in the first viewport, not only at the foot of the page (persona walk, CUSTOMER_JOURNEYS P1). */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/get-started" size="lg">Request a 14-day trial</ButtonLink>
              <ButtonLink href="#calculator" variant="ghost-dark" size="lg">Calculate your cost</ButtonLink>
            </div>
          </div>

          <div className="max-w-[40rem]">
            <h2 className="t-h3">What is a guard day?</h2>
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center sm:gap-3">
              {[
                ["1", "allocated guard"],
                ["1", "on-site shift, clocked in and out"],
                ["1", "guard day"],
              ].map(([num, label], index) => (
                <div key={label} className="contents">
                  <div className="card px-2 py-4 sm:px-4">
                    <p className="t-num text-[2.5rem] text-ink">{num}</p>
                    <p className="mt-2 hyphens-auto text-[0.9375rem] leading-snug text-ink-2">{label}</p>
                  </div>
                  {index < 2 ? (
                    <span aria-hidden="true" className="font-display text-[1.5rem] font-bold text-ink-2">
                      {index === 0 ? "×" : "="}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="t-small mt-5 text-ink-2">
              A guard day is used when an allocated guard clocks in and out of an on-site shift.
            </p>
          </div>
        </div>
      </section>

      <section id="calculator" className="surface-light section scroll-mt-[72px] mat-ice">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <GuardDayCalculator heading="Calculate your guard cost" />

          <div>
            <h2 className="t-h2">The rules, in full.</h2>
            <dl className="mt-8">
              {[
                ["Price", guardDayPricePhrase + ", excluding VAT."],
                ["Minimum purchase", minimumPhrase + "."],
                ["Unused guard days", "Carry over and never expire while your account is active."],
                ["Tiers or packages", "None. The rate is the same for 10 guard days or 10 000."],
                ["No-shows and cancelled shifts", "Not charged. A guard day is used only when a guard clocks in and out."],
                ["Short and multiple shifts", "Each clocked-in and clocked-out shift uses one guard day, whatever its length. Two shifts in a day use two."],
              ].map(([term, detail]) => (
                <div key={term} className="border-t border-hairline py-4">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="t-small m-0 mt-1 text-ink-2">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="surface-white section mat-day">
        <div className="wrap">
          <h2 className="t-h2">Worked examples</h2>
          <p className="t-body mt-3 text-ink-2">Plain arithmetic: guards × days × {guardDayPrice}, excluding VAT.</p>
          <div className="plane mt-8 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Guard day cost examples</caption>
              <thead className="text-[0.9375rem] text-ink">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Guards</th>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Days</th>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Guard days</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">Excl. VAT</th>
                </tr>
              </thead>
              <tbody className="tabular text-[1.0625rem]">
                {examples.map(({ guards, days }) => (
                  <tr key={guards + "-" + days} className="border-t border-hairline">
                    <td className="px-4 py-4 sm:px-6">{guards}</td>
                    <td className="px-4 py-4 sm:px-6">{days}</td>
                    <td className="px-4 py-4 sm:px-6">{num(guards * days)}</td>
                    <td className="px-4 py-4 text-right font-semibold sm:px-6">{rand(exVat(guards * days))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="surface-light section mat-silver">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Priced separately</h2>
            <p className="t-body mt-4 text-ink-2">
              Guard days cover the platform. These are optional and are never bundled into the {guardDayPrice} rate.
            </p>
          </div>
          <ul className="m-0 list-none p-0">
            {[
              { name: "Radios, PTT, tracking and body cameras", status: <Status kind="quote">By quote</Status>, body: "Buy or rent radios, with 12, 24 or 36-month rental terms. Equipment is quoted separately for your deployment.", href: "/radios-equipment" },
              { name: "Accounting", status: <Status kind="mvp">In development</Status>, body: "Not offered yet. Priced separately when it is available." },
              { name: "Payroll", status: <Status kind="soon">Coming soon</Status>, body: "Not available yet. Priced separately when it launches." },
            ].map((item) => (
              <li key={item.name} className="grid gap-2 border-t border-hairline py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6">
                <div>
                  <h3 className="t-h4">{item.name}</h3>
                  <p className="t-small mt-1 text-ink-2">{item.body}</p>
                  {item.href ? (
                    <Link href={item.href} className="link-arrow text-accent">
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

      <section className="surface-base section mat-close">
        <div className="wrap flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="t-h2">Ready to start with guard days?</h2>
            <p className="t-lead mt-4 text-ink-2">
              Tell us about your company and sites. We set up your workspace with you and confirm your customer terms.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink href="/contact" variant="ghost-dark" size="lg" event="buy_guard_days" eventLabel="Pricing closing">
              Talk to us to buy guard days
            </ButtonLink>
            <ButtonLink href="/get-started" size="lg">
              Request a 14-day trial
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
