import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Privacy policy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Privacy policy", "Signal One");
}
