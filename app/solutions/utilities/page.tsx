import type { Metadata } from "next";
import MarketingHero from "../../components/MarketingHero";

export const metadata: Metadata = {
  title: "Utilities & Smart Metering",
  description: "Connected metering and infrastructure monitoring for electricity and water operations with Signal One.",
};

export default function UtilitiesSolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One solutions"
          title="Utilities & Smart Metering"
          body="Modernise grid and water infrastructure with automated metering infrastructure (AMI). Reduce non-revenue water, balance grid loads, and lower operational costs."
          image="/images/industries/utilities.jpg"
          imageAlt="Utility infrastructure supported by connected monitoring"
          primary={{ href: "/contact", label: "Discuss a utilities solution" }}
        />
        <section className="py-20 md:py-24">
          <h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Smart Metering capabilities</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Automated Reads","Eliminate manual meter reads. Collect hourly consumption data remotely via LoRaWAN."],
              ["Leak Detection","Identify continuous flow and pressure drops instantly to prevent water loss and damage."],
              ["Load Profiling","Analyse peak usage patterns to optimise grid distribution and prevent outages."],
            ].map(([title,body])=>(
              <article key={title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-7">
                <span className="mb-5 block h-1 w-8 rounded-full bg-[#0EA5E9]" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
