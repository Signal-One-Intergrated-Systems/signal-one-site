import type { Metadata } from "next";
import { ButtonLink, Check, FactPanel, PageHero, Status } from "../../components/ui";
import { contact } from "../../lib/site";
import { guardDayPricePhrase } from "../../lib/pricing";
import { guardIsLive, guardOnboardingLine, guardStatusLabel } from "../../lib/guardStatus";

export const metadata: Metadata = {
  title: "About Signal One",
  description:
    "Who Signal One is: push-to-talk radios, tracking and body cameras for field teams, and 1GUARD for South African security companies. What is available today and what is still being built.",
  alternates: { canonical: "/about" },
};

// Status words follow the site's truth labels (docs/PRODUCT_BRAND_ARCHITECTURE.md).
const offers = [
  {
    name: "Push-to-talk radios and connectivity",
    // "By quote", as on /radios-equipment, /ptt-radio-rental and /pricing (AUDW-11).
    status: "By quote",
    detail: "Radios that work over the cellular network, sold or rented on 12, 24 or 36-month terms, with or without SIM, data and the push-to-talk platform. By written quote.",
    href: "/radios-equipment",
  },
  {
    name: "Vehicle tracking and body cameras",
    status: "By quote",
    detail: "Trackers for vehicles and assets, and body cameras for patrols and access points. Quoted per deployment.",
    href: "/radios-equipment",
  },
  {
    name: "1GUARD",
    // From lib/guardStatus.ts, the single source of truth: Pilot until GUARD_STATUS=live.
    status: guardStatusLabel,
    detail: "The operating system for security companies: attendance, patrols, occurrence book, SOS and proof of service. " + guardDayPricePhrase + ", excluding VAT." + (guardOnboardingLine ? " " + guardOnboardingLine : ""),
    href: "/solutions/security",
  },
  {
    name: "1Service",
    status: "In development",
    detail: "An operating system for service businesses, starting with restaurants. Not yet available to buy.",
    href: "/service",
  },
  {
    name: "Guard Marketplace",
    status: "In development",
    detail: "A planned way for security companies to find and hire officers. Interest only for now.",
    href: "/guard-marketplace",
  },
] as const;

const principles = [
  ["Nothing is supplied until you accept a written quote", "Prices, terms, availability and delivery are confirmed in writing first."],
  // The labels the site actually uses (AUDW-11): 1GUARD's from lib/guardStatus.ts, the rest as shown on each page.
  ["We label what is not ready", "Every product on this site carries its status: " + guardStatusLabel + ", Beta, In development, Coming soon or By quote. We do not sell a roadmap as a product."],
  ["We do not claim what we have not earned", "No certifications, customer logos or testimonials appear here unless they are real and approved."],
  ["Your information is handled under POPIA", "We use what you send us to answer you, and only send news if you opt in."],
] as const;

export default function AboutPage() {
  return (
    <main id="main" className="s1-scene-page s1-scene-page--security">
      <PageHero
        kicker="About Signal One"
        title="Equipment that keeps teams connected. Software that runs the business."
        lead="Signal One supplies push-to-talk radios, tracking and body cameras to South African businesses with people in the field, and builds operating systems for small and medium businesses, starting with 1GUARD for security companies."
        actions={
          <>
            <ButtonLink href="/contact" size="lg">Talk to Signal One</ButtonLink>
            <ButtonLink href="/radios-equipment" variant="ghost-dark" size="lg">See radios and equipment</ButtonLink>
          </>
        }
        aside={
          <FactPanel
            title="Signal One at a glance"
            facts={[
              ["Trading as", contact.tradingEntity + ", South Africa"],
              ["Sells and rents", "Push-to-talk radios, connectivity, vehicle tracking and body cameras, by written quote"],
              ["Software", "1GUARD for security companies, " + guardDayPricePhrase + " excl. VAT" + (guardIsLive ? "" : " (pilot)")],
              ["Contact", contact.email + " · WhatsApp " + contact.whatsappDisplay],
            ]}
          />
        }
      />

      <section className="surface-light section" aria-labelledby="about-offers">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 id="about-offers" className="t-h2">What we offer, and what is ready</h2>
          <ul className="m-0 grid list-none gap-x-12 p-0 md:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer.name} className="border-t border-line-dark py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="t-h4">{offer.name}</h3>
                  <Status kind={offer.status === "By quote" ? "quote" : offer.status === "Live" ? "live" : offer.status === "Pilot" ? "pilot" : "mvp"} tone="light">{offer.status}</Status>
                </div>
                <p className="t-small mt-2 text-text-inv-2">{offer.detail}</p>
                <a href={offer.href} className="link-arrow mt-3 inline-flex text-signal-300" aria-label={"Learn more about " + offer.name}>Learn more →</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-light-2 section" aria-labelledby="about-company">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 id="about-company" className="t-h2">Who you are dealing with</h2>
          <div className="grid gap-6">
            <p className="t-lead measure text-text-inv-2">
              Signal One Integrated Systems is a South African business. It currently trades as {contact.tradingEntity}.
              If your procurement process needs company registration, VAT or banking details, ask us for them.
            </p>
            <ul className="m-0 grid list-none gap-4 p-0">
              {principles.map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <Check className="mt-1 shrink-0 text-signal-300" />
                  <div>
                    <p className="t-h4">{title}</p>
                    <p className="t-small mt-1 text-text-inv-2">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="surface-light section" aria-labelledby="about-contact">
        <div className="wrap grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 id="about-contact" className="t-h2">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={"mailto:" + contact.email} className="card p-6">
              <span className="t-small text-text-inv-2">Email</span>
              <span className="t-h4 mt-1 block text-signal-300">{contact.email}</span>
            </a>
            <a href={contact.whatsappHref} className="card p-6" rel="noopener">
              <span className="t-small text-text-inv-2">WhatsApp</span>
              <span className="t-h4 mt-1 block text-signal-300">{contact.whatsappDisplay}</span>
            </a>
            <p className="t-small text-text-inv-2 sm:col-span-2">
              Already a customer? <a href="/support" className="link-inline font-semibold text-signal-300">Get support</a>.
              Looking for work as a security officer? <a href="/guards" className="link-inline font-semibold text-signal-300">Start here</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
