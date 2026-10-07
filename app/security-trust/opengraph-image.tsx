import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Security and trust";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Security and trust", "Access control, audit, no invented certifications");
}
