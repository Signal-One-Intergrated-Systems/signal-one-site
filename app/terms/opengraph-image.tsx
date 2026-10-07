import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Website terms";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Website terms", "Signal One");
}
