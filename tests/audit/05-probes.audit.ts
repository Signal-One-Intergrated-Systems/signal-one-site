/**
 * AUDIT probes for specific questions raised during the audit (report-only, local build):
 *  - homepage: the band behind the floating navigation and the strip under the hero (which rule colours them),
 *    the disclosure line that sits outside the content container, per-section heights;
 *  - legal/trust pages: which rule paints the page surface and the text, in light and dark colour scheme,
 *    with measured contrast against the pixel actually rendered behind the text;
 *  - /solutions/security: stray literal "\n" text node.
 */
import { test, type Page } from "@playwright/test";
import { contextOptions, shotPath, writeJson, type ViewportName } from "./lib";

const lum = (r: number, g: number, b: number) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number[], b: number[]) => { const l1 = lum(a[0], a[1], a[2]), l2 = lum(b[0], b[1], b[2]); return +((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2); };

/** Median colour of the pixels in a small box, read from a real screenshot (so gradients, photographs and glass are included). */
async function pixel(page: Page, x: number, y: number, w = 6, h = 6) {
  const sharp = (await import("sharp")).default;
  const vp = page.viewportSize()!;
  const clip = { x: Math.max(0, Math.min(vp.width - w, Math.round(x))), y: Math.max(0, Math.min(vp.height - h, Math.round(y))), width: w, height: h };
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch: number[][] = [[], [], []];
  for (let i = 0; i < data.length; i += info.channels) { ch[0].push(data[i]); ch[1].push(data[i + 1]); ch[2].push(data[i + 2]); }
  return ch.map((c) => c.sort((a, b) => a - b)[Math.floor(c.length / 2)]);
}

/** For a text element: computed colour and the rendered background sampled just beside the glyphs (left gutter of the line box). */
async function textContrast(page: Page, selector: string, nth = 0) {
  const loc = page.locator(selector).nth(nth);
  if (!(await loc.count())) return null;
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const info = await loc.evaluate((el) => {
    const cs = getComputedStyle(el);
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getClientRects()[0] || el.getBoundingClientRect();
    const m = cs.color.match(/[\d.]+/g)!.map(Number);
    return { text: (el.textContent || "").trim().slice(0, 80), color: cs.color, rgb: m.slice(0, 3), fontPx: parseFloat(cs.fontSize), weight: Number(cs.fontWeight), x: r.left, y: r.top, w: r.width, h: r.height, classes: typeof el.className === "string" ? el.className.slice(0, 120) : "" };
  });
  // sample background 3 positions: just above the first line, between words is unreliable, so use line-box corners
  const samples = [await pixel(page, info.x + 2, info.y - 5), await pixel(page, info.x + Math.min(info.w, 300) / 2, info.y - 5), await pixel(page, info.x - 9, info.y + info.h / 2)];
  const ratios = samples.map((s) => ratio(info.rgb, s));
  const large = info.fontPx >= 24 || (info.fontPx >= 18.66 && info.weight >= 700);
  return { selector, ...info, backgroundSamples: samples.map((s) => `rgb(${s.join(", ")})`), contrastRatios: ratios, worstRatio: Math.min(...ratios), required: large ? 3 : 4.5, passesAA: Math.min(...ratios) >= (large ? 3 : 4.5) };
}

for (const scheme of ["light", "dark"] as const) {
  test(`surface and contrast probe ${scheme}`, async ({ browser }) => {
    const out: Record<string, unknown> = {};
    const context = await browser.newContext(contextOptions("desktop", { colorScheme: scheme }));
    const page = await context.newPage();
    const targets: Array<[string, string[]]> = [
      ["/security-trust", ["main h1", "main article header p", "main .t-lead", "main section h2", "main section .t-body", "main nav[aria-label='On this page'] a", "main .t-body.rounded-card", "main article > p"]],
      ["/privacy", ["main h1", "main article header p", "main .t-lead", "main section h2", "main section .t-body", "main nav[aria-label='On this page'] a", "main article > p"]],
      ["/popia", ["main h1", "main article header p", "main .t-lead", "main section h2", "main section .t-body", "main nav[aria-label='On this page'] a", "main article > p"]],
      ["/terms", ["main h1", "main article header p", "main .t-lead", "main section h2", "main section .t-body", "main nav[aria-label='On this page'] a", "main article > p"]],
      ["/contact", ["main h1", "main form label", "main form input", "main p"]],
      ["/get-started", ["main h1", "main form label", "main form legend", "main p"]],
      ["/pricing", ["main h1", "main section.card h3", "main section.card label", "main section.card .t-small", "main table td", "main table th"]],
      ["/guards/join", ["main h1", "main p", "main li"]],
      ["/join/sales", ["main h1", "main #apply label", "main #apply legend", "main p"]],
      ["/radios-equipment", ["main h1", "main form label", "main form legend", "main li h4", "main li p"]],
      ["/guard-marketplace", ["main h1", "main form label", "main p"]],
      ["/solutions/security", ["main h1", "main h2", "main p", "main li"]],
      ["/guard-patrol-software", ["main h1", "main h2", "main li p", "main p"]],
      ["/audit-no-such-page", ["main h1", "main p"]],
    ];
    for (const [path, selectors] of targets) {
      await page.goto(path, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const surface = await page.evaluate(() => {
        const main = document.querySelector("main")!;
        const cs = getComputedStyle(main);
        const rules: string[] = [];
        for (const sheet of Array.from(document.styleSheets)) {
          let list: CSSRuleList | null = null;
          try { list = sheet.cssRules; } catch { continue; }
          const visit = (rs: CSSRuleList, media: string) => {
            for (const rule of Array.from(rs)) {
              if (rule instanceof CSSMediaRule) { if (matchMedia(rule.conditionText).matches) visit(rule.cssRules, rule.conditionText); continue; }
              if ("cssRules" in rule && !(rule instanceof CSSStyleRule)) { visit((rule as CSSGroupingRule).cssRules, media); continue; }
              if (!(rule instanceof CSSStyleRule)) continue;
              let hit = false;
              try { hit = main.matches(rule.selectorText); } catch { hit = false; }
              if (hit && (rule.style.background || rule.style.backgroundColor || rule.style.backgroundImage || rule.style.color)) {
                rules.push((media ? "@media " + media + " " : "") + rule.selectorText.slice(0, 150) + " { background:" + (rule.style.background || rule.style.backgroundImage || rule.style.backgroundColor).slice(0, 150) + (rule.style.getPropertyPriority("background") ? " !important" : "") + "; color:" + rule.style.color + " }");
              }
            }
          };
          visit(list, "");
        }
        return {
          mainClass: main.className, mainBackgroundColor: cs.backgroundColor, mainBackgroundImage: cs.backgroundImage.slice(0, 260), mainColor: cs.color,
          bodyBackground: getComputedStyle(document.body).backgroundColor, htmlColorScheme: getComputedStyle(document.documentElement).colorScheme,
          prefersDark: matchMedia("(prefers-color-scheme: dark)").matches,
          rulesMatchingMainInCascadeOrder: rules,
          mediaQueriesOnColorScheme: Array.from(document.styleSheets).reduce((n, sheet) => { try { return n + Array.from(sheet.cssRules).filter((r) => r instanceof CSSMediaRule && /prefers-color-scheme/.test(r.conditionText)).length; } catch { return n; } }, 0),
        };
      });
      const texts: unknown[] = [];
      for (const s of selectors) { const t = await textContrast(page, s).catch((e) => ({ selector: s, error: String(e.message).slice(0, 120) })); if (t) texts.push(t); }
      out[path] = { surface, texts };
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    writeJson(`parts/probes/surface-contrast-${scheme}.json`, out);
    await context.close();
  });
}

for (const viewport of ["desktop", "tablet", "mobile"] as ViewportName[]) {
  test(`homepage probes ${viewport}`, async ({ browser }) => {
    const context = await browser.newContext(contextOptions(viewport));
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const vp = page.viewportSize()!;
    const top = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s);
      const style = (s: string, pseudo?: string) => { const el = q(s); if (!el) return null; const cs = getComputedStyle(el, pseudo); const r = el.getBoundingClientRect(); return { selector: s + (pseudo || ""), backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage.slice(0, 220), backdropFilter: cs.backdropFilter, opacity: cs.opacity, top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), position: cs.position, marginBottom: cs.marginBottom, filter: cs.filter, objectFit: cs.objectFit, objectPosition: cs.objectPosition }; };
      return {
        body: style("body"), header: style("header"), headerWrap: style("header > .wrap"), headerWrapBefore: style("header > .wrap", "::before"),
        main: style("main"), hero: style(".so-hero"), heroMedia: style(".so-hero-media"), heroPhoto: style(".so-hero-photo"), heroWash: style(".so-hero-wash"),
        heroBar: style(".so-hero-bar"), heroCopy: style(".so-hero-copy"), globeLayer: style(".s1-hero-globe-layer"), globeCanvas: style(".s1-hero-globe-canvas"), introduction: style(".so-introduction"),
        photoNatural: (() => { const i = q(".so-hero-photo") as HTMLImageElement | null; return i ? { w: i.naturalWidth, h: i.naturalHeight, currentSrc: i.currentSrc.replace(/^https?:\/\/[^/]+/, "") } : null; })(),
      };
    });
    // pixels actually rendered: the strip above the photograph (behind the nav), the left gutter beside the photo, the hero bar
    const heroMedia = top.heroMedia!, heroPhoto = top.heroPhoto!, heroBar = top.heroBar;
    const pixels = {
      aboveNavLeftEdge: await pixel(page, 4, 4), aboveNavCentre: await pixel(page, vp.width / 2, 2), besideNavRightEdge: await pixel(page, vp.width - 8, 40),
      justAbovePhotoTop: await pixel(page, 6, Math.max(0, heroPhoto.top - 6)), justBelowPhotoTop: await pixel(page, 6, heroPhoto.top + 8),
      leftOfPhoto: heroPhoto.left > 8 ? await pixel(page, Math.max(2, heroPhoto.left - 8), heroPhoto.top + heroPhoto.height / 2) : null,
      rightOfPhoto: heroPhoto.left + heroPhoto.width < vp.width - 8 ? await pixel(page, Math.min(vp.width - 4, heroPhoto.left + heroPhoto.width + 6), heroPhoto.top + heroPhoto.height / 2) : null,
      heroBarLeftGutter: heroBar && heroBar.top < vp.height ? await pixel(page, 6, Math.min(vp.height - 8, heroBar.top + 12)) : null,
      heroBottomEdge: await pixel(page, 6, Math.min(vp.height - 4, heroMedia.top + heroMedia.height - 6)),
    };
    await page.screenshot({ path: shotPath("screenshots", "probes", `home-top-${viewport}`), clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 260) } });

    // which stylesheet rules set the hero media background (cascade order, last wins among equal importance)
    const heroMediaRules = await page.evaluate(() => {
      const el = document.querySelector(".so-hero-media")!;
      const found: string[] = [];
      for (const sheet of Array.from(document.styleSheets)) {
        let list: CSSRuleList | null = null;
        try { list = sheet.cssRules; } catch { continue; }
        const visit = (rs: CSSRuleList, media: string, active: boolean) => {
          for (const rule of Array.from(rs)) {
            if (rule instanceof CSSMediaRule) { visit(rule.cssRules, rule.conditionText, active && matchMedia(rule.conditionText).matches); continue; }
            if (!(rule instanceof CSSStyleRule)) { if ("cssRules" in rule) visit((rule as CSSGroupingRule).cssRules, media, active); continue; }
            let hit = false; try { hit = el.matches(rule.selectorText); } catch { hit = false; }
            if (hit && (rule.style.background || rule.style.backgroundColor)) found.push((active ? "ACTIVE  " : "inactive ") + (media ? "@media(" + media + ") " : "") + rule.selectorText + " { background:" + (rule.style.background || rule.style.backgroundColor) + (rule.style.getPropertyPriority("background") || rule.style.getPropertyPriority("background-color") ? " !important" : "") + " }");
          }
        };
        visit(list, "", true);
      }
      return found;
    });

    // disclosure line and section geometry (scroll so scroll-driven content has its final layout)
    const geometry = await page.evaluate(() => {
      const line = document.querySelector(".so-editorial-disclosure");
      const wrap = document.querySelector(".so-onboarding-section .wrap");
      const cs = line ? getComputedStyle(line) : null;
      const lr = line?.getBoundingClientRect(); const wr = wrap?.getBoundingClientRect();
      const sections = Array.from(document.querySelectorAll("main > section")).map((s) => {
        const r = s.getBoundingClientRect(); const c = getComputedStyle(s);
        const cards = Array.from(s.querySelectorAll(":scope > .wrap, :scope > div, :scope > p")).map((k) => { const kr = k.getBoundingClientRect(); return { cls: (typeof k.className === "string" ? k.className : "").slice(0, 50), top: Math.round(kr.top + scrollY), height: Math.round(kr.height) }; });
        return { id: s.id, cls: s.className.slice(0, 60), top: Math.round(r.top + scrollY), height: Math.round(r.height), paddingTop: c.paddingTop, paddingBottom: c.paddingBottom, minHeight: c.minHeight, marginTop: c.marginTop, marginBottom: c.marginBottom, screens: +(r.height / innerHeight).toFixed(2), children: cards };
      });
      return {
        disclosure: line && lr ? { text: (line.textContent || "").trim(), left: Math.round(lr.left), width: Math.round(lr.width), top: Math.round(lr.top + scrollY), parentTag: line.parentElement?.tagName + "." + line.parentElement?.className.split(" ")[0], insideWrap: !!line.closest(".wrap"), wrapLeft: wr ? Math.round(wr.left) : null, textAlign: cs!.textAlign, paddingLeft: cs!.paddingLeft, marginLeft: cs!.marginLeft, maxWidth: cs!.maxWidth, fontSize: cs!.fontSize, color: cs!.color } : null,
        sections, docHeight: document.documentElement.scrollHeight, viewportHeight: innerHeight, footerHeight: Math.round(document.querySelector("footer")?.getBoundingClientRect().height || 0),
      };
    });
    writeJson(`parts/probes/home-${viewport}.json`, { viewport, vp, top, pixels: Object.fromEntries(Object.entries(pixels).map(([k, v]) => [k, v ? `rgb(${v.join(", ")})` : null])), heroMediaRules, geometry });
    await context.close();
  });
}

