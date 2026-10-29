import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroGlobeLayer from "../components/HeroGlobeLayer";
import { photos } from "../lib/photos";

export const metadata: Metadata = {
  title: { absolute: "Signal One | Integrated Systems, 1GUARD and 1Service" },
  description: "Signal One connects security operations, service-business operations and mission-critical communications through technology built for real-world operations.",
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
          <p className="s1-brand-eyebrow">SIGNAL ONE · OPERATIONS, PEOPLE AND CONNECTED EQUIPMENT</p>
          <h1 id="s1-brand-intro">One connected business.<br />More control. Less chaos.</h1>
          <p className="s1-brand-explainer">
            Run security operations with 1GUARD. Discover 1Service for restaurants and service businesses. Equip every team with connected radios, communications and field technology.
          </p>
          <div className="s1-home-conversion-actions" aria-label="Get started with Signal One">
            <Link href="/get-started" className="btn btn-primary btn-lg s1-home-primary-cta">Get 14 day free trial <span aria-hidden="true">→</span></Link>
            <Link href="/contact" className="btn btn-ghost-dark btn-lg s1-home-secondary-cta">Talk to our team</Link>
          </div>
          <p className="s1-home-trial-disclosure">For 1GUARD companies. Trial access is subject to onboarding and activation confirmation.</p>
          <div className="s1-brand-family" aria-label="Signal One platforms">
            <Link href="/solutions/security" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1GUARD security operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>GUARD</span>
              <span className="s1-product-description">Security operations</span>
            </Link>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <Link href="/workforce" className="s1-brand-family-item s1-brand-product-link" aria-label="Discover 1Service for service businesses">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Service</span>
              <span className="s1-product-description">Service business OS · In development</span>
            </Link>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <div className="s1-brand-family-item s1-brand-community" aria-label="1Community, coming soon">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Community</span>
              <span className="s1-product-description">Coming soon</span>
            </div>
          </div>
          <p className="s1-brand-final">Security operations. Service businesses. Equipment. One Signal One.</p>
        </div>
      </section>

      <section className="s1-selling-section reveal-group" aria-labelledby="s1-guard-head">
        <div className="s1-selling-photo reveal">
          <Image src={photos.controlRoomTeam.src} alt={photos.controlRoomTeam.alt} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover"/>
        </div>
        <div className="s1-selling-copy reveal">
          <p className="s1-selling-kicker"><span className="s1-product-one">1</span>GUARD · Security operations</p>
          <h2 id="s1-guard-head">Know what is happening at every site.</h2>
          <p>Replace missing patrol updates and scattered incident logs with a connected security operation: team attendance, patrol evidence, control-room oversight and reports your clients can trust.</p>
          <div className="s1-selling-actions"><Link href="/get-started" className="btn btn-primary btn-lg">Get 14 day free trial</Link><Link href="/solutions/security" className="s1-selling-link">Explore <span className="s1-product-one">1</span>GUARD <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
      <section className="s1-selling-section s1-selling-reverse reveal-group" aria-labelledby="s1-service-head">
        <div className="s1-selling-photo reveal">
          <Image src={photos.teamBriefing.src} alt="Operations team reviewing schedules, field equipment and work assignments" fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover"/>
        </div>
        <div className="s1-selling-copy reveal">
          <p className="s1-selling-kicker"><span className="s1-product-one">1</span>Service · Service-business operating system</p>
          <h2 id="s1-service-head">Run the business, not the paperwork.</h2>
          <p>Built restaurant-first, 1Service is evolving from workforce management into an operating system for teams, shifts, service delivery, stock, customer relationships and business oversight. Platform expansion is in development.</p>
          <Link href="/workforce" className="s1-selling-link">Discover <span className="s1-product-one">1</span>Service <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="s1-selling-bottom reveal-group" aria-label="More Signal One solutions">
        <div className="s1-selling-mini reveal">
          <p className="s1-selling-kicker">Equipment and connectivity</p>
          <h2>Equip every operation.</h2>
          <p>Get business radios, push-to-talk connectivity, tracking and operational equipment with a sales team that understands deployment, not just devices.</p>
          <Link href="/equipment-marketplace" className="s1-selling-link">Request equipment advice <span aria-hidden="true">↗</span></Link>
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
