import { ogContentType, ogSize, renderOg } from "../../../lib/og";

export const alt = "Signal One. Sell the operating systems SMEs run on.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Sell the operating systems SMEs run on.", "Signal One");
}
