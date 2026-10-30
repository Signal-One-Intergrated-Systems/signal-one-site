import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroGlobeLayer from "../components/HeroGlobeLayer";
import HomeScrollChoreography from "../components/HomeScrollChoreography";
import LivingOperatingSquare from "../components/LivingOperatingSquare";
import ProductSignature from "../components/brand/ProductSignature";
import { guardDayPricePhrase } from "../lib/pricing";
import pnc360s from "../../public/images/hardware/hytera-pnc360s.webp";
import fmb920 from "../../public/images/hardware/teltonika-fmb920.webp";
import "../home-conversion.css";
import "../os-square.css";

export const metadata: Metadata = {
  title: { absolute: "Signal One | 1GUARD, 1Service & Business Equipment" },
  description:
    "Intelligent business operating systems for SMEs. Explore 1GUARD for security businesses, 1Service for service businesses and professional equipment and connectivity from Signal One.",
  alternates: { canonical: "/" },
};

function Arrow() {
  return <span aria-hidden="true" className="so-arrow">↗</span>;
}

/** Compact documentary photography: purposeful context without dominating copy. */
function PanelPhoto({
  src, alt, size = "card",
}: {
  src: string;
  alt: string;
  size?: "card" | "mini";
}) {
  return (
    <figure className={`so-panel-photo so-panel-photo--${size}`}>
      <Image src={src} alt={alt} fill loading="lazy" quality={76}
        sizes={size === "mini" ? "56px" : "(min-width: 1024px) 340px, (min-width: 680px) 45vw, 90vw"}
        className="so-panel-photo-image" />
    </figure>
  );
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
    <main id="main" data-motion-scope className="s1-brand-home so-home">
      <HomeScrollChoreography />
      <section className="s1-brand-stage so-hero" aria-labelledby="so-hero-title">
        <div className="so-hero-media">
          <Image src="/images/home/approved-full-scene-guard-chef-2026.png"
            alt="Illustrative wide daylight restaurant scene with green gardens on the left and, on the right, a Black woman security officer in a SECURITY vest reviewing a tablet with a white male chef in his chef hat"
            fill priority fetchPriority="high" quality={90}
            sizes="100vw" className="so-hero-photo object-cover" />
          <div className="so-hero-wash" aria-hidden="true" />
        </div>
        {/* Preserve the existing Signal One glass globe, its rendering and animation. */}
        <HeroGlobeLayer />
        <div className="wrap so-hero-inner">
          <div className="so-hero-copy">
            <p className="so-eyebrow"><span className="so-signal-dot" /> Signal One · Integrated Systems</p>
            <h1 id="so-hero-title">Run your business.<br /><span>As one.</span></h1>
            <p className="so-hero-lead">
              Intelligent business operating systems for SMEs. Connect your customers, people, service delivery and business decisions in one smarter way of working.
            </p>
            <div className="so-hero-actions">
              <TrialLink />
              <Link href="#solutions" className="btn so-home-outline">Explore the solutions <Arrow /></Link>
            </div>
            <p className="so-hero-note">14-day trial by request for eligible 1GUARD companies. Activation and terms are confirmed before access.</p>
          </div>
        </div>
        <div className="so-hero-bar" aria-label="Signal One business areas">
          <Link href="/solutions/security" className="so-hero-bar-item" aria-label="Explore 1GUARD Security Business Operating System"><strong className="so-platform-mark"><ProductSignature name="GUARD" tone="dark" /></strong><span>Security Business OS</span></Link>
          <Link href="/service" className="so-hero-bar-item" aria-label="Explore 1Service business operating system"><strong className="so-platform-mark"><ProductSignature name="Service" tone="dark" /></strong><span>Restaurant-first OS · In development</span></Link>
          <Link href="/equipment-marketplace" className="so-hero-bar-item" aria-label="Explore enterprise equipment"><strong>Equipment</strong><span>Professional devices & connectivity</span></Link>
          <a href="#community" className="so-hero-bar-item" aria-label="Learn about 1Community coming soon"><strong className="so-platform-mark"><ProductSignature name="Community" tone="dark" /></strong><span>Coming soon</span></a>
        </div>
        <span className="so-hero-photo-note">Illustrative scene</span>
      </section>

      <section id="solutions" className="so-chapter so-introduction" aria-labelledby="so-solutions-title">
        <div className="wrap">
          <div className="so-os-intro-stage">
            <div className="so-os-float-anchor"><LivingOperatingSquare /></div>
            <div className="so-section-heading">
              <div data-motion-from="left">
                <PanelPhoto src="/images/home/panels/team-dispatch.webp" alt="Illustrative SME security and service team organising assignments" />
                <p className="so-kicker">Built around how you operate</p>
                <h2 id="so-solutions-title">Every part of your business.<br /><span>Working as one.</span></h2>
              </div>
              <p data-motion-from="right" style={{ "--so-motion-delay": "260ms" } as CSSProperties}>From winning a customer and finding the right people to delivering the work, proving the result and growing the business: Signal One is building industry-specific operating systems around the full journey.</p>
            </div>
          </div>
          <div className="so-value-rail" aria-label="What matters to your business">
            <div data-motion-from="bottom"><PanelPhoto src="/images/editorial/security-office-park-site-review.webp" alt="Illustrative security service manager meeting a building client on location to review the site" /><span>01</span><strong>Win & organise the work</strong><p>Customers, assignments, teams and requirements.</p></div>
            <div data-motion-from="top" style={{ "--so-motion-delay": "180ms" } as CSSProperties}><PanelPhoto src="/images/editorial/security-access-scan.webp" alt="Illustrative security officer and supervisor verifying building access during a patrol" /><span>02</span><strong>Deliver & prove the service</strong><p>Connected operations, records and exceptions.</p></div>
            <div data-motion-from="right" style={{ "--so-motion-delay": "360ms" } as CSSProperties}><PanelPhoto src="/images/editorial/security-operations-review.webp" alt="Illustrative management team reviewing operational records and security company performance" /><span>03</span><strong>Manage & grow</strong><p>Business visibility, resources and future opportunities.</p></div>
          </div>
        </div>
      </section>

      <section id="guard" className="so-vertical so-guard-section" aria-labelledby="so-guard-title">
        <div className="wrap so-vertical-layout">
          <div data-motion-from="top" className="so-vertical-visual so-vertical-visual-guard">
            <Image src="/images/home/approved-sme-security-control-room-2026.png" alt="Illustrative daylight security office for an SME, with three operators monitoring CCTV and a light-skinned Black male supervisor supporting the team"
              fill sizes="(min-width:1024px) 49vw, 100vw" className="object-cover" />
            <div className="so-image-caption">Illustrative SME security operations</div>
          </div>
          <div data-motion-from="left" style={{ "--so-motion-delay": "240ms" } as CSSProperties} className="so-vertical-content"><PanelPhoto src="/images/photo/guard-site-operations.webp" alt="Illustrative security workers coordinating operational duties at a customer site" />
            <div className="so-vertical-label"><Link href="/solutions/security" className="so-platform-mark" aria-label="Explore 1GUARD"><ProductSignature name="GUARD" tone="dark" /></Link> <span>SECURITY BUSINESS OS</span></div>
            <h2 id="so-guard-title">A complete business vision. Built for real security SMEs.</h2>
            <p>1GUARD is being built around the security company, not only its control room: customers, guards, staffing, sites, operations, equipment and business oversight. Start with documented shift, patrol and incident workflows as the broader business lifecycle is developed.</p>
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
          <div data-motion-from="right" className="so-vertical-visual so-vertical-visual-service">
            <Image src="/images/home/service-restaurant-operations.jpg" alt="Illustrative restaurant kitchen team coordinating a live service in a professional hospitality environment"
              fill sizes="(min-width:1024px) 49vw, 100vw" className="object-cover" />
            <div className="so-image-caption">Illustrative restaurant team at work</div>
          </div>
          <div data-motion-from="top" style={{ "--so-motion-delay": "280ms" } as CSSProperties} className="so-vertical-content"><PanelPhoto src="/images/home/panels/hire-hospitality.webp" alt="Illustrative hospitality workers discussing a staffing assignment" />
            <div className="so-vertical-label"><Link href="/service" className="so-platform-mark" aria-label="Explore 1Service"><ProductSignature name="Service" tone="dark" /></Link> <span className="so-status">IN DEVELOPMENT</span></div>
            <h2 id="so-service-title">Your service business deserves its own OS.</h2>
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


      {/* Ecosystem vision: customer-facing capabilities only; no internal stack or platform names. */}
      <section className="so-ecosystem-section" aria-labelledby="so-ecosystem-title">
        <div className="wrap so-ecosystem-layout">
          <div data-motion-from="left" className="so-ecosystem-intro"><PanelPhoto src="/images/home/panels/customer-enquiry.webp" alt="Illustrative service business representative handling a customer enquiry" />
            <p className="so-kicker">One connected business journey</p>
            <h2 id="so-ecosystem-title">Not another tool for one task.<br /><span>A better way to run the whole business.</span></h2>
            <p>A customer request creates work. Work requires people and equipment. Delivery creates records, decisions and the next opportunity. Our long-term direction is to connect those handoffs inside purpose-built operating systems.</p>
            <p className="so-disclosure">This is the connected ecosystem vision. Individual workflows and integrations are released and verified in stages.</p>
          </div>
          <ol data-motion-from="right" style={{ "--so-motion-delay": "220ms" } as CSSProperties} className="so-lifecycle" aria-label="Connected business lifecycle vision">
            {[
              ["01","Find customers","/images/editorial/facility-reception-service.webp","Illustrative facilities employees welcoming a visitor at a service centre"],
              ["02","Win the work","/images/editorial/security-site-planning.webp","Illustrative security supervisor discussing a site plan with client representatives"],
              ["03","Hire & assign","/images/editorial/security-interview-training.webp","Illustrative security employer interviewing candidates during recruitment"],
              ["04","Plan & deliver","/images/editorial/security-team-briefing.webp","Illustrative security officers gathered around an operational briefing"],
              ["05","Equip the team","/images/home/panels/prove-work.webp","Illustrative security officer using field technology during a patrol"],
              ["06","Record & prove","/images/editorial/warehouse-security-check.webp","Illustrative guard verifying the security status at a logistics facility"],
              ["07","Bill & manage","/images/home/panels/invoice-confirm.webp","Illustrative administrators preparing customer billing"],
              ["08","Improve & grow","/images/home/panels/manage-grow.webp","Illustrative owner reviewing business performance"],
            ].map(([number,label,src,alt]) => (
              <li key={number}><PanelPhoto src={src} alt={alt} size="mini" /><span>{number}</span><strong>{label}</strong></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="so-marketplace-section" aria-labelledby="so-marketplace-title">
        <div className="wrap">
          <div className="so-section-heading">
            <div data-motion-from="right"><p className="so-kicker">The ecosystem extends beyond software</p>
              <h2 id="so-marketplace-title">When your business needs more,<br /><span>the next step should be connected.</span></h2>
            </div>
            <p data-motion-from="top" style={{ "--so-motion-delay": "220ms" } as CSSProperties}>People, services and equipment are part of business operations—not separate problems. Our marketplace direction connects those needs with the work, while keeping each industry-specific journey clear.</p>
          </div>
          <div className="so-marketplace-grid">
            <article data-motion-from="left">
              <span className="so-marketplace-kicker">Guard marketplace · In development</span>
              <PanelPhoto src="/images/home/panels/hire-security.webp" alt="Illustrative interview between a security employer and prospective officers" />
              <h3>Find the right security officers.</h3>
              <p>A planned route for eligible officers and companies to find one another, with hiring and assignment workflows designed to connect back to operations.</p>
              <Link href="/guard-marketplace">Explore guard hiring <Arrow /></Link>
            </article>
            <article data-motion-from="top" style={{ "--so-motion-delay": "240ms" } as CSSProperties}>
              <span className="so-marketplace-kicker">1Service staffing · Planned</span>
              <PanelPhoto src="/images/editorial/restaurant-staff-briefing.webp" alt="Illustrative restaurant team including chef, waiters and cleaning staff at a pre-service briefing" />
              <h3>Build the team behind the service.</h3>
              <p>Our direction includes hiring and deploying hospitality and other service workers, from kitchen teams and waiters to cleaning and management staff.</p>
              <Link href="/service">Discover 1Service <Arrow /></Link>
            </article>
            <article data-motion-from="right" style={{ "--so-motion-delay": "380ms" } as CSSProperties}>
              <span className="so-marketplace-kicker">Professional technology · Quote-led</span>
              <PanelPhoto src="/images/hardware/teltonika-fmc920.webp" alt="Genuine Teltonika connectivity tracking device manufacturer product photograph" />
              <h3>Get the devices the work requires.</h3>
              <p>Radios, body cameras, tracking, CCTV and connectivity specified for the operation, with pricing and fulfilment confirmed by quotation.</p>
              <Link href="/equipment-marketplace">Browse technology <Arrow /></Link>
            </article>
          </div>
        </div>
      </section>

      <section id="equipment" className="so-equipment-section" aria-labelledby="so-equipment-title">
        <div className="wrap so-equipment-layout">
          <div data-motion-from="right" className="so-equipment-copy"><PanelPhoto src="/images/photo/warehouse-security.webp" alt="Illustrative guard checking professional communications equipment at a logistics site" />
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
          <div data-motion-from="left" style={{ "--so-motion-delay": "280ms" } as CSSProperties} className="so-hardware-gallery" aria-label="Actual manufacturer product imagery">
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
            <div data-motion-from="top"><p className="so-kicker">A straightforward next step</p><h2 id="so-how-title">Start with the problem.<br /><span>We'll help map the solution.</span></h2></div>
            <p data-motion-from="left" style={{ "--so-motion-delay": "280ms" } as CSSProperties}>Business operating systems and equipment don't have the same buying journey. We make the next step clear for each.</p>
          </div>
          <div className="so-journey-grid">
            <div data-motion-from="left"><PanelPhoto src="/images/editorial/hotel-reception-welcome.webp" alt="Illustrative hotel front-desk employees, porter and housekeeper welcoming a guest" /><span className="so-step">01</span><h3>Choose your path</h3><p>Explore 1GUARD, learn about 1Service or select your equipment category.</p></div>
            <div data-motion-from="top" style={{ "--so-motion-delay": "240ms" } as CSSProperties}><PanelPhoto src="/images/editorial/cafe-team-planning.webp" alt="Illustrative cafe manager, chef and service supervisor planning work together" /><span className="so-step">02</span><h3>Tell us about your operation</h3><p>Share the sites, teams, requirements or devices your business needs.</p></div>
            <div data-motion-from="right" style={{ "--so-motion-delay": "400ms" } as CSSProperties}><PanelPhoto src="/images/editorial/hospitality-team-briefing.webp" alt="Illustrative hotel and restaurant staff from different roles discussing a service plan" /><span className="so-step">03</span><h3>Confirm the right starting point</h3><p>We explain eligibility, supported capabilities, terms and activation before the work begins.</p></div>
          </div>
        </div>
        <p className="so-editorial-disclosure">People and workplace scenes are illustrative; equipment photographs are original manufacturer imagery.</p>
      </section>

      <section id="community" className="so-final-cta" aria-labelledby="so-final-title">
        <div className="wrap so-final-inner">
          <div data-motion-from="left"><PanelPhoto src="/images/photo/team-briefing.webp" alt="Illustrative operational staff coordinating service delivery together" /><p className="so-kicker">Make your business easier to run</p><h2 id="so-final-title">Ready for a smarter way to run your business?</h2>
            <p>Start with 1GUARD, explore what 1Service is becoming or speak to Signal One about field equipment.</p></div>
          <div data-motion-from="right" style={{ "--so-motion-delay": "240ms" } as CSSProperties} className="so-final-actions"><TrialLink /><Link href="/contact" className="btn so-home-outline">Talk to Signal One <Arrow /></Link></div>
          <p data-motion-from="bottom" style={{ "--so-motion-delay": "160ms" } as CSSProperties} className="so-community-note"><ProductSignature name="Community" tone="dark" /> is part of the future Signal One ecosystem and is not yet available.</p>
        </div>
      </section>
    </main>
  );
}
