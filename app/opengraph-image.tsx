import { ogContentType, ogSize, renderOg } from "./lib/og";

export const alt = "Run every site. Prove the service.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Run every site. Prove the service.", "Signal One Security");
}
