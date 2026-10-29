import type { NextConfig } from "next";

const legacyRedirects = [
  ["/workforce", "/service"],
  ["/connectivity", "/radios-equipment"],
  ["/connectivity/:path*", "/radios-equipment"],
  ["/devices", "/radios-equipment"],
  ["/devices/:path*", "/radios-equipment"],
  ["/platforms", "/"],
  ["/platforms/aiot-management", "/"],
  ["/platforms/push-to-talk", "/radios-equipment"],
  ["/solutions", "/solutions/security"],
  ["/solutions/agriculture", "/solutions/security"],
  ["/solutions/construction", "/solutions/security"],
  ["/solutions/logistics", "/solutions/security"],
  ["/solutions/public-safety", "/solutions/security"],
  ["/solutions/utilities", "/solutions/security"],
  ["/systems", "/"],
  ["/marketplace", "/guard-marketplace"],
  ["/partners", "/contact"],
] as const;

const nextConfig: NextConfig = {
  // QA builds a second copy (GUARD_STATUS=live) beside the normal one.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    const headers = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
      { key: "X-Signal-Connect-Release", value: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "local" },
    ];
    return ["/connect/:path*", "/present/:path*", "/contact/andisiwe", "/qr/:path*", "/connect-assets/:path*"].map(source => ({ source, headers }));
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 90],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
