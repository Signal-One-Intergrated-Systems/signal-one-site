import type { Metadata } from "next";
import Image from "next/image";
import EquipmentQuoteForm from "../components/EquipmentQuoteForm";
import { premiumImages } from "../lib/premiumImages";

export const metadata: Metadata = {
  title: "Radios & Tracking",
  description:
    "Rent PoC radios and request PTT, vehicle tracking, asset tracking and related field equipment for South African security operations.",
  alternates: { canonical: "/radios-equipment" },
};

const radioOfferings = [
  {
    model: "Hytera PNC360S",
    commercial: "Rental · quote only",
    label: "PoC radio rental",
    useCase:
      "Catalogue rental offering for cellular push-to-talk, including the device, RoIP service and data.",
  },
  {
    model: "P30 Lite PoC",
    commercial: "Rental · quote only",
    label: "Comms + SOS rental",
    useCase:
      "Catalogue rental offering including communications, SOS, SIM, data and platform access.",
  },
  {
    model: "PTT platform + SIM & data",
    commercial: "Subscription · quote only",
    label: "PTT service",
    useCase:
      "Monthly platform access with SIM and data for supported radios. Final device and network fit are confirmed for the deployment.",
  },
] as const;

const additionalEquipment = [
  ["E600 PoC LTE radio", "PoC LTE radio available through the Signal One catalogue by quote."],
  ["FMC920 tracker", "2G/4G vehicle tracking device, paired with the tracking-platform requirement."],
  ["FMB920 tracker", "2G vehicle tracking device for deployments where that network/device profile is suitable."],
  ["SC780 body camera", "24-month body-camera rental offering in the Signal One catalogue."],
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
                Rent the field equipment
                <span className="block text-[#38BDF8]">the contract needs.</span>
              </h1>
            </div>
            <div>
              <p className="text-lg leading-8 text-white/62">
                Signal One supplies PoC radios and can scope tracking equipment
                alongside the operating platform. Radios are rental-by-quote
                only, with 12, 24 or 36 month rental periods.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/68">
                Final availability, accessories, network requirements and
                commercial terms are confirmed for the deployment before a
                rental is accepted.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <p className="s1-eyebrow">PoC radio range</p>
              <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
                Professional cellular push-to-talk devices.
              </h2>
              <p className="s1-body mt-5 max-w-xl">
                These public offerings are aligned to the current Signal One
                commercial catalogue. Final hardware, network fit, stock and
                rental terms are confirmed before a quote is accepted.
              </p>
            </div>

            <div className="relative min-h-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
              <Image
                src={premiumImages.radioTracking}
                alt="Illustrative field security team using radios and tracking equipment"
                fill
                quality={92}
                className="object-cover object-center opacity-72"
                sizes="(min-width:1024px) 58vw,100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.25),rgba(10,13,18,.05))]" />
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {radioOfferings.map((radio) => (
              <article
                key={radio.model}
                className="rounded-[18px] border border-white/10 bg-[#0F131A] p-6"
              >
                <p className="s1-mono text-[11px] text-[#38BDF8]">
                  {radio.commercial}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-.03em]">
                  {radio.model}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/70">
                  {radio.label}
                </p>
                <p className="mt-5 text-sm leading-7 text-white/68">
                  {radio.useCase}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-y border-white/10 py-12 lg:grid-cols-[.82fr_1.18fr] lg:items-start md:py-16">
          <div>
            <p className="s1-eyebrow">Tracking</p>
            <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
              Vehicle tracking, asset tracking and tracking devices.
            </h2>
            <p className="s1-body mt-5 max-w-xl">
              The current catalogue includes named vehicle-tracking devices and
              a monthly tracking-platform service. Signal One confirms the
              appropriate device, installation and platform requirement before quote.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["FMC920", "2G/4G vehicle tracker available through the current catalogue."],
              ["FMB920", "2G vehicle tracker available through the current catalogue."],
              ["Tracking platform", "Monthly platform subscription per tracking device; final commercial terms are quoted for the deployment."],
              ["Guard integration", "Tracking controls inside Guard are Coming soon and are not presented as live today."],
            ].map(([title, body]) => (
              <article
                key={title}
                className="rounded-[16px] border border-white/10 bg-[#0F131A] p-5"
              >
                <h3 className="text-base font-semibold text-white/80">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/68">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="s1-eyebrow">Additional catalogue equipment</p>
              <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
                More than radios.
              </h2>
              <p className="s1-body mt-5 max-w-xl">
                Equipment is surfaced from the same commercial catalogue used
                by Signal One representatives. Public availability remains
                subject to a confirmed quote.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {additionalEquipment.map(([title, body]) => (
                <article key={title} className="rounded-[16px] border border-white/10 bg-[#0F131A] p-5">
                  <h3 className="text-base font-semibold text-white/84">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/68">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start md:py-16">
          <div>
            <p className="s1-eyebrow">How rental works</p>
            <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
              No cart. No invented online price.
            </h2>
            <p className="s1-body mt-5 max-w-xl">
              Tell Signal One what the site or contract needs. We confirm the
              product, quantity, rental period, availability and final quote
              before anything is supplied.
            </p>

            <div className="mt-8 space-y-5 border-t border-white/10 pt-7">
              {[
                ["01", "Choose a product", "Select a radio or tracking requirement."],
                ["02", "Set quantity & term", "Choose 12, 24 or 36 months for radio rentals."],
                ["03", "Confirm the deployment", "Signal One checks product fit, accessories, network and availability."],
                ["04", "Receive the quote", "Commercial terms are confirmed before rental acceptance."],
              ].map(([number, title, body]) => (
                <div key={number} className="grid grid-cols-[34px_1fr] gap-4">
                  <span className="s1-mono pt-1 text-[11px] text-[#38BDF8]">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/80">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/68">{body}</p>
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
