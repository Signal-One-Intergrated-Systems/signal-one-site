import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "Run security operations from the record";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Run security operations from the record", "The platform");
}
