import type { Metadata } from "next";
import Link from "next/link";
import IntakeForm from "../../../components/IntakeForm";
import IntakeAvailability from "../../../components/journey/IntakeAvailability";
import PartnerBenefits from "../../../components/PartnerBenefits";
import { ButtonLink, PageHero, Status, Steps } from "../../../components/ui";
import { salesPartnerFacts, salesPartnerFields, salesPartnerSteps } from "../../../lib/partners";
import { pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Become a Sales Partner | Independent Referral Programme",
  description:
    "Introduce businesses to Signal One's radios, communications services and 1GUARD as an independent sales partner. Not employment, not a dealership. Apply to join.",
  alternates: { canonical: "/partners/sales" },
});

export default function SalesPartnerPage() {
  return (
    <main id="main" className="s1-partners-page">
      <PageHero
        material="mat-stone"
        kicker="Sales partner programme"
        status={<Status kind="live">Applications open</Status>}
        title="Know businesses that need to work as one? Introduce them."
        lead="Independent sales partners introduce businesses to Signal One's professional radios, communications services and 1GUARD, and earn commission on eligible sales under a partner agreement."
        actions={
          <>
            <ButtonLink href="#apply" size="lg">Apply to become a sales partner</ButtonLink>
            <ButtonLink href="/partners/reseller" variant="ghost-light" size="lg">Sell as a dealer instead</ButtonLink>
          </>
        }
        aside={
          <div className="card p-6 sm:p-8">
            <h2 className="t-h3">Partner, dealer or employee?</h2>
            <dl className="m-0 mt-4 grid gap-4">
              <div>
                <dt className="t-small font-semibold">Sales partner</dt>
                <dd className="t-small m-0 mt-1 text-ink-2">Independent. Introduces customers; earns commission on eligible sales.</dd>
              </div>
              <div>
                <dt className="t-small font-semibold">Reseller</dt>
                <dd className="t-small m-0 mt-1 text-ink-2">A business that buys at wholesale and sells to its own customers. <Link href="/partners/reseller" className="link-inline">Reseller programme</Link></dd>
              </div>
              <div>
                <dt className="t-small font-semibold">Employee</dt>
                <dd className="t-small m-0 mt-1 text-ink-2">A salaried role at Signal One. <Link href="/join/sales" className="link-inline">Careers</Link></dd>
              </div>
            </dl>
          </div>
        }
      />

      <section className="surface-light section mat-silver" aria-labelledby="partner-facts-h">
        <div className="wrap">
          <h2 id="partner-facts-h" className="t-h2">How the programme works</h2>
          <p className="t-body mt-3 measure text-ink-2">The exact terms, including commission, are set out in your partner agreement.</p>
          <div className="mt-8"><PartnerBenefits items={salesPartnerFacts} /></div>
        </div>
      </section>

      <section className="surface-light section mat-day" aria-labelledby="partner-steps-h">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 id="partner-steps-h" className="t-h2">From application to your first introduction</h2>
          <Steps items={salesPartnerSteps} />
        </div>
      </section>

      <section id="apply" className="surface-white section scroll-mt-[72px] mat-close" aria-labelledby="partner-apply-h">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="partner-apply-h" className="t-h2">Apply to become a sales partner</h2>
            <p className="t-body mt-4 text-ink-2">
              Tell us about your experience and the businesses you can reach. We review every application and call you to talk it through.
              Submitting this form does not create a partnership.
            </p>
          </div>
          <div>
            <IntakeAvailability kind="sales" what="Sales partner applications" subject="Signal One website: Sales partner application" />
            <IntakeForm
              kind="sales"
              intent="sales-partner-application"
              fields={salesPartnerFields}
              submitLabel="Send application"
              events={{ start: "sales_partner_application_start", complete: "sales_partner_application_complete" }}
              consentText="I agree that Signal One may contact me about this sales partner application."
              successTitle="Your application has been received."
              successBody="We review every application and will call you to discuss the programme. Nothing is agreed until a partner agreement is signed."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
