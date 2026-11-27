import type { Metadata } from "next";
import Link from "next/link";
import IntakeForm from "../../components/IntakeForm";
import IntakeAvailability from "../../components/journey/IntakeAvailability";
import { PageHero } from "../../components/ui";
import { technologyPartnerFields } from "../../lib/partners";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Partner Programmes: Resellers and Sales Partners",
  description:
    "Grow your business with Signal One: become a reseller of professional radios and communications, an independent sales partner, or a technology partner.",
  alternates: { canonical: "/partners" },
});

const programmes = [
  { href: "/partners/reseller", title: "Become a Reseller", body: "For businesses that want to buy professional radios at wholesale and sell them, with the communications service, to their own customers." },
  { href: "/partners/sales", title: "Become a Sales Partner", body: "For independent people who can introduce businesses to Signal One's radios, communications services and 1GUARD." },
  { href: "#technology", title: "Technology partnerships", body: "For organisations interested in integrations, regional distribution, implementation for large organisations or strategic collaboration." },
] as const;

export default function PartnersPage() {
  return (
    <main id="main" className="s1-partners-page">
      <PageHero
        material="mat-ice"
        kicker="Partners"
        title="Grow your business with Signal One."
        lead="Three ways to work with us, each with its own application. Every application is reviewed; none is approved automatically."
      />

      <section className="surface-light section mat-silver" aria-labelledby="programmes-h">
        <div className="wrap">
          <h2 id="programmes-h" className="sr-only">Partner programmes</h2>
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {programmes.map((programme) => (
              <li key={programme.href} className="card flex flex-col p-6 sm:p-7">
                <h3 className="t-h3">{programme.title}</h3>
                <p className="t-small mt-3 text-ink-2">{programme.body}</p>
                <Link href={programme.href} className="link-arrow mt-auto pt-5 text-accent">
                  {programme.href.startsWith("#") ? "Start a conversation" : "See the programme"} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="technology" className="surface-white section scroll-mt-[72px] mat-close" aria-labelledby="technology-h">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 id="technology-h" className="t-h2">Technology partnerships</h2>
            <p className="t-body mt-4 text-ink-2">
              For technology companies, integrators, regional distributors and implementation partners for large organisations. Tell us what you have in mind and the
              right person will contact you. For a quote or customer support, use{" "}
              <Link href="/contact" className="link-inline">Contact</Link> instead.
            </p>
          </div>
          <div>
            <IntakeAvailability what="Partnership enquiries" sent="Your enquiry is only sent when you send that email." subject="Signal One website: Technology partnership" />
            <IntakeForm
              intent="technology-partnership"
              fields={technologyPartnerFields}
              submitLabel="Send enquiry"
              events={{ complete: "partnership_enquiry_complete" }}
              consentText="I agree that Signal One may contact me about this partnership enquiry."
              successTitle="Your enquiry has been received."
              successBody="The right person at Signal One will contact you."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
