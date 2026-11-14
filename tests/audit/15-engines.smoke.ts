/**
 * AUDIT cross-engine smoke pass. One result file per project: <AUDIT_OUT>/data/parts/smoke/<project>.json,
 * fold screenshots in <AUDIT_OUT>/screenshots/<project>/. Emulation, not real devices.
 * Each check records pass/fail with detail instead of stopping at the first failure, so the matrix is complete.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { test, type Page } from "@playwright/test";
import { fillVisible, walkJourney } from "../e2e/helpers";
import { OUT, pageRoutes } from "./lib";

const OK_BASE = "http://localhost:3201";
type Check = { check: string; pass: boolean; detail?: unknown };
const routes = pageRoutes.filter((r) => r.group === "marketing" && r.slug !== "workforce");

function decodePng(png: Buffer) {
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20), colourType = png[25];
  const channels = colourType === 6 ? 4 : colourType === 2 ? 3 : 0;
  if (png[24] !== 8 || !channels || png[28] !== 0) throw new Error("unsupported PNG variant");
  const idat: Buffer[] = [];
  for (let o = 8; o < png.length; ) { const len = png.readUInt32BE(o), type = png.toString("ascii", o + 4, o + 8); if (type === "IDAT") idat.push(png.subarray(o + 8, o + 8 + len)); o += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels, data = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= channels ? data[y * stride + x - channels] : 0, b = y > 0 ? data[(y - 1) * stride + x] : 0, c = x >= channels && y > 0 ? data[(y - 1) * stride + x - channels] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      data[y * stride + x] = (v + (filter === 1 ? a : filter === 2 ? b : filter === 3 ? (a + b) >> 1 : filter === 4 ? (pa <= pb && pa <= pc ? a : pb <= pc ? b : c) : 0)) & 255;
    }
  }
  return { width, height, channels, data };
}
type Rgb = [number, number, number];
async function painted(page: Page, x: number, y: number, w = 4, h = 4): Promise<Rgb> {
  const vp = page.viewportSize()!;
  const clip = { x: Math.max(0, Math.min(vp.width - w, Math.round(x))), y: Math.max(0, Math.min(vp.height - h, Math.round(y))), width: w, height: h };
  const img = decodePng(await page.screenshot({ clip }));
  const ch: number[][] = [[], [], []];
  for (let i = 0; i < img.data.length; i += img.channels) for (let k = 0; k < 3; k++) ch[k].push(img.data[i + k]);
  return ch.map((c) => c.sort((p, q) => p - q)[c.length >> 1]) as Rgb;
}
const lum = ([r, g, b]: Rgb) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = (a: Rgb, b: Rgb) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
async function textContrast(page: Page, selector: string) {
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const info = await loc.evaluate((el) => { const range = document.createRange(); range.selectNodeContents(el); const r = range.getClientRects()[0] || el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, rgb: getComputedStyle(el).color.match(/[\d.]+/g)!.slice(0, 3).map(Number) }; });
  const samples = [await painted(page, info.x - 7, info.y + info.h / 2), await painted(page, info.x + info.w + 4, info.y + info.h / 2), await painted(page, info.x + 2, info.y - 3, 4, 2)];
  return +samples.map((s) => contrast(info.rgb as Rgb, s)).sort((a, b) => a - b)[1].toFixed(2);
}
/** Share of distinct colours in a screenshot: a blank or single-colour page scores near 0. */
async function distinctColours(page: Page) {
  const img = decodePng(await page.screenshot());
  const seen = new Set<number>();
  for (let i = 0; i < img.data.length; i += img.channels * 97) seen.add((img.data[i] >> 3) << 10 | (img.data[i + 1] >> 3) << 5 | (img.data[i + 2] >> 3));
  return seen.size;
}

