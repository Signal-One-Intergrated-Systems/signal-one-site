import type { Metadata } from "next";
import IntakeAvailability from "../../components/journey/IntakeAvailability";
import EquipmentQuoteForm from "../../components/EquipmentQuoteForm";
import { HardwareCard, HardwareShowcase } from "../../components/Hardware";
import { catalogue } from "../../lib/catalogue";
import { ButtonLink, PageHero, Status, Steps } from "../../components/ui";

export const metadata: Metadata = {
  title: "Buy or Rent Two-Way Radios, Tracking and Body Cameras",
  description:
    "Buy or rent professional PTT radios; request vehicle tracking and body-camera quotations: Hytera PNC360S, P30 Lite PoC, E600 PoC LTE, FMC920, FMB920, SC780. By quote.",
  alternates: { canonical: "/radios-equipment" },
};

export default function RadiosEquipmentPage() {
  return (
    <main id="main" className="s1-premium-radio s1-scene-page s1-scene-page--radios">
      <PageHero
        kicker="Radios & Tracking"
        status={
          <Status kind="quote" tone="dark">
            By quote
          </Status>
        }
        title="Buy or rent radios. Keep your team connected."
        lead="Choose professional two-way PoC radios for your team, with purchase or rental options. Tell us the quantity and deployment location; we will confirm availability, connectivity and pricing in writing."
        actions={
          <ButtonLink href="#quote" size="lg">
            Request a quote
          </ButtonLink>
        }
        aside={
        <div className="grid gap-5">
          <HardwareShowcase products={catalogue[0].products.slice(0, 2)} />
          <dl className="m-0 grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline">
            {[
              ["Radios and PTT", "Hytera PNC360S, P30 Lite PoC, E600 PoC LTE, PTT platform with SIM and data"],
              ["Vehicle and asset tracking", "FMC920 and FMB920 trackers"],
              ["Body cameras", "SC780 body camera"],
            ].map(([term, detail]) => (
              <div key={term} className="bg-surface p-5 sm:p-6">
                <dt className="t-h4">{term}</dt>
                <dd className="t-small m-0 mt-1 text-ink-2">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        }
      />

      <section className="surface-light section">
        <div className="wrap">
          <h2 className="t-h2">The catalogue</h2>
          <p className="t-body measure mt-3 text-ink-2">
            Explore radios, tracking and body cameras for your operation. Purchase and rental options, final specification, availability and delivery timing are confirmed in your quote.
          </p>

          <div className="mt-12 grid gap-16">
            {catalogue.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={group.id + "-h"} className="scroll-mt-[72px]">
                <div className="grid gap-4 border-t-2 border-ink pt-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
                  <div>
                    <h3 id={group.id + "-h"} className="t-h3">
                      {group.category}
                    </h3>
                    <p className="t-small mt-3 text-ink-2">{group.lead}</p>
                    <p className="t-small mt-3 font-semibold">{group.terms}</p>
                  </div>
                  <ul className="catalogue-grid">
                    {group.products.map((product) => (
                      <li key={product.model}>
                        <HardwareCard product={product} headingLevel={4} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-card bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="t-h4">Equipment and the Signal One platform</h2>
              <Status kind="soon">Coming soon</Status>
            </div>
            <p className="t-small measure mt-2 text-ink-2">
              Equipment is quoted separately from the 1GUARD subscription. Activating devices and viewing tracking from
              inside 1GUARD is coming soon; renting a device does not yet connect it to the platform.
            </p>
          </div>
        </div>
      </section>

      <section id="quote" className="surface-white section scroll-mt-[72px]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Request a quote</h2>
            <p className="t-body mt-4 text-ink-2">
              Product, requirement, quantity, deployment. The form changes with what you choose, so you only answer what
              matters.
            </p>
            <div className="mt-8">
              <Steps
                items={[
                  ["You send the requirement", "Takes about two minutes."],
                  ["We confirm fit", "Network, accessories, installation and availability for your sites."],
                  ["You get a written quote", "Term, quantities and price, by email."],
                  ["You decide", "Nothing is supplied until you accept the quote."],
                ]}
              />
            </div>
          </div>
          <div><IntakeAvailability /><EquipmentQuoteForm /></div>
        </div>
      </section>
    </main>
  );
}
