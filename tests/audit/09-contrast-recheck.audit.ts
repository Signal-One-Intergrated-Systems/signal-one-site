/**
 * AUDIT re-measurement (Phase 2): every text that failed the Phase 1 pixel contrast sweep is located again by
 * route + text and measured the same way (computed text colour against the median of pixels sampled beside the
 * glyphs in a real screenshot). Unlike the sweep, light text is not skipped, so fixed items are measured too.
 * Also measures the /get-started stepper numerals (A-001) against the pixels inside their own disc.
 *
 * env: AUDIT_BASELINE (dir holding the Phase 1 parts/probes/pixel-contrast-*.json, default /home/claude/audit-out/data)
 */
import { test, type Page } from "@playwright/test";
import fs from "node:fs";
import { contextOptions, writeJson, type ViewportName } from "./lib";

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
const baselineDir = process.env.AUDIT_BASELINE || "/home/claude/audit-out/data";

for (const viewport of ["desktop", "mobile"] as ViewportName[]) {
  test(`contrast re-measure ${viewport}`, async ({ browser }) => {
    const baseline = JSON.parse(fs.readFileSync(`${baselineDir}/parts/probes/pixel-contrast-${viewport}.json`, "utf8")) as Record<string, { failures: Array<{ text: string; color: string; medianRatio: number; required: number; sig: string }> }>;
    const context = await browser.newContext(contextOptions(viewport, { reducedMotion: "reduce" }));
    const page = await context.newPage();
    const rows: unknown[] = [];
    for (const [route, entry] of Object.entries(baseline)) {
      if (!entry.failures.length) continue;
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      for (const f of entry.failures) {
        const tag = f.sig.split("|").pop()!;
        const found = await page.evaluate(({ text, tag }) => {
          const norm = (s: string) => s.replace(/\s+/g, " ").trim();
          for (const el of Array.from(document.querySelectorAll("main *, footer *, header *"))) {
            if (el.tagName !== tag) continue;
            const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 2);
            if (!own || norm(el.textContent || "").slice(0, 70) !== text) continue;
            const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
            if (r.width < 4 || r.height < 4 || cs.visibility === "hidden" || cs.display === "none") continue;
            el.setAttribute("data-audit-rc", "1");
            return true;
          }
          return false;
        }, { text: f.text, tag });
        if (!found) { rows.push({ route, text: f.text, before: { color: f.color, ratio: f.medianRatio }, after: null, note: "text no longer present" }); continue; }
        const loc = page.locator('[data-audit-rc="1"]').first();
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        await page.waitForTimeout(150);
        const info = await loc.evaluate((el) => { const range = document.createRange(); range.selectNodeContents(el); const r = range.getClientRects()[0] || el.getBoundingClientRect(); const cs = getComputedStyle(el); const rgb = cs.color.match(/[\d.]+/g)!.map(Number).slice(0, 3); el.removeAttribute("data-audit-rc"); return { x: r.left, y: r.top, w: r.width, h: r.height, rgb, fontPx: parseFloat(cs.fontSize), weight: Number(cs.fontWeight) || 400 }; });
        const samples = [await pixel(page, info.x - 7, info.y + info.h / 2), await pixel(page, info.x + info.w + 4, info.y + info.h / 2), await pixel(page, info.x + 2, info.y - 3, 4, 2)];
        const ratios = samples.map((s) => ratio(info.rgb, s));
        const large = info.fontPx >= 24 || (info.fontPx >= 18.66 && info.weight >= 700);
        const median = [...ratios].sort((a, b) => a - b)[1];
        rows.push({ route, text: f.text, required: large ? 3 : 4.5, before: { color: f.color, ratio: f.medianRatio }, after: { color: `rgb(${info.rgb.join(", ")})`, ratio: median, ratios, backgroundSamples: samples.map((s) => `rgb(${s.join(", ")})`) }, passes: median >= (large ? 3 : 4.5) });
      }
    }
    // A-001: stepper numerals on /get-started (desktop only: the list is hidden below lg)
    if (viewport === "desktop") {
      await page.goto("/get-started", { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const n = await page.locator("main aside ol li > span").count();
      for (let i = 0; i < n; i++) {
        const loc = page.locator("main aside ol li > span").nth(i);
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        const info = await loc.evaluate((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { x: r.left, y: r.top, w: r.width, h: r.height, rgb: cs.color.match(/[\d.]+/g)!.map(Number).slice(0, 3), text: (el.textContent || "").trim(), fontPx: parseFloat(cs.fontSize) }; });
        const samples = [await pixel(page, info.x + 4, info.y + info.h / 2 - 1, 3, 3), await pixel(page, info.x + info.w - 7, info.y + info.h / 2 - 1, 3, 3), await pixel(page, info.x + info.w / 2 - 1, info.y + 3, 3, 2)];
        const ratios = samples.map((s) => ratio(info.rgb, s));
        const median = [...ratios].sort((a, b) => a - b)[1];
        rows.push({ route: "/get-started", text: `stepper numeral ${info.text}`, required: 4.5, before: i === 0 ? null : { color: "rgb(231, 238, 240)", ratio: 1.03, note: "Phase 1 A-001: computed colour on rgb(217, 235, 248) disc" }, after: { color: `rgb(${info.rgb.join(", ")})`, ratio: median, ratios, backgroundSamples: samples.map((s) => `rgb(${s.join(", ")})`) }, passes: median >= 4.5 });
      }
    }
    writeJson(`parts/probes/contrast-recheck-${viewport}.json`, rows);
    for (const r of rows as Array<{ route: string; text: string; before: { ratio: number } | null; after: { ratio: number; color: string } | null; passes?: boolean }>) console.log(`${viewport} ${r.route} | ${r.text.slice(0, 44)} | ${r.before ? r.before.ratio : "-"} -> ${r.after ? r.after.ratio + " " + r.after.color : "gone"} | ${r.passes ? "PASS" : "FAIL"}`);
    await context.close();
  });
}
