import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroGlobeLayer from "../components/HeroGlobeLayer";
import { photos } from "../lib/photos";

export const metadata: Metadata = {
  title: { absolute: "Signal One | 1GUARD, 1Service & Enterprise Technology" },
  description: "Run security, service operations and connected equipment with Signal One. Explore 1GUARD, 1Service and enterprise technology. Request a 14-day free trial.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main" className="s1-brand-home">
      <section className="s1-brand-stage" aria-labelledby="s1-brand-intro">
        <div className="s1-brand-stage-media">
          <Image src="/images/signal-one-hero-integrated-daylight.jpg" alt="Two professional South African security officers, a woman and a man, working together at a modern corporate entrance in bright daylight"
            fill priority sizes="100vw"
            quality={90} className="s1-brand-stage-image object-cover" />
          <div className="s1-brand-image-wash" aria-hidden="true" />

        </div>
        <HeroGlobeLayer />
        <div className="s1-brand-copy s1-brand-clay s1-hero-content-glass">
          <p className="s1-brand-eyebrow">Operational software and connected technology</p>
          <h1 id="s1-brand-intro">Run a better operation.<br />Every single day.</h1>
          <p className="s1-brand-explainer">
            Know what is happening across your operation. Protect every security shift with 1GUARD, bring your service business together with 1Service, and equip your teams with enterprise-ready technology.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6 mb-5" aria-label="Start with Signal One">
            <Link href="/get-started" className="btn btn-primary btn-lg">Get 14 Day Free Trial</Link>
            <Link href="/equipment-marketplace" className="btn btn-ghost-dark btn-lg">Explore Enterprise Equipment</Link>
          </div>
          <div className="s1-brand-family" aria-label="Signal One platforms">
            <Link href="/solutions/security" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1GUARD security operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>GUARD</span>
              <span className="s1-product-description">Security operations</span>
            </Link>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <Link href="/service" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1Service business operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Service</span>
              <span className="s1-product-description">Service business operating system</span>
            </Link>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <div className="s1-brand-family-item s1-brand-community" aria-label="1Community, coming soon">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Community</span>
              <span className="s1-product-description">Coming soon</span>
            </div>
          </div>
          <p className="s1-brand-final">Security operations. Service businesses. Enterprise technology.</p>
        </div>
      </section>

      <section className="s1-selling-section reveal-group" aria-labelledby="s1-guard-head">
        <div className="s1-selling-photo reveal">
          <Image src={photos.guardPatrol.src} alt={photos.guardPatrol.alt} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover"/>
        </div>
        <div className="s1-selling-copy reveal">
          <p className="s1-selling-kicker"><span className="s1-product-one">1</span>GUARD · Security operations</p>
          <h2 id="s1-guard-head">Run every site with confidence.</h2>
          <p>Bring attendance, patrols, incidents, control-room oversight and client proof of service into one clear operation.</p>
          <Link href="/solutions/security" className="s1-selling-link">Explore <span className="s1-product-one">1</span>GUARD <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="s1-selling-section s1-selling-reverse reveal-group" aria-labelledby="s1-service-head">
        <div className="s1-selling-photo reveal">
          <Image src={photos.teamBriefing.src} alt="Illustrative team briefing at a South African security site; not a 1Service software screenshot" fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover"/>
        </div>
        <div className="s1-selling-copy reveal">
          <p className="s1-selling-kicker"><span className="s1-product-one">1</span>Service · Business operations</p>
          <h2 id="s1-workforce-head">Bring your service business together.</h2>
          <p>Start by bringing attendance, shifts, teams and job records into one operational view. Explore the broader 1Service vision and confirm available workflows with our team.</p>
          <Link href="/service" className="s1-selling-link">Explore <span className="s1-product-one">1</span>Service <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="s1-selling-bottom reveal-group" aria-label="More Signal One solutions">
        <div className="s1-selling-mini reveal">
          <p className="s1-selling-kicker">Equipment and connectivity</p>
          <h2>Equip every operation.</h2>
          <p>Explore radios, PTT, tracking and equipment buying or rental enquiries.</p>
          <Link href="/equipment-marketplace" className="s1-selling-link">Explore enterprise equipment <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="s1-selling-mini reveal">
          <p className="s1-selling-kicker"><span className="s1-product-one">1</span>Community · <span className="s1-upcoming-tag">Coming soon</span></p>
          <h2>More connected possibilities ahead.</h2>
          <p><span className="s1-product-one">1</span>Community is not available yet. More details will be announced when confirmed.</p>
        </div>
      </section>
    </main>
  );
}
