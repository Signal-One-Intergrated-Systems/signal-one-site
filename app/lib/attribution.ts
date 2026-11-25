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

/** Accepts only known keys with short printable string values. Used by the browser and the server. */
export function sanitizeAttribution(input: unknown): Attribution | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined;
  const allowed = new Set<string>([...ATTRIBUTION_KEYS, "landingPath", "referrerHost", "capturedAt"]);
  const out: Attribution = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allowed.has(key) || typeof value !== "string") continue;
    const cleaned = clean(value);
    if (cleaned) out[key as keyof Attribution] = cleaned;
  }
  return Object.keys(out).length ? out : undefined;
}
