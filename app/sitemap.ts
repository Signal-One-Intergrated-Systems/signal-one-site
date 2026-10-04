import type { MetadataRoute } from "next";

const base = "https://signal-one-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/get-started",
    "/join/sales",
    "/guards",
    "/guards/join",
    "/systems",
    "/solutions",
    "/solutions/security",
    "/platforms",
    "/devices",
    "/connectivity",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/guards" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/get-started" || route === "/guards" ? 0.9 : 0.7,
  }));
}
