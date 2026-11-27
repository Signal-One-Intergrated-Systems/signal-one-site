import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/*
 * Design-system static contract (runs before every build: `npm run build` → prebuild).
 * It protects the rules in docs/DESIGN_SYSTEM.md that a later edit could silently undo:
 * the light-first role-token layer (one layer, two palettes, graphite only as a named scope),
 * computed WCAG contrast for every role pair, no retired token layers, the founder-locked hero
 * kept in one marked block, the brand geometry and the shared component recipes.
 * Depth (2026-11-27, docs/launch/DEPTH_SYSTEM.md): the materials, the midnight slab, the plinth and the
 * three glass tiers are computed for WCAG AA at their WORST case (the darkest stop a text can sit on, and
 * glass over the veil over the darkest pixel of each scene photograph); each scene photograph is used
 * once; shadows fall away from the one light source; blur stays on the named glass only.
 */
const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const files = {
  global: read("app/globals.css"),
  marketing: read("app/marketing-system.css"),
  home: read("app/home-conversion.css"),
  layout: read("app/(marketing)/layout.tsx"),
  header: read("app/components/Header.tsx"),
  footer: read("app/components/Footer.tsx"),
  ui: read("app/components/ui.tsx"),
  logo: read("app/components/brand/SignalOneMark.tsx"),
  font: read("app/lib/body-font.ts"),
  docs: read("docs/DESIGN_SYSTEM.md"),
  depthDoc: existsSync(new URL("docs/launch/DEPTH_SYSTEM.md", root)) ? read("docs/launch/DEPTH_SYSTEM.md") : "",
};
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const BEGIN = "/* ===== BEGIN FOUNDER-LOCKED HERO ===== */";
const END = "/* ===== END FOUNDER-LOCKED HERO ===== */";
const homeBegin = files.home.indexOf(BEGIN);
const homeEnd = files.home.indexOf(END);
const homeSections = homeEnd > 0 ? stripComments(files.home.slice(homeEnd + END.length)) : "";
const global = stripComments(files.global);
const marketing = stripComments(files.marketing);
const count = (text, pattern) => (text.match(pattern) || []).length;
const colourLiteral = /#[0-9a-fA-F]{3,8}\b|rgba?\(/g;

// Marketing TSX (Signal Connect has its own layout and tokens and is out of scope).
const tsx = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === "_connect" || name === "(connect)" || name === "node_modules") continue;
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx|ts)$/.test(name)) tsx.push(readFileSync(path, "utf8"));
  }
};
walk(new URL("app", root).pathname);
const markup = tsx.join("\n");

// ---- Palettes and computed contrast --------------------------------------------------------
const palette = (prefix) => {
  const out = {};
  for (const [, key, value] of global.matchAll(new RegExp(`--${prefix}-([a-z0-9-]+):\\s*([^;]+);`, "g"))) out[key] = value.trim();
  return out;
};
const brand = palette("color");
const resolve = (value, depth = 0) => {
  const ref = /^var\(--([a-z0-9-]+)\)$/.exec(value || "");
  if (!ref || depth > 4) return value;
  const [prefix, ...rest] = ref[1].split("-");
  const key = rest.join("-");
  const source = prefix === "color" ? brand : prefix === "light" ? light : prefix === "graphite" ? graphite : {};
  return resolve(source[key], depth + 1);
};
const light = palette("light");
const graphite = palette("graphite");
const hex = (value) => {
  const m = /^#([0-9a-f]{6})$/i.exec(resolve(value) || "");
  return m ? m[1] : null;
};
const luminance = (h) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const contrastFailures = [];
const pairs = (set, name) => {
  const text = ["ink", "ink-2", "ink-3", "accent", "live", "beta", "soon", "danger"];
  for (const bg of ["canvas", "surface", "surface-2"]) {
    for (const fg of text) {
      const a = hex(set[fg]);
      const b = hex(set[bg]);
      if (!a || !b) contrastFailures.push(`${name} ${fg}/${bg} unresolved`);
      else if (ratio(a, b) < 4.5) contrastFailures.push(`${name} ${fg} on ${bg} ${ratio(a, b).toFixed(2)}:1 < 4.5`);
    }
    for (const fg of ["line-strong", "focus"]) {
      const a = hex(set[fg]);
      const b = hex(set[bg]);
      if (a && b && ratio(a, b) < 3) contrastFailures.push(`${name} ${fg} on ${bg} ${ratio(a, b).toFixed(2)}:1 < 3`);
    }
  }
};
pairs(light, "light");
pairs(graphite, "graphite");

