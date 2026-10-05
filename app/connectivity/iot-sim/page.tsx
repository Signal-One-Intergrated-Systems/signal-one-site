import type { Metadata } from "next";
import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export const metadata: Metadata = {
  title: "Global IoT Connectivity",
  description: "Signal One multi-network IoT connectivity for resilient global device operations.",
};

export default function IoTSIMPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One connectivity"
          title="Global IoT Connectivity"
          body="Multi-network IoT connectivity for supported deployments that need resilient cellular access across regions and network environments."
          image="/images/What-we-deliver/connectivity.jpg"
          imageAlt="Global cellular connectivity infrastructure"
          primary={{ href: "/contact", label: "Discuss connectivity" }}
        />

        <section className="grid gap-8 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center md:py-24">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Why Signal One Connectivity?</p>
            <div className="mt-6 space-y-4">
              {[
                ["Multi-network connectivity", "Use supported multi-network connectivity options to reduce dependence on a single operator where the deployment requires broader cellular reach."],
                ["Connectivity management", "Manage supported SIM and connectivity services through the relevant connectivity-management environment for the deployment."],
                ["Private connectivity options", "Private APN or other managed connectivity requirements can be scoped where the selected provider and deployment support them."],
              ].map(([title,body]) => (
                <div key={title} className="rounded-[16px] border border-white/10 bg-white/[.025] p-6">
                  <h3 className="text-xl font-semibold text-[#38BDF8]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/50">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[430px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
            <Image src="/images/products/esim-platform.jpg" alt="Signal One connectivity management platform" fill className="object-contain p-8" sizes="(min-width:1024px) 55vw,100vw" />
          </div>
        </section>

        <section className="border-t border-white/10 py-16">
          <h2 className="text-2xl font-semibold tracking-[-.025em]">Technical Specifications</h2>
          <div className="mt-8 overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {[
                  ["Form factors", "Physical SIM and eSIM options subject to the selected connectivity service."],
                  ["Network technologies", "Supported technologies depend on the selected SIM profile, provider and target network."],
                  ["Coverage", "Coverage is confirmed against the countries, operators and device requirements in the deployment."],
                  ["Private connectivity", "Private APN and related managed-network options are scoped where available."],
                ].map(([label,value]) => (
                  <tr key={label} className="border-b border-white/10 last:border-b-0">
                    <td className="w-1/3 px-5 py-5 font-semibold text-white/82">{label}</td>
                    <td className="px-5 py-5 text-white/48">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
