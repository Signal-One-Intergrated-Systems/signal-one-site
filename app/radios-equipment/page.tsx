import type { Metadata } from "next";
import Image from "next/image";
import EquipmentQuoteForm from "../components/EquipmentQuoteForm";
import EquipmentShowcase from "../components/EquipmentShowcase";
import { HardwareCard } from "../components/Hardware";
import { catalogue } from "../lib/catalogue";
import { ButtonLink, PageHero, Status, Steps } from "../components/ui";

export const metadata: Metadata = {
  title: "Radios, Vehicle Tracking and Body Cameras for Contracts",
  description:
    "Rent PTT radios, vehicle trackers and body cameras for your security contracts: Hytera PNC360S, P30 Lite PoC, E600 PoC LTE, FMC920, FMB920, SC780. By quote.",
  alternates: { canonical: "/radios-equipment" },
};

export default async function RadiosEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>;
}) {
  const { model } = await searchParams;
  const featured = catalogue[0].products[0];
  return (
    <main id="main" className="equipment-main">
      <PageHero
        kicker="Radios & Tracking"
        status={
          <Status kind="quote" tone="dark">
            By quote
          </Status>
        }
        title="Equip the people. Connect the field."
        lead="Choose the product, tell us the requirement and quantity, and where it will be deployed. We reply with a written quote."
        actions={
          <ButtonLink href="#quote" size="lg">
            Request a quote
          </ButtonLink>
        }
        aside={
          <figure className="equipment-hero-product">
            <figcaption>
              <span>Hytera</span>
              <span>Field communications · by quote</span>
            </figcaption>
            <div className="equipment-hero-image">
              <Image
                src={featured.image!.src}
                alt={featured.image!.alt}
                fill
                priority
                sizes="(min-width: 1024px) 180px, 140px"
                quality={90}
                className="object-contain"
              />
            </div>
            <p>
              PNC360S <span>Mini PoC radio</span>
            </p>
          </figure>
        }
      />

      <section className="surface-light section">
        <div className="wrap">
          <h2 className="t-h2">Equipment, considered.</h2>
          <p className="t-body measure mt-3 text-text-2">
            Named products we rent today. Final specification, availability and
            price are confirmed in the quote; we do not publish prices, stock or
            delivery dates.
          </p>

          <div className="mt-8">
            <EquipmentShowcase />
          </div>
          <div className="mt-12 grid gap-12">
            {catalogue
              .filter((group) =>
                group.products.some((product) => !product.image),
              )
              .map((group) => (
                <section
                  key={group.id}
                  id={group.id}
                  aria-labelledby={group.id + "-h"}
                  className="scroll-mt-[72px]"
                >
                  <div className="grid gap-4 border-t-2 border-base pt-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
                    <div>
                      <h3 id={group.id + "-h"} className="t-h3">
                        {group.category}
                      </h3>
                      <p className="t-small mt-3 text-text-2">{group.lead}</p>
                      <p className="t-small mt-3 font-semibold">
                        {group.terms}
                      </p>
                    </div>
                    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
                      {group.products
                        .filter((product) => !product.image)
                        .map((product) => (
                          <li key={product.model}>
                            <HardwareCard product={product} headingLevel={4} />
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
              You can rent this equipment today alongside Signal One Security.
              Activating devices and viewing tracking from inside Signal One
              Guard is coming soon; renting a device does not yet connect it to
              the platform.
            </p>
          </div>
        </div>
      </section>

      <section id="quote" className="surface-white section scroll-mt-[72px]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Request a quote</h2>
            <p className="t-body mt-4 text-text-2">
              Product, requirement, quantity, deployment. The form changes with
              what you choose, so you only answer what matters.
            </p>
            <div className="mt-8">
              <Steps
                items={[
                  ["You send the requirement", "Takes about two minutes."],
                  [
                    "We confirm fit",
                    "Network, accessories, installation and availability for your sites.",
                  ],
                  [
                    "You get a written quote",
                    "Term, quantities and price, by email.",
                  ],
                  [
                    "You decide",
                    "Nothing is supplied until you accept the quote.",
                  ],
                ]}
              />
            </div>
          </div>
          <EquipmentQuoteForm key={model || "default"} initialModel={model} />
        </div>
      </section>
    </main>
  );
}
