import { expect, test, type Page } from "@playwright/test";
import zlib from "node:zlib";
import { routes } from "./routes";

/**
 * Regression tests for the defects repaired after the 2026-11-13 website audit (see the D-numbers).
 * Contrast is measured on RENDERED PIXELS: the surfaces here are photographs, gradients and glass, which a
 * computed-style check cannot resolve (that is how unreadable body copy passed the gate before).
 */

// ---- pixel helpers (no image library: Playwright screenshots are plain 8-bit PNGs) ---------------------------
function decodePng(png: Buffer): { width: number; height: number; channels: number; data: Buffer } {
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20), colourType = png[25];
  const channels = colourType === 6 ? 4 : colourType === 2 ? 3 : 0;
  if (png[24] !== 8 || !channels || png[28] !== 0) throw new Error("unsupported PNG variant");
  const idat: Buffer[] = [];
  for (let o = 8; o < png.length; ) {
    const len = png.readUInt32BE(o), type = png.toString("ascii", o + 4, o + 8);
    if (type === "IDAT") idat.push(png.subarray(o + 8, o + 8 + len));
    o += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels, data = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= channels ? data[y * stride + x - channels] : 0;
      const b = y > 0 ? data[(y - 1) * stride + x] : 0;
      const c = x >= channels && y > 0 ? data[(y - 1) * stride + x - channels] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const paeth = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      data[y * stride + x] = (v + (filter === 1 ? a : filter === 2 ? b : filter === 3 ? (a + b) >> 1 : filter === 4 ? paeth : 0)) & 255;
    }
  }
  return { width, height, channels, data };
}

type Rgb = [number, number, number];

/** Median colour of a small box of the page as actually painted. */
async function paintedColour(page: Page, x: number, y: number, w = 4, h = 4): Promise<Rgb> {
  const vp = page.viewportSize()!;
  const clip = { x: Math.max(0, Math.min(vp.width - w, Math.round(x))), y: Math.max(0, Math.min(vp.height - h, Math.round(y))), width: w, height: h };
  const img = decodePng(await page.screenshot({ clip }));
  const ch: number[][] = [[], [], []];
  for (let i = 0; i < img.data.length; i += img.channels) for (let k = 0; k < 3; k++) ch[k].push(img.data[i + k]);
  return ch.map((c) => c.sort((p, q) => p - q)[c.length >> 1]) as Rgb;
}

const luminance = ([r, g, b]: Rgb) => {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a: Rgb, b: Rgb) => { const l1 = luminance(a), l2 = luminance(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

/**
 * Contrast of a text element: its computed colour against the pixels painted beside its first line
 * (left gutter, right of the line, just above). Returns the median of the three ratios.
 */
async function textContrast(page: Page, locator: ReturnType<Page["locator"]>): Promise<number> {
  return (await textContrastSamples(page, locator)).sort((a, b) => a - b)[1];
}

/** The three ratios behind textContrast (left gutter, right of the line, just above), unsorted. */
async function textContrastSamples(page: Page, locator: ReturnType<Page["locator"]>): Promise<number[]> {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const info = await locator.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getClientRects()[0] || el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, rgb: getComputedStyle(el).color.match(/[\d.]+/g)!.slice(0, 3).map(Number) };
  });
  const samples = [
    await paintedColour(page, info.x - 7, info.y + info.h / 2),
    await paintedColour(page, info.x + info.w + 4, info.y + info.h / 2),
    await paintedColour(page, info.x + 2, info.y - 3, 4, 2),
  ];
  return samples.map((s) => contrast(info.rgb as Rgb, s));
}

const AA = 4.5;
const sizes = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

