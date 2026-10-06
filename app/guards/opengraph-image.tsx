import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Your work, on record";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Your work, on record", "For security officers");
}
