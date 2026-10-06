import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "R2 per guard per day";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("R2 per guard per day", "Excluding VAT. No tiers or packages.");
}
