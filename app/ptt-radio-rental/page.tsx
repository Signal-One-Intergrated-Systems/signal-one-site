import type { Metadata } from "next";
import LandingPage from "../components/LandingPage";
import { ButtonLink, Status } from "../components/ui";
import { catalogue } from "../lib/catalogue";

export const metadata: Metadata = {
  title: "PTT Radio Rental for Security Companies",
  description:
    "Push-to-talk over cellular radios on 12, 24 or 36-month rental terms: Hytera PNC360S, P30 Lite PoC and E600 PoC LTE, by quote, from Signal One.",
  alternates: { canonical: "/ptt-radio-rental" },
};

const radios = catalogue[0];

export default function PttRadioRentalPage() {
  return (
    <LandingPage
      kicker="PTT radio rental"
      title="Push-to-talk radios for your security contracts."
      lead="Rent push-to-talk over cellular radios for your sites and supervisors. Push-to-talk over the cellular network, so a supervisor in Midrand can reach a guard in Pretoria without repeaters. Quoted per deployment, on 12, 24 or 36-month terms."
      actions={
        <>
          <ButtonLink href="/radios-equipment#quote" size="lg">
            Request a radio quote
          </ButtonLink>
          <ButtonLink href="/radios-equipment" variant="ghost-dark" size="lg">
            See all equipment
          </ButtonLink>
        </>
      }
      aside={
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-card border border-line-dark bg-line-dark p-0">
          {radios.products.map((product) => (
            <li key={product.model} className="flex items-start justify-between gap-4 bg-raised p-5 sm:p-6">
              <div>
                <p className="t-small font-semibold text-signal-400">{product.type}</p>
                <p className="font-display mt-1 text-[1.5rem] font-bold leading-tight tracking-[-0.03em]">{product.model}</p>
                <p className="t-small mt-2 text-text-inv-2">{product.detail}</p>
              </div>
              <Status kind="quote" tone="dark">
                By quote
              </Status>
            </li>
          ))}
        </ul>
      }
      capabilitiesTitle="What we rent"
      capabilities={[
        ["Hytera PNC360S", "PoC radio. Rental. Device with push-to-talk service and data."],
        ["P30 Lite PoC", "PoC radio with SOS. Rental. Communications, SOS, SIM, data and platform access."],
        ["E600 PoC LTE", "PoC LTE radio. Available by quote."],
        ["PTT platform with SIM and data", "Monthly platform access with SIM and data for supported radios."],
        ["Rental terms", "12, 24 or 36 months."],
        ["Quoted, not listed", "Final specification, availability and price are confirmed in a written quote. We do not publish prices, stock or delivery dates."],
      ]}
      stepsTitle="How the quote works"
      steps={[
        ["You send the requirement", "Product, quantity and where the radios will be used. About two minutes."],
        ["We confirm fit", "Network, accessories and availability for your sites."],
        ["You get a written quote", "Term, quantities and price, by email."],
        ["You decide", "Nothing is supplied until you accept the quote."],
      ]}
      limits={[
        "Renting a radio does not yet connect it to Signal One Guard. Activating devices and viewing tracking from inside Signal One Guard is coming soon.",
        "Equipment is rented alongside Signal One Security, and priced separately from the R2 per guard per day platform rate.",
      ]}
      closing="Radios for the contract, by quote."
      related={[
        ["/radios-equipment", "Radios, tracking and body cameras"],
        ["/solutions/security", "The Signal One Security platform"],
        ["/contact", "Talk to Signal One"],
      ]}
    />
  );
}
