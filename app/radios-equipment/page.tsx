import type { Metadata } from "next";
import Image from "next/image";
import EquipmentQuoteForm from "../components/EquipmentQuoteForm";

export const metadata: Metadata = {
  title: "Radios & Tracking",
  description:
    "Request Signal One PoC radio rental, radio purchases, PTT services, vehicle tracking and body-camera equipment for security operations.",
};

const radioProducts = [
  {
    model: "PNC360S PoC radio",
    commercial: "Rental · quote only",
    body: "The current Signal One catalogue rental combines the device with RoIP and data for a monthly deployment.",
    facts: ["PoC radio device", "RoIP service", "Data included in the catalogue rental", "Final term and stock confirmed by quote"],
  },
  {
    model: "P30 Lite PoC radio",
    commercial: "Rental · quote only",
    body: "A current catalogue rental option for security and field communications, with communications and SOS positioned as part of the service.",
    facts: ["PoC communications", "SOS capability", "SIM and data included", "Platform access included"],
  },
  {
    model: "E600 PoC LTE radio",
    commercial: "Purchase · quote",
    body: "An outright PoC LTE radio option in the current commercial catalogue for teams that want to own the hardware.",
    facts: ["PoC LTE radio", "Outright equipment purchase", "PTT service can be scoped separately", "Final configuration confirmed before quote"],
  },
] as const;

const connectedProducts = [
  {
    title: "FMC920 vehicle tracker",
    status: "Live",
    body: "2G/4G vehicle-tracker hardware in the current catalogue. Hardware and deployment terms are confirmed by quote.",
  },
  {
    title: "FMB920 vehicle tracker",
    status: "Live",
    body: "2G vehicle-tracker hardware in the current catalogue for supported deployments.",
  },
  {
    title: "Tracker platform",
    status: "Live",
    body: "Per-device tracking-platform subscription exists in the commercial catalogue. The exact provider and deployment scope are confirmed in the quote.",
  },
  {
    title: "SC780 body camera",
    status: "Live",
    body: "A 24-month body-camera rental product exists in the current catalogue. Public pricing is not shown.",
  },
  {
    title: "Manage inside Guard",
    status: "Coming soon",
    body: "Direct PTT, tracking and body-camera controls inside Guard are not presented as live yet.",
  },
] as const;

export default function RadiosEquipmentPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[1280px]">
        <section className="relative overflow-hidden border-b border-white/10 pb-12 md:pb-16">
          <div className="absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-[#0EA5E9]/[.06] blur-[100px]" />
          <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <p className="s1-eyebrow">Radios & Tracking</p>
              <h1 className="s1-display mt-5 max-w-4xl font-semibold">
                Equip the contract
                <span className="block text-[#38BDF8]">without buying blind.</span>
              </h1>
            </div>
            <div>
              <p className="text-lg leading-8 text-white/64">
                Rent PoC radios, buy supported equipment, or request tracking and body-camera products from the current Signal One catalogue.
                Radio rentals remain quote-only.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/55">
                Stock, final configuration, network requirements, accessories, insurance and support terms are confirmed for the actual deployment rather than assumed on the website.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <p className="s1-eyebrow">PoC radio catalogue</p>
              <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
                Start with the radios Signal One is actually set up to quote.
              </h2>
              <p className="s1-body mt-5 max-w-xl">
                The commercial facts below come from the current internal product catalogue. We do not publish a radio rental price until the deployment is quoted.
              </p>
            </div>

            <div className="relative min-h-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
              <Image
                src="/images/Devices/poc/hero-radios.jpg"
                alt="Push-to-talk radio equipment"
                fill
                className="object-cover object-center opacity-72"
                sizes="(min-width:1024px) 58vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.25),rgba(10,13,18,.05))]" />
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {radioProducts.map((radio) => (
              <article key={radio.model} className="rounded-[18px] border border-white/10 bg-[#0F131A] p-6">
                <p className="s1-mono text-[#38BDF8]">{radio.commercial}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-.03em]">{radio.model}</h3>
                <p className="mt-5 text-sm leading-7 text-white/58">{radio.body}</p>
                <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm leading-6 text-white/60">
                  {radio.facts.map((fact) => (
                    <li key={fact} className="flex gap-2">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#38BDF8]" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
            <div>
              <p className="s1-eyebrow">Tracking & body camera</p>
              <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
                Add the devices the operation needs.
              </h2>
              <p className="s1-body mt-5 max-w-xl">
                Tracking and body-camera products are commercial catalogue items. Direct control of those capabilities from inside Guard remains a separate product integration and is labelled honestly below.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {connectedProducts.map((product) => (
                <article key={product.title} className="rounded-[16px] border border-white/10 bg-[#0F131A] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-white/84">{product.title}</h3>
                    <span className={
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold " +
                      (product.status === "Live"
                        ? "border-[#22C55E]/25 bg-[#22C55E]/[.06] text-[#86EFAC]"
                        : "border-[#38BDF8]/25 bg-[#0EA5E9]/[.06] text-[#7DD3FC]")
                    }>
                      {product.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/58">{product.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start md:py-16">
          <div>
            <p className="s1-eyebrow">How the quote works</p>
            <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
              Tell us what the site needs. We confirm the commercial model.
            </h2>
            <p className="s1-body mt-5 max-w-xl">
              Radio rental, equipment purchases, platform subscriptions and tracking requirements do not all use the same term. The form changes with the product instead of forcing one commercial model onto everything.
            </p>

            <div className="mt-8 space-y-5 border-t border-white/10 pt-7">
              {[
                ["01", "Choose the product", "Select the radio, PTT, tracking or body-camera requirement."],
                ["02", "Set the quantity", "Tell us how many units or devices the deployment needs."],
                ["03", "Confirm deployment details", "Signal One checks stock, connectivity, configuration and applicable terms."],
                ["04", "Receive the quote", "Nothing is accepted until the final commercial terms are confirmed."],
              ].map(([number, title, body]) => (
                <div key={number} className="grid grid-cols-[36px_1fr] gap-4">
                  <span className="s1-mono pt-1 text-[#38BDF8]">{number}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/82">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/58">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <EquipmentQuoteForm />
        </section>
      </div>
    </main>
  );
}
