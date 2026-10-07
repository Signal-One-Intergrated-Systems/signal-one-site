import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Open Graph images, generated at build time with the dark Signal One lockup
 * (docs/BRAND.md) and the page title. Static: no per-request work.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontsDir = path.join(process.cwd(), "app", "lib", "fonts");

async function fonts() {
  const [bold, semi] = await Promise.all([readFile(path.join(fontsDir, "Inter-Bold.ttf")), readFile(path.join(fontsDir, "Inter-SemiBold.ttf"))]);
  return [
    { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: semi, weight: 600 as const, style: "normal" as const },
  ];
}

export async function renderOg(title: string, kicker?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F131A",
          padding: "64px 72px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="76" height="76" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="15" stroke="#38BDF8" strokeWidth="1" opacity="0.35" />
            <circle cx="17" cy="17" r="9.5" stroke="#38BDF8" strokeWidth="1.4" opacity="0.7" />
            <circle cx="17" cy="17" r="4" fill="#0EA5E9" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 22 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1, color: "#F1F5F9" }}>
              <span>SIGNAL&nbsp;</span>
              <span style={{ color: "#38BDF8" }}>ONE</span>
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 16, fontWeight: 600, letterSpacing: "0.42em", color: "#94A3B8" }}>INTEGRATED SYSTEMS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {kicker ? <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#38BDF8", marginBottom: 18 }}>{kicker}</div> : null}
          <div style={{ display: "flex", fontSize: title.length > 48 ? 64 : 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.04, color: "#F1F5F9", maxWidth: 1000 }}>{title}</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
