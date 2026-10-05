import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Radios & Equipment",
  description: "Signal One radio rental, tracking and field equipment for security companies.",
  robots: { index: false, follow: true },
};

export default function RadiosEquipmentStagePage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-[1280px]">
        <p className="s1-eyebrow">Radios & Equipment</p>
        <h1 className="s1-h1 mt-5 max-w-3xl font-semibold">Rent the field equipment the contract needs.</h1>
        <p className="s1-body mt-5 max-w-2xl">
          Signal One's current radio direction includes PNC360S, P30/P30 Pro and E600 PoC radios. Radio rental is by quote only, with 12, 24 or 36 month rental periods. Tracking equipment will remain generic until the approved public range is finalised.
        </p>
        <div className="mt-8 rounded-[16px] border border-white/10 bg-white/[.04] p-5 text-sm leading-7 text-white/58">
          Stage preview: product imagery, approved specifications and the rental quote form will be completed in the Radios & Equipment stage.
        </div>
        <Link href="/contact" className="s1-primary-action mt-7 px-5 py-3 text-sm font-semibold">Talk to Signal One</Link>
      </div>
    </main>
  );
}
