import Image from "next/image";
import Link from "next/link";
import MarketingHero from "../components/MarketingHero";

const devices = [
  {
    href: "/devices/lorawan-sensors",
    title: "LoRaWAN Sensors",
    body: "Industrial-grade sensors for environmental monitoring, smart metering, asset tracking, and facility management. Long-range, low-power performance.",
    image: "/images/Devices/Lorawan/hero-sensors.jpg",
    alt: "Signal One LoRaWAN sensors",
    cta: "View catalog",
  },
  {
    href: "/devices/poc-radios",
    title: "PoC Radios",
    body: "Ruggedised Push-to-Talk over Cellular devices combining instant voice communication with broadband data capabilities.",
    image: "/images/Devices/poc/hero-radios.jpg",
    alt: "Signal One Push-to-Talk over Cellular radios",
    cta: "View models",
  },
] as const;

export default function DevicesPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One devices"
          title="Hardware built for field operations."
          body="Ruggedised, mission-critical hardware for field operations, sensing, and tracking."
          image="/images/devices.jpg"
          imageAlt="Connected operational devices for field use"
          primary={{ href: "/marketplace", label: "Browse marketplace" }}
          secondary={{ href: "/contact", label: "Request a device quote" }}
        />

        <section className="py-20 md:py-24">
          <div className="grid gap-5 md:grid-cols-2">
            {devices.map((device) => (
              <Link
                key={device.href}
                href={device.href}
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:-translate-y-1 hover:border-[#0EA5E9]/35"
              >
                <div className="relative h-72 overflow-hidden bg-[radial-gradient(circle_at_50%_36%,rgba(14,165,233,.12),transparent_55%)]">
                  <Image
                    src={device.image}
                    alt={device.alt}
                    fill
                    className="object-cover transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.035]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,13,18,.64))]" />
                </div>
                <div className="p-7 md:p-8">
                  <h2 className="text-2xl font-semibold tracking-[-.03em] md:text-3xl">{device.title}</h2>
                  <p className="mt-4 text-base leading-7 text-white/52">{device.body}</p>
                  <span className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition duration-300 group-hover:translate-x-1">
                    {device.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
