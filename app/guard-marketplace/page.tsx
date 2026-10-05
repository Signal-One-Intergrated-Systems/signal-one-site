import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guard Marketplace",
  description: "Signal One Guard Marketplace for client security companies hiring guards for won contracts.",
  robots: { index: false, follow: true },
};

export default function GuardMarketplaceStagePage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-[1280px]">
        <p className="s1-eyebrow">Guard Marketplace</p>
        <h1 className="s1-h1 mt-5 max-w-3xl font-semibold">Hire guards after you win the contract.</h1>
        <p className="s1-body mt-5 max-w-2xl">
          Guard profiles are not public. Security companies can browse available guards only after becoming Signal One clients. Client views can include location, grade, experience, availability, skills, rating and profile photo.
        </p>
        <div className="mt-8 rounded-[16px] border border-white/10 bg-white/[.04] p-5 text-sm leading-7 text-white/58">
          Stage preview: the full gated Guard Marketplace and request-to-hire flow will be built in the Marketplace stage. A guard receives the request in the Guard app and accepts it there.
        </div>
        <Link href="/get-started" className="s1-primary-action mt-7 px-5 py-3 text-sm font-semibold">Get started</Link>
      </div>
    </main>
  );
}
