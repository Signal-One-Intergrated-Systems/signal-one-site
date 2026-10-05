import type { MetadataRoute } from "next";

const base = "https://signal-one-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/get-started",
    "/join/sales",
    "/guards",
    "/guards/join",
    "/tour",
    "/pricing",
    "/trust",
    "/insights",
    "/insights/security-contracts-fail-quietly",
    "/insights/control-room-exception-management",
    "/insights/digital-occurrence-book",
    "/marketplace",
    "/systems",
    "/solutions",
    "/solutions/security",
    "/solutions/security/guard-management",
    "/solutions/security/patrol-verification",
    "/solutions/security/attendance",
    "/solutions/security/electronic-occurrence-book",
    "/solutions/security/control-room",
    "/solutions/security/client-proof",
    "/solutions/security/push-to-talk",
    "/solutions/agriculture",
    "/solutions/logistics",
    "/solutions/utilities",
    "/platforms",
    "/platforms/push-to-talk",
    "/platforms/aiot-management",
    "/devices",
    "/devices/poc-radios",
    "/devices/lorawan-sensors",
    "/connectivity",
    "/connectivity/iot-sim",
    "/contact",
  ];

  return routes.map((route) => ({
    url: base + route,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/marketplace" || route.startsWith("/insights") ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/tour" || route === "/pricing"
          ? 0.9
          : route === "/solutions/security" || route.startsWith("/solutions/security/") || route === "/trust"
            ? 0.85
            : route === "/insights"
              ? 0.8
            : route === "/get-started" || route === "/marketplace"
              ? 0.8
              : 0.7,
  }));
}
