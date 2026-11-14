// Audit-only: renders inventory.md from inventory.json plus what the browser capture actually saw being served.
// Usage: node scripts/audit/build-inventory-md.mjs <audit-out dir>
import fs from "node:fs";
import path from "node:path";
const OUT = process.argv[2] || "/home/claude/audit-out";
const inv = JSON.parse(fs.readFileSync(path.join(OUT, "data", "inventory.json"), "utf8"));
const sum = JSON.parse(fs.readFileSync(path.join(OUT, "data", "browser-audit-summary.json"), "utf8"));
const full = JSON.parse(fs.readFileSync(path.join(OUT, "data", "browser-audit.json"), "utf8"));
const site = full.siteLevel;

// ---------- served-by-route map keyed by the repo asset path
const servedBy = {}; // public path -> {routes, how}
const mediaToPublic = (p) => {
  const m = p.match(/^\/_next\/static\/media\/(.+?)\.[0-9a-f]{8}\.(webp|png|jpg|jpeg|svg|woff2)$/);
  if (!m) return p;
  const hit = inv.assets.find((a) => a.file.endsWith("/" + m[1] + "." + m[2]) || a.file.endsWith("/" + m[1].replace(/-s\.p$/, "") + "." + m[2]));
  return hit ? (hit.publicPath || "/" + hit.file) : p;
};
for (const [k, v] of Object.entries(sum.assetRoutes)) {
  const key = mediaToPublic(k);
  const e = (servedBy[key] ||= { routes: new Set(), how: new Set() });
  // /workforce is a 308 to /service: the capture of "/workforce" is the /service page, so it is not counted as a separate route
  v.routes.filter((r) => r !== "/workforce").forEach((r) => e.routes.add(r)); v.how.forEach((h) => e.how.add(h));
}
const routesOf = (a) => { const e = servedBy[a.publicPath || "/" + a.file]; return e ? [...e.routes].sort() : []; };
const howOf = (a) => { const e = servedBy[a.publicPath || "/" + a.file]; return e ? [...e.how].sort().join("+") : ""; };

