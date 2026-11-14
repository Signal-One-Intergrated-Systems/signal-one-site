import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "1Service. Run your service business. As one.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Run your service business. As one.", "1Service");
}
