import type { MetadataRoute } from "next";

const base = "https://signal-one-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/get-started",
    "/join/sales",
    "/guards",
    "/guards/join",
    "/marketplace",
    "/systems",
    "/solutions",
    "/solutions/security",
    "/solutions/agriculture",
    "/solutions/construction",
    "/solutions/logistics",
    "/solutions/public-safety",
    "/solutions/utilities",
    "/platforms",
    "/platforms/push-to-talk",
    "/platforms/aiot-management",
    "/devices",
    "/devices/poc-radios",
    "/devices/lorawan-sensors",
    "/connectivity",
    "/connectivity/iot-sim",
    "/partners",
    "/contact",
  ];

  return routes.map((route) => ({
    url: base + route,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/marketplace" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/get-started" || route === "/marketplace"
          ? 0.9
          : route === "/solutions/security"
            ? 0.85
            : 0.7,
  }));
}
