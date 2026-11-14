/**
 * AUDIT helper: true pixel dimensions and transfer size of every image variant the capture pass saw.
 * Chrome's img.naturalWidth honours embedded density metadata (the optimiser's AVIF output of a 72 dpi PNG reports
 * 75% of its pixel width), so "is this image upscaled" must be judged against decoded pixels, not naturalWidth.
 * Run AFTER 01-capture. Local build only.
 */
import fs from "node:fs";
import path from "node:path";
import { test } from "@playwright/test";
import { BASE, OUT, writeJson } from "./lib";

test("true pixel size of every served image variant", async ({ request }) => {
  const sharp = (await import("sharp")).default;
  const root = path.join(OUT, "data", "parts", "capture");
  const srcs = new Set<string>();
  const walk = (dir: string) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const f = path.join(dir, e.name); if (e.isDirectory()) walk(f); else if (f.endsWith(".json")) { const d = JSON.parse(fs.readFileSync(f, "utf8")); for (const i of d.dom.images) if (i.src && i.src.startsWith("/")) srcs.add(i.src); for (const b of d.dom.backgrounds) for (const u of b.urls) if (u.startsWith("/")) srcs.add(u); } } };
  walk(root);
  const out: Record<string, unknown> = {};
  for (const src of srcs) {
    const r = await request.get(BASE + src, { headers: { accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" }, failOnStatusCode: false });
    const body = await r.body();
    let meta: { width?: number; height?: number; format?: string; density?: number } = {};
    try { meta = await sharp(body, { limitInputPixels: false }).metadata(); } catch { /* not decodable by sharp */ }
    out[src] = { status: r.status(), contentType: r.headers()["content-type"], bytes: body.length, pixelWidth: meta.width ?? null, pixelHeight: meta.height ?? null, format: meta.format ?? null, density: meta.density ?? null, cacheControl: r.headers()["cache-control"] || null };
  }
  writeJson("parts/image-truth.json", out);
});