// ---------- approval records (docs/ASSET_PROVENANCE.md, docs/BRAND.md) -- transcribed by the auditor, see the quoted basis
const approval = (file) => {
  const f = file.replace(/^public/, "");
  if (/^\/images\/hardware\//.test(f)) return ["APPROVED (recorded)", "ASSET_PROVENANCE.md table: first-party manufacturer media, usage basis 'authorised dealer, founder-confirmed 2026-10-07'"];
  if (f === "/images/home/approved-full-scene-guard-chef-2026.png") return ["APPROVED (recorded, hash matches)", "ASSET_PROVENANCE.md 'Approved full-width restaurant entrance scene 2026-10-30' + 'Approved final layering contract' (LOCKED hero); SHA-256 in doc matches file"];
  if (f === "/images/home/approved-sme-security-control-room-2026.png") return ["APPROVED (recorded, hash matches)", "ASSET_PROVENANCE.md 'Founder-approved SME security control room 2026-10-30 replacement'; SHA-256 in doc matches file"];
  if (f === "/images/home/approved-security-chef-daylight-2026.png") return ["APPROVED then SUPERSEDED", "ASSET_PROVENANCE.md 'Founder-approved hospitality + security hero 2026-10-30', superseded the same day by the full-width scene"];
  if (f === "/images/home/sme-security-control-room.png") return ["RECORDED, superseded (not marked approved)", "ASSET_PROVENANCE.md 'SME security operations scene 2026-10-30'; replaced by approved-sme-security-control-room-2026.png"];
  if (/^\/images\/editorial\//.test(f)) return ["APPROVED (recorded)", "ASSET_PROVENANCE.md '2026-10-30 founder-approved field and hospitality photography' (12 named files)"];
  if (/^\/images\/backgrounds\//.test(f)) return ["APPROVED (recorded)", "ASSET_PROVENANCE.md '2026-10-30 Approved final layering contract': eight people-free architectural photographs, named"];
  if (/^\/images\/home\/panels\//.test(f)) return ["RECORDED (documented, no explicit approval wording)", "ASSET_PROVENANCE.md 'Homepage contextual editorial panels 2026-10-30' lists the nine files as synthetic illustrative photographs"];
  if (f === "/images/home/signal-one-hero-daylight.jpg" || f === "/images/home/service-restaurant-operations.jpg") return ["RECORDED (documented, no explicit approval wording)", "ASSET_PROVENANCE.md 'Homepage original illustrative photography 2026-10-29' table"];
  if (/^\/images\/(photo|story)\//.test(f)) return ["RECORDED as a group (no per-file record, no approval wording)", "ASSET_PROVENANCE.md 'Photography': documentary photographs under public/images/photo/ and public/images/story/ are illustrative scenes; app/lib/photos.ts calls them AI-generated environment images pending a commissioned shoot"];
  if (/^\/brand\//.test(f) || f === "/og-image.jpg") return ["RECORDED (brand asset)", "docs/BRAND.md asset table"];
  if (/^\/images\/interior\//.test(f)) return ["NO APPROVAL RECORD", "only docs/SITEWIDE_VISUAL_MISSION_2026-10-29.md lists some as 'wired, build pending'; absent from ASSET_PROVENANCE.md"];
  if (/^\/images\/scenes\//.test(f)) return ["NO APPROVAL RECORD", "not mentioned in any doc"];
  if (/^\/images\//.test(f)) return ["NO APPROVAL RECORD", "not mentioned in any doc"];
  if (f === "/connect-assets/andisiwe-bw.webp") return ["NO PROVENANCE RECORD", "portrait of a named person; not in ASSET_PROVENANCE.md"];
  if (f === "/data/world.geojson") return ["NO PROVENANCE RECORD", "world geometry; no source or licence recorded in any doc"];
  if (/^assets\/hardware\/originals\//.test(file)) return ["SOURCE ORIGINAL (recorded)", "ASSET_PROVENANCE.md: originals kept unmodified, not served"];
  if (/fonts|_fonts/.test(file)) return ["LICENSED (OFL)", "app/_fonts/inter/OFL.txt"];
  return ["n/a", ""];
};

const kb = (n) => (n >= 1024 * 1024 ? (n / 1048576).toFixed(2) + " MB" : Math.round(n / 1024) + " kB");
const lines = [];
const p = (s = "") => lines.push(s);

p("# Signal One website inventory");
p();
p(`Generated ${new Date().toISOString()} from commit ${sum.meta.commit || "(see logs/01-environment.log)"} by scripts/audit/inventory.mjs (static) and tests/audit (browser, local production build).`);
p("Static facts come from reading the repository. Anything marked **served** was observed as a network request or a rendered element in Chromium during the capture pass (24 routes x 3 viewports x 2 colour schemes).");
p();

// ---------- a. routes
p("## a. Routes");
p();
p("| URL | Kind | File | Notes | Local status |");
p("|---|---|---|---|---|");
const statusOf = (url) => {
  if (!site) return "";
  const pg = site.pages.find((x) => x.path === url); if (pg) return String(pg.status) + (pg.location ? " -> " + pg.location : "");
  const st = site.statics.find((x) => x.path === url); if (st) return String(st.status);
  const og = site.ogImages.find((x) => x.localPath && x.localPath.split("?")[0].replace(/-[a-z0-9]+$/, "") === url); if (og) return String(og.status) + " " + og.contentType;
  return "";
};
for (const r of inv.routes) {
  const notes = [r.dynamic ? "dynamic segment" : "", r.methods?.length ? "methods: " + r.methods.join(", ") : "", r.redirectsTo ? "permanentRedirect -> " + r.redirectsTo : "", r.noindex ? "robots noindex in metadata" : ""].filter(Boolean).join("; ");
  let url = r.url;
  let st = statusOf(url);
  if (url === "/connect/[profile]") st = statusOf("/connect/andisiwe") + " (andisiwe); " + statusOf("/connect/audit-no-such-profile") + " (unknown id)";
  if (url === "/present/[profile]") st = statusOf("/present/andisiwe") + " (andisiwe)";
  if (url === "/qr/[profile]") st = statusOf("/qr/andisiwe") + " (andisiwe); " + statusOf("/qr/nobody") + " (unknown id)";
  if (url === "/contact/[profile]") st = statusOf("/contact/andisiwe") + " (andisiwe, vCard gate closed); " + statusOf("/contact/nobody") + " (unknown id)";
  if (url === "/[...unmatched]") st = statusOf("/audit-no-such-page") + " (any unknown path)";
  p(`| \`${url}\` | ${r.kind} | \`${r.file}\` | ${notes} | ${st} |`);
}
p();
p("Redirects defined in `next.config.ts` (`redirects()`, all permanent) and observed locally:");
p();
if (site) { p("| From | To | Observed |"); p("|---|---|---|"); for (const r of site.redirects) p(`| \`${r.from}\` | \`${r.expected}\` | ${r.status} -> ${r.location} (${r.note}) |`); }
p();
p("`proxy.ts` (Next 16 middleware): canonical-host redirect, inactive unless `CANONICAL_REDIRECT=1`.");
p();

// ---------- b. components
const purpose = {
  "app/components/Analytics.tsx": "Loads GA4 (gtag) only when NEXT_PUBLIC_GA_ID is set; forwards clicks on [data-analytics-event] to trackEvent.",
  "app/components/AudienceJourneys.tsx": "Five audience cards (service owner, security company, officer, equipment buyer, sales candidate). **Not imported by any route (dead code).**",
  "app/components/ConsentFields.tsx": "The two consent checkboxes on every public form: required processing consent, optional marketing consent.",
  "app/components/EquipmentQuoteForm.tsx": "Equipment quote form on /radios-equipment (radio tiles choose Radios and PTT / Tracking / Body cameras).",
  "app/components/Footer.tsx": "Site footer: closing CTA, lockup, three link groups rendered as <details> accordions.",
  "app/components/GlassGlobe.tsx": "Canvas 2D animated globe (requestAnimationFrame) with arcs from Johannesburg; fetches /data/world.geojson.",
  "app/components/GuardDayCalculator.tsx": "Guards x days cost calculator on /pricing (two number inputs, live result).",
  "app/components/Hardware.tsx": "HardwareCard and HardwareRail: equipment product tiles (manufacturer photo or typographic tile).",
  "app/components/Header.tsx": "Sticky header with three identities (buyer / guard / careers), desktop nav, Menu button and mobile sheet.",
  "app/components/HeroGlobeLayer.tsx": "Mounts GlassGlobe lazily (IntersectionObserver, ssr:false) over a static fallback orb.",
  "app/components/HomeScrollChoreography.tsx": "Homepage directional entrance of [data-motion-from] panels via IntersectionObserver.",
  "app/components/IntakeError.tsx": "Error message for a failed submit plus the prefilled mailto fallback link.",
  "app/components/IntakeForm.tsx": "Short single-step intake form (contact, marketplace interest) posting to /api/intake.",
  "app/components/LandingPage.tsx": "Template for the three SEO landing pages (patrol, attendance, PTT rental).",
  "app/components/LegalPage.tsx": "Template for /privacy, /popia, /terms, /security-trust (contents list + sections).",
  "app/components/PatrolStory.tsx": "Four-step patrol story with two photographs (reveal-group) on /guard-patrol-software.",
  "app/components/ProductProof.tsx": "Tabbed product-screenshot frame. **Not imported by any route (dead code).**",
  "app/components/RailControls.tsx": "Previous/next buttons for the hardware rail. **Not imported by any route (dead code).**",
  "app/components/ReceiptReference.tsx": "Shows the stored record reference once the receiver confirmed the save.",
  "app/components/Reveal.tsx": "IntersectionObserver that sets data-reveal on .reveal-group (only PatrolStory uses it).",
  "app/components/SceneTransition.tsx": "Route transition: intercepts internal link clicks and plays the glass shutter overlay before router.push.",
  "app/components/brand/ProductSignature.tsx": "Typographic product wordmark (1GUARD / 1Service / 1Community).",
  "app/components/brand/SignalOneLogo.tsx": "Signal One lockup (mark + wordmark + descriptor).",
  "app/components/brand/SignalOneMark.tsx": "Signal One mark (three concentric circles), optional pulse.",
  "app/components/journey/ClientOnboarding.tsx": "Five-step company onboarding / trial-request journey on /get-started.",
  "app/components/journey/GuardJoin.tsx": "Nine-step guard profile journey on /guards/join.",
  "app/components/journey/IntakeAvailability.tsx": "Notice shown when /api/intake/status says online submission is not connected.",
  "app/components/journey/SalesApplication.tsx": "Multi-step sales representative application on /join/sales.",
  "app/components/journey/fields.tsx": "Journey form fields: text, textarea, select, radio tiles, checkbox tiles.",
  "app/components/journey/useJourney.ts": "Headless journey state: steps, validation, localStorage resume, submit, mailto fallback.",
  "app/components/ui.tsx": "Shared primitives: Kicker, Status, GuardStatus, FactPanel, ButtonLink, Photo, Steps, PhotoBand, SplitHero, PageHero.",
  "app/_connect/components/ConnectHeader.tsx": "Signal Connect header (lockup + context label).",
  "app/_connect/components/ContactExchange.tsx": "Presenter-side link to the visitor card.",
  "app/_connect/components/ExchangeDetails.tsx": "Earlier manual-email exchange form. **Not imported by any route (dead code).**",
  "app/_connect/components/FounderPresenter.tsx": "/present/[profile]: founder name, QR, share controls.",
  "app/_connect/components/InterestSelect.tsx": "Grouped interest picker (disclosure + checkboxes) for the introduction form.",
  "app/_connect/components/IntroductionForm.tsx": "/connect/[profile] introduction form (rendered as unavailable while the exchange gate is closed).",
  "app/_connect/components/QRDisplay.tsx": "QR image (/qr/[profile]) and share controls.",
  "app/_connect/components/ShareLink.tsx": "Share link / Copy link buttons with a read-only visitor link field.",
  "app/_connect/components/VisitorIdentity.tsx": "/connect/[profile]: digital business card with portrait and contact rows.",
  "app/_connect/components/brand/SignalOneLogo.tsx": "Re-export of the site lockup for Connect.",
  "app/_connect/components/brand/SignalOneMark.tsx": "Re-export of the site mark for Connect.",
};
p("## b. Components");
p();
p("| File | Client? | Interactive controls (static count) | Used by | Purpose |");
p("|---|---|---|---|---|");
for (const c of inv.components) {
  const ctl = Object.entries(c.controls).filter(([, n]) => n > 0).map(([k, n]) => `${k}:${n}`).join(", ") || "none";
  const used = c.importedBy.length ? c.importedBy.map((f) => f.replace(/^app\//, "")).slice(0, 4).join(", ") + (c.importedBy.length > 4 ? ` +${c.importedBy.length - 4}` : "") : "**nothing**";
  p(`| \`${c.file}\` | ${c.client ? "client" : "server"} | ${ctl} | ${used} | ${purpose[c.file] || ""} |`);
}
p();
p("Page files (`app/(marketing)/*/page.tsx`) also contain links and, on the homepage, the hero selector; they are exercised page by page in `data/parts/interaction/controls/`.");
p();

// ---------- c. motion
const motionRoutes = {};
for (const [vp, slugs] of Object.entries(full.capture.light || {})) for (const [, part] of Object.entries(slugs)) {
  for (const name of part.dom.motion.infiniteAnimations) { const k = name.split(" on ")[0]; (motionRoutes[k] ||= new Set()).add(part.route); }
  if (part.dom.controls.canvases) (motionRoutes.canvas ||= new Set()).add(part.route);
  if (part.dom.motion.motionTargets) (motionRoutes["data-motion-from"] ||= new Set()).add(part.route);
  if (part.dom.motion.revealGroups) (motionRoutes["reveal-group"] ||= new Set()).add(part.route);
  if (part.dom.motion.hiddenByOpacity.length) (motionRoutes["view-timeline"] ||= new Set()).add(part.route);
  void vp;
}
const R = (k) => (motionRoutes[k] ? [...motionRoutes[k]].sort().join(", ") : "none observed");
const rmRows = sum.summaryRows.filter((r) => r.scheme === "light" && r.rmRunning !== null);
const rmWorst = { running: Math.max(...rmRows.map((r) => r.rmRunning)), movement: Math.max(...rmRows.map((r) => r.rmMovementCss)), hidden: Math.max(...rmRows.map((r) => r.rmHidden)), pending: Math.max(...rmRows.map((r) => r.rmPending)), canvasMoved: rmRows.filter((r) => r.rmCanvasMoves === true).length, overlay: [...new Set(rmRows.map((r) => r.rmOverlay))].join("/"), navMax: Math.max(...rmRows.map((r) => r.rmNavMs || 0)) };
p("## c. Animation, transition, reveal, scroll and moving elements");
p();
p("| Effect | Defined at | Mechanism | Routes (observed in browser) | prefers-reduced-motion |");
p("|---|---|---|---|---|");
const kf = (n) => inv.motion.keyframes.filter((k) => k.name === n).map((k) => k.at).join(", ");
p(`| Header logo pulse | \`signal-pulse\` ${kf("signal-pulse")} | CSS keyframes, infinite 2.8s | ${R("signal-pulse")} | Off (\`animation:none\` at app/globals.css:782-784; Connect: app/_connect/styles/global.css:67-68) |`);
p(`| Route transition "glass shutter" | \`sg-shutter-*\`, \`sg-entry-seam-*\`, \`sg-pulse-flip-away\`, \`sg-wordmark-flip-in\`, \`sg-entry-emblem-out\` app/globals.css:1630-1747; logic app/components/SceneTransition.tsx:70-132 | Click interception + CSS keyframes (1122ms close, 420ms hold, 460ms hold, 1338ms open) | every marketing route (overlay element present on all) | Bypassed: SceneTransition.tsx:81 returns before preventDefault; overlay \`display:none\` (app/globals.css:1749) |`);
p(`| Homepage hero globe | app/components/GlassGlobe.tsx:91-196 (requestAnimationFrame), mounted by HeroGlobeLayer.tsx:10 | Canvas 2D, continuous rotation and travelling pulses | ${R("canvas")} | Static frame: GlassGlobe.tsx:67,101,172,183,194 (no rAF loop when reduced) |`);
p(`| Homepage hero copy / bar entrance | \`so-float-enter\` app/home-conversion.css:388-391, \`so-rail-enter\` :437-443 | CSS keyframes on load | / | Only inside \`@media (prefers-reduced-motion:no-preference)\` |`);
p(`| Homepage scroll-driven text panels | app/home-conversion.css:392 (\`animation-timeline:view()\`) on .so-vertical-content, .so-equipment-copy | CSS scroll-driven animation (opacity 0 until the panel enters the viewport) | ${R("view-timeline")} | Only inside \`no-preference\` block |`);
p(`| Homepage directional panel entrances | app/components/HomeScrollChoreography.tsx:33-57; CSS app/home-conversion.css:879-915, 999-1035 | IntersectionObserver sets data-motion-state; CSS transition 800ms/700ms, one-shot | ${R("data-motion-from")} | JS returns early (HomeScrollChoreography.tsx:35); CSS forces opacity:1, transform:none (home-conversion.css:911-915) |`);
p(`| Section reveal groups | app/components/Reveal.tsx:12-33; CSS app/globals.css:1301-1308 | IntersectionObserver, re-arms when scrolled back above; 850ms transition; >=640px only | ${R("reveal-group")} | Not started (Reveal.tsx:12 media query); CSS override app/globals.css:1336 |`);
p(`| First-section glass panel settle | \`s1-panel-settle\` app/globals.css:1579-1591 | CSS keyframes 700ms on load | non-home routes with a .glass-light first section | Only in \`no-preference\`; override app/globals.css:1593-1595 |`);
p(`| Tab/step enter | \`s1-enter\` app/globals.css:721-734 (.animate-enter) | CSS keyframes 320ms | journey steps | Inside reduced-motion handling at app/globals.css:164-176 |`);
p(`| Button / card hover lift, footer link transitions | app/marketing-system.css:117-151, 192-194, 249-250; app/home-conversion.css:365-397 | CSS transitions (hover) | all marketing routes | Disabled at marketing-system.css:151,179,194,250; home-conversion.css:394-397 |`);
p(`| Legacy hero float / globe enter | \`s1-clay-breathe\` app/globals.css:898,933; \`s1-globe-enter\` :1002,1009 | CSS keyframes on selectors (.s1-hero-float, .s1-hero-content-glass) | **no element with these classes was rendered on any route** | Covered (:939-941, :1012) |`);
p(`| Connect card arrival | \`signal-arrival\` app/_connect/styles/global.css:59-65; VisitorIdentity.module.css:105-111; ExchangeDetails.module.css:105-110 | CSS keyframes 320ms | /connect/andisiwe, /present/andisiwe | Only in \`no-preference\` |`);
p(`| Smooth scrolling | app/globals.css:164-176 | \`scroll-behavior\` | all | \`auto\` under reduce (measured) |`);
p(`| Video | none | no <video> element or video file in the repo | - | - |`);
p();
p(`Browser check with \`prefers-reduced-motion: reduce\` on all 24 routes x 3 viewports (light scheme): max running animations after a full scroll = ${rmWorst.running}; elements with a non-zero movement transition/animation = ${rmWorst.movement}; elements left hidden in <main> = ${rmWorst.hidden}; panels left pending = ${rmWorst.pending}; captures where the canvas kept changing = ${rmWorst.canvasMoved}; transition overlay display = ${rmWorst.overlay}; slowest internal navigation = ${rmWorst.navMax} ms.`);
p();
p("All `@keyframes` definitions: " + inv.motion.keyframes.map((k) => `\`${k.name}\` (${k.at})`).join(", ") + ".");
p();

// ---------- d. assets
p("## d. Image, font and data assets");
p();
p("Flags: `>400KB` file over 400 kB; `UNREFERENCED` no reference in app/ code or CSS; `CSS-REF-NOT-SERVED` referenced only from CSS rules that never applied on any captured route; `NOT-OPTIMISED` served as a raw file (CSS background or <img>), not through next/image.");
p();
p("| Asset | Bytes | Pixels | Format | Referenced from (code) | Served on routes (browser) | Flags |");
p("|---|---|---|---|---|---|---|");
for (const a of inv.assets) {
  const served = routesOf(a);
  const how = howOf(a);
  const flags = [];
  if (a.over400KB) flags.push(">400KB");
  if (a.status === "UNREFERENCED") flags.push("UNREFERENCED");
  if (a.referencedByApp && !served.length && /^public\//.test(a.file) && !/brand\//.test(a.file)) flags.push(a.refs.app.every((r) => /\.css:/.test(r)) ? "CSS-REF-NOT-SERVED" : "REFERENCED-NOT-SERVED");
  if (/css-background/.test(how)) flags.push("NOT-OPTIMISED (CSS background)");
  if (a.embeddedRaster) flags.push("SVG wrapping a base64 " + a.embeddedRaster.join("+"));
  const refs = a.refs.app.length ? a.refs.app.slice(0, 3).map((r) => r.replace(/^app\//, "")).join(", ") + (a.refs.app.length > 3 ? ` +${a.refs.app.length - 3}` : "") : (a.status.startsWith("FRAMEWORK") ? "Next.js file convention" : a.status.startsWith("SOURCE") ? "not served (source original)" : "none");
  p(`| \`${a.file}\` | ${a.bytes} (${kb(a.bytes)}) | ${a.width ? a.width + "x" + a.height : "-"} | ${a.format} | ${refs} | ${served.length ? served.join(" ") : "none"} | ${flags.join("; ")} |`);
}
p();
p(`Referenced in code but missing from disk: ${inv.missing.length ? inv.missing.map((m) => m.path + " (" + m.at + ")").join(", ") : "none"}.`);
p();

// image usage findings from the browser
p("### Image elements as rendered (browser, light scheme)");
p();
p("| Route | Viewport | Image | Rendered box | Decoded pixels of served variant | Display scale | object-fit | Finding |");
p("|---|---|---|---|---|---|---|---|");
const seen = new Set();
for (const vp of ["desktop", "tablet", "mobile"]) for (const [, part] of Object.entries(full.capture.light?.[vp] || {})) {
  for (const img of part.dom.images) {
    if (!img.visible) continue;
    const findings = [];
    if (img.broken) findings.push("BROKEN");
    if (img.distorted) findings.push("DISTORTED (aspect off by " + Math.round(img.aspectDelta * 100) + "%)");
    if (img.trueUpscaled) findings.push("UPSCALED x" + img.trueDisplayScale);
    if (img.croppedByCover > 0.4) findings.push("heavy cover crop (box aspect differs " + Math.round(img.croppedByCover * 100) + "%)");
    if (img.altMissing) findings.push("alt missing");
    if (!img.nextImage) findings.push("raw <img>");
    if (!findings.length) continue;
    const key = part.route + vp + (img.original || img.src) + findings.join();
    if (seen.has(key)) continue; seen.add(key);
    p(`| ${part.route} | ${vp} | \`${(img.original || img.src).slice(0, 70)}\` | ${img.renderedWidth}x${img.renderedHeight} | ${img.truePixelWidth ? img.truePixelWidth + "x" + img.truePixelHeight : "?"} | ${img.trueDisplayScale ?? "?"} | ${img.objectFit} | ${findings.join("; ")} |`);
  }
}
p();
const imgStats = { total: 0, next: 0, raw: 0, altMissing: 0, broken: 0, noDims: 0, lazy: 0, priority: 0 };
for (const vp of ["desktop"]) for (const part of Object.values(full.capture.light?.[vp] || {})) for (const img of part.dom.images) { imgStats.total++; if (img.nextImage) imgStats.next++; else imgStats.raw++; if (img.altMissing) imgStats.altMissing++; if (img.broken) imgStats.broken++; if (!img.hasWidthHeightAttrs && !img.nextImage) imgStats.noDims++; if (img.loading === "lazy") imgStats.lazy++; if (img.fetchPriority === "high") imgStats.priority++; }
p(`Desktop totals across 24 routes: ${imgStats.total} <img> elements; ${imgStats.next} via next/image, ${imgStats.raw} raw <img>; alt attribute missing on ${imgStats.altMissing}; broken ${imgStats.broken}; raw <img> without width/height ${imgStats.noDims}; loading=lazy ${imgStats.lazy}; fetchpriority=high ${imgStats.priority}. next/image \`fill\` images carry no width/height attributes by design (the parent box sets the size).`);
p();

// reuse table
p("### Photographs reused across routes (browser, any viewport)");
p();
p("`/workforce` answers 308 to `/service` and is therefore not listed as a separate route. `/audit-no-such-page` is the marketing 404 page.");
p();
p("| Asset | Routes | How |");
p("|---|---|---|");
for (const a of inv.assets.filter((x) => /^public\/images\//.test(x.file))) { const r = routesOf(a); if (r.length > 1) p(`| \`${a.publicPath}\` | ${r.join(" ")} (${r.length}) | ${howOf(a)} |`); }
p();

// ---------- e. approved vs deployed
p("## e. Imagery: approval record versus what the build serves");
p();
p("Search results (logs/06c, 06d, 06e): the string \"fable\" does not occur in any file, filename or path in the repository at this commit, nor in any path in the 216 commits fetched. It occurs only in commit-message trailers (`Co-Authored-By: Claude Fable 5.2`, 10 commits dated 2026-11-12). \"premium-images\" does not occur anywhere. No code, config or `.env.example` entry points at an external image host: `next.config.ts` has no `images.remotePatterns`, the CSP is `img-src 'self' data: blob:` plus Google Analytics hosts, and every image request in the capture went to the local origin (0 external requests on every route). The build does not depend on any other service for imagery.");
p();
const groups = { "approved-and-deployed": [], "approved-but-not-deployed": [], "recorded-not-explicitly-approved-and-deployed": [], "recorded-not-deployed": [], "deployed-but-no-approval-record": [], "no-record-and-not-deployed": [] };
const imgAssets = inv.assets.filter((x) => /^public\/(images|connect-assets|data|og-image)/.test(x.file) || x.file === "public/og-image.jpg");
p("| Asset | Approval record | Basis | Served on routes | Bucket |");
p("|---|---|---|---|---|");
for (const a of imgAssets) {
  const [status, basis] = approval(a.file);
  const served = routesOf(a);
  const approved = /^APPROVED \(/.test(status);
  const recorded = /^RECORDED|SUPERSEDED/.test(status);
  const bucket = approved ? (served.length ? "approved-and-deployed" : "approved-but-not-deployed") : recorded ? (served.length ? "recorded-not-explicitly-approved-and-deployed" : "recorded-not-deployed") : (served.length ? "deployed-but-no-approval-record" : "no-record-and-not-deployed");
  groups[bucket].push(a.publicPath);
  p(`| \`${a.publicPath}\` | ${status} | ${basis} | ${served.length ? served.join(" ") : "none"} | ${bucket} |`);
}
p();
for (const [k, v] of Object.entries(groups)) p(`- **${k}** (${v.length}): ${v.length ? v.map((x) => "`" + x + "`").join(", ") : "none"}`);
p();
p("Bundled into the deployable but never requested by any route: every file in `public/` is copied into the deployment and is reachable by URL even when no page uses it.");
p();
p("External hosts referenced in code and env examples (`.env.example`, app/, next.config.ts, proxy.ts, scripts/):");
p();
const hosts = {};
for (const h of inv.externalHosts) { let host = ""; try { host = new URL(h.url).host; } catch { continue; } (hosts[host] ||= []).push(h.at); }
p("| Host | Where | Image host? |");
p("|---|---|---|");
for (const [h, at] of Object.entries(hosts).sort()) p(`| ${h} | ${[...new Set(at)].slice(0, 4).join(", ")}${at.length > 4 ? " +" + (at.length - 4) : ""} | ${/googletagmanager|google-analytics|analytics\.google/.test(h) ? "allowed in CSP img-src (analytics beacons only, dormant without NEXT_PUBLIC_GA_ID)" : "no"} |`);
p();
p("`.env.example` contents:");
p();
p("```");
p(inv.envExample.trim());
p("```");
fs.writeFileSync(path.join(OUT, "data", "inventory.md"), lines.join("\n") + "\n");
console.log("inventory.md lines:", lines.length, "| buckets:", Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])));
