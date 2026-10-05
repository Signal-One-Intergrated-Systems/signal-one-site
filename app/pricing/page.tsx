import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guard-Day Pricing",
  description: "Signal One Guard platform access is R2 per guard per day, excluding VAT.",
  robots: { index: false, follow: true },
};

export default function PricingStagePage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-[1280px]">
        <p className="s1-eyebrow">Guard-day pricing</p>
        <h1 className="s1-h1 mt-5 max-w-3xl font-semibold">R2 per guard per day.</h1>
        <p className="s1-body mt-5 max-w-2xl">
          Pricing is excluding VAT. Buying guard days gives the security company access to the Guard platform. Guard days carry over, and the minimum purchase is 10 guard days.
        </p>
        <div className="mt-8 rounded-[16px] border border-white/10 bg-white/[.04] p-5 text-sm leading-7 text-white/58">
          Stage preview: the interactive guard-days calculator will be built in the calculator stage. No packages, tiers or volume discounts will be introduced.
        </div>
        <Link href="/get-started" className="s1-primary-action mt-7 px-5 py-3 text-sm font-semibold">Get started</Link>
      </div>
    </main>
  );
}
