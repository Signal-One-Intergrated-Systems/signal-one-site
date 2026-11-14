/**
 * AUDIT (Phase 2, D-009): is any photograph drawn larger than the pixels the browser actually decoded?
 * For every route and width, every visible raster <img> is compared with the DECODED pixel size of the variant
 * the browser chose (fetched and measured with sharp, because Chrome's naturalWidth is density-scaled) and with
 * the pixel size of the original file, so "sizes hint too small" can be told apart from "source too small".
 * scale = cover: max(boxW/pxW, boxH/pxH); contain: min(...). DPR 1.
 *
 * env: AUDIT_WIDTHS (default "390,820,1440"), AUDIT_LABEL
 */
import { test } from "@playwright/test";
import { BASE, pageRoutes, scrollThrough, writeJson } from "./lib";

const widths = (process.env.AUDIT_WIDTHS || "390,820,1440").split(",").map(Number);
const heights: Record<number, number> = { 390: 844, 820: 1180, 1024: 768, 1280: 800, 1440: 900, 1920: 1080 };

test("image display scale against decoded pixels", async ({ browser, request }) => {
  test.setTimeout(40 * 60_000);
  const sharp = (await import("sharp")).default;
  const cache = new Map<string, { w: number; h: number } | null>();
  const size = async (url: string) => {
    if (cache.has(url)) return cache.get(url)!;
    let v: { w: number; h: number } | null = null;
    try {
      const r = await request.get(url.startsWith("http") ? url : BASE + url, { headers: { accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8" }, failOnStatusCode: false });
      const m = await sharp(await r.body(), { limitInputPixels: false }).metadata();
      if (m.width && m.height) v = { w: m.width, h: m.height };
    } catch { v = null; }
    cache.set(url, v);
    return v;
  };
  const rows: Array<Record<string, unknown>> = [];
  let checked = 0;
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: heights[width] || 900 }, deviceScaleFactor: 1, locale: "en-ZA", reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const route of pageRoutes.filter((r) => r.slug !== "workforce")) {
      await page.goto(route.path, { waitUntil: "networkidle" });
      await scrollThrough(page);
      await page.waitForLoadState("networkidle").catch(() => undefined);
      const images = await page.evaluate(() => Array.from(document.images).map((img) => {
        const r = img.getBoundingClientRect(); const cs = getComputedStyle(img);
        const visible = r.width > 8 && r.height > 8 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05;
        let original = ""; let src = img.currentSrc || img.src;
        try { const u = new URL(src); if (u.pathname === "/_next/image") original = u.searchParams.get("url") || ""; src = u.pathname + u.search; } catch { /* keep */ }
        const parent = img.closest("section,[id]");
        return { src, original, visible, w: Math.round(r.width), h: Math.round(r.height), fit: cs.objectFit, sizes: img.getAttribute("sizes"), alt: (img.getAttribute("alt") || "").slice(0, 50), where: parent ? parent.tagName.toLowerCase() + (parent.id ? "#" + parent.id : "." + String(parent.className).split(" ")[0]) : "" };
      }));
      for (const im of images) {
        if (!im.visible || /\.svg(\?|$)/.test(im.src) || im.src.startsWith("data:")) continue;
        const decoded = await size(im.src);
        if (!decoded) continue;
        checked++;
        const sx = im.w / decoded.w, sy = im.h / decoded.h;
        const scale = +(im.fit === "contain" || im.fit === "scale-down" ? Math.min(sx, sy) : Math.max(sx, sy)).toFixed(3);
        if (scale <= 1.0) continue;
        const source = await size(im.original || im.src.split("?")[0]);
        const ssx = source ? im.w / source.w : 0, ssy = source ? im.h / source.h : 0;
        const sourceScale = source ? +(im.fit === "contain" || im.fit === "scale-down" ? Math.min(ssx, ssy) : Math.max(ssx, ssy)).toFixed(3) : null;
        const aspect = source ? source.w / source.h : decoded.w / decoded.h;
        const neededWidth = Math.ceil(im.fit === "contain" || im.fit === "scale-down" ? Math.min(im.w, im.h * aspect) : Math.max(im.w, im.h * aspect));
        rows.push({ width, route: route.path, where: im.where, alt: im.alt, box: `${im.w}x${im.h}`, fit: im.fit, decoded: `${decoded.w}x${decoded.h}`, scale, source: source ? `${source.w}x${source.h}` : null, sourceScale, sourceTooSmall: sourceScale !== null && sourceScale > 1.0, neededSourceWidth: neededWidth, sizes: im.sizes, file: (im.original || im.src).slice(0, 80) });
      }
    }
    await context.close();
  }
  rows.sort((a, b) => (b.scale as number) - (a.scale as number));
  writeJson(`parts/probes/image-scale-${process.env.AUDIT_LABEL || "after"}.json`, { widths, imagesChecked: checked, above1: rows.length, sourceTooSmall: rows.filter((r) => r.sourceTooSmall).length, rows });
  console.log(`image-scale: widths=${widths.join(",")} checked=${checked} above1.0=${rows.length} sourceTooSmall=${rows.filter((r) => r.sourceTooSmall).length}`);
  for (const r of rows) console.log(`${r.width} ${r.route} ${r.where} | box ${r.box} ${r.fit} | decoded ${r.decoded} x${r.scale} | source ${r.source} x${r.sourceScale} | need ${r.neededSourceWidth}w | sizes=${r.sizes} | ${r.file}`);
});
