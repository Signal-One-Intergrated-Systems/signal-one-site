import type { Metadata } from "next";
import MarketingHero from "../../components/MarketingHero";

export const metadata: Metadata = {
  title: "Construction, Mining & Infrastructure",
  description: "Signal One construction, mining and infrastructure solutions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ConstructionPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One solutions"
          title="Construction, Mining & Infrastructure"
          body="This page will be expanded with detailed content."
          image="/images/industries/construction.jpg"
          imageAlt="Construction worker using field communications"
          primary={{ href: "/contact", label: "Talk to Signal One" }}
        />
      </div>
    </main>
  );
}
