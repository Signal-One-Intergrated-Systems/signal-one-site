import Image from "next/image";
import Link from "next/link";
import MarketingHero from "../components/MarketingHero";

const solutions = [
  {
    href: "/solutions/security",
    title: "Security Operations",
    body: "End-to-end patrol management and dispatch systems utilising Signal One Critical Connect platforms and rapid-response panic alarms for officer safety.",
    points: ["Real-time Video Dispatch", "Lone Worker Protection", "Global Roaming Connectivity"],
    image: "/images/industries/security.jpg",
    alt: "Security control room supporting active operations",
  },
  {
    href: "/solutions/utilities",
    title: "Smart Utilities",
    body: "Remote metering and infrastructure monitoring powered by Signal One LoRaWAN sensors and global IoT connectivity.",
    points: ["Automated Meter Reading (AMR)", "Predictive Maintenance", "Private LoRaWAN Networks"],
    image: "/images/industries/utilities.jpg",
    alt: "Utility infrastructure supported by connected monitoring",
  },
  {
    href: "/solutions/logistics",
    title: "Fleet & Logistics",
    body: "Global asset tracking and fleet coordination using multi-network IoT SIMs and unified device management platforms.",
    points: ["Cross-Border Tracking", "Remote Firmware Management", "Driver Telematics"],
    image: "/images/industries/logistics.jpg",
    alt: "Logistics operation with connected field coordination",
  },
  {
    href: "/solutions/agriculture",
    title: "Smart Agriculture",
    body: "Precision farming and livestock monitoring with ruggedised Signal One sensors and long-range connectivity solutions.",
    points: ["Livestock Geo-fencing", "Environmental Sensing", "Solar-Powered Gateways"],
    image: "/images/industries/agriculture.jpg",
    alt: "Agricultural operation supported by connected monitoring",
  },
] as const;

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One solutions"
          title="Solutions built around the operation."
          body="Tailored operational ecosystems integrating best-in-class hardware, platforms, and global connectivity."
          image="/images/industries-bg.jpg"
          imageAlt="Connected operational landscape representing Signal One industry solutions"
          primary={{ href: "/solutions/security", label: "Explore security operations" }}
          secondary={{ href: "/contact", label: "Talk to Signal One" }}
        />

        <section className="py-20 md:py-24">
          <div className="grid gap-4 md:grid-cols-2">
            {solutions.map((solution) => (
              <Link
                key={solution.href}
                href={solution.href}
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] shadow-[0_24px_70px_rgba(0,0,0,.22)] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:-translate-y-1 hover:border-[#0EA5E9]/35"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.alt}
                    fill
                    className="object-cover transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.035]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.04),rgba(10,13,18,.76))]" />
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold tracking-[-.03em] text-white transition group-hover:text-[#38BDF8] md:text-3xl">
                    {solution.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/52 md:text-base">{solution.body}</p>
                  <ul className="mt-6 space-y-2">
                    {solution.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-sm text-white/46">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9] shadow-[0_0_10px_rgba(14,165,233,.45)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition duration-300 group-hover:translate-x-1">
                    Explore solution →
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
