import type { MetadataRoute } from "next";

const base =
  process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/guard-marketplace",
    "/radios-equipment",
    "/pricing",
    "/solutions/security",
    "/get-started",
    "/contact",
    "/guards",
    "/guards/join",
    "/security-trust",
    "/privacy",
    "/popia",
    "/terms",
  ];

  return routes.map((route) => ({
    url: base + route,
    lastModified: new Date(),
    changeFrequency:
      route === "" ||
      route === "/guard-marketplace" ||
      route === "/radios-equipment" ||
      route === "/pricing"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/pricing" ||
            route === "/guard-marketplace" ||
            route === "/radios-equipment"
          ? 0.9
          : route === "/solutions/security" ||
              route === "/get-started" ||
              route === "/contact"
            ? 0.85
            : route.startsWith("/guards")
              ? 0.7
              : 0.45,
  }));
}
