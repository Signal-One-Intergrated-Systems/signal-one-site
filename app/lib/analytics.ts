/**
 * Public-site analytics. Dormant unless NEXT_PUBLIC_GA_ID is set (see
 * components/Analytics.tsx). Event names are the agreed funnel vocabulary;
 * do not add ad-hoc names.
 */
export const signalOneEvents = [
  "homepage_trial_cta",
  "homepage_service_interest",
  "homepage_equipment_quote",
  "hero_product_proof",
  "hero_pricing",
  "buy_guard_days",
  "guard_pricing_interaction",
  "consultation_start",
  "consultation_complete",
  "marketplace_interest",
  "equipment_quote_start",
  "equipment_quote_complete",
  "client_onboarding_start",
  "client_onboarding_complete",
  "guard_join_start",
  "guard_join_complete",
  "sales_application_start",
  "sales_application_complete",
] as const;

export type SignalOneEvent = (typeof signalOneEvents)[number];

export function isSignalOneEvent(value: string | undefined): value is SignalOneEvent {
  return !!value && (signalOneEvents as readonly string[]).includes(value);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: SignalOneEvent,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}

/**
 * A sales enquiry that the receiver has durably saved. Fired once per receipt (never on a duplicate),
 * only for client enquiries: guard and job applications are not sales leads. The receipt reference is
 * the transaction_id, so GA4 and Google Ads both de-duplicate a repeated report of the same lead.
 * Dormant unless NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION are configured.
 */
export function trackLeadConversion(reference: string, intent: string | undefined) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "generate_lead", { transaction_id: reference, lead_intent: intent });
  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION;
  if (sendTo) window.gtag("event", "conversion", { send_to: sendTo, transaction_id: reference });
}
