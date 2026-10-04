import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export default function AgricultureSolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One solutions"
          title="Agriculture & Rural Operations"
          body="Bring digital intelligence to the paddock. Monitor soil moisture, track livestock, and automate irrigation systems across vast rural properties using long-range telemetry."
          image="/images/industries/agriculture.jpg"
          imageAlt="Agricultural operation supported by connected technology"
          primary={{ href: "/contact", label: "Discuss an agriculture solution" }}
        />
        <section className="grid gap-8 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center md:py-24">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Livestock Management</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">Know exactly where your herd is.</h2>
            <p className="mt-5 text-base leading-7 text-white/52">
              Our smart collars monitor location and behaviour, alerting you to stray animals, theft, or health issues immediately.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/48">
              {["Virtual Fencing capabilities","Heat detection & health monitoring","Pasture utilisation analysis"].map(item=>(
                <li key={item} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9]" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[400px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
            <Image src="/images/products/cattle-tracker.jpg" alt="Connected cattle tracking device" fill className="object-contain p-8" sizes="(min-width:1024px) 58vw,100vw" />
          </div>
        </section>
      </div>
    </main>
  );
}
