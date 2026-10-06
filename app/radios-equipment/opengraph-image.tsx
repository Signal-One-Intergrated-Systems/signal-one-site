import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "PTT radio rental for security companies";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("PTT radio rental for security companies", "Radios, tracking and body cameras, by quote");
}
