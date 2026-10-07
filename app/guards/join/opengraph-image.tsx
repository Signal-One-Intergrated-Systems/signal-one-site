import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "Create your security officer profile";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Create your security officer profile", "Private, never shown publicly");
}
