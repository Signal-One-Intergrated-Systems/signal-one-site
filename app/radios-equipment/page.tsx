import type { Metadata } from "next";
import EquipmentQuoteForm from "../components/EquipmentQuoteForm";
import { ButtonLink, PageHero, Status, Steps } from "../components/ui";

export const metadata: Metadata = {
  title: "PTT Radio Rental, Vehicle Tracking & Body Cameras",
  description:
    "PTT radio rental in South Africa on 12, 24 or 36 month terms, vehicle tracking for security companies and body-camera rental. Hytera PNC360S, P30 Lite PoC, E600, FMC920, FMB920, SC780. Quoted per deployment.",
  alternates: { canonical: "/radios-equipment" },
};

const catalogue = [
  {
    category: "Radios and PTT",
    id: "radios",
    lead: "Push-to-talk over the cellular network, so a supervisor in Midrand can reach a guard in Pretoria without repeaters.",
    products: [
      { model: "Hytera PNC360S", type: "PoC radio", detail: "Rental. Device with push-to-talk service and data." },
      { model: "P30 Lite PoC", type: "PoC radio with SOS", detail: "Rental. Communications, SOS, SIM, data and platform access." },
      { model: "E600 PoC LTE", type: "PoC LTE radio", detail: "Available by quote." },
      { model: "PTT platform + SIM & data", type: "Service", detail: "Monthly platform access with SIM and data for supported radios." },
    ],
    terms: "Radio rental terms: 12, 24 or 36 months.",
  },
  {
    category: "Vehicle and asset tracking",
    id: "tracking",
    lead: "Trackers for response vehicles, supervisor cars and high-value assets, with the tracking platform quoted per device.",
    products: [
      { model: "FMC920", type: "Vehicle tracker, 2G/4G", detail: "For deployments that need 4G coverage." },
      { model: "FMB920", type: "Vehicle tracker, 2G", detail: "Where the 2G network profile suits the area." },
    ],
    terms: "Device, installation and platform confirmed per deployment.",
  },
  {
    category: "Body cameras",
    id: "bodycams",
    lead: "Recorded evidence for patrols, access points and events, where a client contract asks for it.",
    products: [{ model: "SC780", type: "Body camera", detail: "Rental." }],
    terms: "Quoted per deployment.",
  },
] as const;

export default function RadiosEquipmentPage() {
  return (
    <main id="main">
      <PageHero
        kicker="Radios & Tracking"
        status={
          <Status kind="quote" tone="dark">
            By quote
          </Status>
        }
        title="Radios, PTT, tracking and body cameras. Rented, not sold online."
        lead="Choose the product, tell us the requirement and quantity, and where it will be deployed. We reply with a written quote."
        actions={
          <ButtonLink href="#quote" size="lg">
            Request a quote
          </ButtonLink>
        }
        aside={
          <dl className="m-0 grid gap-px overflow-hidden rounded-card border border-line-dark bg-line-dark">
            {[
              ["Radios and PTT", "Hytera PNC360S, P30 Lite PoC, E600 PoC LTE, PTT platform with SIM and data"],
              ["Vehicle and asset tracking", "FMC920 and FMB920 trackers"],
              ["Body cameras", "SC780 body camera"],
            ].map(([term, detail]) => (
              <div key={term} className="bg-raised p-5 sm:p-6">
                <dt className="t-h4">{term}</dt>
                <dd className="t-small m-0 mt-1 text-text-inv-2">{detail}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section className="surface-light section">
        <div className="wrap">
          <h2 className="t-h2">The catalogue</h2>
          <p className="t-body measure mt-3 text-text-2">
            Named products we rent today. Final specification, availability and price are confirmed in the quote; we do
            not publish prices, stock or delivery dates.
          </p>

          <div className="mt-12 grid gap-16">
            {catalogue.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={group.id + "-h"} className="scroll-mt-[72px]">
                <div className="grid gap-4 border-t-2 border-base pt-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
                  <div>
                    <h3 id={group.id + "-h"} className="t-h3">
                      {group.category}
                    </h3>
                    <p className="t-small mt-3 text-text-2">{group.lead}</p>
                    <p className="t-small mt-3 font-semibold">{group.terms}</p>
                  </div>
                  <ul className="m-0 grid list-none gap-3 p-0 lg:grid-cols-2">
                    {group.products.map((product) => (
                      <li key={product.model} className="card flex flex-col justify-between gap-8 p-6 sm:p-8">
                        <div>
                          <p className="t-small font-semibold text-signal-ink">{product.type}</p>
                          <p className="font-display mt-3 text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[2.5rem]">{product.model}</p>
                          <p className="t-small mt-4 text-text-2">{product.detail}</p>
                        </div>
                        <p>
                          <Status kind="quote">By quote</Status>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-card bg-light-2 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="t-h4">Equipment and the Signal One platform</h2>
              <Status kind="soon">Coming soon</Status>
            </div>
            <p className="t-small measure mt-2 text-text-2">
              You can rent this equipment today alongside Signal One Security. Activating devices and viewing tracking from
              inside Signal One Guard is coming soon; renting a device does not yet connect it to the platform.
            </p>
          </div>
        </div>
      </section>

      <section id="quote" className="surface-white section scroll-mt-[72px]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Request a quote</h2>
            <p className="t-body mt-4 text-text-2">
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
          <EquipmentQuoteForm />
        </div>
      </section>
    </main>
  );
}
