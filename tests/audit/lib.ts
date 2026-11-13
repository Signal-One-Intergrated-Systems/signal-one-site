import fs from "node:fs";
import path from "node:path";
import type { BrowserContextOptions, Page } from "@playwright/test";

export const OUT = process.env.AUDIT_OUT || "/home/claude/audit-out";
export const BASE = "http://localhost:3200";
export const OK_BASE = "http://localhost:3201";

/** Every page route in app/ (from the step 6a inventory), plus the 404s and the one valid Connect profile. */
export const pageRoutes: Array<{ path: string; slug: string; group: "marketing" | "connect" | "error"; note?: string }> = [
  { path: "/", slug: "home", group: "marketing" },
  { path: "/solutions/security", slug: "solutions-security", group: "marketing" },
  { path: "/service", slug: "service", group: "marketing" },
  { path: "/guard-marketplace", slug: "guard-marketplace", group: "marketing" },
  { path: "/equipment-marketplace", slug: "equipment-marketplace", group: "marketing" },
  { path: "/radios-equipment", slug: "radios-equipment", group: "marketing" },
  { path: "/guard-patrol-software", slug: "guard-patrol-software", group: "marketing" },
  { path: "/guard-attendance-software", slug: "guard-attendance-software", group: "marketing" },
  { path: "/ptt-radio-rental", slug: "ptt-radio-rental", group: "marketing" },
  { path: "/pricing", slug: "pricing", group: "marketing" },
  { path: "/contact", slug: "contact", group: "marketing" },
  { path: "/get-started", slug: "get-started", group: "marketing" },
  { path: "/guards", slug: "guards", group: "marketing" },
  { path: "/guards/join", slug: "guards-join", group: "marketing" },
  { path: "/join/sales", slug: "join-sales", group: "marketing" },
  { path: "/security-trust", slug: "security-trust", group: "marketing" },
  { path: "/privacy", slug: "privacy", group: "marketing" },
  { path: "/popia", slug: "popia", group: "marketing" },
  { path: "/terms", slug: "terms", group: "marketing" },
  { path: "/workforce", slug: "workforce", group: "marketing", note: "app/(marketing)/workforce/page.tsx calls permanentRedirect('/service')" },
  { path: "/audit-no-such-page", slug: "404-marketing", group: "error", note: "catch-all -> app/(marketing)/not-found.tsx" },
  { path: "/connect/andisiwe", slug: "connect-andisiwe", group: "connect", note: "only valid profile id (app/_connect/lib/profiles.ts)" },
  { path: "/present/andisiwe", slug: "present-andisiwe", group: "connect", note: "only valid profile id" },
  { path: "/connect/audit-no-such-profile", slug: "404-connect", group: "error", note: "app/(connect)/not-found.tsx" },
];

export const viewports = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  tablet: { width: 820, height: 1180, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
} as const;
export type ViewportName = keyof typeof viewports;

export function contextOptions(name: ViewportName, extra: BrowserContextOptions = {}): BrowserContextOptions {
  const v = viewports[name];
  return { viewport: { width: v.width, height: v.height }, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: 1, locale: "en-ZA", ...extra };
}

