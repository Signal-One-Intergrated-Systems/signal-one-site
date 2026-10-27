import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
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
