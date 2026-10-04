import type { Metadata } from "next";
import MarketingHero from "../components/MarketingHero";
import MarketplaceStore from "../components/MarketplaceStore";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse Signal One radios, connectivity subscriptions, sensors and operational technology. Buy, rent or request a quote.",
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One Marketplace"
          title="Equip the operation."
          body="Buy or rent Signal One radios, choose connectivity subscriptions, and source the sensors and platform services your operation needs."
          image="/images/What-we-deliver/communications.jpg"
          imageAlt="Signal One radios and connected operational devices"
          primary={{ href: "#catalogue", label: "Browse catalogue" }}
          secondary={{ href: "/contact", label: "Request a quote" }}
          meta={
            <div className="flex flex-wrap gap-2">
              {["Buy", "Rent", "Subscribe"].map((label) => (
                <span key={label} className="rounded-[10px] border border-white/10 bg-white/[.04] px-4 py-2 text-xs font-semibold text-white/68">
                  {label}
                </span>
              ))}
              <span className="ml-0 text-xs leading-9 text-white/36 md:ml-3">
                Where a published numeric price is not available, Signal One confirms pricing before the order is accepted.
              </span>
            </div>
          }
        />

        <section id="catalogue" className="scroll-mt-28 py-14 md:py-16">
          <MarketplaceStore />
        </section>
      </div>
    </main>
  );
}
