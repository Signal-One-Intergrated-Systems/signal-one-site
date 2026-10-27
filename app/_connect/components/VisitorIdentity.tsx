import type { FounderProfile } from "../lib/profiles";
import { IntroductionForm } from "./IntroductionForm";
import styles from "./VisitorIdentity.module.css";

/**
 * Recipient lands on a recognisable digital business card, not a hero poster.
 * All visible contact actions use real mailto/tel/HTTPS links.
 */
export function VisitorIdentity({ profile, exchangeEnabled=false, alreadyConnected=false }: { profile: FounderProfile; exchangeEnabled?:boolean; alreadyConnected?:boolean }) {
  const whatsapp = `https://wa.me/${profile.whatsappPhone.replace(/\D/g, "")}`;

  return (
    <main id="main" className={styles.root}>
      <section className={styles.businessCard} aria-label="Andisiwe Satshwa digital business card">
        <div className={styles.cardHeader}>
          <span className={styles.cardBrand}>SIGNAL ONE <span className={styles.brandAccent}>/</span> CONNECT</span>
          <span className={styles.cardDescriptor}>DIGITAL BUSINESS CARD</span>
        </div>

        <div className={styles.cardIdentity}>
          <div className={styles.person}>
            <h1 className={styles.name}>{profile.fullName}</h1>
            <p className={styles.title}>{profile.title}</p>
            <p className={styles.company}>{profile.organization}</p>
          </div>
          <div className={styles.portrait}>
            {/* Source: user-supplied cutout, converted offline to monochrome. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/connect-assets/andisiwe-bw.webp"
              width={142}
              height={169}
              alt="Black-and-white portrait of Andisiwe Satshwa"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className={styles.hairline} aria-hidden="true" />

        <div className={styles.contactRows} aria-label="Business contact details">
          <a className={styles.contactRow} href={`mailto:${profile.publicEmail}`}>
            <span className={styles.contactLabel}>Email</span>
            <span className={styles.contactValue}>{profile.publicEmail}</span>
            <span className={styles.contactArrow} aria-hidden="true">↗</span>
          </a>
          <a className={styles.contactRow} href={whatsapp} target="_blank" rel="noopener noreferrer">
            <span className={styles.contactLabel}>WhatsApp</span>
            <span className={styles.contactValue}>060 633 5870</span>
            <span className={styles.contactArrow} aria-hidden="true">↗</span>
          </a>
          <a className={styles.contactRow} href={`tel:${profile.landlinePhone}`}>
            <span className={styles.contactLabel}>Landline</span>
            <span className={styles.contactValue}>010 023 1810</span>
            <span className={styles.contactArrow} aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className={styles.connect} aria-label="Personal introduction">
        <IntroductionForm enabled={exchangeEnabled} alreadyConnected={alreadyConnected}/>
      </section>

      <section className={styles.discovery} aria-labelledby="discovery-heading">
        <div className={styles.discoveryHeading}>
          <h2 id="discovery-heading">Discover Signal One</h2>
          <span className={styles.soon}>Coming soon</span>
        </div>
        <p>WIN <span aria-hidden="true">·</span> HIRE <span aria-hidden="true">·</span> RUN <span aria-hidden="true">·</span> EQUIP <span aria-hidden="true">·</span> PROVE</p>
        <p className={styles.discoveryNote}>The interactive five-chapter story is being prepared.</p>
      </section>
      <p className={styles.privacy}>Viewing this card does not submit your contact details.</p>
    </main>
  );
}
