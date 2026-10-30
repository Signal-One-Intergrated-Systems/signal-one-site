/**
 * Execution 04A: local-only exchange -> user-controlled mail application.
 * This module has no persistence, network calls or lead acknowledgement.
 */
export type ExchangeFields = Readonly<{
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
  consent: boolean;
}>;

export type ExchangeFieldKey = "name" | "email" | "phone" | "company" | "interest" | "message" | "consent";
export type ExchangeErrors = Partial<Record<ExchangeFieldKey, string>>;

export const emptyExchange: ExchangeFields = {
  name: "", email: "", phone: "", company: "", interest: "", message: "", consent: false,
};

export const exchangeInterests = [
  "1GUARD Security Business OS",
  "Radios and equipment",
  "Business partnership",
  "General enquiry",
] as const;

/** Strict enough to catch mistakes without rejecting normal international emails. */
export function validateExchange(value: ExchangeFields): ExchangeErrors {
  const errors: ExchangeErrors = {};
  const name = value.name.trim();
  const email = value.email.trim();
  const phone = value.phone.trim();
  const company = value.company.trim();
  const message = value.message.trim();

  if (name.length < 2 || name.length > 80 || /[\r\n\x00-\x1f]/.test(name)) {
    errors.name = "Enter your full name (2–80 characters).";
  }
  if (!email && !phone) {
    errors.email = "Provide an email address or phone number.";
    errors.phone = "Provide an email address or phone number.";
  }
  if (email && (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    errors.email = "Enter a valid email address.";
  }
  if (phone && (phone.length > 25 || !/^\+?[\d ()-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15)) {
    errors.phone = "Enter a valid telephone number.";
  }
  if (company.length > 80) errors.company = "Company must be 80 characters or fewer.";
  if (message.length > 240) errors.message = "Message must be 240 characters or fewer.";
  if (value.interest && !exchangeInterests.includes(value.interest as (typeof exchangeInterests)[number])) {
    errors.interest = "Choose one of the listed interests.";
  }
  if (!value.consent) errors.consent = "Confirm that you choose to include your details in an email.";
  return errors;
}

/** A mailto address contains optional personal data only after user prepares it. */
export function createExchangeEmail(recipient: string, value: ExchangeFields) {
  if (Object.keys(validateExchange(value)).length) return null;
  if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(recipient)) return null;
  const body = [
    "Hello Andisiwe,",
    "",
    "I met you through Signal Connect and would like to introduce myself.",
    "",
    "Name: " + value.name.trim(),
    ...(value.email.trim() ? ["Email: " + value.email.trim()] : []),
    ...(value.phone.trim() ? ["Phone: " + value.phone.trim()] : []),
    ...(value.company.trim() ? ["Company: " + value.company.trim()] : []),
    ...(value.interest ? ["Interested in: " + value.interest] : []),
    ...(value.message.trim() ? ["Message: " + value.message.trim()] : []),
    "",
    "Kind regards,",
    value.name.trim(),
  ].join("\n");
  const subject = "Signal Connect introduction — Andisiwe Satshwa";
  return {
    recipient,
    subject,
    body,
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  } as const;
}
