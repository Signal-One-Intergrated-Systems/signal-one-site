import { ogContentType, ogSize, renderOg } from "../lib/og";
import { guardDayPricePhrase } from "../lib/pricing";

export const alt = guardDayPricePhrase;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg(guardDayPricePhrase, "Excluding VAT. No tiers or packages.");
}
