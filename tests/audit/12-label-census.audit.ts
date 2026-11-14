/**
 * AUDIT (final round, D-025/D-026): census of small accent and caption text.
 * Unlike the sweep (one element per colour/class signature per page), this measures EVERY visible text element whose
 * computed colour is one of the accent or caption inks, on every route, at 390 / 820 / 1440, against rendered pixels
 * (three samples beside the glyphs; median and minimum reported). Brand lockups are reported separately.
 * env: AUDIT_LABEL; AUDIT_CENSUS_BASELINE (label of an earlier run: every element it measured is measured again,
 *      found by route + tag + text, whatever its colour is now, so before/after pairs line up)
 */
import fs from "node:fs";
import { test, type Page } from "@playwright/test";
import { OUT, contextOptions, pageRoutes, writeJson, type ViewportName } from "./lib";

const lum = (r: number, g: number, b: number) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number[], b: number[]) => { const l1 = lum(a[0], a[1], a[2]), l2 = lum(b[0], b[1], b[2]); return +((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2); };
async function pixel(page: Page, x: number, y: number, w = 4, h = 4) {
  const sharp = (await import("sharp")).default;
  const vp = page.viewportSize()!;
  const clip = { x: Math.max(0, Math.min(vp.width - w, Math.round(x))), y: Math.max(0, Math.min(vp.height - h, Math.round(y))), width: w, height: h };
  const { data, info } = await sharp(await page.screenshot({ clip })).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch: number[][] = [[], [], []];
  for (let i = 0; i < data.length; i += info.channels) { ch[0].push(data[i]); ch[1].push(data[i + 1]); ch[2].push(data[i + 2]); }
  return ch.map((c) => c.sort((a, b) => a - b)[Math.floor(c.length / 2)]);
}

for (const viewport of ["desktop", "tablet", "mobile"] as ViewportName[]) {
  test(`label census ${viewport}`, async ({ browser }) => {
    test.setTimeout(30 * 60_000);
    const context = await browser.newContext(contextOptions(viewport, { reducedMotion: "reduce" }));
    const page = await context.newPage();
    const rows: Array<Record<string, unknown>> = [];
    const baselineLabel = process.env.AUDIT_CENSUS_BASELINE;
    const baseline: Array<{ route: string; tag: string; text: string }> = baselineLabel ? JSON.parse(fs.readFileSync(`${OUT}/data/parts/probes/label-census-${viewport}-${baselineLabel}.json`, "utf8")) : [];
    for (const route of pageRoutes.filter((r) => r.group === "marketing" && r.slug !== "workforce")) {
      await page.goto(route.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const wanted = baseline.filter((r) => r.route === route.path).map((r) => r.tag + "|" + r.text);
      const found = await page.evaluate((wanted) => {
        const out: Array<{ i: number; text: string; rgb: number[]; fontPx: number; weight: number; cls: string; tag: string; brand: boolean; home: string }> = [];
        let i = 0;
        for (const el of Array.from(document.querySelectorAll("main *, header *"))) {
          const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 1);
          if (!own || el.closest("svg, canvas, [aria-hidden=true], .sr-only")) continue;
          const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
          if (r.width < 4 || r.height < 4 || cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.5) continue;
          const rgb = (cs.color.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
          const key = rgb.join(",");
          const fontPx = parseFloat(cs.fontSize);
          const cls = typeof el.className === "string" ? el.className : "";
          // accent blue, and the small caption / note classes of the homepage and the muted caption ink
          const isAccent = key === "56,189,248";
          const isNote = /so-hero-photo-note|so-editorial-disclosure|so-hardware-note|so-image-caption|photo-caption|text-text-inv-3|t-caption/.test(cls);
          const text60 = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
          if (!isAccent && !isNote && !wanted.includes(el.tagName + "|" + text60)) continue;
          el.setAttribute("data-census", String(i));
          out.push({ i, text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60), rgb, fontPx, weight: Number(cs.fontWeight) || 400, cls: cls.slice(0, 80), tag: el.tagName, brand: !!el.closest(".s1-product-signature, [class*='logo'], [class*='Logo'], header a[href='/']"), home: el.closest("header") ? "header" : "main" });
          i++;
        }
        return out;
      }, wanted);
      for (const c of found) {
        const loc = page.locator(`[data-census="${c.i}"]`);
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        await page.waitForTimeout(120);
        const box = await loc.evaluate((el) => { const range = document.createRange(); range.selectNodeContents(el); const r = range.getClientRects()[0] || el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }).catch(() => null);
        if (!box) continue;
        const vp = page.viewportSize()!;
        if (box.y < 0 || box.y > vp.height - 4) continue;
        const samples = [await pixel(page, box.x - 7, box.y + box.h / 2), await pixel(page, box.x + box.w + 4, box.y + box.h / 2), await pixel(page, box.x + 2, box.y - 3, 4, 2)];
        const ratios = samples.map((s) => ratio(c.rgb, s));
        const large = c.fontPx >= 24 || (c.fontPx >= 18.66 && c.weight >= 700);
        const need = large ? 3 : 4.5;
        const median = [...ratios].sort((a, b) => a - b)[1];
        rows.push({ route: route.path, text: c.text, tag: c.tag, cls: c.cls, color: `rgb(${c.rgb.join(", ")})`, fontPx: c.fontPx, region: c.home, brand: c.brand, required: need, ratios, median, min: Math.min(...ratios), passesMedian: median >= need, passesAll: Math.min(...ratios) >= need });
      }
    }
    const label = process.env.AUDIT_LABEL || "after";
    writeJson(`parts/probes/label-census-${viewport}-${label}.json`, rows);
    const bad = rows.filter((r) => !r.passesMedian);
    console.log(`census ${viewport}: measured=${rows.length} failMedian=${bad.length} failAny=${rows.filter((r) => !r.passesAll).length}`);
    for (const r of rows.filter((x) => !x.passesAll)) console.log(`${viewport} ${r.route} | ${String(r.text).slice(0, 40)} | ${r.color} ${r.fontPx}px | ${(r.ratios as number[]).join("/")} | need ${r.required} | ${r.brand ? "BRAND " : ""}${r.passesMedian ? "median-ok" : "FAIL"} | ${String(r.cls).slice(0, 50)}`);
    await context.close();
  });
}
