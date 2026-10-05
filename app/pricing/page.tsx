import type { Metadata } from "next";
import Link from "next/link";
import GuardDayCalculator from "../components/GuardDayCalculator";

export const metadata: Metadata = {
  title: "Guard-Day Pricing",
  description:
    "Signal One Guard platform access is R2 per guard per day excluding VAT. Guard days carry over and the minimum purchase is 10 guard days.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[1280px]">
        <section className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end md:pb-16">
          <div>
            <p className="s1-eyebrow">Guard-day pricing</p>
            <h1 className="s1-display mt-5 max-w-3xl font-semibold">
              R2 per guard per day.
            </h1>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-white/62">
              Buying guard days gives your security company access to the
              Signal One Guard platform. You only calculate the guards and
              days you want to cover.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/42">
              Pricing is excluding VAT. Guard days carry over. Minimum
              purchase: 10 guard days.
            </p>
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start md:py-16">
          <div>
            <p className="s1-eyebrow">Calculate</p>
            <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
              See the Guard platform cost before you start.
            </h2>
            <p className="s1-body mt-5 max-w-xl">
              There are no Starter, Pro or Enterprise Guard packages. The
              public platform price is based on guard days.
            </p>

            <div className="mt-8 space-y-5 border-t border-white/10 pt-7">
              {[
                ["1", "Choose the number of guards", "Use the number of guards you want the platform to cover."],
                ["2", "Choose the number of days", "Calculate the period you want to purchase."],
                ["3", "Buy the guard days", "Payment can be made by EFT or card before company activation."],
              ].map(([number, title, body]) => (
                <div key={number} className="grid grid-cols-[34px_1fr] gap-4">
                  <span className="s1-mono pt-1 text-[8px] text-[#38BDF8]">
                    0{number}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/82">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/42">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GuardDayCalculator />
        </section>

        <section className="grid gap-5 border-y border-white/10 py-12 sm:grid-cols-3">
          {[
            ["Carry over", "Unused guard days remain available for your security company."],
            ["10 guard-day minimum", "The minimum purchase is guard days, not a minimum number of guards."],
            ["No volume tiers", "The public rate stays R2 per guard day. No hidden package ladder is shown."],
          ].map(([title, body]) => (
            <article key={title} className="sm:px-6 sm:first:pl-0">
              <h2 className="text-base font-semibold text-white/84">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-white/44">{body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[1fr_.9fr] lg:items-start md:py-16">
          <div>
            <p className="s1-eyebrow">What this price covers</p>
            <h2 className="s1-h2 mt-5 max-w-2xl font-semibold">
              Guard platform access is priced in guard days.
            </h2>
            <p className="s1-body mt-5 max-w-2xl">
              Guard supports the operating workflows used to run security
              sites: attendance, patrol verification, incidents, occurrence
              records, SOS, operational exceptions, Control Room and
              proof-of-service workflows.
            </p>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-[#0F131A] p-6">
            <p className="s1-eyebrow">Priced separately</p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-white/52">
              <p>
                <strong className="font-semibold text-white/82">Payroll</strong>{" "}
                — extra cost.
              </p>
              <p>
                <strong className="font-semibold text-white/82">Accounting</strong>{" "}
                — extra cost.
              </p>
              <p>
                <strong className="font-semibold text-white/82">
                  Radios & equipment
                </strong>{" "}
                — rental by quote.
              </p>
              <p>
                <strong className="font-semibold text-white/82">
                  PTT, tracking and body-worn equipment
                </strong>{" "}
                — scoped separately for the deployment.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#0EA5E9]/20 bg-[#0EA5E9]/[.045] p-7 md:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="s1-eyebrow">Next step</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.035em]">
                Purchase guard days, then activate your company.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                Signal One company activation follows payment. The onboarding
                flow will support EFT and card before the Guard company
                environment is created.
              </p>
            </div>
            <Link
              href="/get-started"
              className="s1-primary-action shrink-0 px-6 py-3 text-sm font-semibold"
            >
              Get started
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
