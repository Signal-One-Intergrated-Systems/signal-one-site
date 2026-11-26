import type { Metadata } from "next";
import { brand } from "./site";

const BRAND_SUFFIX = " | Signal One";

/**
 * Page metadata with page-specific social previews. Before this, every page inherited the layout's
 * homepage Open Graph title and URL, so shared links all previewed as the homepage (independent
 * review, 2026-11). Derives og/twitter title, description and URL from the page's own title,
 * description and canonical. A route's opengraph-image file, where present, still wins for images.
 */
export function pageMetadata(m: Metadata & { alternates: { canonical: string } }): Metadata {
  const t = m.title;
  const fullTitle = typeof t === "string" ? t + BRAND_SUFFIX : t && typeof t === "object" && "absolute" in t ? String(t.absolute) : brand.master;
  const description = typeof m.description === "string" ? m.description : undefined;
  const url = m.alternates.canonical;
  return {
    ...m,
    openGraph: { type: "website", siteName: brand.master, locale: "en_ZA", title: fullTitle, description, url, ...(m.openGraph ?? {}) },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...(m.twitter ?? {}) },
  };
}
