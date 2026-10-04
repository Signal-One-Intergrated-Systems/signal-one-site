import type { Metadata } from "next";
import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export const metadata: Metadata = {
  title: "Logistics & Fleet Operations",
  description: "Real-time asset visibility, driver communications and connected fleet operations with Signal One.",
};

export default function LogisticsSolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One solutions"
          title="Logistics & Fleet Operations"
          body="Optimise your supply chain with real-time asset visibility and instant driver communication. Reduce downtime, improve route efficiency, and ensure cargo security."
          image="/images/industries/logistics.jpg"
          imageAlt="Logistics and fleet operation"
          primary={{ href: "/contact", label: "Discuss a fleet solution" }}
        />
        <section className="grid gap-5 py-20 md:grid-cols-2 md:py-24">
          {[
            ["Fleet Telematics","Gain deep insights into vehicle performance. Monitor fuel usage, driver behaviour, and engine health remotely via our IoT interface.","/images/fleet.jpg"],
            ["Asset Tracking","Never lose sight of high-value cargo. Our long-life LoRaWAN trackers provide continuous location updates even for unpowered assets like trailers and containers.","/images/products/cattle-tracker.jpg"],
          ].map(([title,body,image])=>(
            <article key={title} className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
              <div className="relative h-64"><Image src={image} alt="" fill className="object-cover" sizes="(min-width:768px) 50vw,100vw" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(10,13,18,.66))]" /></div>
              <div className="p-7"><h2 className="text-3xl font-semibold tracking-[-.035em]">{title}</h2><p className="mt-4 text-sm leading-7 text-white/50">{body}</p></div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
