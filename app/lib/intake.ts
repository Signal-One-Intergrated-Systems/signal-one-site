import { salesEmail } from "./site";

export type IntakeKind = "client" | "guard" | "sales";

/** Version of the privacy notice the visitor agreed to. Bump when /privacy or /popia changes materially. */
export const PRIVACY_NOTICE_VERSION = "2026-11-12";

/**
 * Consent captured with every submission (website intake contract v1).
 * `processing` is required to send anything. `marketing` is a separate,
 * optional opt-in and is never pre-ticked or bundled with `processing`.
 */
export type IntakeConsent = {
  processing: true;
  marketing: boolean;
  noticeVersion: string;
  capturedAt: string;
};

/** Proof from the receiver that a record was stored. `reference` is the stored record's identifier. */
export type IntakeReceipt = { reference: string; recordType: string; persistedAt: string; duplicate: boolean; idempotencyKey: string };

export type IntakeResult =
  | { ok: true; message: string; receipt: IntakeReceipt }
  | { ok: false; message: string; fallback: IntakeFallback | null };

export type IntakeFallback = { email: string; href: string };

const subjects: Record<string, string> = {
  consultation: "Consultation request",
  "company-onboarding": "Client onboarding",
  "equipment-rental-quote": "Equipment rental quote",
  "tracking-quote": "Tracking quote",
  "bodycam-rental-quote": "Body camera rental quote",
  "marketplace-interest": "Guard Marketplace interest",
  "guard-profile": "Guard join",
  "sales-representative-application": "Sales application",
};

// Mail clients and some OSes truncate very long mailto: links.
const MAX_BODY_CHARS = 1500;

function humanise(name: string): string {
  const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").toLowerCase();
  return (words.charAt(0).toUpperCase() + words.slice(1)).replace(/psira/gi, "PSiRA");
}

/** One key per form instance: a retry of the same submission reuses it, so the receiver can de-duplicate. */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // RFC 4122 v4 shape from getRandomValues, for older browsers on insecure origins.
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Builds a mailto: link prefilled with the visitor's answers. */
export function buildMailto(data: Record<string, string>, labels: Record<string, string> = {}): IntakeFallback {
  const intent = data.intent || "";
  const subject = "Signal One website: " + (subjects[intent] || intent || "Enquiry");
  const lines = Object.entries(data)
    .filter(([name, value]) => name !== "intent" && value)
    .map(([name, value]) => (labels[name] || humanise(name)) + ": " + value);
  let body = lines.join("\n");
  if (body.length > MAX_BODY_CHARS) body = body.slice(0, MAX_BODY_CHARS) + "\n[shortened: please add anything missing]";
  const href = "mailto:" + salesEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  return { email: salesEmail, href };
}

/**
 * POSTs to /api/intake. When the form service is unavailable (503 until an
 * upstream is configured, 502/504, or the network is down) the result carries
 * a mailto: fallback so a form never dead-ends.
 */
export async function submitIntake(
  kind: IntakeKind,
  data: Record<string, string>,
  options: { labels?: Record<string, string>; marketing: boolean; idempotencyKey: string },
): Promise<IntakeResult> {
  const fallback = () => buildMailto(data, options.labels);
  const consent: IntakeConsent = {
    processing: true,
    marketing: options.marketing,
    noticeVersion: PRIVACY_NOTICE_VERSION,
    capturedAt: new Date().toISOString(),
  };
  try {
    const response = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data, consent, idempotencyKey: options.idempotencyKey }),
    });
    const body = (await response.json().catch(() => ({}))) as { message?: string; receipt?: IntakeReceipt };
    // Success needs the receiver's receipt for THIS submission, not merely a 200.
    if (response.ok && body.receipt && typeof body.receipt.reference === "string" && body.receipt.idempotencyKey === options.idempotencyKey) {
      return { ok: true, message: body.message || "", receipt: body.receipt };
    }
    if (response.ok) {
      return { ok: false, message: "We could not confirm that this was saved, so please treat it as not received.", fallback: fallback() };
    }
    const unavailable = response.status >= 500;
    return {
      ok: false,
      message: body.message || "We could not send this. Please try again.",
      fallback: unavailable ? fallback() : null,
    };
  } catch {
    return { ok: false, message: "We could not reach our form service.", fallback: fallback() };
  }
}
