import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Talk to Signal One";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Talk to Signal One", "Security guard software");
}