export function writeJson(rel: string, data: unknown) {
  const file = path.join(OUT, "data", rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

export function shotPath(dir: string, viewport: string, name: string) {
  const file = path.join(OUT, dir, viewport, name + ".png");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
}

/** Step through the whole page once so lazy images load and scroll-reveal content is triggered, then return to the top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(200, Math.floor(window.innerHeight * 0.7));
    let y = 0;
    for (let guard = 0; guard < 200; guard++) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (y >= max) break;
      y = Math.min(max, y + step);
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      await delay(180);
    }
    await delay(500);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    await delay(300);
  });
}

/**
 * Scroll-stitched capture: what a visitor actually sees at each scroll position, joined into one image.
 * Needed because the homepage uses scroll-driven animations (animation-timeline: view()), which a native
 * full-page capture taken at scrollTop 0 renders as still hidden. Tiles below the first drop the sticky header strip.
 */
export async function stitchedCapture(page: Page, file: string, settleMs = 1200) {
  const sharp = (await import("sharp")).default;
  const metrics = await page.evaluate(() => {
    const h = document.querySelector("header");
    const cs = h ? getComputedStyle(h) : null;
    const sticky = !!cs && (cs.position === "sticky" || cs.position === "fixed");
    return { vw: window.innerWidth, vh: window.innerHeight, doc: document.documentElement.scrollHeight, headerH: sticky && h ? Math.max(0, Math.min(200, Math.round(h.getBoundingClientRect().bottom))) : 0 };
  });
  const tiles: Array<{ input: Buffer; top: number; left: number }> = [];
  let covered = 0;
  let scrollY = 0;
  for (let guard = 0; guard < 120 && covered < metrics.doc; guard++) {
    const max = Math.max(0, metrics.doc - metrics.vh);
    scrollY = guard === 0 ? 0 : Math.min(max, covered - metrics.headerH);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }), scrollY);
    await page.waitForTimeout(settleMs);
    const actualY = await page.evaluate(() => Math.round(window.scrollY));
    const from = Math.max(0, covered - actualY);
    const height = Math.min(metrics.vh - from, metrics.doc - covered);
    if (height <= 0) break;
    const shot = await page.screenshot({ clip: { x: 0, y: from, width: metrics.vw, height } });
    tiles.push({ input: shot, top: covered, left: 0 });
    covered += height;
  }
  const canvas = sharp({ create: { width: metrics.vw, height: Math.max(1, covered), channels: 3, background: { r: 255, g: 0, b: 255 } }, limitInputPixels: false });
  await canvas.composite(tiles).jpeg({ quality: 82 }).toFile(file);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(300);
  return { tiles: tiles.length, height: covered, headerStrip: metrics.headerH };
}

/** LCP / CLS observers, installed before any page script. */
export async function installVitals(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __audit: { lcp: number; lcpEl: string; lcpUrl: string; lcpSize: number; cls: number; shifts: number } };
    w.__audit = { lcp: 0, lcpEl: "", lcpUrl: "", lcpSize: 0, cls: 0, shifts: 0 };
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as Array<PerformanceEntry & { element?: Element; url?: string; size?: number }>) {
          w.__audit.lcp = e.startTime;
          w.__audit.lcpUrl = e.url || "";
          w.__audit.lcpSize = e.size || 0;
          const el = e.element;
          w.__audit.lcpEl = el ? el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "") : "";
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
          if (!e.hadRecentInput) { w.__audit.cls += e.value; w.__audit.shifts += 1; }
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch { /* unsupported: values stay 0 */ }
  });
}

export type DomAudit = ReturnType<typeof collectDom>;

