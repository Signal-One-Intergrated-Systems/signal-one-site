import type { Metadata } from "next";
import MarketplaceStore from "../components/MarketplaceStore";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse Signal One radios, connectivity subscriptions, sensors and operational technology. Buy, rent or request a quote.",
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080d13] px-5 pb-24 pt-36 text-white md:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_72%_14%,rgba(56,189,248,.15),transparent_28%),radial-gradient(circle_at_18%_34%,rgba(99,102,241,.09),transparent_25%)]" />
      <div className="relative mx-auto max-w-[92rem]">
        <section className="grid gap-10 border-b border-white/9 pb-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#7dd3fc]">Signal One Marketplace</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[.96] tracking-[-.045em] md:text-7xl">
              Equip the operation.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/54 md:text-lg">
              Buy or rent Signal One radios, choose connectivity subscriptions, and source the sensors and platform services your operation needs.
            </p>
          </div>
          <div className="rounded-3xl border border-white/9 bg-white/[.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-white/34">Commercial options</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              {["Buy", "Rent", "Subscribe"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-black/15 px-3 py-4 font-semibold text-white/72">
                  {label}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-white/34">
              Where a published numeric price is not available, Signal One confirms pricing before the order is accepted.
            </p>
          </div>
        </section>

        <section className="py-10">
          <MarketplaceStore />
        </section>
      </div>
    </main>
  );
}
