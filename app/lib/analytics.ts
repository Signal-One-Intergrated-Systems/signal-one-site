/**
 * Public-site analytics. Dormant unless NEXT_PUBLIC_GA_ID is set (see
 * components/Analytics.tsx). Event names are the agreed funnel vocabulary;
 * do not add ad-hoc names.
 */
export const signalOneEvents = [
  "hero_product_proof",
  "hero_pricing",
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
