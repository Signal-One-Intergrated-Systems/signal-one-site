import Image from "next/image";
import Link from "next/link";
import MarketingHero from "../components/MarketingHero";

const platforms = [
  {
    href: "/platforms/push-to-talk",
    title: "Critical Connect",
    body: "Carrier-grade Mission Critical Push-to-Talk (MCPTT) platform. Instant voice, video, and data dispatch for high-availability operations.",
    image: "/images/platform/dispatch.jpg",
    alt: "Dispatch platform used for operational communications",
  },
  {
    href: "/platforms/aiot-management",
    title: "AIoT Device Management",
    body: "Unified Mobile Device Management (MDM) and sensor fleet provisioning. Secure, track, and update your entire edge ecosystem.",
    image: "/images/products/mdm-platform.jpg",
    alt: "Device management platform for connected operational devices",
  },
] as const;

export default function PlatformsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One platforms"
          title="Operational control, dispatch and device management."
          body="Enterprise-grade operational control, dispatch, and device management platforms."
          image="/images/What-we-deliver/platforms.jpg"
          imageAlt="Connected operational platform displayed across multiple screens"
          primary={{ href: "/platforms/push-to-talk", label: "Explore Critical Connect" }}
          secondary={{ href: "/contact", label: "Discuss your platform needs" }}
        />

        <section className="py-20 md:py-24">
          <div className="grid gap-5 md:grid-cols-2">
            {platforms.map((platform) => (
              <Link
                key={platform.href}
                href={platform.href}
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:-translate-y-1 hover:border-[#0EA5E9]/35"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={platform.image}
                    alt={platform.alt}
                    fill
                    className="object-cover transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.035]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.02),rgba(10,13,18,.70))]" />
                </div>
                <div className="p-7 md:p-8">
                  <h2 className="text-2xl font-semibold tracking-[-.03em] md:text-3xl">{platform.title}</h2>
                  <p className="mt-4 text-base leading-7 text-white/52">{platform.body}</p>
                  <span className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition duration-300 group-hover:translate-x-1">
                    Explore platform →
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