// ---- D-001 / D-002: legal and trust pages must be readable ---------------------------------------------------
for (const [name, viewport] of Object.entries(sizes)) {
  for (const route of ["/privacy", "/terms", "/popia", "/security-trust"]) {
    test(`D-001 ${route} body copy is readable at ${name} (>= 4.5:1 on rendered pixels)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const main = page.locator("main");
      const targets: Array<[string, ReturnType<Page["locator"]>]> = [
        ["kicker", main.locator(".t-kicker").first()],
        ["lead paragraph", main.locator(".t-lead").first()],
        ["first section body", main.locator("section .t-body").first()],
        ["last section body", main.locator("section .t-body").last()],
      ];
      if (name === "desktop") targets.push(["contents link", main.locator("nav a.t-small").first()]);
      for (const [label, locator] of targets) {
        await expect(locator, label).toBeVisible();
        const ratio = await textContrast(page, locator);
        expect(ratio, `${route} ${label} contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
      }
    });
  }
}

// ---- D-003: the Menu button must work between 1024 and 1279 px ------------------------------------------------
for (const width of [1024, 1100, 1180, 1279]) {
  test(`D-003 Menu opens the full primary navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    const toggle = page.locator('header button[aria-controls="mobile-nav"]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const sheet = page.locator("#mobile-nav");
    await expect(sheet).toBeVisible();
    for (const label of ["1GUARD", "1Service", "Hire Guards", "Equipment"]) {
      const link = sheet.getByRole("link", { name: label, exact: true });
      await expect(link, label).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.width, `${label} has a real hit area`).toBeGreaterThan(100);
      expect(box.y, `${label} is below the header`).toBeGreaterThanOrEqual(70);
      expect(box.y + box.height, `${label} is inside the viewport`).toBeLessThanOrEqual(800);
    }
    // the sheet really is on top: the point in the middle of its first link belongs to that link
    const first = sheet.getByRole("link", { name: "1GUARD", exact: true });
    const fb = (await first.boundingBox())!;
    expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest("#mobile-nav a"), [fb.x + 40, fb.y + fb.height / 2])).toBe(true);
    // opening moves focus into the sheet, exactly as it does at tablet width
    expect(await page.evaluate(() => !!document.activeElement?.closest("#mobile-nav")), "focus moved into the menu").toBe(true);
    // Escape closes and returns focus to the toggle
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(toggle).toBeFocused();
    // choosing a destination navigates and closes the sheet
    await toggle.click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Equipment", exact: true }).click();
    await expect(page).toHaveURL(/\/equipment-marketplace$/);
    await expect(page.locator("#mobile-nav")).toHaveCount(0);
  });
}

// ---- D-004: no literal escape sequences in visible text -------------------------------------------------------
test("D-004 no route renders a literal \\n, \\t or \\r in its text", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const stray = await page.evaluate(() => {
      const out: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const parent = n.parentElement;
        if (!parent || parent.closest("script, style, noscript, template")) continue;
        if (/\\[nrt]/.test(n.textContent || "")) out.push((n.textContent || "").trim().slice(0, 80));
      }
      return out;
    });
    expect(stray, `${route} literal escape sequences`).toEqual([]);
  }
});

// ---- D-008 / D-017 / D-036: each page is shared as itself ------------------------------------------------------
test("D-008 every page has its own og:url (equal to its canonical), social title and description", async ({ page }) => {
  const seen = new Map<string, string>();
  for (const route of routes) {
    await page.goto(route);
    const meta = async (selector: string, attribute = "content") => (await page.locator(selector).first().getAttribute(attribute).catch(() => null)) || "";
    const canonical = await meta('link[rel="canonical"]', "href");
    const title = await page.title();
    const description = await meta('meta[name="description"]');
    expect(canonical, `${route} canonical`).toBe("https://signalone.co.za" + (route === "/" ? "" : route));
    expect(await meta('meta[property="og:url"]'), `${route} og:url`).toBe(canonical);
    expect(await meta('meta[property="og:title"]'), `${route} og:title`).toBe(title);
    expect(await meta('meta[name="twitter:title"]'), `${route} twitter:title`).toBe(title);
    expect(await meta('meta[property="og:description"]'), `${route} og:description`).toBe(description);
    expect(await meta('meta[name="twitter:description"]'), `${route} twitter:description`).toBe(description);
    expect(await meta('meta[property="og:image"]'), `${route} og:image`).toMatch(/^https:\/\/signalone\.co\.za\/.+/);
    expect(seen.has(title), `og:title of ${route} duplicates ${seen.get(title)}`).toBe(false);
    seen.set(title, route);
  }
});

test("D-017 no title repeats the site-name suffix", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    expect(title.split(" | Signal One").length - 1, `${route} title "${title}"`).toBeLessThanOrEqual(1);
    expect(title, `${route} title`).not.toMatch(/Signal One\s*\|\s*Signal One/);
  }
});

test("D-036 the 404 page does not claim to be the homepage", async ({ page, request }) => {
  // what a crawler is served
  const served = await request.get("/this-page-does-not-exist");
  expect(served.status()).toBe(404);
  const html = await served.text();
  const head = html.slice(0, html.indexOf("</head>"));
  expect(head).toContain("<title>Page not found | Signal One</title>");
  expect(head).toMatch(/<meta name="robots" content="noindex/);
  expect(head).not.toMatch(/rel="canonical"/);
  expect(head).not.toMatch(/property="og:url"/);
  expect(head).toMatch(/<meta property="og:title" content="Page not found \| Signal One"/);
  // and after the page has hydrated in a browser
  const response = await page.goto("/this-page-does-not-exist");
  expect(response!.status()).toBe(404);
  await page.waitForLoadState("networkidle");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
});

// ---- D-005 / D-006: button and link labels on the two marketplaces ----------------------------------------------
const marketplaceLabels: Record<string, string[]> = {
  "/guard-marketplace": ["See the platform", "Shortlist", "Create your profile here"],
  "/equipment-marketplace": ["Enquire about availability →", "See available equipment and request a quote →"],
};
for (const [name, viewport] of Object.entries(sizes)) {
  for (const [route, labels] of Object.entries(marketplaceLabels)) {
    test(`D-005 ${route} button and link labels are readable at ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      for (const label of labels) {
        const matches = page.locator("main").locator("a, span, button").filter({ hasText: new RegExp("^\\s*" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$") });
        const count = await matches.count();
        expect(count, `"${label}" is present on ${route}`).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
          if (!(await matches.nth(i).isVisible())) continue;
          const ratio = await textContrast(page, matches.nth(i));
          expect(ratio, `${route} "${label}" #${i} contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
        }
      }
    });
  }
}

// ---- D-010: no pale green fill behind the navigation -------------------------------------------------------------
for (const width of [390, 820, 1024, 1280, 1440, 1920]) {
  test(`D-010 no green fill in the top 100px of the homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".so-hero-media .so-hero-photo")).toBeVisible();
    const isGreen = ([r, g, b]: Rgb) => g - Math.max(r, b) >= 10 && g >= 110;
    // the fill itself
    const fill = await page.locator(".so-hero-media").evaluate((el) => getComputedStyle(el).backgroundColor.match(/[\d.]+/g)!.slice(0, 3).map(Number));
    expect(isGreen(fill as Rgb), `hero media fill rgb(${fill.join(",")}) is green`).toBe(false);
    // what is painted above the photograph (behind and beside the floating navigation)
    const photoTop = await page.locator(".so-hero-media .so-hero-photo").evaluate((el) => Math.round(el.getBoundingClientRect().top));
    const band = Math.max(8, Math.min(100, photoTop));
    const strip = decodePng(await page.screenshot({ clip: { x: 0, y: 0, width, height: band } }));
    let green = 0;
    for (let i = 0; i < strip.data.length; i += strip.channels) if (isGreen([strip.data[i], strip.data[i + 1], strip.data[i + 2]])) green++;
    const share = green / (strip.width * strip.height);
    expect(share, `${(share * 100).toFixed(1)}% of the top ${band}px is green`).toBeLessThan(0.01);
  });
}

// ---- Founder ruling 4: Accounting and Payroll are future capabilities -------------------------------------------
test("Accounting and Payroll are never presented as available or priced", async ({ page }) => {
  await page.goto("/pricing");
  const future = page.locator("#future-capabilities");
  await expect(future).toBeVisible();
  await expect(future).toContainText(/not available/i);
  for (const name of ["Accounting", "Payroll"]) {
    const items = page.locator("main li, main article").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(items, `${name} appears once on /pricing`).toHaveCount(1);
    const text = (await items.first().innerText()).replace(/\s+/g, " ");
    expect(text, name).toMatch(/Coming soon/);
    expect(text, name).toMatch(/Not available yet/);
    expect(text, `${name} carries no price`).not.toMatch(/R\s?\d|By quote|per guard|Included|Available now|\bLive\b|\bPilot\b/);
    // it sits after the future-capabilities heading, not in the purchasable list
    expect(await items.first().evaluate((el) => !!(document.getElementById("future-capabilities")!.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  }
  const purchasable = page.locator("main ul, main ol").filter({ hasText: "By quote" }).first();
  await expect(purchasable).not.toContainText(/Accounting|Payroll/);
  // site-wide: wherever a card or list item is headed Accounting or Payroll, it is marked as not yet available
  for (const route of routes) {
    await page.goto(route);
    const offenders = await page.evaluate(() => {
      const out: string[] = [];
      for (const heading of Array.from(document.querySelectorAll("main h2, main h3, main h4, main dt, main th"))) {
        if (!/^(Accounting|Payroll)$/i.test((heading.textContent || "").trim())) continue;
        const item = heading.closest("li, article, tr, .card") || heading.parentElement!;
        const text = (item.textContent || "").replace(/\s+/g, " ");
        if (!/coming soon|not available/i.test(text) || /R\s?\d|By quote|Included|Available now/i.test(text)) out.push(text.slice(0, 120));
      }
      return out;
    });
    expect(offenders, `${route} presents Accounting/Payroll as available`).toEqual([]);
  }
});

// ---- D-009 / D-041: no photograph is drawn larger than the pixels the browser decoded ---------------------------
/** Pixel size from an image file header (PNG, JPEG, WebP, AVIF). naturalWidth is not used: Chrome scales it by density metadata. */
function imagePixelSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") { const bits = buf.readUInt32LE(21); return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 }; }
    if (kind === "VP8X") return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    for (let o = 2; o + 9 < buf.length; ) {
      if (buf[o] !== 0xff) { o++; continue; }
      const marker = buf[o + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { w: buf.readUInt16BE(o + 7), h: buf.readUInt16BE(o + 5) };
      o += 2 + buf.readUInt16BE(o + 2);
    }
  }
  const ispe = buf.indexOf("ispe", 0, "ascii");
  if (ispe > 0 && ispe + 16 <= buf.length) return { w: buf.readUInt32BE(ispe + 8), h: buf.readUInt32BE(ispe + 12) };
  return null;
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 820, height: 1180 }, { width: 390, height: 844 }]) {
  test(`D-009 no image is drawn above the decoded size of its chosen variant at ${viewport.width}px`, async ({ page, request }) => {
    test.setTimeout(240_000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const known = new Map<string, { w: number; h: number } | null>();
    const problems: string[] = [];
    let checked = 0;
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        await Promise.all(Array.from(document.images).filter((i) => !i.complete).map((i) => new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); setTimeout(r, 4000); })));
      });
      const images = await page.evaluate(() => Array.from(document.images).map((img) => {
        const box = img.getBoundingClientRect(); const cs = getComputedStyle(img);
        return { src: img.currentSrc || img.src, w: box.width, h: box.height, fit: cs.objectFit, shown: box.width >= 8 && box.height >= 8 && cs.visibility !== "hidden" && cs.display !== "none" };
      }));
      for (const img of images) {
        if (!img.shown || !img.src || img.src.startsWith("data:") || /\.svg(\?|$)/.test(img.src)) continue;
        if (!known.has(img.src)) {
          const response = await request.get(img.src, { headers: { accept: "image/webp,image/png,image/*;q=0.8" }, failOnStatusCode: false });
          known.set(img.src, response.ok() ? imagePixelSize(await response.body()) : null);
        }
        const size = known.get(img.src);
        if (!size || !size.w || !size.h) continue;
        checked++;
        const sx = img.w / size.w, sy = img.h / size.h;
        const scale = img.fit === "contain" || img.fit === "scale-down" ? Math.min(sx, sy) : Math.max(sx, sy);
        if (scale > 1.02) problems.push(`${route} ${decodeURIComponent(img.src.replace(/^.*?(url=|\/media\/|\/images\/)/, "")).slice(0, 60)} box ${Math.round(img.w)}x${Math.round(img.h)} decoded ${size.w}x${size.h} (${scale.toFixed(2)}x)`);
      }
    }
    expect(checked, "images were measured").toBeGreaterThan(40);
    expect(problems).toEqual([]);
  });
}

