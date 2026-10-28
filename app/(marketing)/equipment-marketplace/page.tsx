import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { photos } from "../../lib/photos";
import { ButtonLink, Kicker } from "../../components/ui";

export const metadata: Metadata = {
 title: "Security Equipment Marketplace | Buy or Rent | Signal One",
 description: "Browse security equipment categories for purchase or rental enquiries: PTT radios, body cameras, vehicle tracking and related field technology. Quotes subject to availability.",
 alternates: { canonical: "/equipment-marketplace" },
};
const categories = [
 ["PTT radios and communications", "PoC and radio systems for deployed teams."],
 ["Body cameras", "Recording hardware for field operations."],
 ["Vehicle and asset tracking", "Tracking devices and managed connectivity."],
 ["Security technology", "Discuss CCTV and supporting infrastructure for your project."],
] as const;
export default function EquipmentMarketplacePage() {
 return <main id="main">
 <section className="surface-deep section s1-equipment-hero"><div className="wrap grid items-center gap-10 lg:grid-cols-2"><div>
 <Kicker tone="dark">1GUARD · Equipment marketplace</Kicker>
 <h1 className="t-h1 mt-5">The right equipment. Ready for the field.</h1>
 <p className="t-lead measure mt-5 text-text-inv-2">Explore professional radios, PTT communications, tracking and security technology. Tell us what your operation needs and request purchase or rental pricing.</p>
 <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/radios-equipment#quote" size="lg">Request equipment pricing</ButtonLink><ButtonLink href="#categories" variant="ghost-dark" size="lg">Browse categories</ButtonLink></div>
 <p className="t-caption mt-6 text-text-inv-3">Online checkout and live stock confirmation are not yet available. Purchases and rentals are arranged by written quotation.</p>
 </div><div className="s1-equipment-photo"><Image src={photos.siteOperations.src} alt={photos.siteOperations.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div></div></section>
 <section id="categories" className="surface-light section scroll-mt-[72px]"><div className="wrap">
 <div className="flex flex-wrap justify-between items-end gap-5"><div><Kicker>Equipment</Kicker><h2 className="t-h2 mt-4">Select what the operation requires.</h2></div><Link href="/radios-equipment" className="link-arrow text-signal-ink">See available equipment and request a quote →</Link></div>
 <div className="mt-10 grid gap-4 md:grid-cols-2">{categories.map(([name,detail])=><article key={name} className="card p-7"><h3 className="t-h3">{name}</h3><p className="t-body mt-3 text-text-2">{detail}</p><Link className="btn btn-ghost-light mt-6" href="/radios-equipment#quote">Enquire about availability →</Link></article>)}</div>
 </div></section>
 <section className="surface-white section"><div className="wrap"><h2 className="t-h2">Buying or renting?</h2><p className="t-body measure mt-4 text-text-2">Tell us the deployment location, quantity, intended term and equipment type. A representative will confirm sale or rental options, availability and contractual requirements.</p><div className="mt-7"><ButtonLink href="/radios-equipment#quote">Request a written quotation</ButtonLink></div></div></section>
 </main>;
}
