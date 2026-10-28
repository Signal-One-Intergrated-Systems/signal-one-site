import type { Metadata } from "next";
import Image from "next/image";
import SignalOneLogo from "../components/brand/SignalOneLogo";
import { photos, illustrativeCaption } from "../lib/photos";

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
          <Image src={photos.hero.src} alt={photos.hero.alt}
            fill priority sizes="(min-width: 1200px) 72vw, 100vw"
            quality={85} className="s1-brand-stage-image object-cover" />
          <div className="s1-brand-image-wash" aria-hidden="true" />
          <p className="s1-brand-photo-caption">{illustrativeCaption}</p>
        </div>
        <div className="s1-brand-copy s1-brand-clay">
          <div className="s1-brand-parent"><SignalOneLogo size={21} tone="light" descriptorMin={10} /></div>
          <p className="s1-brand-eyebrow">Technology for real-world operations</p>
          <h1 id="s1-brand-intro">The systems behind<br />better operations.</h1>
          <p className="s1-brand-explainer">
            Signal One is a South African technology company connecting people,
            equipment and operational intelligence. We build platforms for security
            and field work, and provide the communications and connected systems
            that keep teams informed, accountable and in control.
          </p>
          <div className="s1-brand-family" aria-label="Signal One platforms">
            <div className="s1-brand-family-item">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>GUARD</span>
              <span className="s1-product-description">Security operations</span>
            </div>
            <div className="s1-brand-family-divider" aria-hidden="true" />
            <div className="s1-brand-family-item">
              <span className="s1-product-lockup"><span className="s1-product-one">1</span>Workforce</span>
              <span className="s1-product-description">Workforce operations</span>
            </div>
          </div>
          <p className="s1-brand-final">One company. Purpose-built technology. Connected operations.</p>
        </div>
      </section>
    </main>
  );
}
