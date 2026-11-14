import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "Signal One. The right equipment. Ready for the field.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("The right equipment. Ready for the field.", "Signal One");
}
