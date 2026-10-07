import { num, rand } from "./format";

/**
 * The one source of the public Guard Day price. Every price on the site
 * (copy, calculator, worked examples, metadata, JSON-LD, OG images, tests)
 * reads from here. To change the price, edit `pricePerGuardDay` and
 * `effectiveDate` only.
 *
 * R2.50 is pending founder confirmation; until then the price stays R2.00.
 * Sales OS and Admin keep their own price books in other repositories and
 * must be aligned separately (SITE_INTEGRATION.md).
 */
export const pricing = {
  pricePerGuardDay: 2.0,
  currency: "ZAR",
  vatRate: 0.15,
  minimumGuardDays: 10,
  carryOver: true,
  effectiveDate: "2026-10-07",
} as const;

/** "R2" (or "R2,50"): the price of one guard day, excl. VAT. */
export const guardDayPrice = rand(pricing.pricePerGuardDay);

/** "R2 per guard per day" */
export const guardDayPricePhrase = guardDayPrice + " per guard per day";

/** "R2/day" for tight spaces. */
export const guardDayPriceShort = guardDayPrice + "/day";

/** "2.00": schema.org price. */
export const schemaPrice = pricing.pricePerGuardDay.toFixed(2);

/** "15%" */
export const vatPercent = num(pricing.vatRate * 100) + "%";

/** "10 guard days" */
export const minimumPhrase = num(pricing.minimumGuardDays) + " guard days";

/** "Excluding VAT. Minimum purchase 10 guard days." */
export const priceTerms = "Excluding VAT. Minimum purchase " + minimumPhrase + ".";

/** "Carry over." */
export const carryOverPhrase = pricing.carryOver ? "Carry over." : "Do not carry over.";

/** "R2 per guard per day, excluding VAT. Minimum purchase 10 guard days." */
export const priceSentence = guardDayPricePhrase + ", excluding VAT. Minimum purchase " + minimumPhrase + ".";

/** Guard days billed for a request, with the minimum applied. */
export function billableGuardDays(requested: number) {
  return requested > 0 ? Math.max(requested, pricing.minimumGuardDays) : 0;
}

export function exVat(guardDays: number) {
  return guardDays * pricing.pricePerGuardDay;
}

export function incVat(amountExVat: number) {
  return amountExVat * (1 + pricing.vatRate);
}
