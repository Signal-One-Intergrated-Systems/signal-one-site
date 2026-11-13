// Audit-only: merges the per-test JSON parts written by tests/audit/*.audit.ts into one machine-readable file
// and prints a triage summary. Usage: node scripts/audit/merge-browser-audit.mjs <audit-out dir>
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] || "/home/claude/audit-out";
const parts = path.join(OUT, "data", "parts");
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const list = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []);
const tryRead = (f) => (fs.existsSync(f) ? readJson(f) : null);

const capture = {};
for (const scheme of list(path.join(parts, "capture"))) {
  capture[scheme.name] = {};
  for (const vp of list(path.join(parts, "capture", scheme.name))) {
    capture[scheme.name][vp.name] = {};
    for (const f of list(path.join(parts, "capture", scheme.name, vp.name))) capture[scheme.name][vp.name][f.name.replace(/\.json$/, "")] = readJson(path.join(parts, "capture", scheme.name, vp.name, f.name));
  }
}
const imageTruth = tryRead(path.join(parts, "image-truth.json")) || {};
const interaction = { navSweep: tryRead(path.join(parts, "interaction", "nav-sweep.json")), menu: {}, controls: {} };
for (const f of list(path.join(parts, "interaction"))) if (f.isFile() && f.name.startsWith("menu-")) interaction.menu[f.name.replace(/^menu-|\.json$/g, "")] = readJson(path.join(parts, "interaction", f.name));
for (const vp of list(path.join(parts, "interaction", "controls"))) { interaction.controls[vp.name] = {}; for (const f of list(path.join(parts, "interaction", "controls", vp.name))) interaction.controls[vp.name][f.name.replace(/\.json$/, "")] = readJson(path.join(parts, "interaction", "controls", vp.name, f.name)); }
const forms = {};
for (const f of list(path.join(parts, "forms"))) forms[f.name.replace(/\.json$/, "")] = readJson(path.join(parts, "forms", f.name));
const probes = {};
for (const f of list(path.join(parts, "probes"))) probes[f.name.replace(/\.json$/, "")] = readJson(path.join(parts, "probes", f.name));
const siteLevel = tryRead(path.join(parts, "site-level.json"));

// ---- derived: true image scale, per-capture summary rows
const rows = [];
const assetRoutes = {}; // original asset path -> { routes:Set, how:Set }
const note = (asset, route, how) => { if (!asset) return; const a = (assetRoutes[asset] ||= { routes: new Set(), how: new Set() }); a.routes.add(route); a.how.add(how); };
for (const [scheme, vps] of Object.entries(capture)) for (const [viewport, slugs] of Object.entries(vps)) for (const [slug, p] of Object.entries(slugs)) {
  const d = p.dom;
  for (const img of d.images) {
    const t = imageTruth[img.src];
    if (t && t.pixelWidth && img.renderedWidth && img.renderedHeight) {
      const sx = img.renderedWidth / t.pixelWidth, sy = img.renderedHeight / t.pixelHeight;
      img.truePixelWidth = t.pixelWidth; img.truePixelHeight = t.pixelHeight; img.variantBytes = t.bytes; img.variantFormat = t.format;
      img.trueDisplayScale = +(img.objectFit === "contain" || img.objectFit === "scale-down" ? Math.min(sx, sy) : Math.max(sx, sy)).toFixed(3);
      img.trueUpscaled = img.trueDisplayScale > 1.02;
    }
    note(img.original || img.src.split("?")[0], p.route, "img");
  }
  for (const b of d.backgrounds) for (const u of b.urls) note(u.split("?")[0], p.route, "css-background");
  for (const s of p.servedAssets) note(s.original || s.path, p.route, "network");
  const small = (viewport === "desktop") ? [] : [...d.links, ...d.buttons].filter((x) => x.visible && (x.w < 44 || x.h < 44) && !x.inlineInText);
  rows.push({
    scheme, viewport, slug, route: p.route, status: p.status, finalUrl: p.finalUrl, docHeight: d.docHeight, screens: d.screens,
    consoleErrors: p.consoleMessages.filter((m) => m.type === "error").length, consoleWarnings: p.consoleMessages.filter((m) => m.type === "warning").length,
    pageErrors: p.pageErrors.length, failedRequests: p.failedRequests.length, badResponses: p.badResponses.length,
    overflowPx: d.overflow.scrollWidth - d.overflow.innerWidth, textAtEdge: d.overflow.textAtViewportEdge.length,
    images: d.images.length, brokenImages: d.images.filter((i) => i.broken).length, notLoaded: d.images.filter((i) => !i.complete).length,
    distorted: d.images.filter((i) => i.distorted).length, trueUpscaled: d.images.filter((i) => i.trueUpscaled && i.visible).length,
    worstUpscale: Math.max(0, ...d.images.filter((i) => i.visible && i.trueDisplayScale).map((i) => i.trueDisplayScale)),
    heavyCoverCrop: d.images.filter((i) => i.visible && i.croppedByCover > 0.4).length,
    altMissing: d.images.filter((i) => i.altMissing).length, emptyAlt: d.images.filter((i) => i.alt === "").length,
    links: d.links.length, linksNoName: d.links.filter((l) => l.nameMissing && l.visible).length, brokenHashOnPage: d.links.filter((l) => l.hashTargetExists === false).length,
    buttons: d.buttons.length, buttonsNoName: d.buttons.filter((b) => b.nameMissing && b.visible).length, smallTapTargets: small.length,
    axeCritical: p.axe?.byImpact?.critical || 0, axeSerious: p.axe?.byImpact?.serious || 0, axeModerate: p.axe?.byImpact?.moderate || 0, axeMinor: p.axe?.byImpact?.minor || 0,
    axeIds: (p.axe?.violations || []).map((v) => `${v.id}(${v.impact},${v.nodes})`).join(" "),
    axeContrastIncomplete: (p.axe?.incomplete || []).filter((i) => i.id === "color-contrast").reduce((n, i) => n + i.nodes, 0),
    contrastFailCertain: d.contrast.certainFailureCount, contrastFailAll: d.contrast.failureCount,
    h1: d.seo.h1Count, headingSkips: d.seo.headingSkips.length, title: d.seo.title, titleLen: d.seo.titleLength, titleDup: d.seo.titleSuffixRepeated, descLen: d.seo.descriptionLength,
    canonical: d.seo.canonical, robots: d.seo.robots, lang: d.seo.lang, ogImage: !!d.seo.og.image, jsonLdOk: d.seo.jsonLd.every((j) => j.parses), jsonLdTypes: d.seo.jsonLd.flatMap((j) => j.types).join(","),
    lcpMs: p.perf.lcpMs, lcpEl: p.perf.lcpElement, clsLoad: p.perf.clsAtLoad, clsScroll: p.perf.clsAfterScroll, requests: p.perf.requestCount, kB: Math.round(p.perf.transferredBytes / 1024),
    jsKB: Math.round(p.perf.totalJsBytes / 1024), imgKB: Math.round(p.perf.totalImageBytes / 1024), fontKB: Math.round(p.perf.totalFontBytes / 1024), cssKB: Math.round(p.perf.totalCssBytes / 1024),
    largestImage: p.perf.largestImage ? p.perf.largestImage.url.slice(0, 90) + " " + Math.round(p.perf.largestImage.bytes / 1024) + "kB" : "", externalRequests: p.perf.externalRequests.length,
    rmRunning: p.reducedMotion ? p.reducedMotion.afterScroll.runningAnimations : null, rmCanvasMoves: p.reducedMotion ? p.reducedMotion.afterScroll.canvasChanged : null,
    rmMovementCss: p.reducedMotion ? p.reducedMotion.afterScroll.elementsWithMovementCss : null, rmHidden: p.reducedMotion ? p.reducedMotion.afterScroll.hiddenInMain : null, rmPending: p.reducedMotion ? p.reducedMotion.afterScroll.pendingMotion : null,
    rmNavMs: p.reducedMotion?.navigation?.ms ?? null, rmOverlay: p.reducedMotion ? p.reducedMotion.atLoad.overlayDisplay : null,
    hiddenByOpacityAtTop: d.motion.hiddenByOpacity.length, infiniteAnimations: d.motion.infiniteAnimations.length,
    shots: p.screenshots,
  });
}

