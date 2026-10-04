import type { Metadata } from "next";
import MarketingHero from "../../components/MarketingHero";

export const metadata: Metadata = {
  title: "Public Safety & Municipal Services",
  description: "Signal One public safety and municipal services solutions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PublicSafetyPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One solutions"
          title="Public Safety & Municipal Services"
          body="This page will be expanded with detailed content."
          image="/images/industries/public-safety.jpg"
          imageAlt="Public safety operations centre"
          primary={{ href: "/contact", label: "Talk to Signal One" }}
        />
      </div>
    </main>
  );
}
