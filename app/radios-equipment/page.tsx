import type { Metadata } from "next";
import Image from "next/image";
import EquipmentQuoteForm from "../components/EquipmentQuoteForm";

export const metadata: Metadata = {
  title: "Radios & Equipment",
  description:
    "Rent Signal One PoC radios and request tracking equipment for security operations. Rental periods: 12, 24 or 36 months.",
};

const radios = [
  {
    model: "Hytera PNC360S",
    label: "Compact professional PoC radio",
    useCase:
      "For security teams that need a compact LTE/Wi-Fi push-to-talk device with strong audio and rugged field protection.",
    specs: [
      "LTE / WCDMA / GSM cellular support",
      "1.77-inch display",
      "4,000 mAh battery",
      "Wi-Fi 2.4 GHz",
      "Bluetooth 4.1",
      "GPS / BDS / GLONASS / AGPS positioning",
      "IP67 protection",
      "Approx. 190 g with belt clip",
    ],
  },
  {
    model: "Hytera P30",
    label: "Professional lightweight PoC radio",
    useCase:
      "For guarding and field teams that need simple push-to-talk communications in a lightweight handheld form factor.",
    specs: [
      "2G / 3G / LTE cellular support",
      "1.77-inch 128×160 display",
      "3,300 mAh battery",
      "Up to 3 W audio",
      "Nano SIM",
      "Optional GPS / BDS / GLONASS positioning",
      "IP54 protection",
      "Approx. 170 g without belt clip",
    ],
  },
  {
    model: "Caltta e600",
    label: "Rugged broadband PoC radio",
    useCase:
      "For field teams that need a larger battery, rugged enclosure and Android-based broadband communications device.",
    specs: [
      "LTE / WCDMA / GSM plus Wi-Fi",
      "5,100 mAh battery",
      "Customised Android 8",
      "512 MB RAM + 4 GB storage",
      "GPS / AGPS positioning",
      "Wi-Fi 2.4 GHz",
      "Bluetooth support",
      "IP68 protection",
    ],
  },
] as const;

export default function RadiosEquipmentPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[1280px]">
        <section className="relative overflow-hidden border-b border-white/10 pb-16 md:pb-20">
          <div className="absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-[#0EA5E9]/[.06] blur-[100px]" />
          <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div>
              <p className="s1-eyebrow">Radios & Equipment</p>
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
              <p className="mt-4 text-sm leading-7 text-white/42">
                Final availability, accessories, network requirements and
                commercial terms are confirmed for the deployment before a
                rental is accepted.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <p className="s1-eyebrow">PoC radio range</p>
              <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
                Professional cellular push-to-talk devices.
              </h2>
              <p className="s1-body mt-5 max-w-xl">
                The public range below is limited to radio models whose core
                specifications have been cross-checked against current
                manufacturer material.
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
            {radios.map((radio) => (
              <article
                key={radio.model}
                className="rounded-[18px] border border-white/10 bg-[#0F131A] p-6"
              >
                <p className="s1-mono text-[8px] text-[#38BDF8]">
                  Rental · quote only
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-.03em]">
                  {radio.model}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/50">
                  {radio.label}
                </p>
                <p className="mt-5 text-sm leading-7 text-white/44">
                  {radio.useCase}
                </p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="s1-mono text-[8px] text-white/28">
                    Verified core specifications
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs leading-6 text-white/46">
                    {radio.specs.map((spec) => (
                      <li key={spec} className="flex gap-2">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#38BDF8]" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-y border-white/10 py-16 lg:grid-cols-[.82fr_1.18fr] lg:items-start md:py-20">
          <div>
            <p className="s1-eyebrow">Tracking</p>
            <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
              Vehicle tracking, asset tracking and tracking devices.
            </h2>
            <p className="s1-body mt-5 max-w-xl">
              Tracking remains a commercial category rather than a named public
              hardware range for now. Signal One can scope tracking against the
              operating requirement and confirm the exact device before quote.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Vehicle tracking",
                "For response vehicles, patrol vehicles and other mobile fleet assets.",
              ],
              [
                "Asset tracking",
                "For equipment and operational assets that need location visibility.",
              ],
              [
                "Tracking devices",
                "Hardware selection is confirmed against the environment, power, network and mounting requirement.",
              ],
              [
                "Guard integration",
                "Direct Tracking on/off controls inside Guard are planned, not currently presented as live.",
              ],
            ].map(([title, body]) => (
              <article
                key={title}
                className="rounded-[16px] border border-white/10 bg-[#0F131A] p-5"
              >
                <h3 className="text-base font-semibold text-white/80">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/42">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-12 py-16 lg:grid-cols-[.8fr_1.2fr] lg:items-start md:py-20">
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
                  <span className="s1-mono pt-1 text-[8px] text-[#38BDF8]">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/80">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/40">{body}</p>
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
