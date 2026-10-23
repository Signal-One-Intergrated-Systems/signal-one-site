import type { FounderProfile } from "../lib/profiles";
import { ContactExchange } from "./ContactExchange";
import styles from "./VisitorIdentity.module.css";

function introductionEmail(profile: FounderProfile): string {
  const subject = "Introduction via Signal Connect — Andisiwe Satshwa";
  const body = [
    "Hello Andisiwe,",
    "",
    "I found your Signal Connect card and would like to connect.",
    "",
    "My name:",
    "Company (optional):",
    "Best way to reach me:",
    "What I would like to discuss:",
    "",
    "Kind regards,",
  ].join("\n");
  return `mailto:${profile.publicEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * A public, identity-first card. Viewing it never submits personal information.
 * Save Contact is never gated by discovery, a form, login or email exchange.
 */
export function VisitorIdentity({ profile }: { profile: FounderProfile }) {
  return (
    <main id="main" className={styles.root}>
      <section className={styles.identity} aria-labelledby="visitor-name">
        <p className={styles.eyebrow}>A personal introduction</p>
        <h1 id="visitor-name" className={styles.name}>{profile.fullName}</h1>
        <p className={styles.title}>{profile.title}</p>
        <p className={styles.company}>{profile.organization}</p>
        <p className={styles.statement}>Every connection begins with a signal.</p>
      </section>

      <section className={styles.connect} aria-label="Save contact and connect">
        <div className={styles.contactAction}>
          <ContactExchange profile={profile} />
        </div>
        <p className={styles.actionHint}>Open her contact card and choose whether to save it.</p>

        <div className={styles.secondaryActions}>
          <a className={styles.secondaryAction} href={introductionEmail(profile)}>
            <span className={styles.secondaryTitle}>Share my details <span aria-hidden="true">↗</span></span>
            <span className={styles.secondaryDescription}>Write an introduction</span>
          </a>
          <a className={styles.secondaryAction} href={profile.website} target="_blank" rel="noopener noreferrer">
            <span className={styles.secondaryTitle}>Visit Signal One <span aria-hidden="true">↗</span></span>
            <span className={styles.secondaryDescription}>Explore the website</span>
          </a>
        </div>
        <p className={styles.emailNote}>Sharing your details opens your email app. Nothing is sent until you choose Send.</p>
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
