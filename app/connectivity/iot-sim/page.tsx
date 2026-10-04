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
          body="One SIM, global coverage. Our multi-IMSI IoT SIMs provide redundant, carrier-agnostic connectivity across 180+ countries and 600+ networks."
          image="/images/What-we-deliver/connectivity.jpg"
          imageAlt="Global cellular connectivity infrastructure"
          primary={{ href: "/contact", label: "Discuss connectivity" }}
        />

        <section className="grid gap-8 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center md:py-24">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Why Signal One Connectivity?</p>
            <div className="mt-6 space-y-4">
              {[
                ["Unsteered Roaming", "Our SIMs automatically connect to the strongest available signal, regardless of the network operator. No steering ensures maximum uptime for mission-critical devices."],
                ["Single Management Plane", "Manage your entire global fleet from one dashboard. Activate, suspend, and monitor usage in real-time via our Connectivity Management Platform (CMP)."],
                ["Secure Private APN", "Data is routed securely via private APN tunnels directly to your infrastructure or cloud, bypassing the public internet for enhanced security."],
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
                  ["Form Factors", "2FF (Mini), 3FF (Micro), 4FF (Nano), MFF2 (eSIM)"],
                  ["Network Support", "2G, 3G, 4G, 5G, LTE-M, NB-IoT"],
                  ["Temperature Range", "Industrial Grade (-40°C to +105°C) available"],
                  ["Coverage", "Global (180+ Countries)"],
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
