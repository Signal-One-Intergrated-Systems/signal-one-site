import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MarketingHero from "../components/MarketingHero";

export const metadata: Metadata = {
  title: "Connectivity",
  description: "Redundant cellular and IoT connectivity solutions from Signal One for reliable operational data transmission.",
};

export default function ConnectivityPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One connectivity"
          title="Connectivity designed for operational continuity."
          body="Global, redundant cellular and IoT connectivity solutions for reliable data transmission."
          image="/images/What-we-deliver/connectivity.jpg"
          imageAlt="Connected cellular infrastructure representing Signal One connectivity"
          primary={{ href: "/connectivity/iot-sim", label: "Explore IoT connectivity" }}
          secondary={{ href: "/contact", label: "Discuss coverage requirements" }}
        />

        <section className="py-20 md:py-24">
          <Link
            href="/connectivity/iot-sim"
            className="group grid overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-500 [transition-timing-function:var(--s1-ease)] hover:border-[#0EA5E9]/35 lg:grid-cols-[1.05fr_.95fr]"
          >
            <div className="relative min-h-[340px] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,.12),transparent_55%)]">
              <Image
                src="/images/products/sim-card.jpg"
                alt="Signal One global IoT SIM"
                fill
                className="object-contain p-10 transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 p-7 lg:border-l lg:border-t-0 md:p-10">
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Global IoT SIM</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">One SIM. Multi-network resilience.</h2>
              <p className="mt-5 text-base leading-7 text-white/52">
                Multi-network IoT connectivity for supported deployments that need broader cellular reach and less dependence on a single operator.
              </p>
              <span className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition duration-300 group-hover:translate-x-1">
                View connectivity plans →
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