// ---- Depth: worst-case contrast of every material, plinth, slab and glass tier -------------------
const rootVars = {};
for (const [, key, value] of (/@theme\s*\{([\s\S]*?)\n\}/.exec(global)?.[1] || "").matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) rootVars[key] = value.trim();
// Only the :root token blocks (the graphite and midnight scopes re-point some of the same names).
for (const [, block] of global.matchAll(/:root\s*\{([^}]*)\}/g))
  for (const [, key, value] of block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) if (!(key in rootVars)) rootVars[key] = value.trim();
const rgbOf = (value, depth = 0) => {
  const v = (value || "").trim();
  const ref = /^var\(--([a-z0-9-]+)\)$/.exec(v);
  if (ref && depth < 5) return rgbOf(rootVars[ref[1]] ?? (ref[1].startsWith("color-") ? brand[ref[1].slice(6)] : undefined), depth + 1);
  let m = /^#([0-9a-f]{6})$/i.exec(v);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = /^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/.exec(v);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  return null;
};
const over = (top, bottom) => top.slice(0, 3).map((c, i) => c * top[3] + bottom[i] * (1 - top[3])).concat(1);
const toHex = (c) => c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
const lightText = ["ink", "ink-2", "ink-3", "accent", "live", "beta", "soon", "danger"];
const depthFailures = [];
const depthPairs = [];
const surfaceCheck = (name, bg, set, prefix) => {
  if (!bg) return depthFailures.push(name + " unresolved");
  for (const role of lightText) {
    const fg = hex(set[role]);
    const r = ratio(fg, toHex(bg));
    depthPairs.push(r);
    if (r < 4.5) depthFailures.push(`${prefix} ${role} on ${name} ${r.toFixed(2)}:1`);
  }
};
const plane = rgbOf(rootVars.plane);
for (const mat of ["mat-horizon", "mat-silver", "mat-ice", "mat-stone", "mat-pearl", "plinth-top", "plinth-base"]) {
  const body = rgbOf(rootVars[mat]);
  surfaceCheck(mat, body, light, "light");
  if (body && plane) surfaceCheck("plane over " + mat, over(plane, body), light, "light");
}
const midnightPlane = /\.mat-midnight,\s*\.so-home \.so-guard-section \{[^}]*--plane: (rgb\([^)]*\))/.exec(global)?.[1];
for (const stop of ["midnight-canvas", "midnight-surface", "midnight-surface-2", "midnight-high", "midnight-low"]) {
  const body = rgbOf(rootVars[stop]);
  surfaceCheck(stop, body, graphite, "graphite");
  if (body && midnightPlane) surfaceCheck("midnight plane over " + stop, over(rgbOf(midnightPlane), body), graphite, "graphite");
}
// The lit corner of the slab: the sky light at full strength over its lightest stop.
const slabLight = /\.mat-midnight,\s*\.so-home \.so-guard-section \{[^}]*?radial-gradient\([^,]*, (rgb\([^)]*\))/.exec(global)?.[1];
if (slabLight) surfaceCheck("midnight lit corner", over(rgbOf(slabLight), rgbOf(rootVars["midnight-high"])), graphite, "graphite");
else depthFailures.push("midnight slab light unresolved");

// Scenes: every photograph used as an environment is measured (docs/launch/depth-scene-floor.json),
// unchanged since measurement, and used once. Text is checked over its darkest pixel.
const floorPath = new URL("docs/launch/depth-scene-floor.json", root);
const floor = existsSync(floorPath) ? JSON.parse(readFileSync(floorPath, "utf8")) : {};
const sceneUses = [global, marketing, homeSections].join("\n").match(/url\("(\/images\/[^"]+)"\)/g) || [];
const sceneUrls = sceneUses.map((u) => /url\("([^"]+)"\)/.exec(u)[1]);
const sceneFailures = [];
for (const url of new Set(sceneUrls)) {
  const entry = floor[url];
  if (!entry) { sceneFailures.push(url + " not measured"); continue; }
  const sha = createHash("sha256").update(readFileSync(new URL("public" + url, root))).digest("hex");
  if (sha !== entry.sha256) sceneFailures.push(url + " changed since measurement");
  const dark = rgbOf(entry.darkest);
  const veilStrong = over(rgbOf(rootVars["veil-strong"]), dark);
  const veilMid = over(rgbOf(rootVars["veil-mid"]), dark);
  surfaceCheck("veil-strong over " + url, veilStrong, light, "light");
  surfaceCheck("glass over veil-mid over " + url, over(rgbOf(rootVars["glass-panel"]), veilMid), light, "light");
  surfaceCheck("solid glass over " + url, over(rgbOf(rootVars["glass-panel-solid"]), dark), light, "light");
}
const repeatedScenes = sceneUrls.filter((u, i) => sceneUrls.indexOf(u) !== i);

