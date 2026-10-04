import MarketingHero from "../components/MarketingHero";

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Work with Signal One"
          title="Partners"
          body="This page will be expanded with detailed content."
          image="/images/What-we-deliver/communications.jpg"
          imageAlt="Signal One communications equipment"
          primary={{ href: "/contact", label: "Contact Signal One" }}
        />
      </div>
    </main>
  );
}
