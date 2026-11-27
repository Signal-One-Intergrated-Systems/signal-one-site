import type { Metadata } from "next";
import Link from "next/link";
import IntakeForm from "../../../components/IntakeForm";
import IntakeAvailability from "../../../components/journey/IntakeAvailability";
import PartnerBenefits from "../../../components/PartnerBenefits";
import { ButtonLink, Check, PageHero, Status, Steps } from "../../../components/ui";
import { resellerAudiences, resellerBenefits, resellerFields, resellerPolicy, resellerSteps } from "../../../lib/partners";
import { pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Become a Reseller | Two-Way Radio Dealer Programme",
  description:
    "Sell professional push-to-talk radios and communications services with Signal One. Wholesale purchasing, training and support for approved dealers. Apply to become a reseller.",
  alternates: { canonical: "/partners/reseller" },
});

export default function ResellerPage() {
  return (
    <main id="main" className="s1-partners-page">
      <PageHero
        material="mat-ice"
        kicker="Reseller programme"
        status={<Status kind="live">Applications open</Status>}
        title="Sell professional communications. Grow with Signal One."
        lead="Become an approved Signal One dealer: buy radios at wholesale, sell the communications service that keeps them working, and build recurring business with your customers."
        actions={
          <>
            <ButtonLink href="#apply" size="lg">Apply to become a reseller</ButtonLink>
            <ButtonLink href="/partners/sales" variant="ghost-light" size="lg">Introduce customers instead</ButtonLink>
          </>
        }
        aside={
          <div className="card p-6 sm:p-8">
            <h2 className="t-h3">Who it is for</h2>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0">
              {resellerAudiences.map((audience) => (
                <li key={audience} className="t-body flex gap-3">
                  <Check className="mt-1 text-accent" />
                  {audience}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <section className="surface-light section mat-silver" aria-labelledby="reseller-benefits-h">
        <div className="wrap">
          <h2 id="reseller-benefits-h" className="t-h2">What an approved dealer receives</h2>
          <p className="t-body mt-3 measure text-ink-2">The exact terms are set out in your dealer agreement.</p>
          <div className="mt-8"><PartnerBenefits items={resellerBenefits} /></div>
        </div>
      </section>

      <section className="surface-light section mat-day" aria-labelledby="reseller-how-h">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="reseller-how-h" className="t-h2">How it works</h2>
            <h3 className="t-h4 mt-8">Commercial terms</h3>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0" data-reseller-policy>
              {resellerPolicy.map((item) => (
                <li key={item} className="t-body flex gap-3">
                  <Check className="mt-1 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Steps items={resellerSteps} />
        </div>
      </section>

      <section id="apply" className="surface-white section scroll-mt-[72px] mat-close" aria-labelledby="reseller-apply-h">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="reseller-apply-h" className="t-h2">Apply to become a reseller</h2>
            <p className="t-body mt-4 text-ink-2">
              Tell us about your business. We review every application and contact you to discuss it. Submitting this form does not approve a
              dealership, and no wholesale prices are shared until a dealer agreement is in place.
            </p>
            <p className="t-small mt-6 text-ink-2">
              Want to introduce customers without buying stock?{" "}
              <Link href="/partners/sales" className="link-inline font-semibold text-accent">Become a sales partner</Link>.
            </p>
          </div>
          <div>
            <IntakeAvailability what="Reseller applications" sent="Your application is only sent when you send that email." subject="Signal One website: Reseller application" />
            <IntakeForm
              intent="reseller-application"
              fields={resellerFields}
              submitLabel="Send application"
              events={{ start: "reseller_application_start", complete: "reseller_application_complete" }}
              consentText="I agree that Signal One may contact me about this reseller application."
              successTitle="Your application has been received."
              successBody="We review every application and will contact you to discuss it. Nothing is approved until a dealer agreement is signed."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
