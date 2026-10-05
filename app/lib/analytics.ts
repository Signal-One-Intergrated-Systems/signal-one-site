export type SignalOneEvent =
  | "hero_product_proof"
  | "hero_pricing"
  | "header_get_started"
  | "footer_product_proof"
  | "contact_begin"
  | "guard_pricing_interaction"
  | "onboarding_begin"
  | "onboarding_complete"
  | "equipment_quote_begin"
  | "equipment_quote_complete"
  | "marketplace_interest";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: SignalOneEvent | string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
