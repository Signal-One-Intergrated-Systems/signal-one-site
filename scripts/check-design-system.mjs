import { readFileSync } from "node:fs";

/*
 * Design-system static contract (runs before every build: `npm run build` → prebuild).
 * It protects the rules in docs/DESIGN_SYSTEM.md that a later edit could silently undo:
 * one token layer, no override layers, the founder-locked hero kept in one marked block,
 * the brand geometry, and the shared component recipes.
 */
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
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
// globals.css: colour literals belong to the token blocks (@theme and :root custom properties) and the
// shutter/mark keyframe recipes. A budget, so a new literal is a deliberate, reviewed change.
const globalLiteralBudget = 70;
// The only `!important` allowed outside the locked hero: the reduced-motion safety net (3) and the
// reduced-motion shutter switch (1).
const globalImportantBudget = 4;

const checks = [
  ["Inter variable is the sole site font", files.font.includes("InterVariable.woff2") && files.font.includes('variable: "--font-body"')],
  ["Canonical brand geometry", files.logo.includes('r="15"') && files.logo.includes('r="9.5"') && files.logo.includes('r="4"')],
  ["Canonical header lockup", files.header.includes('size={22} tone="dark" pulse descriptorMin={10}')],
  ["Canonical footer lockup", files.footer.includes('size={24} tone="dark" descriptorMin={11}')],
  ["Marketing stylesheet is registered", files.layout.includes('import "../marketing-system.css";')],
  ["Guard shutter cadence is unchanged", files.global.includes("--sg-dur-enter:440ms") && files.global.includes("--sg-dur-fast:180ms")],
  ["Graphite stage tokens are defined once in @theme", ["--color-deep: #171d21", "--color-raised: #252b2e", "--color-raised-2: #2c3438", "--color-text-inv: #f1f5f9", "--color-danger-inv: #ffb4ab"].every((t) => files.global.includes(t))],
  ["Retired token layers stay deleted (--s1-*, --site-*, --marketing-*, --so-quiet-surface)", ![global, marketing, homeSections].some((css) => /--(s1-(navy|slate|silver|glass|edge|ink|copy|accent|quiet)|site-|marketing-|so-quiet-surface)/.test(css))],
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
  ["One focus recipe: 3px ring", global.includes("outline: 3px solid var(--color-signal-400)")],
  ["Header navigation remains legible", global.includes("font-size: clamp(0.875rem, 1vw, 1rem)") && global.includes("header.glass-nav .btn-primary {\n    min-height: 48px")],
  ["Status labels use the one badge component", files.ui.includes('"badge badge-" + kind')],
  ["The footer band never out-ranks the page (2rem heading)", /\.s1-premium-footer-intro h2 \{[^}]*font-size: 2rem/.test(marketing)],
  ["Design constitution is documented", files.docs.includes("# Signal One website design constitution") && files.docs.includes("Approved 2026-10-29 premium website direction")],
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
