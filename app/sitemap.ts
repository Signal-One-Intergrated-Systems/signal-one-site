import type { MetadataRoute } from "next";

const base =
  process.env.NEXT_PUBLIC_SITE_URL || "https://signal-one-site.up.railway.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/get-started",
    "/guard-marketplace",
    "/radios-equipment",
    "/pricing",
    "/solutions/security",
    "/guards",
    "/guards/join",
    "/contact",
  ];

  return routes.map((route) => ({
    url: base + route,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/guard-marketplace" || route === "/radios-equipment"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/get-started" || route === "/pricing"
          ? 0.9
          : route === "/guard-marketplace" ||
              route === "/radios-equipment" ||
              route === "/solutions/security"
            ? 0.85
            : 0.7,
  }));
}