test("engine smoke", async ({ page, context }, info) => {
  const project = info.project.name;
  const touch = !!info.project.use.hasTouch;
  const shots = path.join(OUT, "screenshots", project);
  fs.mkdirSync(shots, { recursive: true });
  const checks: Check[] = [];
  const add = (check: string, pass: boolean, detail?: unknown) => { checks.push({ check, pass, detail }); console.log(`${project} | ${pass ? "PASS" : "FAIL"} | ${check}${detail !== undefined && !pass ? " | " + JSON.stringify(detail).slice(0, 400) : ""}`); };
  const attempt = async (check: string, fn: () => Promise<{ pass: boolean; detail?: unknown }>) => { try { const r = await fn(); add(check, r.pass, r.detail); } catch (e) { add(check, false, "threw: " + String(e).split("\n")[0].slice(0, 300)); } };
  const tapOrClick = (locator: ReturnType<Page["locator"]>) => (touch ? locator.tap() : locator.click());

  // 1. every route loads cleanly, is not blank, has no horizontal overflow; fold screenshot
  const pageErrors: string[] = [], consoleErrors: string[] = [], failed: string[] = [];
  let current = "";
  // WebKit reports a fetch that is cancelled by a navigation (here: Next.js link prefetches still in flight when the
  // test moves to the next route) as "... due to access control checks". Those are listed separately, not as page errors.
  const cancelledByNavigation: string[] = [];
  page.on("pageerror", (e) => { if (/\?_rsc=.* due to access control checks/.test(e.message)) cancelledByNavigation.push(`${current}: ${e.message.slice(0, 120)}`); else pageErrors.push(`${current}: ${e.message.slice(0, 160)}`); });
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${current}: ${m.text().slice(0, 160)}`); });
  page.on("requestfailed", (r) => { const f = r.failure()?.errorText || ""; if (!/cancel|NS_BINDING_ABORTED|aborted/i.test(f)) failed.push(`${current}: ${r.url().slice(0, 120)} ${f}`); });
  page.on("response", (r) => { if (r.status() >= 400) failed.push(`${current}: ${r.status()} ${r.url().slice(0, 120)}`); });
  const overflow: string[] = [], blank: string[] = [], noH1: string[] = [];
  for (const route of routes) {
    current = route.path;
    await page.goto(route.path, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(shots, route.slug + "--fold.png") });
    const m = await page.evaluate(() => ({ over: document.documentElement.scrollWidth - innerWidth, h1: !!document.querySelector("h1") && (document.querySelector("h1") as HTMLElement).getBoundingClientRect().height > 10, main: (document.querySelector("main") as HTMLElement | null)?.getBoundingClientRect().height || 0 }));
    if (m.over > 1) overflow.push(`${route.path} +${m.over}px`);
    if (!m.h1) noH1.push(route.path);
    if (m.main < 200 || (await distinctColours(page)) < 12) blank.push(route.path);
  }
  current = "";
  add(`all ${routes.length} routes load: no page errors`, pageErrors.length === 0, pageErrors.slice(0, 8));
  if (cancelledByNavigation.length) console.log(`${project} | NOTE | ${cancelledByNavigation.length} prefetch requests cancelled by the test's own navigation (WebKit wording): ${cancelledByNavigation.slice(0, 2).join(" ; ")}`);
  add("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 8));
  add("no failed requests or responses >= 400", failed.length === 0, failed.slice(0, 8));
  add("no horizontal overflow on any route", overflow.length === 0, overflow);
  add("no blank page; every route shows its h1", blank.length === 0 && noH1.length === 0, { blank, noH1 });

  // 2. hero photograph and globe render
  await attempt("homepage hero photograph and globe canvas render", async () => {
    await page.goto("/", { waitUntil: "networkidle" });
    // the globe is a lazily imported client component: wait for its canvas to exist and to have been drawn on
    await page.waitForFunction(() => { const c = document.querySelector("canvas.s1-hero-globe-canvas") as HTMLCanvasElement | null; if (!c || !c.width) return false; const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 8) return true; return false; }, undefined, { timeout: 15_000 }).catch(() => undefined);
    const r = await page.evaluate(() => {
      const img = document.querySelector(".so-hero-media .so-hero-photo") as HTMLImageElement | null;
      const canvas = document.querySelector("canvas.s1-hero-globe-canvas") as HTMLCanvasElement | null;
      // share of the globe canvas that has been drawn on (read from the canvas's own 2D context)
      let inkedShare = 0;
      if (canvas && canvas.width && canvas.height) {
        const d = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
        let inked = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 8) inked++;
        inkedShare = +(inked / (canvas.width * canvas.height)).toFixed(3);
      }
      const cb = canvas?.getBoundingClientRect();
      return { photoLoaded: !!img && img.complete && img.naturalWidth > 0, photoBox: img ? [Math.round(img.getBoundingClientRect().width), Math.round(img.getBoundingClientRect().height)] : null, canvasBox: cb ? [Math.round(cb.width), Math.round(cb.height)] : null, canvasInkedShare: inkedShare };
    });
    return { pass: r.photoLoaded && !!r.photoBox && r.photoBox[0] > 200 && !!r.canvasBox && r.canvasBox[0] > 100 && r.canvasInkedShare > 0.02, detail: r };
  });

  // 3. navigation: menu opens and closes (touch on mobile); on wide desktop the primary nav is shown instead
  await attempt("navigation menu opens and closes", async () => {
    await page.goto("/pricing", { waitUntil: "networkidle" });
    const toggle = page.locator('header button[aria-controls="mobile-nav"]');
    if (!(await toggle.isVisible())) {
      const links = await page.locator('header nav[aria-label="Primary"] a:visible').count();
      return { pass: links >= 4, detail: { wideLayout: true, primaryLinksVisible: links } };
    }
    await tapOrClick(toggle);
    const sheet = page.locator("#mobile-nav");
    await sheet.waitFor({ state: "visible", timeout: 5000 });
    const links = await sheet.locator("ul a:visible").count();
    const onTop = await sheet.locator("ul a").first().evaluate((el) => { const b = el.getBoundingClientRect(); return !!document.elementFromPoint(b.left + 30, b.top + b.height / 2)?.closest("#mobile-nav"); });
    await tapOrClick(toggle);
    await page.waitForTimeout(300);
    const closed = (await sheet.count()) === 0;
    const unlocked = await page.evaluate(() => document.body.style.overflow !== "hidden");
    // and a link in the sheet navigates
    await tapOrClick(toggle);
    await tapOrClick(sheet.locator("ul a").nth(3));
    await page.waitForURL(/equipment-marketplace/, { timeout: 20_000 });
    return { pass: links >= 4 && onTop && closed && unlocked, detail: { links, onTop, closed, unlocked, navigated: page.url() } };
  });

  // 4. legal and trust pages readable
  await attempt("legal and trust pages: body copy >= 4.5:1 on rendered pixels", async () => {
    const out: Record<string, number> = {};
    for (const route of ["/privacy", "/terms", "/popia", "/security-trust"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      out[route + " lead"] = await textContrast(page, "main .t-lead");
      out[route + " body"] = await textContrast(page, "main section .t-body");
      out[route + " kicker"] = await textContrast(page, "main .t-kicker");
    }
    return { pass: Object.values(out).every((v) => v >= 4.5), detail: out };
  });

  // 5. pricing calculator
  await attempt("/pricing calculator: 10 guards x 30 days = 300 guard days = R750", async () => {
    await page.goto("/pricing", { waitUntil: "networkidle" });
    const guards = page.locator('main input[id$="-guards"]'), days = page.locator('main input[id$="-days"]');
    await guards.fill("10");
    await days.fill("30");
    await page.waitForTimeout(400);
    const text = (await page.locator('main section:has(input[id$="-guards"]) [aria-live="polite"]').innerText()).replace(/\s+/g, " ");
    return { pass: /300/.test(text) && /R\s?750(?!\d)/.test(text), detail: text.slice(0, 200) };
  });

  // 6. forms: honest unavailable state with no upstream, success against the local mock
  for (const [name, route, run] of [
    ["/contact", "/contact", async (p: Page) => { await fillVisible(p, "main form"); await p.locator("main form button[type=submit]").first().click(); }],
    ["/get-started", "/get-started", (p: Page) => walkJourney(p)],
  ] as Array<[string, string, (p: Page) => Promise<void>]>) {
    await attempt(`${name}: no upstream -> honest "not sent" state with mail fallback`, async () => {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await run(page);
      const link = page.locator('main form a[href^="mailto:sales@signalone.co.za"][href*="subject="]').first();
      await link.waitFor({ state: "visible", timeout: 20_000 });
      // the confirmation is a role="status" block that opens with "Thanks"; other live regions (availability notice) are not it
      const success = await page.locator('main [role="status"]').filter({ hasText: /Thanks|request is with Signal One/ }).count();
      const text = (await page.locator("main form").first().innerText()).replace(/\s+/g, " ");
      return { pass: success === 0 && !/Thanks\./.test(text), detail: { fallbackVisible: true, confirmationShown: success } };
    });
    await attempt(`${name}: local mock upstream -> success state`, async () => {
      const p2 = await context.newPage();
      try {
        await p2.goto(OK_BASE + route, { waitUntil: "networkidle" });
        await p2.waitForTimeout(500);
        await run(p2);
        await p2.locator('[role="status"]').filter({ hasText: /Thanks|request is with Signal One/ }).first().waitFor({ state: "visible", timeout: 20_000 });
        const fallback = await p2.locator('main form a[href^="mailto:sales@signalone.co.za"][href*="subject="]').count();
        return { pass: fallback === 0, detail: { successVisible: true, fallbackShown: fallback } };
      } finally { await p2.close(); }
    });
  }

  // 7. glass and the scene transition do not blank the page
  await attempt("glass surfaces render and the scene transition lands on a visible page", async () => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const glass = await page.evaluate(() => { const el = document.querySelector(".so-hero-copy") as HTMLElement | null; if (!el) return null; const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return { backdrop: cs.backdropFilter || (cs as unknown as Record<string, string>).webkitBackdropFilter || "", background: cs.backgroundColor, box: [Math.round(b.width), Math.round(b.height)], textVisible: (el.textContent || "").length > 20 }; });
    const coloursHome = await distinctColours(page);
    // a real internal navigation with motion enabled: shutters close, route commits, shutters open
    const link = page.locator('main a[href="/solutions/security"]:visible, footer a[href="/solutions/security"]:visible').first();
    await link.scrollIntoViewIfNeeded();
    await tapOrClick(link);
    await page.waitForURL(/\/solutions\/security$/, { timeout: 30_000 });
    await page.waitForFunction(() => { const o = document.querySelector(".sg-entry-overlay"); return !o || o.getAttribute("data-guard-entry") === "idle"; }, undefined, { timeout: 20_000 });
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => { const o = document.querySelector(".sg-entry-overlay") as HTMLElement | null; const h1 = document.querySelector("h1") as HTMLElement | null; const hb = h1?.getBoundingClientRect(); const top = hb ? document.elementFromPoint(hb.left + 20, hb.top + hb.height / 2) : null; return { overlayState: o?.getAttribute("data-guard-entry"), overlayBlocksPointer: !!top?.closest(".sg-entry-overlay"), h1: (h1?.textContent || "").trim().slice(0, 40), h1Visible: !!hb && hb.height > 10, scrollLocked: getComputedStyle(document.documentElement).overflow === "hidden" }; });
    const coloursAfter = await distinctColours(page);
    await page.screenshot({ path: path.join(shots, "after-scene-transition--fold.png") });
    return { pass: !!glass && glass.textVisible && coloursHome >= 12 && after.h1Visible && !after.overlayBlocksPointer && !after.scrollLocked && coloursAfter >= 12, detail: { glass, coloursHome, after, coloursAfter } };
  });

  const result = { project, cancelledPrefetchOnNavigation: cancelledByNavigation.length, browser: page.context().browser()?.browserType().name(), version: page.context().browser()?.version(), viewport: page.viewportSize(), touch, deviceScaleFactor: info.project.use.deviceScaleFactor ?? 1, userAgent: await page.evaluate(() => navigator.userAgent), emulation: true, checks, passed: checks.filter((c) => c.pass).length, failed: checks.filter((c) => !c.pass).length };
  const file = path.join(OUT, "data", "parts", "smoke", project + ".json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(result, null, 1));
  console.log(`${project}: ${result.passed} passed, ${result.failed} failed`);
});
