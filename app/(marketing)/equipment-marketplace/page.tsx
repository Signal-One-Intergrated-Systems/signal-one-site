import type { Metadata } from "next";
import Link from "next/link";
import { HardwareShowcase } from "../../components/Hardware";
import { catalogue } from "../../lib/catalogue";
import { ButtonLink, Kicker } from "../../components/ui";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
 title: "Security Equipment Marketplace | Buy or Rent",
 description: "Browse security equipment categories for purchase or rental enquiries: PTT radios, body cameras, vehicle tracking and related field technology. Quotes subject to availability.",
 alternates: { canonical: "/equipment-marketplace" },
});
const categories = [
 ["PTT radios and communications", "PoC and radio systems for deployed teams.", "/radios-equipment?category=radio#quote"],
 ["Body cameras", "Recording hardware for field operations.", "/radios-equipment?category=bodycam#quote"],
 ["Vehicle and asset tracking", "Tracking devices and managed connectivity.", "/radios-equipment?category=tracking#quote"],
 ["Security technology", "Discuss CCTV and supporting infrastructure for your project.", "/contact"],
] as const;
export default function EquipmentMarketplacePage() {
 return <main id="main" className="s1-scene-page s1-scene-page--equipment">
 <section className="surface-deep section s1-equipment-hero mat-silver"><div className="wrap grid items-center gap-10 lg:grid-cols-2"><div>
 <Kicker tone="dark">Signal One · Equipment</Kicker>
 <h1 className="t-hero mt-5">The right equipment. Ready for the field.</h1>
 <p className="t-lead measure mt-5 text-ink-2">Explore professional radios, PTT communications, tracking and security technology. Tell us what your operation needs and request purchase or rental pricing.</p>
 <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/radios-equipment#quote" size="lg">Request equipment pricing</ButtonLink><ButtonLink href="#categories" variant="ghost-dark" size="lg">Browse categories</ButtonLink></div>
 <p className="t-caption mt-6 text-ink-3">Online checkout and live stock confirmation are not yet available. Purchases and rentals are arranged by written quotation.</p>
 </div><HardwareShowcase products={catalogue[0].products.slice(0, 2)} /></div></section>
 <section id="categories" className="surface-light section scroll-mt-[72px] mat-day"><div className="wrap">
 <div className="flex flex-wrap justify-between items-end gap-5"><div><Kicker>Equipment</Kicker><h2 className="t-h2 mt-4">Select what the operation requires.</h2></div><Link href="/radios-equipment" className="link-arrow text-accent">See available equipment and request a quote →</Link></div>
 <div className="mt-10 grid gap-4 md:grid-cols-2">{categories.map(([name,detail,href])=><article key={name} className="card p-7"><h3 className="t-h3">{name}</h3><p className="t-body mt-3 text-ink-2">{detail}</p><Link className="link-arrow mt-4" href={href}>{href === "/contact" ? "Talk to Signal One" : "Request a quote"} <span aria-hidden="true">→</span></Link></article>)}</div>
 </div></section>
 {/* Buy or rent, from published catalogue facts only (lib/catalogue.ts, /ptt-radio-rental). Nothing about
     deposits, damage, delivery or prices is stated: those are not established and belong in the quote (DR-016). */}
 <section className="surface-white section mat-close"><div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
 <div><h2 className="t-h2">Buying or renting?</h2><p className="t-body mt-4 text-ink-2">Both are quoted in writing. Ask for both in one quote if you want to compare them.</p></div>
 <div className="grid gap-4 md:grid-cols-2">
 <article className="card p-6 sm:p-7"><h3 className="t-h3">Buy</h3><ul className="t-small mt-4 grid list-none gap-3 p-0 text-ink-2">
 <li>Radios are sold outright, by quotation.</li>
 <li>Ask about push-to-talk service, SIM and data for the radios you buy.</li>
 <li>Trackers: the device, installation and tracking platform are confirmed per deployment.</li></ul></article>
 <article className="card p-6 sm:p-7"><h3 className="t-h3">Rent</h3><ul className="t-small mt-4 grid list-none gap-3 p-0 text-ink-2">
 <li>Radio rental terms: 12, 24 or 36 months.</li>
 <li>With SIM, data and the PTT platform, radios only if you have SIMs, or the platform and SIMs for radios you already own.</li>
 <li>The SC780 body camera is available to rent, quoted per deployment.</li></ul></article>
 <div className="md:col-span-2"><p className="t-small text-ink-2">Your quote confirms the devices, connectivity, availability and the full price. Ask about delivery, deposit, damage and loss, and the end of the term when you request it.</p>
 <div className="mt-6 flex flex-wrap gap-3"><ButtonLink href="/radios-equipment#quote" size="lg">Request a written quotation</ButtonLink><ButtonLink href="/ptt-radio-rental" variant="ghost-dark" size="lg">How radio rental works</ButtonLink></div></div>
 </div></div></section>
 </main>;
}