/** Runs in the page. Everything the audit records about the rendered DOM. */
export function collectDom() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const de = document.documentElement;
  const sel = (el: Element): string => {
    const parts: string[] = [];
    let node: Element | null = el;
    for (let depth = 0; node && depth < 4; depth++) {
      let s = node.tagName.toLowerCase();
      if (node.id) { parts.unshift(s + "#" + node.id); break; }
      const cls = typeof node.className === "string" ? node.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : [];
      if (cls.length) s += "." + cls.join(".");
      parts.unshift(s);
      node = node.parentElement;
    }
    return parts.join(" > ");
  };
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) return false;
    return true;
  };
  const region = (el: Element) => (el.closest("header") ? "header" : el.closest("footer") ? "footer" : el.closest("main") ? "main" : "other");
  const text = (el: Element) => (el.textContent || "").replace(/\s+/g, " ").trim();
  const accName = (el: Element) => {
    const label = el.getAttribute("aria-label");
    if (label) return label.trim();
    const by = el.getAttribute("aria-labelledby");
    if (by) return by.split(/\s+/).map((id) => text(document.getElementById(id) || document.createElement("i"))).join(" ").trim();
    const t = text(el);
    if (t) return t;
    const img = el.querySelector("img[alt]");
    if (img) return (img.getAttribute("alt") || "").trim();
    return (el.getAttribute("title") || "").trim();
  };

  // --- horizontal overflow
  const overflow = {
    innerWidth: vw,
    clientWidth: de.clientWidth,
    scrollWidth: de.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    overflows: de.scrollWidth > vw,
    offenders: [] as Array<{ selector: string; left: number; right: number; width: number }>,
    textAtViewportEdge: [] as Array<{ selector: string; text: string; left: number; right: number; y: number }>,
  };
  const all = Array.from(document.querySelectorAll("body *"));
  if (overflow.overflows) {
    const wide = all
      .filter((el) => visible(el))
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.right > vw + 1 || r.left < -1)
      .sort((a, b) => b.r.right - a.r.right)
      .slice(0, 12);
    overflow.offenders = wide.map(({ el, r }) => ({ selector: sel(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }));
  }
  // text that touches the viewport edge (a block rendered outside the content container)
  for (const el of all) {
    if (!el.closest("main, footer") || !visible(el)) continue;
    const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 2);
    if (!own.length) continue;
    const range = document.createRange();
    range.selectNodeContents(own[0]);
    const r = range.getBoundingClientRect();
    if (r.width < 1) continue;
    if (r.left < 6 || r.right > vw - 6) {
      overflow.textAtViewportEdge.push({ selector: sel(el), text: text(el).slice(0, 90), left: Math.round(r.left), right: Math.round(r.right), y: Math.round(r.top + window.scrollY) });
    }
  }
  overflow.textAtViewportEdge = overflow.textAtViewportEdge.slice(0, 20);

  // --- images
  const images = Array.from(document.images).map((img) => {
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const nw = img.naturalWidth, nh = img.naturalHeight;
    const fit = cs.objectFit || "fill";
    const natAr = nw && nh ? nw / nh : 0;
    const renAr = r.width && r.height ? r.width / r.height : 0;
    const arDelta = natAr && renAr ? Math.abs(renAr / natAr - 1) : 0;
    const scale = nw && nh && r.width && r.height
      ? fit === "cover" ? Math.max(r.width / nw, r.height / nh) : fit === "contain" || fit === "scale-down" ? Math.min(r.width / nw, r.height / nh) : Math.max(r.width / nw, r.height / nh)
      : 0;
    let src = img.currentSrc || img.src;
    let original = "";
    try { const u = new URL(src); if (u.pathname === "/_next/image") original = u.searchParams.get("url") || ""; src = u.pathname + u.search; } catch { /* keep */ }
    return {
      selector: sel(img), src: src.slice(0, 300), original, alt: img.getAttribute("alt"), altMissing: !img.hasAttribute("alt"),
      nextImage: img.hasAttribute("data-nimg"), loading: img.getAttribute("loading"), fetchPriority: img.getAttribute("fetchpriority"), decoding: img.getAttribute("decoding"),
      hasWidthHeightAttrs: img.hasAttribute("width") && img.hasAttribute("height"), sizes: img.getAttribute("sizes"),
      complete: img.complete, broken: img.complete && nw === 0, naturalWidth: nw, naturalHeight: nh,
      renderedWidth: Math.round(r.width), renderedHeight: Math.round(r.height), y: Math.round(r.top + window.scrollY),
      objectFit: fit, objectPosition: cs.objectPosition, visible: visible(img),
      aspectDelta: +arDelta.toFixed(4),
      distorted: fit === "fill" && arDelta > 0.02,
      croppedByCover: fit === "cover" && arDelta > 0.02 ? +arDelta.toFixed(3) : 0,
      displayScale: +scale.toFixed(3),
      upscaled: scale > 1.02,
      oversizeFactor: scale ? +(1 / scale).toFixed(2) : 0,
      region: region(img),
    };
  });

  // --- CSS background images (photographs behind sections)
  const backgrounds: Array<{ selector: string; urls: string[]; w: number; h: number; y: number; size: string; position: string }> = [];
  for (const el of [document.body, ...all]) {
    for (const pseudo of [null, "::before", "::after"] as const) {
      const cs = getComputedStyle(el, pseudo);
      const bg = cs.backgroundImage;
      if (!bg || bg === "none" || !bg.includes("url(")) continue;
      const urls = Array.from(bg.matchAll(/url\("?([^")]+)"?\)/g)).map((m) => { try { const u = new URL(m[1]); return u.origin === location.origin ? u.pathname + u.search : m[1].slice(0, 80); } catch { return m[1].slice(0, 80); } });
      const r = el.getBoundingClientRect();
      backgrounds.push({ selector: sel(el) + (pseudo || ""), urls, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + window.scrollY), size: cs.backgroundSize, position: cs.backgroundPosition });
    }
  }

  // --- links and buttons
  const links = Array.from(document.querySelectorAll("a[href]")).map((a) => {
    const el = a as HTMLAnchorElement;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const raw = el.getAttribute("href") || "";
    let kind = "internal";
    let pathname = "", hash = "";
    try {
      const u = new URL(el.href);
      if (u.protocol === "mailto:" || u.protocol === "tel:") kind = u.protocol.slice(0, -1);
      else if (u.origin !== location.origin) kind = "external";
      pathname = u.pathname; hash = u.hash;
    } catch { kind = "invalid"; }
    const inlineInText = cs.display === "inline" && !!el.parentElement && text(el.parentElement).length > text(el).length + 12;
    return {
      href: raw.slice(0, 300), kind, pathname, hash, target: el.target || "", rel: el.rel || "", name: accName(el).slice(0, 120),
      nameMissing: accName(el).length === 0, region: region(el), visible: visible(el), w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.left), y: Math.round(r.top + window.scrollY), inlineInText, selector: sel(el),
      hashTargetExists: kind === "internal" && hash && pathname === location.pathname ? !!document.getElementById(decodeURIComponent(hash.slice(1))) : null,
    };
  });
  const buttons = Array.from(document.querySelectorAll("button, [role=button], input[type=submit], input[type=button], summary")).map((b) => {
    const r = b.getBoundingClientRect();
    return {
      tag: b.tagName.toLowerCase(), type: b.getAttribute("type") || "", name: accName(b).slice(0, 120), nameMissing: accName(b).length === 0,
      disabled: (b as HTMLButtonElement).disabled === true, ariaExpanded: b.getAttribute("aria-expanded"), ariaControls: b.getAttribute("aria-controls"),
      region: region(b), visible: visible(b), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top + window.scrollY),
      inForm: !!b.closest("form"), selector: sel(b),
    };
  });
  const controls = {
    forms: document.querySelectorAll("form").length,
    details: document.querySelectorAll("details").length,
    tabs: document.querySelectorAll("[role=tab]").length,
    tablists: document.querySelectorAll("[role=tablist]").length,
    selects: document.querySelectorAll("select").length,
    radios: document.querySelectorAll("input[type=radio]").length,
    checkboxes: document.querySelectorAll("input[type=checkbox]").length,
    ranges: document.querySelectorAll("input[type=range]").length,
    numberInputs: document.querySelectorAll("input[type=number]").length,
    rails: document.querySelectorAll(".hardware-rail").length,
    canvases: document.querySelectorAll("canvas").length,
    videos: document.querySelectorAll("video").length,
    iframes: document.querySelectorAll("iframe").length,
    dialogs: document.querySelectorAll("dialog,[role=dialog]").length,
  };

  // --- SEO
  const meta = (name: string) => document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? null;
  const prop = (name: string) => document.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ?? null;
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => ({ level: Number(h.tagName[1]), text: text(h).slice(0, 110), visible: visible(h), region: region(h) }));
  const headingSkips: string[] = [];
  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1) headingSkips.push(`h${prev} -> h${h.level} "${h.text.slice(0, 50)}"`);
    prev = h.level;
  }
  const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => {
    try {
      const data = JSON.parse(s.textContent || "");
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
      return { parses: true, types: graph.map((g: { "@type"?: string }) => g["@type"] || "?"), raw: (s.textContent || "").slice(0, 3000) };
    } catch (error) { return { parses: false, types: [] as string[], raw: String(error) }; }
  });
  const title = document.title;
  const seo = {
    title, titleLength: title.length,
    titleSuffixRepeated: /(\|\s*Signal One)\s*\|\s*Signal One\b/.test(title) || /(.+?)\s*\|\s*\1(\s*\||$)/.test(title),
    description: meta("description"), descriptionLength: (meta("description") || "").length,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    robots: meta("robots"), lang: de.getAttribute("lang"), viewport: meta("viewport"), colorSchemeMeta: meta("color-scheme"),
    themeColor: Array.from(document.querySelectorAll('meta[name="theme-color"]')).map((m) => (m.getAttribute("media") || "") + " " + m.getAttribute("content")),
    og: { title: prop("og:title"), description: prop("og:description"), url: prop("og:url"), type: prop("og:type"), image: prop("og:image"), imageAlt: prop("og:image:alt"), siteName: prop("og:site_name"), locale: prop("og:locale") },
    twitter: { card: meta("twitter:card"), title: meta("twitter:title"), description: meta("twitter:description"), image: meta("twitter:image") },
    h1Count: headings.filter((h) => h.level === 1).length, h1: headings.filter((h) => h.level === 1).map((h) => h.text),
    headings, headingSkips, jsonLd,
    hreflang: Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((l) => l.getAttribute("hreflang")),
  };

  // --- text contrast (computed; backgrounds behind images/gradients are flagged, not guessed)
  const parse = (c: string) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = (c: { r: number; g: number; b: number }) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const over = (top: { r: number; g: number; b: number; a: number }, bottom: { r: number; g: number; b: number }) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a) });
  const rootBg = parse(getComputedStyle(de).backgroundColor);
  const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
  const canvasColor = rootBg && rootBg.a > 0 ? rootBg : bodyBg && bodyBg.a > 0 ? bodyBg : { r: 255, g: 255, b: 255, a: 1 };
  const resolveBg = (el: Element) => {
    const layers: Array<{ r: number; g: number; b: number; a: number }> = [];
    let uncertain = false;
    let node: Element | null = el;
    while (node) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== "none") uncertain = true;
      if (cs.backdropFilter && cs.backdropFilter !== "none") uncertain = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 0.999) break; }
      if (cs.position === "fixed" || cs.position === "absolute") uncertain = uncertain || false;
      node = node.parentElement;
    }
    let base: { r: number; g: number; b: number } = { r: canvasColor.r, g: canvasColor.g, b: canvasColor.b };
    if (layers.length && layers[layers.length - 1].a >= 0.999) { base = layers[layers.length - 1]; layers.pop(); }
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return { bg: base, uncertain };
  };
  const contrastFailures: Array<{ selector: string; text: string; fg: string; bg: string; ratio: number; fontPx: number; weight: number; large: boolean; bgUncertain: boolean; region: string }> = [];
  let textNodesChecked = 0;
  const seen = new Set<string>();
  for (const el of all) {
    if (!visible(el) || el.closest("svg, canvas, [aria-hidden=true]")) continue;
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 1);
    if (!own) continue;
    textNodesChecked += 1;
    const cs = getComputedStyle(el);
    const fgRaw = parse(cs.color);
    if (!fgRaw) continue;
    const { bg, uncertain } = resolveBg(el);
    const fg = over(fgRaw, bg);
    const l1 = lum(fg), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const fontPx = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
    if (ratio < (large ? 3 : 4.5)) {
      const key = cs.color + "|" + Math.round(bg.r) + "," + Math.round(bg.g) + "," + Math.round(bg.b) + "|" + sel(el);
      if (seen.has(key)) continue;
      seen.add(key);
      contrastFailures.push({ selector: sel(el), text: text(el).slice(0, 70), fg: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`, ratio: +ratio.toFixed(2), fontPx, weight, large, bgUncertain: uncertain, region: region(el) });
    }
  }
  contrastFailures.sort((a, b) => Number(a.bgUncertain) - Number(b.bgUncertain) || a.ratio - b.ratio);

  // --- layout: top-level sections, their content boxes and the empty gap between consecutive content boxes
  const main = document.querySelector("main");
  const sections = main ? Array.from(main.children).filter((c) => visible(c) && c.getBoundingClientRect().height > 20).map((s) => {
    const r = s.getBoundingClientRect();
    let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
    for (const d of Array.from(s.querySelectorAll("*"))) {
      if (!visible(d)) continue;
      const isLeaf = d.tagName === "IMG" || d.tagName === "CANVAS" || d.tagName === "INPUT" || d.tagName === "BUTTON" || Array.from(d.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0);
      if (!isLeaf) continue;
      // the full-bleed background photograph is not "content" for gap purposes
      const dr = d.getBoundingClientRect();
      if (d.tagName === "IMG" && dr.width >= r.width * 0.98 && dr.height >= r.height * 0.9) continue;
      top = Math.min(top, dr.top); bottom = Math.max(bottom, dr.bottom); left = Math.min(left, dr.left); right = Math.max(right, dr.right);
    }
    const cs = getComputedStyle(s);
    return {
      selector: sel(s), id: s.id || "", top: Math.round(r.top + window.scrollY), height: Math.round(r.height),
      contentTop: isFinite(top) ? Math.round(top + window.scrollY) : null, contentBottom: isFinite(bottom) ? Math.round(bottom + window.scrollY) : null,
      contentLeft: isFinite(left) ? Math.round(left) : null, contentRight: isFinite(right) ? Math.round(right) : null,
      paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage.slice(0, 160),
      heading: text(s.querySelector("h1,h2,h3") || document.createElement("i")).slice(0, 70),
    };
  }) : [];
  const sectionGaps = sections.slice(1).map((s, i) => ({ after: sections[i].id || sections[i].heading || sections[i].selector, before: s.id || s.heading || s.selector, gapPx: s.contentTop !== null && sections[i].contentBottom !== null ? s.contentTop - (sections[i].contentBottom as number) : null }));

  // --- motion state at capture time
  const anims = typeof document.getAnimations === "function" ? document.getAnimations() : [];
  const motion = {
    runningAnimations: anims.filter((a) => a.playState === "running").length,
    infiniteAnimations: anims.filter((a) => a.playState === "running" && a.effect && a.effect.getComputedTiming().iterations === Infinity).map((a) => { const t = (a.effect as KeyframeEffect).target; return ((a as CSSAnimation).animationName || "transition") + " on " + (t ? sel(t) : "?"); }).slice(0, 20),
    pendingMotion: document.querySelectorAll('[data-motion-state="pending"]').length,
    shownMotion: document.querySelectorAll('[data-motion-state="shown"]').length,
    motionTargets: document.querySelectorAll("[data-motion-from]").length,
    revealWaiting: document.querySelectorAll('.reveal-group[data-reveal="waiting"]').length,
    revealGroups: document.querySelectorAll(".reveal-group").length,
    overlayDisplay: (() => { const o = document.querySelector(".sg-entry-overlay"); return o ? getComputedStyle(o).display + "/" + o.getAttribute("data-guard-entry") : "none-in-dom"; })(),
    hiddenByOpacity: all.filter((el) => { const r = el.getBoundingClientRect(); return r.width > 40 && r.height > 20 && Number(getComputedStyle(el).opacity) < 0.05 && !el.closest("[aria-hidden=true]") && !!el.closest("main"); }).map((el) => sel(el)).slice(0, 15),
  };

  const bodyCs = getComputedStyle(document.body);
  const header = document.querySelector("header");
  const headerWrap = document.querySelector("header > .wrap");
  const surfaces = {
    htmlBg: getComputedStyle(de).backgroundColor, htmlColorScheme: getComputedStyle(de).colorScheme,
    bodyBg: bodyCs.backgroundColor, bodyBgImage: bodyCs.backgroundImage.slice(0, 200), bodyColor: bodyCs.color,
    mainClass: main ? main.className : "", mainBg: main ? getComputedStyle(main).backgroundColor : "", mainBgImage: main ? getComputedStyle(main).backgroundImage.slice(0, 300) : "", mainColor: main ? getComputedStyle(main).color : "",
    headerBg: header ? getComputedStyle(header).backgroundColor : "", headerBgImage: header ? getComputedStyle(header).backgroundImage.slice(0, 300) : "", headerBackdrop: header ? getComputedStyle(header).backdropFilter : "",
    headerWrapBg: headerWrap ? getComputedStyle(headerWrap).backgroundColor : "", headerWrapBgImage: headerWrap ? getComputedStyle(headerWrap).backgroundImage.slice(0, 300) : "", headerWrapBackdrop: headerWrap ? getComputedStyle(headerWrap).backdropFilter : "",
    darkSchemeMatches: matchMedia("(prefers-color-scheme: dark)").matches, reducedMotionMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
  };

  return {
    url: location.pathname + location.search, docHeight: de.scrollHeight, viewport: { w: vw, h: vh }, screens: +(de.scrollHeight / vh).toFixed(2),
    overflow, images, backgrounds, links, buttons, controls, seo, contrast: { textNodesChecked, failures: contrastFailures.slice(0, 60), failureCount: contrastFailures.length, certainFailureCount: contrastFailures.filter((f) => !f.bgUncertain).length },
    sections, sectionGaps, motion, surfaces,
    visibleText: (main ? (main as HTMLElement).innerText : document.body.innerText).slice(0, 60000),
    fullText: document.body.innerText.slice(0, 80000),
  };
}
