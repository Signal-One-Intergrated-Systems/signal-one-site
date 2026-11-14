// Audit-only inventory of routes, components, motion definitions and assets.
// Read-only against the repo; writes JSON to the path given as argv[2].
// Usage: node scripts/audit/inventory.mjs /abs/path/to/inventory.json
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let sharp = null;
try { sharp = require("sharp"); } catch { /* dimensions fall back to null */ }

const out = process.argv[2];
if (!out) { console.error("usage: inventory.mjs <out.json>"); process.exit(2); }
const root = process.cwd();

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", ".next-live", "test-results", "playwright-report", "connect-test-results"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}
const rel = (p) => path.relative(root, p).replaceAll("\\", "/");
const all = [];
for await (const f of walk(root)) all.push(rel(f));

// ---------- a. routes ----------
function urlFor(file) {
  let p = file.replace(/^app\//, "/");
  p = p.replace(/\/\([^)]+\)/g, "");
  p = p.replace(/\/(page|route|layout|not-found|error|global-error|opengraph-image|sitemap|robots|icon|apple-icon|favicon)\.(tsx|ts|png|ico)$/, "");
  return p === "" ? "/" : p;
}
const routeKinds = [
  [/\/page\.tsx$/, "page"], [/\/route\.ts$/, "route-handler"], [/\/layout\.tsx$/, "layout"],
  [/\/not-found\.tsx$/, "not-found"], [/\/error\.tsx$/, "error-boundary"], [/global-error\.tsx$/, "global-error"],
  [/\/opengraph-image\.tsx$/, "og-image"], [/app\/sitemap\.ts$/, "sitemap"], [/app\/robots\.ts$/, "robots"],
  [/app\/(icon|apple-icon)\.png$/, "icon"], [/app\/favicon\.ico$/, "favicon"],
];
const routes = [];
for (const f of all.filter((f) => f.startsWith("app/"))) {
  for (const [re, kind] of routeKinds) {
    if (!re.test(f)) continue;
    let url = urlFor(f);
    if (kind === "og-image") url += (url.endsWith("/") ? "" : "/") + "opengraph-image";
    if (kind === "sitemap") url = "/sitemap.xml";
    if (kind === "robots") url = "/robots.txt";
    if (kind === "icon") url = "/" + path.basename(f);
    if (kind === "favicon") url = "/favicon.ico";
    const src = /\.(tsx|ts)$/.test(f) ? await readFile(f, "utf8") : "";
    routes.push({
      url, kind, file: f,
      dynamic: /\[/.test(f),
      methods: kind === "route-handler" ? [...src.matchAll(/export\s+(?:async\s+)?(?:function|const)\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g)].map((m) => m[1]) : undefined,
      redirectsTo: (src.match(/permanentRedirect\(["']([^"']+)["']\)/) || [])[1],
      noindex: /robots:\s*\{\s*index:\s*false/.test(src) || undefined,
    });
  }
}
routes.sort((a, b) => a.url.localeCompare(b.url) || a.kind.localeCompare(b.kind));

// ---------- b. components ----------
const componentFiles = all.filter((f) => /^app\/(components|_connect\/components)\/.*\.(tsx|ts)$/.test(f));
const components = [];
for (const f of componentFiles) {
  const src = await readFile(f, "utf8");
  const count = (re) => (src.match(re) || []).length;
  const controls = {
    button: count(/<button\b/g), link: count(/<(?:a|Link|ButtonLink)\b/g), form: count(/<form\b/g),
    input: count(/<(?:input|select|textarea)\b/g), details: count(/<details\b/g),
    tab: count(/role=["']tab["']/g), radioOrCheckbox: count(/type=["'](?:radio|checkbox)["']/g),
    range: count(/type=["']range["']/g), scrollRail: count(/scrollBy\(/g),
  };
  components.push({
    file: f, lines: src.split("\n").length,
    client: /^\s*["']use client["']/.test(src),
    exports: [...src.matchAll(/export\s+(?:default\s+)?(?:async\s+)?function\s+(\w+)/g)].map((m) => m[1]),
    controls, interactive: Object.values(controls).some((n) => n > 0),
    usesNextImage: /from ["']next\/image["']/.test(src), rawImg: count(/<img\b/g),
    observers: { intersection: count(/IntersectionObserver/g), resize: count(/ResizeObserver/g), raf: count(/requestAnimationFrame/g), canvas: count(/<canvas\b/g) },
    reducedMotionChecks: count(/prefers-reduced-motion/g),
    importedBy: [],
  });
}
const codeFiles = all.filter((f) => /^app\/.*\.(tsx|ts)$/.test(f));
const codeSrc = Object.fromEntries(await Promise.all(codeFiles.map(async (f) => [f, await readFile(f, "utf8")])));
for (const c of components) {
  const base = path.basename(c.file).replace(/\.(tsx|ts)$/, "");
  for (const [f, src] of Object.entries(codeSrc)) {
    if (f === c.file) continue;
    if (new RegExp("from\\s+[\"'][^\"']*/" + base + "[\"']|import\\([\"'][^\"']*/" + base + "[\"']\\)").test(src)) c.importedBy.push(f);
  }
}

// ---------- c. motion ----------
const cssFiles = all.filter((f) => /^app\/.*\.css$/.test(f));
const motion = { keyframes: [], animationUses: [], transitions: [], reducedMotionBlocks: [], scrollTimeline: [], js: [] };
for (const f of cssFiles) {
  const lines = (await readFile(f, "utf8")).split("\n");
  lines.forEach((line, i) => {
    const at = `${f}:${i + 1}`;
    for (const m of line.matchAll(/@keyframes\s+([\w-]+)/g)) motion.keyframes.push({ name: m[1], at });
    for (const m of line.matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/g)) motion.animationUses.push({ value: m[1].trim().slice(0, 140), at, selectorHint: line.split("{")[0].trim().slice(0, 140) });
    if (/animation-timeline|view\(\)|scroll\(\)/.test(line)) motion.scrollTimeline.push({ at, text: line.trim().slice(0, 200) });
    if (/prefers-reduced-motion/.test(line)) motion.reducedMotionBlocks.push({ at, text: line.trim().slice(0, 200) });
    if (/\btransition\s*:/.test(line)) motion.transitions.push({ at, text: line.trim().slice(0, 160) });
  });
}
for (const [f, src] of Object.entries(codeSrc)) {
  src.split("\n").forEach((line, i) => {
    if (/IntersectionObserver|requestAnimationFrame|scrollIntoView|scrollBy\(|scrollTo\(|matchMedia\(|<canvas|<video|animate\(/.test(line)) motion.js.push({ at: `${f}:${i + 1}`, text: line.trim().slice(0, 180) });
  });
}

// ---------- d. assets ----------
const assetFiles = all.filter((f) => /^(public|assets)\//.test(f) || /^app\/(_fonts|lib\/fonts)\//.test(f) || /^app\/(icon|apple-icon)\.png$/.test(f) || f === "app/favicon.ico");
const textFiles = all.filter((f) => /\.(tsx|ts|mjs|js|css|md|json|yml|txt|html)$/.test(f) && !f.endsWith("package-lock.json") && !f.startsWith("scripts/audit/") && !f.startsWith("tests/audit/"));
const textSrc = Object.fromEntries(await Promise.all(textFiles.map(async (f) => [f, await readFile(f, "utf8")])));
const assets = [];
for (const f of assetFiles) {
  const s = await stat(f);
  const ext = path.extname(f).slice(1).toLowerCase();
  let width = null, height = null, embeddedRaster = null;
  if (sharp && ["png", "jpg", "jpeg", "webp", "svg", "avif", "gif"].includes(ext)) {
    try { const meta = await sharp(f).metadata(); width = meta.width ?? null; height = meta.height ?? null; } catch { /* leave null */ }
  }
  if (ext === "svg") {
    const svg = await readFile(f, "utf8");
    const embedded = [...svg.matchAll(/data:image\/(jpeg|png|webp);base64,/g)].map((m) => m[1]);
    embeddedRaster = embedded.length ? embedded : null;
  }
  const publicPath = f.startsWith("public/") ? f.slice("public".length) : null;
  const base = path.basename(f);
  const refs = { app: [], tests: [], docs: [], other: [] };
  for (const [tf, src] of Object.entries(textSrc)) {
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      const hit = (publicPath && line.includes(publicPath)) || line.includes("/" + base) || (f.startsWith("app/") && line.includes(base));
      if (!hit) return;
      const bucket = tf.startsWith("app/") ? "app" : tf.startsWith("tests/") ? "tests" : (tf.startsWith("docs/") || tf.endsWith(".md")) ? "docs" : "other";
      refs[bucket].push(`${tf}:${i + 1}`);
    });
  }
  assets.push({
    file: f, publicPath, bytes: s.size, format: ext, width, height,
    aspect: width && height ? +(width / height).toFixed(4) : null,
    embeddedRaster, over400KB: s.size > 400 * 1024,
    refs, referencedByApp: refs.app.length > 0,
    status: refs.app.length > 0 ? "REFERENCED" : (f.startsWith("assets/") ? "SOURCE-ORIGINAL (not served)" : (f.startsWith("app/") ? "FRAMEWORK-CONVENTION" : "UNREFERENCED")),
  });
}
// referenced-but-missing: any /images, /brand, /data, /connect-assets path in app code that has no file
const missing = [];
for (const [f, src] of Object.entries(codeSrc).concat(await Promise.all(cssFiles.map(async (f) => [f, await readFile(f, "utf8")])))) {
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/["'(`](\/(?:images|brand|data|connect-assets)\/[^"'`)\s?#]+)/g)) {
      if (!all.includes("public" + m[1])) missing.push({ path: m[1], at: `${f}:${i + 1}` });
    }
    for (const m of line.matchAll(/from\s+["'](\.\.\/)+public\/([^"']+)["']/g)) {
      if (!all.includes("public/" + m[2])) missing.push({ path: "/" + m[2], at: `${f}:${i + 1}` });
    }
  });
}
// image usage sites
const imageUsage = [];
for (const [f, src] of Object.entries(codeSrc)) {
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    if (/<Image\b/.test(line) || /<img\b/.test(line)) {
      const block = lines.slice(i, i + 6).join(" ");
      const tag = block.slice(block.search(/<(?:Image|img)\b/));
      const end = tag.indexOf("/>");
      const t = end > 0 ? tag.slice(0, end + 2) : tag.slice(0, 500);
      imageUsage.push({
        at: `${f}:${i + 1}`, element: /<Image\b/.test(line) ? "next/image" : "img",
        src: (t.match(/src=(\{[^}]+\}|"[^"]+")/) || [])[1] ?? null,
        fill: /\bfill\b/.test(t), hasWidthHeight: /\bwidth=/.test(t) && /\bheight=/.test(t),
        hasAlt: /\balt=/.test(t), emptyAlt: /\balt=""/.test(t), priority: /\bpriority\b/.test(t),
        loading: (t.match(/loading="(\w+)"/) || [])[1] ?? null, sizes: (t.match(/sizes=(\{[^}]+\}|"[^"]+")/) || [])[1] ?? null,
        objectFit: (t.match(/object-(cover|contain|fill)/) || [])[1] ?? null,
      });
    }
  });
}
const cssImageUrls = [];
for (const f of cssFiles) {
  (await readFile(f, "utf8")).split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) cssImageUrls.push({ url: m[1].slice(0, 160), at: `${f}:${i + 1}`, selectorHint: line.split("{")[0].trim().slice(0, 120) });
  });
}
// external hosts in code and env examples
const externalHosts = [];
for (const [tf, src] of Object.entries(textSrc)) {
  if (tf.startsWith("docs/") || tf.startsWith("tests/")) continue;
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/https?:\/\/[^\s"'`)<>\\]+/g)) externalHosts.push({ url: m[0].slice(0, 200), at: `${tf}:${i + 1}` });
  });
}
let envExample = "";
try { envExample = await readFile(".env.example", "utf8"); } catch { /* none */ }

const { writeFile } = await import("node:fs/promises");
await writeFile(out, JSON.stringify({ generatedAt: new Date().toISOString(), sharpAvailable: Boolean(sharp), routes, components, motion, assets, missing, imageUsage, cssImageUrls, externalHosts, envExample }, null, 2));
console.log(`routes=${routes.length} components=${components.length} assets=${assets.length} keyframes=${motion.keyframes.length} missing=${missing.length} imageUsage=${imageUsage.length} cssUrls=${cssImageUrls.length}`);
