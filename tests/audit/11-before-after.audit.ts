/**
 * AUDIT (Phase 2): side-by-side BEFORE / AFTER composites for the repaired defects.
 * BEFORE is a second local server running the build of the pre-repair commit; AFTER is the audit server.
 *
 * env: AUDIT_BEFORE_BASE (default http://localhost:3210), AUDIT_BEFORE_LABEL, AUDIT_AFTER_LABEL
 * Output: <AUDIT_OUT>/before-after/*.jpg and data/parts/before-after.json
 */
import fs from "node:fs";
import path from "node:path";
import { test, type Browser, type Page } from "@playwright/test";
import { BASE, OUT, stitchedCapture, scrollThrough, writeJson } from "./lib";

const BEFORE = process.env.AUDIT_BEFORE_BASE || "http://localhost:3210";
const beforeLabel = process.env.AUDIT_BEFORE_LABEL || "BEFORE";
const afterLabel = process.env.AUDIT_AFTER_LABEL || "AFTER";
const dir = path.join(OUT, "before-after");

type Shot = (page: Page) => Promise<Buffer>;
type Item = { name: string; path: string; width: number; height: number; shot: Shot; maxHeight?: number };

const fold: Shot = (page) => page.screenshot();
/** Screenshot of the region around an element (scrolled into view), padded. */
const around = (selector: string, pad = 24, nth = 0): Shot => async (page) => {
  const loc = page.locator(selector).nth(nth);
  await loc.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy({ top: -120, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(700);
  const box = (await loc.boundingBox())!;
  const vp = page.viewportSize()!;
  const x = Math.max(0, box.x - pad), y = Math.max(0, box.y - pad);
  return page.screenshot({ clip: { x, y, width: Math.min(vp.width - x, box.width + pad * 2), height: Math.min(vp.height - y, box.height + pad * 2) } });
};
const strip: Shot = async (page) => {
  await scrollThrough(page);
  await page.waitForTimeout(1500);
  const tmp = path.join(dir, `.tmp-${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`);
  await stitchedCapture(page, tmp, 700);
  const buf = fs.readFileSync(tmp);
  fs.unlinkSync(tmp);
  return buf;
};
const menuOpen: Shot = async (page) => {
  await page.locator('header button[aria-controls="mobile-nav"]').click({ timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(600);
  return page.screenshot();
};

const items: Item[] = [
  ...["privacy", "terms", "popia", "security-trust"].flatMap((slug) => [
    { name: `legal-${slug}-desktop`, path: "/" + slug, width: 1440, height: 900, shot: fold },
    { name: `legal-${slug}-mobile`, path: "/" + slug, width: 390, height: 844, shot: fold },
  ]),
  { name: "nav-1024-menu-open-home", path: "/", width: 1024, height: 768, shot: menuOpen },
  { name: "nav-1024-menu-open-pricing", path: "/pricing", width: 1024, height: 768, shot: menuOpen },
  ...[[390, 844], [820, 1180], [1024, 768], [1440, 900]].map(([w, h]) => ({ name: `home-top-${w}`, path: "/", width: w, height: h, shot: fold })),
  { name: "home-full-1440", path: "/", width: 1440, height: 900, shot: strip, maxHeight: 6000 },
  { name: "home-full-390", path: "/", width: 390, height: 844, shot: strip, maxHeight: 6000 },
  { name: "solutions-security-hero-1440", path: "/solutions/security", width: 1440, height: 900, shot: fold },
  { name: "solutions-security-hero-photo-crop-1440", path: "/solutions/security", width: 1440, height: 900, shot: (page) => page.screenshot({ clip: { x: 900, y: 150, width: 520, height: 520 } }) },
  { name: "guards-hero-1440", path: "/guards", width: 1440, height: 900, shot: fold },
  { name: "guard-marketplace-buttons-1440", path: "/guard-marketplace", width: 1440, height: 900, shot: around('main a.btn-ghost-light:has-text("See the platform")', 150) },
  { name: "guard-marketplace-profile-link-1440", path: "/guard-marketplace", width: 1440, height: 900, shot: around('main a:has-text("Create your profile here")', 110) },
  { name: "equipment-marketplace-buttons-1440", path: "/equipment-marketplace", width: 1440, height: 900, shot: around('main a.btn-ghost-light:has-text("Enquire about availability")', 190) },
  { name: "equipment-marketplace-link-1440", path: "/equipment-marketplace", width: 1440, height: 900, shot: around('main a:has-text("See available equipment and request a quote")', 90) },
  { name: "equipment-marketplace-buttons-390", path: "/equipment-marketplace", width: 390, height: 844, shot: around('main a.btn-ghost-light:has-text("Enquire about availability")', 150) },
  { name: "photo-caption-guard-attendance-1440", path: "/guard-attendance-software", width: 1440, height: 900, shot: around("main figcaption.photo-caption", 90) },
  { name: "photo-caption-solutions-security-390", path: "/solutions/security", width: 390, height: 844, shot: around("main figcaption.photo-caption", 120) },
  { name: "pricing-accounting-payroll-1440", path: "/pricing", width: 1440, height: 900, shot: around('main section:has(h3:has-text("Radios, PTT, tracking and body cameras")) ul >> nth=0', 260) },
  { name: "pricing-accounting-payroll-390", path: "/pricing", width: 390, height: 844, shot: around('main h3:has-text("Radios, PTT, tracking and body cameras")', 330) },
  { name: "get-started-stepper-1440", path: "/get-started", width: 1440, height: 900, shot: around("main aside ol", 40) },
  { name: "contact-accent-links-1440", path: "/contact", width: 1440, height: 900, shot: fold },
  { name: "home-disclosure-line-1440", path: "/", width: 1440, height: 900, shot: around(".so-editorial-disclosure", 120) },
  { name: "home-service-image-1440", path: "/", width: 1440, height: 900, shot: around("#service .so-vertical-visual", 10) },
];

async function capture(browser: Browser, base: string, item: Item) {
  const context = await browser.newContext({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1, locale: "en-ZA", reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto(base + item.path, { waitUntil: "networkidle", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(900);
    return await item.shot(page);
  } finally { await context.close(); }
}

test("before / after composites", async ({ browser }) => {
  test.setTimeout(40 * 60_000);
  const sharp = (await import("sharp")).default;
  fs.mkdirSync(dir, { recursive: true });
  const only = process.env.AUDIT_ONLY ? new RegExp(process.env.AUDIT_ONLY) : null;
  const log: unknown[] = [];
  for (const item of items.filter((i) => !only || only.test(i.name))) {
    const out: Record<string, unknown> = { name: item.name, path: item.path, viewport: `${item.width}x${item.height}` };
    try {
      const pair: Array<{ buf: Buffer; w: number; h: number }> = [];
      for (const base of [BEFORE, BASE]) {
        let buf = await capture(browser, base, item);
        let meta = await sharp(buf, { limitInputPixels: false }).metadata();
        out[base === BEFORE ? "beforeSize" : "afterSize"] = `${meta.width}x${meta.height}`;
        if (item.maxHeight && meta.height! > item.maxHeight) {
          // long strips are scaled down to stay legible as one image; the true heights are recorded above
          const scale = Math.min(1, 420 / meta.width!);
          buf = await sharp(buf, { limitInputPixels: false }).resize({ width: Math.round(meta.width! * scale) }).png().toBuffer();
          meta = await sharp(buf).metadata();
        }
        pair.push({ buf, w: meta.width!, h: meta.height! });
      }
      const gap = 24, head = 44;
      const width = pair[0].w + pair[1].w + gap * 3, height = Math.max(pair[0].h, pair[1].h) + head + gap;
      const label = (text: string, x: number) => `<text x="${x}" y="29" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#111">${text}</text>`;
      const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${head}">${label(beforeLabel, gap)}${label(afterLabel, gap * 2 + pair[0].w)}</svg>`);
      const file = path.join(dir, item.name + ".jpg");
      await sharp({ create: { width, height, channels: 3, background: "#f2f2f2" }, limitInputPixels: false })
        .composite([{ input: svg, top: 0, left: 0 }, { input: pair[0].buf, top: head, left: gap }, { input: pair[1].buf, top: head, left: gap * 2 + pair[0].w }])
        .jpeg({ quality: 86 }).toFile(file);
      out.file = file;
    } catch (error) { out.error = String(error).split("\n")[0].slice(0, 200); }
    log.push(out);
    console.log(JSON.stringify(out));
  }
  writeJson("parts/before-after.json", log);
});
