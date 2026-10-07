import type { NextConfig } from "next";

const legacyRedirects = [
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
