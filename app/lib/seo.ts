import type { Metadata } from "next";
import { brand } from "./site";

/** Must match the title template in app/(marketing)/layout.tsx. */
const TITLE_SUFFIX = " | Signal One";

type PageMeta = Metadata & { alternates: { canonical: string }; description: string };

/**
 * Adds a page's own Open Graph and Twitter fields to its metadata.
 *
 * Next.js replaces (does not merge) `openGraph` and `twitter` per route segment. Pages that set only
 * title, description and canonical therefore inherited the layout's social block and every page was
 * shared as the homepage: same og:url, og:title, og:description and twitter:title. Wrapping the page's
 * metadata in this keeps og:url equal to its canonical and the social title/description equal to its own.
 * Images still come from each route's opengraph-image file.
 */
export function withSocial(meta: PageMeta): Metadata {
  const raw = meta.title;
  const title =
    typeof raw === "string" ? raw + TITLE_SUFFIX
    : raw && typeof raw === "object" && "absolute" in raw && raw.absolute ? raw.absolute
    : brand.master;
  return {
    ...meta,
    openGraph: { title, description: meta.description, url: meta.alternates.canonical, type: "website", siteName: brand.master, locale: "en_ZA" },
    twitter: { card: "summary_large_image", title, description: meta.description },
  };
}
