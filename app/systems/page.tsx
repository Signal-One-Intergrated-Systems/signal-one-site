import Image from "next/image";
import MarketingHero from "../components/MarketingHero";

const layers = [
  {
    title: "Edge Layer",
    body: "Industrial sensors and communications devices (LoRaWAN / PoC) collect data and voice inputs at the operational fringe.",
    image: "/images/systems-overview/field-devices.jpg",
  },
  {
    title: "Transport Layer",
    body: "Redundant connectivity via multi-network Cellular and LoRaWAN gateways ensures inputs reach the core, even in challenging RF environments.",
    image: "/images/systems-overview/secure-connectivity.jpg",
  },
  {
    title: "Application Layer",
    body: "Centralised dispatch and visualization platforms process inputs into actionable intelligence for command centres.",
    image: "/images/systems-overview/platforms-control.jpg",
  },
] as const;

export default function SystemsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Integrated systems"
          title="Hardware, connectivity and software as one operational system."
          body="End-to-end operational ecosystems combining best-in-class hardware, redundant connectivity, and unified software platforms. Designed for mission-critical reliability."
          image="/images/systems-overview-bg.jpg"
          imageAlt="Connected digital infrastructure representing an integrated Signal One system"
          primary={{ href: "/contact", label: "Discuss a system design" }}
        />

        <section className="py-20 md:py-24">
          <div className="max-w-4xl">
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">System architecture</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-5xl">Three layers designed for continuity.</h2>
            <p className="mt-5 text-base leading-7 text-white/54">
              Signal One systems are built on a three-tier architecture designed to ensure data integrity and communications continuity:
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {layers.map((layer, index) => (
              <article key={layer.title} className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
                <div className="relative h-52 overflow-hidden">
                  <Image src={layer.image} alt="" fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes="(min-width:1024px) 33vw,100vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(10,13,18,.72))]" />
                  <span className="s1-mono absolute bottom-4 left-5 text-[9px] text-white/48">0{index+1}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{layer.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/48">{layer.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 py-20 md:py-24">
          <h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Operational Capabilities</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Unified Dispatch", "Manage voice, video, and data across your entire workforce from a single pane of glass. Push-to-Talk bridging allows disparate radio networks to communicate seamlessly."],
              ["Real-Time Telemetry", "Ingest millions of data points from environmental sensors and asset trackers. Set threshold alerts to trigger automated workflows or dispatch notifications."],
              ["Fleet Visibility", "Track vehicles and personnel in real-time with high-precision GPS. Replay historical routes and analyse efficiency metrics to optimise logistics."],
            ].map(([title,body]) => (
              <div key={title} className="rounded-[18px] border border-white/10 bg-white/[.025] p-7">
                <span className="mb-5 block h-1 w-8 rounded-full bg-[#0EA5E9]" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/48">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Integration & interoperability</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">Built to connect into the operating environment.</h2>
              <p className="mt-5 text-base leading-7 text-white/54">
                We believe in open standards. Our systems expose secure RESTful APIs and MQTT endpoints, allowing simple integration with existing ERP, SCADA, and building management systems.
              </p>
            </div>
            <div className="relative min-h-[360px] overflow-hidden rounded-[18px] border border-white/10">
              <Image src="/images/systems-overview/operational-oversight.jpg" alt="Operational oversight interface representing integrated systems" fill className="object-cover" sizes="(min-width:1024px) 58vw,100vw" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
