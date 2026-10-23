"use client";

import { useId, useState, type FormEvent } from "react";
import type { FounderProfile } from "../lib/profiles";
import {
  createExchangeEmail,
  emptyExchange,
  exchangeInterests,
  validateExchange,
  type ExchangeFields,
  type ExchangeErrors,
} from "../lib/exchange";
import styles from "./ExchangeDetails.module.css";

export function ExchangeDetails({ profile }: { profile: FounderProfile }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<ExchangeFields>(emptyExchange);
  const [errors, setErrors] = useState<ExchangeErrors>({});
  const [email, setEmail] = useState<ReturnType<typeof createExchangeEmail>>(null);
  const [copyState, setCopyState] = useState("");
  const [copyFallback, setCopyFallback] = useState(false);

  function update<K extends keyof ExchangeFields>(field: K, value: ExchangeFields[K]) {
    setDetails(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setEmail(null);
    setCopyState("");
    setCopyFallback(false);
  }

  function toggle() {
    if (open) {
      // Clear all personal data when dismissing the exchange form.
      setDetails(emptyExchange);
      setErrors({});
      setEmail(null);
      setCopyState("");
      setCopyFallback(false);
    }
    setOpen(!open);
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopyState("");
    const found = validateExchange(details);
    setErrors(found);
    setEmail(null);
    if (Object.keys(found).length > 0) return;
    setEmail(createExchangeEmail(profile.publicEmail, details));
  }

  async function copyMessage() {
    if (!email) return;
    setCopyState("");
    if (!navigator.clipboard?.writeText) {
      setCopyFallback(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(
        `To: ${email.recipient}\nSubject: ${email.subject}\n\n${email.body}`,
      );
      setCopyState("Email message copied. Paste it into your email application and send it yourself.");
      setCopyFallback(false);
    } catch {
      setCopyFallback(true);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.openAction}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className={styles.actionTitle}>Share my details <span aria-hidden="true">{open ? "−" : "+"}</span></span>
        <span className={styles.actionSub}>Optional introduction</span>
      </button>
      <a className={styles.siteAction} href={profile.website} target="_blank" rel="noopener noreferrer">
        <span className={styles.actionTitle}>Visit Signal One <span aria-hidden="true">↗</span></span>
        <span className={styles.actionSub}>Explore the website</span>
      </a>

      {open && (
        <section className={styles.panel} id={panelId} aria-labelledby={panelId + "-title"}>
          <h2 id={panelId + "-title"} className={styles.heading}>Introduce yourself</h2>
          <p className={styles.intro}>
            Prepare an email to {profile.givenName}. Your details stay in this page until
            you choose to open your email app. Signal Connect does not save or send them.
          </p>
          <form onSubmit={prepare} noValidate className={styles.form}>
            <div className={styles.field}>
              <label htmlFor={panelId + "-name"}>Full name <span aria-hidden="true">*</span></label>
              <input id={panelId + "-name"} value={details.name} maxLength={80}
                autoComplete="name" onChange={e => update("name", e.target.value)}
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? panelId + "-name-error" : undefined} />
              {errors.name && <p id={panelId + "-name-error"} className={styles.error}>{errors.name}</p>}
            </div>
            <div className={styles.fieldPair}>
              <div className={styles.field}>
                <label htmlFor={panelId + "-email"}>Email address</label>
                <input id={panelId + "-email"} type="email" inputMode="email" autoComplete="email" maxLength={150}
                  value={details.email} onChange={e => update("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? panelId + "-email-error" : undefined} />
                {errors.email && <p id={panelId + "-email-error"} className={styles.error}>{errors.email}</p>}
              </div>
              <div className={styles.field}>
                <label htmlFor={panelId + "-phone"}>Phone number</label>
                <input id={panelId + "-phone"} type="tel" inputMode="tel" autoComplete="tel" maxLength={25}
                  value={details.phone} onChange={e => update("phone", e.target.value)}
                  aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? panelId + "-phone-error" : undefined} />
                {errors.phone && <p id={panelId + "-phone-error"} className={styles.error}>{errors.phone}</p>}
              </div>
            </div>
            <p className={styles.fieldHint}>Provide an email address or phone number.</p>
            <div className={styles.field}>
              <label htmlFor={panelId + "-company"}>Company <span className={styles.optional}>(optional)</span></label>
              <input id={panelId + "-company"} autoComplete="organization" maxLength={80}
                value={details.company} onChange={e => update("company", e.target.value)}
                aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? panelId + "-company-error" : undefined} />
              {errors.company && <p id={panelId + "-company-error"} className={styles.error}>{errors.company}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor={panelId + "-interest"}>What interests you? <span className={styles.optional}>(optional)</span></label>
              <select id={panelId + "-interest"} value={details.interest} onChange={e => update("interest", e.target.value)}>
                <option value="">Select an area</option>
                {exchangeInterests.map(interest => <option key={interest} value={interest}>{interest}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor={panelId + "-message"}>Short message <span className={styles.optional}>(optional)</span></label>
              <textarea id={panelId + "-message"} rows={3} maxLength={240}
                value={details.message} onChange={e => update("message", e.target.value)}
                aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? panelId + "-message-error" : undefined} />
              {errors.message && <p id={panelId + "-message-error"} className={styles.error}>{errors.message}</p>}
            </div>
            <div className={styles.consentRow}>
              <input type="checkbox" id={panelId + "-consent"} checked={details.consent}
                onChange={e => update("consent", e.target.checked)}
                aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? panelId + "-consent-error" : undefined} />
              <label htmlFor={panelId + "-consent"}>
                I choose to include these details in an email to Signal One. Nothing is sent automatically.
              </label>
            </div>
            {errors.consent && <p id={panelId + "-consent-error"} className={styles.error}>{errors.consent}</p>}
            {Object.keys(errors).length > 0 && (
              <p className={styles.errorSummary} role="alert">Correct the highlighted fields before preparing your email.</p>
            )}
            <button type="submit" className={styles.prepare}>Prepare email</button>
          </form>

          {email && (
            <div className={styles.handoff} aria-label="Prepared email">
              <h3>Ready to review in your email app</h3>
              <p>The message is prepared, not sent or saved. You must choose Send in your mail app.</p>
              <a className={styles.mailAction} href={email.href}>Open email app</a>
              <button type="button" className={styles.copyAction} onClick={() => void copyMessage()}>Copy email instead</button>
              <p className={styles.status} role="status" aria-live="polite">{copyState}</p>
              {copyFallback && (
                <div className={styles.field}>
                  <label htmlFor={panelId + "-copy"}>Copy this message manually</label>
                  <textarea id={panelId + "-copy"} rows={8} readOnly
                    value={`To: ${email.recipient}\nSubject: ${email.subject}\n\n${email.body}`}
                    onFocus={e => e.currentTarget.select()} />
                </div>
              )}
            </div>
          )}
          <p className={styles.notice}>No lead is created by preparing this email. Close this section to clear the entered details.</p>
        </section>
      )}
    </>
  );
}
