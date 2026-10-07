import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Start onboarding your security company";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Start onboarding your security company", "Signal One Security");
}