test("stray literal backslash-n text nodes", async ({ browser }) => {
  const context = await browser.newContext(contextOptions("desktop"));
  const page = await context.newPage();
  const out: Record<string, unknown> = {};
  for (const path of ["/", "/solutions/security", "/service", "/guard-marketplace", "/equipment-marketplace", "/radios-equipment", "/guard-patrol-software", "/guard-attendance-software", "/ptt-radio-rental", "/pricing", "/contact", "/get-started", "/guards", "/guards/join", "/join/sales", "/security-trust", "/privacy", "/popia", "/terms"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const hits = await page.evaluate(() => {
      const found: Array<{ text: string; parent: string; x: number; y: number; w: number; h: number; visible: boolean }> = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n.textContent || "";
        if (!/\\[nrt]|&[a-z]+;|\{\s*["'`]|undefined|\[object Object\]|NaN\b/.test(t)) continue;
        if (n.parentElement?.closest("script, style, noscript, textarea")) continue;
        const range = document.createRange(); range.selectNodeContents(n); const r = range.getBoundingClientRect();
        found.push({ text: t.trim().slice(0, 80), parent: (n.parentElement?.tagName || "") + "." + (typeof n.parentElement?.className === "string" ? n.parentElement.className.slice(0, 60) : ""), x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.height > 0 });
      }
      return found;
    });
    if (hits.length) {
      out[path] = hits;
      const first = hits.find((h) => h.visible);
      if (first) { await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), first.y); await page.waitForTimeout(400); await page.screenshot({ path: shotPath("screenshots", "probes", `stray-text-${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}`) }); }
    }
  }
  writeJson("parts/probes/stray-text.json", out);
  await context.close();
});

/**
 * Pixel-verified text contrast on every route: any text whose computed colour fails AA against the naive
 * (flat-colour) background is re-measured against the pixels actually rendered beside it, because most
 * surfaces here are photographs, gradients or glass that a computed-style check cannot resolve.
 */
for (const viewport of ["desktop", "tablet", "mobile"] as ViewportName[]) {
  test(`pixel contrast sweep ${viewport}`, async ({ browser }) => {
    const { pageRoutes } = await import("./lib");
    const context = await browser.newContext(contextOptions(viewport, { reducedMotion: "reduce" }));
    const page = await context.newPage();
    const out: Record<string, unknown> = {};
    for (const route of pageRoutes.filter((r) => r.slug !== "workforce")) {
      await page.goto(route.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const candidates = await page.evaluate(() => {
        const parse = (c: string) => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 1]; };
        const lum = (c: number[]) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
        const seen = new Set<string>();
        const list: Array<{ i: number; text: string; rgb: number[]; fontPx: number; weight: number; sig: string; region: string }> = [];
        let i = 0;
        for (const el of Array.from(document.querySelectorAll("main *, footer *, header *"))) {
          const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || "").trim().length > 2);
          if (!own || el.closest("svg, canvas, [aria-hidden=true], .sr-only")) continue;
          const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
          if (r.width < 4 || r.height < 4 || cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.5) continue;
          const rgb = parse(cs.color);
          // skip clearly light text (it sits on the dark surfaces used site-wide) unless it is mid-tone
          const L = lum(rgb);
          if (L > 0.55) continue;
          const sig = cs.color + "|" + (typeof el.className === "string" ? el.className.split(/\s+/).slice(0, 3).join(".") : "") + "|" + el.tagName;
          if (seen.has(sig)) continue; seen.add(sig);
          el.setAttribute("data-audit-ct", String(i));
          list.push({ i, text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 70), rgb: rgb.slice(0, 3), fontPx: parseFloat(cs.fontSize), weight: Number(cs.fontWeight) || 400, sig: sig.slice(0, 120), region: el.closest("header") ? "header" : el.closest("footer") ? "footer" : "main" });
          i++;
          if (i >= 45) break;
        }
        return list;
      });
      const rows: unknown[] = [];
      for (const c of candidates) {
        const loc = page.locator(`[data-audit-ct="${c.i}"]`);
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        await page.waitForTimeout(120);
        const box = await loc.evaluate((el) => { const range = document.createRange(); range.selectNodeContents(el); const rs = range.getClientRects(); const r = rs[0] || el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }).catch(() => null);
        if (!box) continue;
        const vp = page.viewportSize()!;
        if (box.y < 0 || box.y > vp.height - 4) continue;
        const samples = [await pixel(page, box.x - 7, box.y + box.h / 2, 4, 4), await pixel(page, box.x + box.w + 4, box.y + box.h / 2, 4, 4), await pixel(page, box.x + 2, box.y - 3, 4, 2)];
        const ratios = samples.map((s) => ratio(c.rgb, s));
        const large = c.fontPx >= 24 || (c.fontPx >= 18.66 && c.weight >= 700);
        const need = large ? 3 : 4.5;
        const failing = ratios.filter((r) => r < need).length;
        if (failing >= 2) rows.push({ text: c.text, color: `rgb(${c.rgb.join(", ")})`, fontPx: c.fontPx, weight: c.weight, region: c.region, sig: c.sig, backgroundSamples: samples.map((s) => `rgb(${s.join(", ")})`), ratios, medianRatio: [...ratios].sort((a, b) => a - b)[1], required: need });
      }
      out[route.path] = { candidatesChecked: candidates.length, failures: rows };
    }
    writeJson(`parts/probes/pixel-contrast-${viewport}.json`, out);
    await context.close();
  });
}

test("homepage disclosure captions: pixel contrast", async ({ browser }) => {
  const out: Record<string, unknown> = {};
  for (const viewport of ["desktop", "tablet", "mobile"] as ViewportName[]) {
    const context = await browser.newContext(contextOptions(viewport, { reducedMotion: "reduce" }));
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const rows: unknown[] = [];
    for (const sel of [".so-hero-photo-note", ".so-image-caption", ".so-editorial-disclosure", ".so-hardware-note", ".so-disclosure", ".so-hero-note", ".so-community-note"]) {
      const n = await page.locator(sel).count();
      for (let i = 0; i < Math.min(n, 3); i++) { const t = await textContrast(page, sel, i).catch(() => null); if (t) rows.push(t); }
    }
    out[viewport] = rows;
    await context.close();
  }
  writeJson("parts/probes/home-captions.json", out);
});
