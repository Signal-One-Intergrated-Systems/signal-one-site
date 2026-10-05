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
          body="A managed Push-to-Talk over Cellular platform for distributed operational teams, combining voice communication with dispatch, location and emergency workflows."
          image="/images/platform/dispatch.jpg"
          imageAlt="Signal One dispatch console"
          primary={{ href: "/contact", label: "Discuss Critical Connect" }}
        />

        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Dispatch & Control Features</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Voice Dispatch", "Group and private voice workflows for distributed operational teams through the Critical Connect dispatch environment."],
              ["Video Workflows", "Supported field devices can be evaluated for video-enabled operational workflows where the deployment requires them."],
              ["Location Services", "Location-aware operational workflows can support dispatch and field-team visibility where enabled for the deployment."],
              ["Emergency Workflows", "SOS and emergency communication workflows can be configured around the field devices and operating model selected."],
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
              RoIP gateway integration can be evaluated where an operation needs to connect existing radio infrastructure with cellular push-to-talk workflows. The exact supported network types and integration scope should be confirmed during solution design.
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
