import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt = "Know who is on post, and prove it";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Know who is on post, and prove it", "Guard attendance and clock-in");
}
