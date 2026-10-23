import type { FounderProfile } from "../lib/profiles";
import { ContactExchange } from "./ContactExchange";
import { ExchangeDetails } from "./ExchangeDetails";
import styles from "./VisitorIdentity.module.css";

/**
 * Recipient lands on a recognisable digital business card, not a hero poster.
 * All visible contact actions use real mailto/tel/HTTPS links.
 */
export function VisitorIdentity({ profile }: { profile: FounderProfile }) {
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
              src="/people/andisiwe-bw.webp"
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

      <section className={styles.connect} aria-label="Contact actions">
        <div className={styles.contactAction}>
          <ContactExchange profile={profile} />
        </div>
        <div className={styles.quickActions}>
          <a className={styles.quickAction} href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
          <a className={styles.quickAction} href={`tel:${profile.landlinePhone}`}>Call <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.secondaryActions}>
          <ExchangeDetails profile={profile} />
        </div>
        <p className={styles.emailNote}>Sharing your details is optional. Signal Connect prepares an email; it does not send or store it.</p>
      </section>

      <section className={styles.discovery} aria-labelledby="discovery-heading">
        <div className={styles.discoveryHeading}>
          <h2 id="discovery-heading">Discover Signal One</h2>
          <span className={styles.soon}>Coming soon</span>
        </div>
        <p>WIN <span aria-hidden="true">·</span> HIRE <span aria-hidden="true">·</span> RUN <span aria-hidden="true">·</span> EQUIP <span aria-hidden="true">·</span> PROVE</p>
        <p className={styles.discoveryNote}>The interactive five-chapter story is being prepared.</p>
      </section>
      <p className={styles.privacy}>Viewing this card does not submit your contact details or create a lead.</p>
    </main>
  );
}
