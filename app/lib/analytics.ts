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
  "reseller_application_start",
  "reseller_application_complete",
  "sales_partner_application_start",
  "sales_partner_application_complete",
  "partnership_enquiry_complete",
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
/**
 * Which commercial journey a saved enquiry belongs to, so radio purchases, radio rentals and
 * 1GUARD trial requests are measured separately (founder, 2026-11-26). Derived only from the
 * visitor's own answers; the same answers are stored with the enquiry in Signal One's customer records, where quotes,
 * contracts and revenue are tracked against it.
 */
export function leadJourney(data: Record<string, string>): string {
  const intent = data.intent || "";
  if (data.quoteType === "Buy radios") return "radio_purchase";
  if (data.quoteType === "Rent radios") return "radio_rental";
  if (data.quoteType === "Connect radios I already own") return "radio_own_connect";
  if (data.quoteType === "Help me choose") return "radio_help_choose";
  if (data.quoteType === "Compare buying and renting") return "radio_compare";
  if (intent === "company-onboarding") {
    const trial = (data.nextStep || "").startsWith("Request a 14-day 1GUARD trial") || (data.interests || "").includes("14-day 1GUARD trial request");
    return trial ? "guard_trial" : "onboarding";
  }
  if (intent === "tracking-quote") return "tracking_quote";
  if (intent === "bodycam-rental-quote") return "bodycam_quote";
  if (intent === "marketplace-interest") return "guard_marketplace";
  if (intent === "consultation") return "general_enquiry";
  return intent || "unknown";
}

export function trackLeadConversion(reference: string, intent: string | undefined, journey?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "generate_lead", { transaction_id: reference, lead_intent: intent, lead_journey: journey });
  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION;
  if (sendTo) window.gtag("event", "conversion", { send_to: sendTo, transaction_id: reference });
}