// ---- D-025 / D-026: small notes, kickers and status labels over photographs ------------------------------------
const labelViewports = [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }];

for (const viewport of labelViewports) {
  test(`D-025 homepage notes over photographs are readable at ${viewport.width}px (every sample >= 4.5:1)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    for (const selector of [".so-hero-photo-note", ".so-editorial-disclosure", ".so-hardware-note"]) {
      const note = page.locator(selector).first();
      await expect(note, selector).toBeVisible();
      const ratios = await textContrastSamples(page, note);
      expect(Math.min(...ratios), `${selector} contrast samples ${ratios.map((r) => r.toFixed(2)).join(" / ")}`).toBeGreaterThanOrEqual(AA);
    }
  });

  test(`D-026 hero kickers, status labels and related links over photographs are readable at ${viewport.width}px`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    let measured = 0;
    for (const route of routes) {
      if (route === "/") continue;
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const targets = page.locator(
        [
          "main .split-hero p.t-kicker", // hero kickers
          "main .split-hero p.text-signal-400", // "For security officers"
          'main span.rounded-full:text-is("Pilot")', // status label
          "main section.surface-deep ul a.link-arrow", // related-links list of the landing pages
          "main .s1-equipment-hero p.t-caption", // caption under the equipment hero buttons
        ].join(", "),
      );
      const count = await targets.count();
      for (let i = 0; i < count; i++) {
        const target = targets.nth(i);
        if (!(await target.isVisible())) continue;
        const text = ((await target.textContent()) || "").replace(/\s+/g, " ").trim().slice(0, 40);
        const ratio = await textContrast(page, target);
        measured++;
        expect(ratio, `${route} "${text}" contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
      }
    }
    expect(measured, "labels were measured").toBeGreaterThan(20);
  });
}

