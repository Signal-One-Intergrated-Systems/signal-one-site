import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignalOneLogo from "../components/brand/SignalOneLogo";
import HeroGlobeLayer from "../components/HeroGlobeLayer";

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
          <div className="s1-hero-image-logo"><SignalOneLogo size={21} tone="dark" descriptorMin={10} /></div>
          <Image src="/images/signal-one-hero-daylight-duo.jpg" alt="Two professional South African security officers, a woman and a man, working together at a modern corporate entrance in bright daylight"
            fill priority sizes="(min-width: 1200px) 72vw, 100vw"
            quality={85} className="s1-brand-stage-image object-cover" />
          <div className="s1-brand-image-wash" aria-hidden="true" />

        </div>
        <HeroGlobeLayer />
        <div className="s1-brand-copy s1-brand-clay s1-hero-content-glass">
          <p className="s1-brand-eyebrow">Technology for real-world operations</p>
          <h1 id="s1-brand-intro">The systems behind<br />better operations.</h1>
          <p className="s1-brand-explainer">
            Signal One is a South African technology company connecting people,
            equipment and operational intelligence. We build platforms for security
            and field work, and provide the communications and connected systems
            that keep teams informed, accountable and in control.
          </p>
          <div className="s1-brand-family" aria-label="Signal One platforms">
            <Link href="/solutions/security" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1GUARD security operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>GUARD</span>
              <span className="s1-product-description">Security operations</span>
            </Link>
            </Link>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <Link href="/workforce" className="s1-brand-family-item s1-brand-product-link" aria-label="Explore 1Workforce operations">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Workforce</span>
              <span className="s1-product-description">Workforce operations</span>
            </Link>
          </div>
          <p className="s1-brand-final">One company. Purpose-built technology. Connected operations.</p>
        </div>
      </section>
    </main>
  );
}
