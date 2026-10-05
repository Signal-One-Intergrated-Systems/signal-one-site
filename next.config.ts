import type { NextConfig } from "next";

const legacyRedirects = [
  ["/connectivity", "/radios-equipment"],
  ["/connectivity/:path*", "/radios-equipment"],
  ["/devices", "/radios-equipment"],
  ["/devices/:path*", "/radios-equipment"],
  ["/platforms", "/#platform"],
  ["/platforms/aiot-management", "/#platform"],
  ["/platforms/push-to-talk", "/radios-equipment"],
  ["/solutions", "/solutions/security"],
  ["/solutions/agriculture", "/solutions/security"],
  ["/solutions/construction", "/solutions/security"],
  ["/solutions/logistics", "/solutions/security"],
  ["/solutions/public-safety", "/solutions/security"],
  ["/solutions/utilities", "/solutions/security"],
  ["/systems", "/#platform"],
  ["/marketplace", "/radios-equipment"],
  ["/partners", "/contact"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
