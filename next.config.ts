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
    // Baseline for every public route. Script and style allow 'unsafe-inline' because
    // Next.js emits inline bootstrap scripts and the layout inlines JSON-LD; tightening
    // to nonces is tracked in SITE_INTEGRATION.md. Listed first so the stricter
    // Signal Connect rules below still win on their own paths.
    const ga = "https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com";
    const publicHeaders = [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          `script-src 'self' 'unsafe-inline' ${ga}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
          "font-src 'self' data:",
          `connect-src 'self' ${ga}`,
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "object-src 'none'",
          "form-action 'self'",
        ].join("; "),
      },
    ];
    return [
      { source: "/:path*", headers: publicHeaders },
      ...["/connect/:path*", "/present/:path*", "/contact/andisiwe", "/qr/:path*", "/connect-assets/:path*"].map(source => ({ source, headers })),
    ];
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