// ---- N-002: the SplitHero photograph is not a narrow strip between 1024 and 1279 px ------------------------------
for (const width of [1024, 1100, 1180, 1279]) {
  test(`N-002 SplitHero photograph keeps a sensible share of the width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/solutions/security", "/join/sales", "/guards"]) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const hero = page.locator("section.split-hero.s1-person-first-split");
      await expect(hero, route).toHaveCount(1);
      const m = await hero.evaluate((el) => {
        const photo = el.querySelector(".s1-glass-people-photo")!.getBoundingClientRect();
        const text = el.querySelector(".wrap > div")!.getBoundingClientRect();
        const h1 = el.querySelector("h1")!.getBoundingClientRect();
        return { photoW: photo.width, photoLeft: photo.left, photoRight: photo.right, textW: text.width, h1Left: h1.left, h1Right: h1.right, overflow: document.documentElement.scrollWidth - innerWidth };
      });
      expect(m.photoW, `${route} photo column width at ${width}px`).toBeGreaterThanOrEqual(420);
      expect(m.photoW / width, `${route} photo share at ${width}px`).toBeGreaterThanOrEqual(0.4);
      expect(m.textW, `${route} text column width at ${width}px`).toBeGreaterThanOrEqual(480);
      // the photograph is on the right on two of the pages and on the left on /guards
      expect(m.h1Right <= m.photoLeft + 1 || m.h1Left >= m.photoRight - 1, `${route} headline stays clear of the photograph`).toBe(true);
      expect(m.photoLeft, `${route} photograph starts inside the viewport`).toBeGreaterThanOrEqual(-1);
      expect(m.photoRight, `${route} photograph ends inside the viewport`).toBeLessThanOrEqual(width + 1);
      expect(m.overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
    }
  });
}
