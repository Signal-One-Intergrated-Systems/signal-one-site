// This route sets its own Open Graph block, which drops the inherited image; keep the site card it showed before.
import Image, { alt as siteAlt } from "../../opengraph-image";
import { ogContentType, ogSize } from "../../../lib/og";

export const alt = siteAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default Image;
