import type { Metadata } from "next";
import Image from "next/image";
import { HardwareShowcase } from "../../components/Hardware";
import LandingPage from "../../components/LandingPage";
import { ButtonLink, Status } from "../../components/ui";
import { catalogue } from "../../lib/catalogue";
import { guardDayPricePhrase } from "../../lib/pricing";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PTT Radio Rental for Security Companies",
  description:
    "Push-to-talk over cellular radios on 12, 24 or 36-month rental terms: Hytera PNC360S, P30 Lite PoC, P30G Pro and EasyTalk E600, by quote, from Signal One.",
  alternates: { canonical: "/ptt-radio-rental" },
});

const radios = catalogue[0];

export default function PttRadioRentalPage() {
  return (
    <LandingPage
      scene="radio-rental"
      kicker="PTT radio rental"
      title="Push-to-talk radios for your security contracts."
      lead="Rent push-to-talk radios that run over the cellular network, so a supervisor in Midrand can reach a guard in Pretoria without repeaters. Quoted per deployment, on 12, 24 or 36-month terms."
      actions={
        <>
          <ButtonLink href="/radios-equipment?quoteType=Rent%20radios#quote" size="lg">
            Request a radio quote
          </ButtonLink>
          <ButtonLink href="/radios-equipment" variant="ghost-dark" size="lg">
            See all equipment
          </ButtonLink>
        </>
      }
      aside={
        <div className="grid gap-5">
          <HardwareShowcase products={catalogue[0].products.slice(0, 2)} />
          <ul className="m-0 grid list-none gap-px overflow-hidden rounded-card border border-hairline bg-hairline p-0">
          {radios.products.map((product) => (
            <li key={product.model} className="flex items-start justify-between gap-4 bg-surface p-5 sm:p-6">
              <div>
                <p className="t-small font-semibold text-accent">{product.type}</p>
                <p className="t-h3 mt-1">{product.model}</p>
                <p className="t-small mt-2 text-ink-2">{product.detail}</p>
              </div>
              <Status kind="quote" tone="dark">
                By quote
              </Status>
            </li>
          ))}
          </ul>
        </div>
      }
      capabilitiesTitle="What a rental includes, and what is quoted"
      // The radios themselves are listed in the hero; this section answers how renting works instead of repeating them (DR-017).
      capabilities={[
        ["The radio", "Rented on a 12, 24 or 36-month term, or bought outright."],
        ["Connectivity, if you want it", "Push-to-talk service, SIM and data are a separate monthly line: take it with the radios, use your own SIMs, or add it to radios you already own."],
        ["Buying instead", "Radios are also sold outright, by quotation. Ask to compare buying and renting in one quote."],
        ["Confirmed in your written quote", "Price, availability and final specification, plus accessories (chargers, earpieces, clips), delivery, any deposit, maintenance, damage, loss and replacement, and early termination. We do not publish prices, stock or delivery dates, and nothing here is included unless your quote says so."],
      ]}
      stepsTitle="How the quote works"
      // Supporting editorial panel (founder bright package, 05): an illustrative scene, never stock or inventory evidence.
      stepsVisual={
        <figure className="m-0">
          <div className="media-frame relative aspect-video">
            <Image src="/images/bright/05-radio-rental-workflow.webp" alt="Illustrative team preparing communications equipment for deployment" fill
              sizes="(min-width:1024px) 34vw, 92vw" className="object-cover" loading="lazy" />
          </div>
          <figcaption className="photo-caption mt-3">Illustrative scene · not actual rental stock</figcaption>
        </figure>
      }
      steps={[
        ["You send the requirement", "Product, quantity and where the radios will be used. About two minutes."],
        ["We confirm fit", "Network, accessories and availability for your sites."],
        ["You get a written quote", "Term, quantities and price, by email."],
        ["You decide", "Nothing is supplied until you accept the quote."],
      ]}
      limits={[
        "Renting a radio does not yet connect it to 1GUARD. Activating devices and viewing tracking from inside 1GUARD is coming soon.",
        "Equipment is rented alongside 1GUARD, and priced separately from the " + guardDayPricePhrase + " platform rate.",
      ]}
      closing="Radios for the contract, by quote."
      closingLead="Choose a 12, 24 or 36-month rental term. Your written quote confirms devices, connectivity, availability and the full rental cost."
      closingActions={<><ButtonLink href="/radios-equipment?quoteType=Rent%20radios#quote" size="lg">Request a radio quote</ButtonLink><ButtonLink href="/radios-equipment" variant="ghost-dark" size="lg">Compare equipment options</ButtonLink></>}
      related={[
        ["/radios-equipment#journeys", "Buy, rent, connect your own radios, or get help choosing"],
        ["/solutions/security", "The 1GUARD platform"],
        ["/contact", "Talk to Signal One"],
      ]}
    />
  );
}
