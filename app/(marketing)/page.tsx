import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroGlobeLayer from "../components/HeroGlobeLayer";
import { photos } from "../lib/photos";
import { guardDayPricePhrase } from "../lib/pricing";
import heroPhoto from "../../public/images/home/signal-one-hero-daylight.jpg";
import servicePhoto from "../../public/images/home/service-restaurant-operations.jpg";
import pnc360s from "../../public/images/hardware/hytera-pnc360s.webp";
import fmb920 from "../../public/images/hardware/teltonika-fmb920.webp";
import "../home-conversion.css";

export const metadata: Metadata = {
  title: { absolute: "Signal One | 1GUARD, 1Service & Business Equipment" },
  description:
    "Make every operation easier to run. Explore 1GUARD security operations, the emerging 1Service restaurant and service-business platform, and professional radios, tracking and connectivity from Signal One.",
  alternates: { canonical: "/" },
};

function Arrow() {
  return <span aria-hidden="true" className="so-arrow">↗</span>;
}

function TrialLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/get-started" data-analytics-event="homepage_trial_cta"
      data-analytics-label="homepage-14-day-trial" className={"btn btn-primary so-home-cta " + className}>
      Get 14 Day Free Trial <Arrow />
    </Link>
  );
}

export default function Home() {
  return (
    <main id="main" className="s1-brand-home so-home">
      <section className="s1-brand-stage so-hero" aria-labelledby="so-hero-title">
        <div className="so-hero-media">
          <Image src={heroPhoto} alt="Illustrative daylight scene of two security professionals coordinating at a modern corporate entrance"
            fill priority quality={90} sizes="100vw" className="so-hero-photo object-cover" />
          <div className="so-hero-wash" aria-hidden="true" />
        </div>
        {/* Preserve the existing Signal One glass globe, its rendering and animation. */}
        <HeroGlobeLayer />
        <div className="wrap so-hero-inner">
          <div className="so-hero-copy">
            <p className="so-eyebrow"><span className="so-signal-dot" /> Signal One · Integrated Systems</p>
            <h1 id="so-hero-title">Every operation.<br /><span>In your control.</span></h1>
            <p className="so-hero-lead">
              From security sites and patrols to restaurant teams and field technology:
              bring the people, the work and the decisions that matter into focus.
            </p>
            <div className="so-hero-actions">
              <TrialLink />
              <Link href="#solutions" className="btn so-home-outline">Explore the solutions <Arrow /></Link>
            </div>
            <p className="so-hero-note">14-day trial by request for eligible 1GUARD companies. Activation and terms are confirmed before access.</p>
          </div>
        </div>
        <div className="so-hero-bar" aria-label="Signal One business areas">
          <Link href="/solutions/security" className="so-hero-bar-item" aria-label="Explore 1GUARD security operations"><strong><span className="so-brand-one">1</span>GUARD</strong><span>Security operations</span></Link>
          <Link href="/service" className="so-hero-bar-item" aria-label="Explore 1Service business operating system"><strong><span className="so-brand-one">1</span>Service</strong><span>Restaurant-first OS · In development</span></Link>
          <Link href="/equipment-marketplace" className="so-hero-bar-item" aria-label="Explore enterprise equipment"><strong>Equipment</strong><span>Professional devices & connectivity</span></Link>
          <a href="#community" className="so-hero-bar-item" aria-label="Learn about 1Community coming soon"><strong><span className="so-brand-one">1</span>Community</strong><span>Coming soon</span></a>
        </div>
        <span className="so-hero-photo-note">Illustrative scene</span>
      </section>

      <section id="solutions" className="so-chapter so-introduction" aria-labelledby="so-solutions-title">
        <div className="wrap">
          <div className="so-section-heading">
            <div><p className="so-kicker">Built around how you operate</p>
              <h2 id="so-solutions-title">Different businesses.<br /><span>One standard of control.</span></h2>
            </div>
            <p>You're not buying another dashboard. You're choosing a clearer way to run the day, handle exceptions and make better decisions.</p>
          </div>
          <div className="so-value-rail" aria-label="What matters to your business">
            <div><span>01</span><strong>Know what is happening</strong><p>Visibility across people, sites and work.</p></div>
            <div><span>02</span><strong>Act before it becomes a problem</strong><p>Find exceptions and give the right person ownership.</p></div>
            <div><span>03</span><strong>Show what was delivered</strong><p>Records that support oversight and client conversations.</p></div>
          </div>
        </div>
      </section>

      <section id="guard" className="so-vertical so-guard-section" aria-labelledby="so-guard-title">
        <div className="wrap so-vertical-layout">
          <div className="so-vertical-visual">
            <Image src={photos.controlRoomTeam.src} alt={photos.controlRoomTeam.alt}
              fill sizes="(min-width:1024px) 49vw, 100vw" className="object-cover" />
            <div className="so-image-caption">Illustrative security operation</div>
          </div>
          <div className="so-vertical-content">
            <div className="so-vertical-label"><span className="so-brand-one">1</span>GUARD <span>SECURITY OPERATIONS</span></div>
            <h2 id="so-guard-title">Your sites cannot run on unanswered messages.</h2>
            <p>Give owners, supervisors, guards and clients a clearer operational record. From the first shift to the proof your customer asks for.</p>
            <ul className="so-checklist">
              <li><strong>Staffed or short?</strong><span>See shifts, attendance and post coverage.</span></li>
              <li><strong>Patrol done or missed?</strong><span>Use QR/NFC checkpoints and recorded exceptions.</span></li>
              <li><strong>What needs action?</strong><span>Incidents, SOS and oversight in the control room.</span></li>
            </ul>
            <div className="so-inline-actions">
              <TrialLink />
              <Link href="/solutions/security" className="so-text-link">Explore 1GUARD <Arrow /></Link>
            </div>
            <p className="so-disclosure">Current public pricing: {guardDayPricePhrase}, excl. VAT. Trial access requires confirmation.</p>
          </div>
        </div>
      </section>

      <section id="service" className="so-vertical so-service-section" aria-labelledby="so-service-title">
        <div className="wrap so-vertical-layout so-reverse-layout">
          <div className="so-vertical-visual">
            <Image src={servicePhoto} alt="Illustrative professional restaurant kitchen team coordinating food service and operational decisions"
              fill sizes="(min-width:1024px) 49vw, 100vw" className="object-cover" />
            <div className="so-image-caption">Illustrative restaurant operation</div>
          </div>
          <div className="so-vertical-content">
            <div className="so-vertical-label"><span className="so-brand-one">1</span>Service <span className="so-status">IN DEVELOPMENT</span></div>
            <h2 id="so-service-title">A busy service business needs more than a roster.</h2>
            <p>1Service is being developed as the operating system for service-based businesses, starting with restaurants. The vision connects the front of house, back of house, people and business performance.</p>
            <div className="so-service-scope">
              <span>Shifts & teams</span><span>Orders & kitchen flow</span><span>Stock & costing</span><span>Staff hiring</span>
            </div>
            <p className="so-disclosure">These are planned product capabilities, not a claim that the full restaurant operating system is already available.</p>
            <div className="so-inline-actions">
              <Link href="/service" className="btn btn-primary so-home-cta">Explore 1Service <Arrow /></Link>
              <Link href="/contact" data-analytics-event="homepage_service_interest" className="so-text-link">Discuss early access <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="equipment" className="so-equipment-section" aria-labelledby="so-equipment-title">
        <div className="wrap so-equipment-layout">
          <div className="so-equipment-copy">
            <p className="so-kicker">Signal One · Business equipment</p>
            <h2 id="so-equipment-title">The right technology. For the real job.</h2>
            <p>Professional push-to-talk radios, tracking and connectivity should be specified for the deployment, not sold as a generic gadget. Talk to the team that understands field operations.</p>
            <div className="so-equipment-types" aria-label="Available equipment categories">
              <span>PoC & PTT radios</span><span>Vehicle & asset tracking</span><span>Body cameras</span><span>CCTV & networks</span>
            </div>
            <div className="so-inline-actions">
              <Link href="/radios-equipment#quote" data-analytics-event="homepage_equipment_quote"
                data-analytics-label="homepage-equipment" className="btn btn-primary so-home-cta">Request equipment quote <Arrow /></Link>
              <Link href="/equipment-marketplace" className="so-text-link">Explore equipment <Arrow /></Link>
            </div>
            <p className="so-disclosure">Prices, lead times and availability are confirmed by written quotation.</p>
          </div>
          <div className="so-hardware-gallery" aria-label="Actual manufacturer product imagery">
            <div className="so-hardware-product so-radio-product">
              <Image src={pnc360s} alt="Hytera PNC360S push-to-talk over cellular radio, original manufacturer product image"
                sizes="(min-width:1024px) 300px, 45vw" className="so-product-image" />
              <span>Hytera PNC360S <small>Push-to-talk radio</small></span>
            </div>
            <div className="so-hardware-product so-tracker-product">
              <Image src={fmb920} alt="Teltonika FMB920 vehicle tracking device, original manufacturer product image"
                sizes="(min-width:1024px) 240px, 45vw" className="so-product-image" />
              <span>Teltonika FMB920 <small>Vehicle tracking</small></span>
            </div>
            <p className="so-hardware-note">Original manufacturer product images. Products shown for category illustration, subject to quotation.</p>
          </div>
        </div>
      </section>

      <section className="so-onboarding-section" aria-labelledby="so-how-title">
        <div className="wrap">
          <div className="so-section-heading">
            <div><p className="so-kicker">A straightforward next step</p><h2 id="so-how-title">Start with the problem.<br /><span>We'll help map the solution.</span></h2></div>
            <p>Security software and business equipment don't have the same buying journey. We make the next step clear for each.</p>
          </div>
          <div className="so-journey-grid">
            <div><span className="so-step">01</span><h3>Choose your path</h3><p>Explore 1GUARD, learn about 1Service or select your equipment category.</p></div>
            <div><span className="so-step">02</span><h3>Tell us about your operation</h3><p>Share the sites, teams, requirements or devices your business needs.</p></div>
            <div><span className="so-step">03</span><h3>Confirm the right starting point</h3><p>We explain eligibility, supported capabilities, terms and activation before the work begins.</p></div>
          </div>
        </div>
      </section>

      <section id="community" className="so-final-cta" aria-labelledby="so-final-title">
        <div className="wrap so-final-inner">
          <div><p className="so-kicker">Make the next shift easier to manage</p><h2 id="so-final-title">Ready for a better-run operation?</h2>
            <p>Start with 1GUARD, explore what 1Service is becoming or speak to Signal One about field equipment.</p></div>
          <div className="so-final-actions"><TrialLink /><Link href="/contact" className="btn so-home-outline">Talk to Signal One <Arrow /></Link></div>
          <p className="so-community-note"><span className="so-brand-one">1</span>Community is part of the future Signal One ecosystem and is not yet available.</p>
        </div>
      </section>
    </main>
  );
}
