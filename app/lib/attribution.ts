/**
 * Marketing attribution for website enquiries (intake contract v1, optional `attribution` field).
 *
 * What is kept: the campaign parameters of the visit that brought someone here (UTM tags and Google's
 * click identifiers), the landing path, and the referring host. Kept in sessionStorage only (no cookie,
 * gone when the tab closes) and sent ONLY with an enquiry the visitor submits with consent, so a lead in
 * the sales platform can be traced to the ad or campaign that produced it and to the revenue it becomes.
 *
 * Rule: only visits with campaign parameters are recorded; a later campaign visit replaces the stored
 * one (last campaign click, as Google Ads attributes); a visit without them never overwrites it.
 */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number] | "landingPath" | "referrerHost" | "capturedAt", string>>;

const STORAGE_KEY = "s1.attribution.v1";
const MAX_VALUE = 200;

function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, MAX_VALUE);
  // Printable characters only; nothing that could smuggle markup or control characters into a CRM.
  return /^[\x20-\x7E]+$/.test(trimmed) && !/[<>"'`]/.test(trimmed) ? trimmed : undefined;
}

/** Reads campaign parameters from the current URL and stores them for this browser session. */
export function captureAttribution(location: Location = window.location, referrer = document.referrer): void {
  try {
    const params = new URLSearchParams(location.search);
    const found: Attribution = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = clean(params.get(key));
      if (value) found[key] = value;
    }
    // Only a visit that arrived from a campaign link is recorded. Ordinary visits keep nothing, so their
    // enquiries carry no `attribution` key at all (a v1-only receiver refuses unknown keys) and no
    // browsing detail is collected without a campaign reason.
    if (Object.keys(found).length === 0) return;
    let referrerHost: string | undefined;
    try {
      const host = referrer ? new URL(referrer).host : "";
      referrerHost = host && host !== location.host ? clean(host) : undefined;
    } catch {
      referrerHost = undefined;
    }
    const record: Attribution = {
      ...found,
      landingPath: clean(location.pathname),
      referrerHost,
      capturedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked (private mode, policy): attribution is optional and never blocks a visit.
  }
}

/** The stored attribution, re-validated, or undefined. */
export function readAttribution(): Attribution | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return sanitizeAttribution(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

// The receiver's own patterns (lancesat-enterprise-platform website_intake_contract.ts). A value that does
// not fit is dropped here on its own; sent as-is, the receiver refuses the WHOLE enquiry with 422 (audit L2-08).
const RECEIVER_HOST = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,62})(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,62}))*(?::\d{1,5})?$/;
const RECEIVER_PATH = /^\/[^?#\s]*$/;
// capturedAt: the receiver's ISO_TIME, at most 40 characters, and a date Date.parse accepts (AUDW-08).
const RECEIVER_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/;

function fitsReceiver(key: string, value: string): string | undefined {
  if (key === "referrerHost") {
    const host = value.toLowerCase().replace(/\.+$/, ""); // "www.google.com." is the same host
    return RECEIVER_HOST.test(host) ? host : undefined; // IPv6 literals and other forms are dropped
  }
  if (key === "landingPath") return RECEIVER_PATH.test(value) ? value : undefined;
  if (key === "capturedAt") return value.length <= 40 && RECEIVER_TIME.test(value) && Number.isFinite(Date.parse(value)) ? value : undefined;
  return value;
}

/** Accepts only known keys with short printable string values. Used by the browser and the server. */
export function sanitizeAttribution(input: unknown): Attribution | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined;
  const allowed = new Set<string>([...ATTRIBUTION_KEYS, "landingPath", "referrerHost", "capturedAt"]);
  const out: Attribution = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allowed.has(key) || typeof value !== "string") continue;
    const cleaned = clean(value);
    const fitted = cleaned ? fitsReceiver(key, cleaned) : undefined;
    if (fitted) out[key as keyof Attribution] = fitted;
  }
  // Campaign visits only: without a UTM tag or click identifier there is no campaign to attribute, so a
  // landing path, referrer or time on its own is not sent (AUDW-08; the capture rule above).
  return ATTRIBUTION_KEYS.some((key) => out[key]) ? out : undefined;
}
