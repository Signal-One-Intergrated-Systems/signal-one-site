import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

// /join/sales is intentionally excluded (noindex careers page).
const routes: ReadonlyArray<[string, MetadataRoute.Sitemap[number]["changeFrequency"], number]> = [
  ["", "weekly", 1],
  ["/solutions/security", "monthly", 0.9],
  ["/pricing", "monthly", 0.9],
  ["/radios-equipment", "monthly", 0.85],
  ["/guard-marketplace", "monthly", 0.8],
  ["/contact", "monthly", 0.8],
  ["/get-started", "monthly", 0.7],
  ["/guards", "monthly", 0.7],
  ["/guards/join", "monthly", 0.6],
  ["/security-trust", "yearly", 0.4],
  ["/popia", "yearly", 0.3],
  ["/privacy", "yearly", 0.3],
  ["/terms", "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(([route, changeFrequency, priority]) => ({
    url: siteUrl + route,
    lastModified,
    changeFrequency,
    priority,
  }));
}