// ---- sitemap coverage
let sitemapCoverage = null;
if (siteLevel) {
  const inSitemap = new Set(siteLevel.sitemap.entries.map((e) => e.localPath));
  const indexable = siteLevel.pages.filter((p) => p.status === 200 && !/noindex/i.test(p.robotsMeta || "") && !/noindex/i.test(p.xRobotsTag || "")).map((p) => p.path);
  sitemapCoverage = {
    sitemapUrls: siteLevel.sitemap.urls.length, allResolve200: siteLevel.sitemap.entries.every((e) => e.status === 200), notResolving: siteLevel.sitemap.entries.filter((e) => e.status !== 200),
    indexableNotInSitemap: indexable.filter((p) => !inSitemap.has(p)), inSitemapButNoindexOrNot200: siteLevel.sitemap.entries.filter((e) => { const pg = siteLevel.pages.find((p) => p.path === e.localPath); return !pg || pg.status !== 200 || /noindex/i.test(pg.robotsMeta || ""); }).map((e) => e.localPath),
  };
}

const merged = {
  meta: { generatedAt: new Date().toISOString(), target: "LOCAL production build (next start) at http://localhost:3200 (no intake upstream) and :3201 (repo mock intake on :4010)", commit: process.env.AUDIT_SHA || null, viewports: { desktop: "1440x900", tablet: "820x1180", mobile: "390x844" }, schemes: Object.keys(capture) },
  summaryRows: rows, sitemapCoverage,
  assetRoutes: Object.fromEntries(Object.entries(assetRoutes).map(([k, v]) => [k, { routes: [...v.routes].sort(), how: [...v.how].sort() }])),
  capture, imageTruth, interaction, forms, probes, siteLevel,
};
fs.writeFileSync(path.join(OUT, "data", "browser-audit.json"), JSON.stringify(merged));
fs.writeFileSync(path.join(OUT, "data", "browser-audit-summary.json"), JSON.stringify({ meta: merged.meta, summaryRows: rows, sitemapCoverage, assetRoutes: merged.assetRoutes }, null, 1));
const csvCols = Object.keys(rows[0] || {}).filter((k) => k !== "shots");
fs.writeFileSync(path.join(OUT, "data", "browser-audit-summary.csv"), [csvCols.join(","), ...rows.map((r) => csvCols.map((c) => JSON.stringify(r[c] ?? "")).join(","))].join("\n"));
console.log("captures merged:", rows.length, "| schemes:", Object.keys(capture).join(","), "| image variants measured:", Object.keys(imageTruth).length);
console.log("forms:", Object.keys(forms).length, "| control files:", Object.values(interaction.controls).reduce((n, v) => n + Object.keys(v).length, 0), "| probes:", Object.keys(probes).length, "| site-level:", !!siteLevel);