// Shadows fall away from the one light source (high on the right): every drop layer has x <= 0.
const shadowTokens = ["shadow-contact", "shadow-card", "shadow-float"].map((k) => rootVars[k] || "");
const shadowAgainstLight = shadowTokens.some((v) => !v || [...v.matchAll(/(?:^|,)\s*(-?\d+)(?:px)? (-?\d+)(?:px)? \d+px/g)].some(([, x]) => +x > 0));
// Blur is expensive to scroll: only the named glass carries backdrop-filter (nav, photo glass, shutter).
const blurDeclarations = count([global, marketing, homeSections].join("\n"), /(?<![-(])backdrop-filter:/g);
const midnightUses = count(markup, /\bmat-midnight\b/g);
// Materials come from the system: no section-level gradients or background photographs in markup.
const adHocBackgrounds = /bg-\[(linear|radial)-gradient|bg-\[url\(|backgroundImage:/.test(markup);
if (ratio(hex(brand["on-signal"]) || "000000", hex(brand.signal) || "000000") < 4.5) contrastFailures.push("on-signal on signal < 4.5");

// ---- Role tokens: declared once in @theme (light), re-pointed in the graphite scope ------------
const roles = ["canvas", "surface", "surface-2", "ink", "ink-2", "ink-3", "accent", "hairline", "line-strong", "focus", "live", "beta", "soon", "danger"];
const theme = /@theme\s*\{([\s\S]*?)\n\}/.exec(global)?.[1] || "";
const scopeMatch = /([^{}]+)\{(\s*--color-canvas: var\(--graphite-canvas\);[\s\S]*?)\}/.exec(global);
const scopeSelectors = (scopeMatch?.[1] || "").split(",").map((s) => s.trim()).filter(Boolean);
const scopeBody = scopeMatch?.[2] || "";
// Graphite is selective: only these named places may be graphite (DESIGN_SYSTEM §1).
const approvedGraphite = [".tone-graphite", ".mat-midnight", ".so-home .so-guard-section", ".s1-premium-footer-shell", ".product-window", ".phone-frame", ".sg-entry-overlay"];
const toneGraphiteUses = count(markup, /\btone-graphite\b/g);

// ---- Retired names ----------------------------------------------------------------------------
const retiredCssTokens = /--color-(deep|base|raised|raised-2|text-inv|text-inv-2|text-inv-3|line-dark|danger-inv|live-inv|beta-inv|soon-inv|text|text-2|light|light-2|line)\b(?!-)/;
const retiredUtilities = /(?<![\w-])(text-text-inv(-[23])?|bg-raised(-2)?|(border|ring|bg|divide)-line-dark|text-signal-300|text-signal(?![\w-])|bg-deep|bg-base|text-live-inv|text-beta-inv)(?![\w-])/;

const sceneWash = ["scene-wash", "veil-strong", "veil-clear"].map((name) => new RegExp(`--${name}:\\s*([^;]+);`).exec(global)?.[1] || "").join(" ");
const darkScrim = !/--veil-strong:/.test(global) || [...sceneWash.matchAll(/rgb\((\d+) (\d+) (\d+)/g)].some(([, r, g, b]) => Math.min(+r, +g, +b) < 200);

const globalLiteralBudget = 104;
const globalImportantBudget = 4;

const checks = [
  ["Inter variable is the sole site font", files.font.includes("InterVariable.woff2") && files.font.includes('variable: "--font-body"')],
  ["Canonical brand geometry", files.logo.includes('r="15"') && files.logo.includes('r="9.5"') && files.logo.includes('r="4"')],
  ["Header lockup: canonical size, light-surface tone on the light header", files.header.includes('size={22} tone="light" pulse descriptorMin={10}') && !/tone="dark"/.test(files.header)],
  ["Footer lockup: canonical size, dark tone on the graphite footer", files.footer.includes('size={24} tone="dark" descriptorMin={11}')],
  ["Marketing stylesheet is registered", files.layout.includes('import "../marketing-system.css";')],
  ["Guard shutter cadence is unchanged", files.global.includes("--sg-dur-enter:440ms") && files.global.includes("--sg-dur-fast:180ms")],
  ["Light-first: the page canvas and text are the light palette", light.canvas === "#f7f9fb" && light.surface === "#ffffff" && light.ink === "#18242d" && /html\s*\{[^}]*background: var\(--color-canvas\);[^}]*color-scheme: light;/.test(global) && /body\s*\{[^}]*background: var\(--color-canvas\);[^}]*color: var\(--color-ink\);/.test(global)],
  ["Every role token is declared once in @theme, pointing at the light palette", roles.every((r) => count(theme, new RegExp(`--color-${r}: var\\(--light-${r}\\);`, "g")) === 1)],
  ["Every role token is re-pointed in the graphite scope", roles.every((r) => scopeBody.includes(`--color-${r}: var(--graphite-${r});`))],
  [`Graphite stays selective: only the approved scopes (${approvedGraphite.length}) and ≤ 4 tone-graphite uses in markup`, scopeSelectors.length === approvedGraphite.length && approvedGraphite.every((s) => scopeSelectors.includes(s)) && toneGraphiteUses <= 4],
  [`WCAG AA for every role pair, computed (${contrastFailures.length ? contrastFailures.join("; ") : "all pass"})`, contrastFailures.length === 0],
  ["Retired token names stay deleted (graphite-stage names, --s1-*, --site-*, --marketing-*, --so-quiet-surface)", ![global, marketing, homeSections].some((css) => retiredCssTokens.test(css) || /--(s1-(navy|slate|silver|glass|edge|ink|copy|accent|quiet)|site-|marketing-|so-quiet-surface)/.test(css))],
  ["Markup uses role utilities only (no retired dark-stage utilities, no #0EA5E9 accent text)", !retiredUtilities.test(markup)],
  ["Photography keeps its daylight: the scene veil is light and nothing tones photographs to luminosity", sceneWash.length > 0 && !darkScrim && ![global, marketing, homeSections].some((css) => /luminosity/.test(css))],
  ["No override layer: no `main:not(.s1-brand-home)` scoping", ![global, marketing, homeSections].some((css) => css.includes(":not(.s1-brand-home)"))],
  [`globals.css has at most ${globalImportantBudget} !important (safety nets only)`, count(global, /!important/g) <= globalImportantBudget],
  ["marketing-system.css has no !important", count(marketing, /!important/g) === 0],
  ["Homepage sections below the locked hero have no !important", homeSections.length > 0 && count(homeSections, /!important/g) === 0],
  ["marketing-system.css uses tokens only (no colour literals)", count(marketing, colourLiteral) === 0],
  ["Homepage sections use tokens only (no colour literals)", count(homeSections, colourLiteral) === 0],
  [`globals.css colour literals within budget (${globalLiteralBudget})`, count(global, colourLiteral) <= globalLiteralBudget],
  ["Founder-locked hero is one marked block at the top of home-conversion.css", homeBegin >= 0 && homeEnd > homeBegin && !homeSections.includes(".so-hero")],
  ["No uppercase labels outside the locked hero (the lockup is the only all-caps text)", ![global, marketing, homeSections].some((css) => /text-transform:\s*uppercase/.test(css))],
  ["Buttons have no hover lift or glow outside the locked hero", ![global, marketing, homeSections].some((css) => /:hover[^{]*\{[^}]*translateY\(-/.test(css))],
  ["One focus recipe: 3px ring in the scope's focus colour", global.includes("outline: 3px solid var(--color-focus)") && !/outline: 3px solid var\(--color-signal-4/.test(global)],
  ["Header navigation remains legible", global.includes("font-size: clamp(0.875rem, 1vw, 1rem)") && global.includes("header.glass-nav .btn-primary {\n    min-height: 48px")],
  ["Status labels use the one badge component", files.ui.includes('"badge badge-" + kind')],
  ["The footer band never out-ranks the page (2rem heading)", /\.s1-premium-footer-intro h2 \{[^}]*font-size: 2rem/.test(marketing)],
  ["Design constitution records the light-first decision", files.docs.includes("# Signal One website design constitution") && files.docs.includes("Approved 2026-11-26 light-first direction")],
  [`Depth: WCAG AA at the worst case of every material, plinth, slab, veil and glass tier, computed (${depthPairs.length} pairs${depthFailures.length ? "; " + depthFailures.join("; ") : ""})`, depthFailures.length === 0 && depthPairs.length > 0],
  [`Depth: every scene photograph is measured, unchanged and used once (${sceneFailures.concat(repeatedScenes.map((u) => u + " repeated")).join("; ") || new Set(sceneUrls).size + " scenes"})`, sceneFailures.length === 0 && repeatedScenes.length === 0 && sceneUrls.length > 0],
  ["Depth: every shadow tier falls away from the one light source (x ≤ 0)", !shadowAgainstLight],
  [`Depth: backdrop blur only on the named glass (${blurDeclarations} ≤ 6)`, blurDeclarations <= 6],
  [`Depth: midnight stays selective (${midnightUses} ≤ 4 slabs in markup)`, midnightUses <= 4],
  ["Depth: materials come from the system (no ad-hoc gradient or photo backgrounds in markup)", !adHocBackgrounds],
  ["Depth system is documented and recorded in the constitution", files.depthDoc.includes("# Depth system") && files.docs.includes("Approved 2026-11-27 depth direction")],
];
const errors = checks.filter(([, pass]) => !pass).map(([description]) => description);
for (const [description, pass] of checks) {
  process.stdout.write(`${pass ? "PASS" : "FAIL"} ${description}\n`);
}
if (errors.length) {
  process.stderr.write(`Design-system contract failed (${errors.length}/${checks.length}): ${errors.join("; ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Design-system static contract passed (${checks.length}/${checks.length}).\n`);
}
