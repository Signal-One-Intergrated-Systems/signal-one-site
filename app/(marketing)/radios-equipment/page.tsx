import type { Metadata } from "next";
import IntakeAvailability from "../../components/journey/IntakeAvailability";
import EquipmentQuoteForm from "../../components/EquipmentQuoteForm";
import { HardwareCard, HardwareShowcase } from "../../components/Hardware";
import { catalogue } from "../../lib/catalogue";
import { ButtonLink, PageHero, Status, Steps } from "../../components/ui";
import { pageMetadata } from "../../lib/seo";
import { CommsComponents, CommsFaq, CommsIndustries, CommsJourneys } from "../../components/CommsOffer";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Business Radios and Managed Communications",
  description:
    "Buy and connect, rent a managed radio fleet, connect radios you already own, or ask us to help you choose. PTT radios, tracking and body cameras, by written quote.",
  alternates: { canonical: "/radios-equipment" },
});

export default function RadiosEquipmentPage() {
  return (
    <main id="main" className="s1-premium-radio s1-scene-page s1-scene-page--radios">
      <PageHero
        kicker="Communications"
        status={
          <Status kind="quote" tone="dark">
            By quote
          </Status>
        }
        title="Business radios. Managed and connected."
        lead="Professional push-to-talk radios with the connectivity, setup and support your teams need. Buy them, rent a managed fleet, or connect radios you already own. Every solution is quoted in writing."
        actions={
          <ButtonLink href="#quote" size="lg">
            Request a quote
          </ButtonLink>
        }
        aside={
        <div className="grid gap-5">
          <HardwareShowcase products={catalogue[0].products.slice(0, 2)} />
          <dl className="m-0 grid gap-px overflow-hidden rounded-card border border-line-dark bg-line-dark">
            {[
              ["Radios and PTT", "Hytera PNC360S, P30 Lite PoC, E600 PoC LTE; push-to-talk platform, SIM and data"],
              ["Vehicle and asset tracking", "FMC920 and FMB920 trackers"],
              ["Body cameras", "SC780 body camera"],
            ].map(([term, detail]) => (
              <div key={term} className="bg-raised p-5 sm:p-6">
                <dt className="t-h4">{term}</dt>
                <dd className="t-small m-0 mt-1 text-text-inv-2">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        }
      />

      <section id="journeys" className="surface-light section scroll-mt-[72px]" aria-labelledby="journeys-h">
        <div className="wrap">
          <h2 id="journeys-h" className="t-h2">Four ways to start</h2>
          <p className="t-body measure mt-3 text-text-inv-2">Pick the one closest to you. Each opens the quote form with the right questions.</p>
          <div className="mt-8"><CommsJourneys /></div>
        </div>
      </section>

      <section className="surface-light section pt-0">
        <div className="wrap">
          <h2 className="t-h2">The catalogue</h2>
          <p className="t-body measure mt-3 text-text-inv-2">
            Explore radios, tracking and body cameras for your operation. Purchase and rental options, final specification, availability and delivery timing are confirmed in your quote.
          </p>

          <div className="mt-12 grid gap-16">
            {catalogue.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={group.id + "-h"} className="scroll-mt-[72px]">
                <div className="grid gap-4 border-t-2 border-base pt-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
                  <div>
                    <h3 id={group.id + "-h"} className="t-h3">
                      {group.category}
                    </h3>
                    <p className="t-small mt-3 text-text-inv-2">{group.lead}</p>
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

          <div className="mt-16 rounded-card bg-raised p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="t-h4">Equipment and the Signal One platform</h2>
              <Status kind="soon">Coming soon</Status>
            </div>
            <p className="t-small measure mt-2 text-text-inv-2">
              Equipment is quoted separately from the 1GUARD subscription. Activating devices and viewing tracking from
              inside 1GUARD is coming soon; renting a device does not yet connect it to the platform.
            </p>
            <p className="t-small mt-4">
              Ask in the same quote about{" "}
              <Link href="/solutions/security" className="link-inline font-semibold text-signal-300">1GUARD</Link>,{" "}
              <a href="#tracking" className="link-inline font-semibold text-signal-300">vehicle and asset tracking</a>,{" "}
              <a href="#bodycams" className="link-inline font-semibold text-signal-300">body cameras</a>, dispatcher access or more radios as your team grows.
            </p>
          </div>
        </div>
      </section>

      <section className="surface-light section pt-0" aria-labelledby="components-h">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 id="components-h" className="t-h2">What a solution can include</h2>
            <p className="t-body mt-3 text-text-inv-2">Each part can be quoted on its own or together. Nothing is included unless your written quote says so.</p>
          </div>
          <CommsComponents />
        </div>
      </section>

      <section className="surface-light section pt-0" aria-labelledby="industries-h">
        <div className="wrap">
          <h2 id="industries-h" className="t-h2">Who it is for</h2>
          <p className="t-body measure mt-3 text-text-inv-2">Teams that need to reach each other instantly across sites. Coverage depends on the cellular network where you work, and is confirmed for your sites before you commit.</p>
          <div className="mt-8"><CommsIndustries /></div>
        </div>
      </section>

      <section className="surface-light section pt-0" aria-labelledby="faq-h">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 id="faq-h" className="t-h2">Questions</h2>
          <CommsFaq />
        </div>
      </section>

      <section id="quote" className="surface-white section scroll-mt-[72px]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Request a quote</h2>
            <p className="t-body mt-4 text-text-inv-2">
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
