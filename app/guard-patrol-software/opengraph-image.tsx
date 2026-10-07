import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Prove the patrol was walked";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Prove the patrol was walked", "Guard patrol software");
}
