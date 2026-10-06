import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "POPIA and data handling";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("POPIA and data handling", "Signal One");
}
