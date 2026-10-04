import type { Metadata } from "next";
import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export const metadata: Metadata = {
  title: "Critical Connect",
  description: "Signal One Critical Connect for mission-critical Push-to-Talk, dispatch, video, location and emergency communications.",
};

export default function PushToTalkPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One Critical Connect"
          title="Mission-critical Push-to-Talk over cellular."
          body="A carrier-grade Mission Critical Push-to-Talk (MCPTT) platform delivering instant voice, video, and data communication over public cellular networks."
          image="/images/platform/dispatch.jpg"
          imageAlt="Signal One dispatch console"
          primary={{ href: "/contact", label: "Discuss Critical Connect" }}
        />

        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Dispatch & Control Features</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Voice Dispatch", "Instant group calling, private one-to-one calls, and priority interrupt. The platform supports thousands of concurrent talk groups with sub-300ms latency."],
              ["Live Video Streaming", "Pull live video feeds from field devices directly to the dispatch console. Gain immediate eyes-on situational awareness during critical incidents."],
              ["Location Services", "Real-time GPS tracking, geofencing, and location processing history. Visualise your entire workforce on a live map interface."],
              ["Emergency Alarms", "Dedicated SOS handling with automated audio recording and location pinning. Man-down and lone-worker safety protocols are built-in."],
            ].map(([title,body]) => (
              <article key={title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-7">
                <span className="mb-5 block h-1 w-8 rounded-full bg-[#0EA5E9]" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[24px] border border-white/10 bg-white/[.025] p-7 lg:grid-cols-[.72fr_1.28fr] lg:items-center md:p-10">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">LMR Gateway Integration</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em]">Bridge traditional radio and cellular operations.</h2>
            <p className="mt-5 text-sm leading-7 text-white/52">
              Bridge your existing DMR, TETRA, or Analog radio networks into the Signal One Critical Connect platform. Our RoIP gateways ensure seamless communication between traditional radios and cellular devices.
            </p>
          </div>
          <div className="relative min-h-[340px] overflow-hidden rounded-[18px] border border-white/10">
            <Image src="/images/What-we-deliver/communications.jpg" alt="Push-to-talk devices connected to Signal One communications" fill className="object-cover" sizes="(min-width:1024px) 58vw,100vw" />
          </div>
        </section>
      </div>
    </main>
  );
}
