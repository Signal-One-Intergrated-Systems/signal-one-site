import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging review copies are never crawled.
  if (process.env.SITE_NOINDEX === "1") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/connect/", "/present/", "/contact/andisiwe", "/qr/", "/connect-assets/"],
    },
    sitemap: siteUrl + "/sitemap.xml",
    host: siteUrl,
  };
}
