import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroGlobeLayer from "../components/HeroGlobeLayer";
import { photos } from "../lib/photos";

export const metadata: Metadata = {
  title: { absolute: "Signal One | Integrated Systems, 1GUARD and 1Workforce" },
  description: "Signal One connects security operations, field workforce management and mission-critical communications through technology built for real-world operations.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main" className="s1-brand-home">
      <section className="s1-brand-stage" aria-labelledby="s1-brand-intro">
        <div className="s1-brand-stage-media">
          <Image src="/images/signal-one-hero-integrated-daylight.jpg" alt="Two professional South African security officers, a woman and a man, working together at a modern corporate entrance in bright daylight"
            fill priority sizes="100vw"
            quality={85} className="s1-brand-stage-image object-cover" />
          <div className="s1-brand-image-wash" aria-hidden="true" />

        </div>
        <HeroGlobeLayer />
        <div className="s1-brand-copy s1-brand-clay s1-hero-content-glass">
          <p className="s1-brand-eyebrow">Technology for real-world operations</p>
          <h1 id="s1-brand-intro">Control the work.<br />See the results.</h1>
          <p className="s1-brand-explainer">
            Manage guards, patrols and incidents with 1GUARD. Keep teams, attendance and field work organised with 1Workforce. Equip your operation with connected communications and technology from Signal One.
          </p>
          <div className="s1-brand-family" aria-label="Signal One platforms">
            <Link href="/solutions/security" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1GUARD security operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>GUARD</span>
              <span className="s1-product-description">Security operations</span>
            </Link>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <Link href="/workforce" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1Workforce operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Workforce</span>
              <span className="s1-product-description">Workforce operations</span>
            </Link>
          </div>
          <p className="s1-brand-final">Security. Workforce. Equipment. Connected.</p>
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
      <section className="s1-selling-section s1-selling-reverse reveal-group" aria-labelledby="s1-workforce-head">
        <div className="s1-selling-photo reveal">
          <Image src={photos.warehouse.src} alt={photos.warehouse.alt} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover"/>
        </div>
        <div className="s1-selling-copy reveal">
          <p className="s1-selling-kicker"><span className="s1-product-one">1</span>Workforce · Attendance and field teams</p>
          <h2 id="s1-workforce-head">Know who worked. Where. And when.</h2>
          <p>Bring your people, shifts, timesheets and job cards together. Turn workforce activity into records you can review and act on.</p>
          <Link href="/workforce" className="s1-selling-link">Explore <span className="s1-product-one">1</span>Workforce <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="s1-selling-bottom reveal-group" aria-label="More Signal One solutions">
        <div className="s1-selling-mini reveal">
          <p className="s1-selling-kicker">Equipment and connectivity</p>
          <h2>Equip every operation.</h2>
          <p>Explore radios, PTT, tracking and equipment buying or rental enquiries.</p>
          <Link href="/equipment-marketplace" className="s1-selling-link">Explore equipment <span aria-hidden="true">↗</span></Link>
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
