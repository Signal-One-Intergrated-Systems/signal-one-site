// Audit-only content and design-rule spot checks (step 8). Report only; changes nothing.
// Reads the built HTML in .next/server/app, optional live-local pages (http://localhost:PORT/...), and source.
// Usage: node scripts/audit/content-rules.mjs <out.json> [http://localhost:3200]
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const out = process.argv[2];
const localBase = process.argv[3] || "";
if (!out) { console.error("usage: content-rules.mjs <out.json> [local base url]"); process.exit(2); }

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full); else yield full;
  }
}
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#x2F;/g, "/").replace(/&middot;/g, "·");
function visibleText(html) {
  let h = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<template[\s\S]*?<\/template>/gi, " ").replace(/<!--[\s\S]*?-->/g, "");
  const head = h.match(/<head[\s\S]*?<\/head>/i)?.[0] || "";
  h = h.replace(/<head[\s\S]*?<\/head>/i, " ");
  // inline tags join their text; every other tag is a break
  h = h.replace(/<\/?(span|strong|em|b|i|small|a|abbr|code|sup|sub|mark|u)\b[^>]*>/gi, "");
  h = h.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "\n");
  const lines = decode(h).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const attrs = [];
  for (const m of html.matchAll(/\b(alt|aria-label|title|placeholder)="([^"]*)"/g)) if (m[2].trim()) attrs.push(`[${m[1]}] ${decode(m[2])}`);
  const meta = [];
  const title = head.match(/<title>([^<]*)<\/title>/)?.[1];
  if (title) meta.push("[title] " + decode(title));
  for (const m of head.matchAll(/<meta (?:name|property)="([^"]+)" content="([^"]*)"/g)) if (/description|title|og:|twitter:|keywords|application-name/.test(m[1])) meta.push(`[meta ${m[1]}] ${decode(m[2])}`);
  const jsonLd = Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)).map((m) => "[json-ld] " + m[1]);
  return { lines, attrs, meta, jsonLd };
}

// ---- gather pages
const pages = {};
const builtRoot = ".next/server/app";
for await (const file of walk(builtRoot)) {
  if (!file.endsWith(".html")) continue;
  let route = "/" + path.relative(builtRoot, file).replace(/\.html$/, "").replace(/\\/g, "/");
  if (route === "/index") route = "/";
  pages[route] = { source: file, html: await readFile(file, "utf8") };
}
if (localBase) {
  for (const route of ["/join/sales", "/connect/andisiwe", "/present/andisiwe", "/audit-no-such-page"]) {
    try { const r = await fetch(localBase + route); pages[route] = { source: localBase + route + " (HTTP " + r.status + ", dynamic route, not prerendered)", html: await r.text() }; } catch (e) { pages[route] = { source: localBase + route, html: "", error: String(e) }; }
  }
}

const rules = [
  ["codename-LEOS", /\bL\.?E\.?O\.?S\b/i],
  ["sales-os", /sales[\s-]?os\b/i],
  ["shared-phone", /shared[\s-]+(phone|device)s?/i],
  ["central-device", /central[\s-]+device/i],
  ["psira", /psira/i],
  ["verified-claim", /\bverif(y|ied|ication|ies|ying)\b/i],
  ["community", /community/i],
  ["coming-soon", /coming soon/i],
  ["signal-one-guard", /signal one guard/i],
  ["1guard", /1\s?guard/i],
  ["signal-one-security", /signal one security/i],
  ["pilot", /\bpilot/i],
  ["literal-backslash-n", /\\n/],
  ["free-trial", /free trial|14[\s-]day/i],
];
const priceRe = /R\s?\d[\d\s]*(?:[.,]\d{1,2})?(?!\d)/g;

const report = { generatedAt: new Date().toISOString(), pages: {}, totals: {}, prices: [], naming: {}, sourceFindings: {} };
for (const [route, page] of Object.entries(pages).sort()) {
  const t = visibleText(page.html);
  const all = [...t.lines, ...t.attrs, ...t.meta, ...t.jsonLd];
  const hits = {};
  for (const [name, re] of rules) {
    const found = all.filter((l) => re.test(l)).map((l) => l.slice(0, 260));
    if (found.length) hits[name] = [...new Set(found)];
  }
  const prices = [];
  for (const l of [...t.lines, ...t.attrs, ...t.meta]) for (const m of l.matchAll(priceRe)) { const v = m[0].replace(/\s+/g, " ").trim(); if (/^R\s?\d/.test(v) && v.length > 1) prices.push({ value: v, context: l.slice(Math.max(0, m.index - 70), m.index + 90) }); }
  const count = (re) => all.reduce((n, l) => n + (l.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) || []).length, 0);
  report.pages[route] = {
    source: page.source, title: t.meta.find((m) => m.startsWith("[title]")) || null, hits, prices,
    counts: {
      "Signal One Guard": count(/Signal One Guard/), "1GUARD": count(/1GUARD/), "1Guard (mixed case)": count(/1Guard/), "Signal One Security": count(/Signal One Security/),
      "Central Device": count(/Central Device/), "Central device": count(/Central device/), "central device": count(/central device/),
      "Pilot": count(/\bPilot\b/), "pilot": count(/\bpilot/), "1Community": count(/1Community/), "Coming soon": count(/coming soon/i), "1Service": count(/1Service/), "In development": count(/in development/i),
    },
  };
  for (const p of prices) report.prices.push({ route, ...p });
}
// roll-ups
for (const key of Object.keys(Object.values(report.pages)[0].counts)) {
  report.naming[key] = { total: 0, byRoute: {} };
  for (const [route, p] of Object.entries(report.pages)) if (p.counts[key]) { report.naming[key].total += p.counts[key]; report.naming[key].byRoute[route] = p.counts[key]; }
}
const distinct = {};
for (const p of report.prices) { const k = p.value.replace(/\s/g, ""); (distinct[k] ||= { count: 0, routes: new Set(), sample: p.context }); distinct[k].count += 1; distinct[k].routes.add(p.route); }
report.distinctPrices = Object.fromEntries(Object.entries(distinct).map(([k, v]) => [k, { count: v.count, routes: [...v.routes], sample: v.sample }]));

// ---- source checks (file:line)
const src = [];
for (const root of ["app", "public"]) for await (const f of walk(root)) if (/\.(tsx|ts|css|svg|json|md|txt)$/.test(f)) src.push(f);
const grepSource = async (re, { skip = () => false } = {}) => {
  const hits = [];
  for (const f of src) {
    if (skip(f)) continue;
    const raw = await readFile(f, "utf8");
    const text = f.endsWith(".svg") ? raw.replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+/g, "[b64]") : raw;
    text.split("\n").forEach((line, i) => { if (re.test(line)) hits.push(`${f}:${i + 1}: ${line.trim().slice(0, 220)}`); });
  }
  return hits;
};
report.sourceFindings = {
  "literal \\n inside JSX text or string shown to users": await grepSource(/>[^<{]*\\n[^<{]*<|["'`][^"'`]*\\n[^"'`]*["'`]\s*\}?\s*<\/|\{"\\n"\}/, { skip: (f) => f.includes("vendor/") || f.endsWith(".css") }),
  "any \\n escape in a .tsx file (review list)": await grepSource(/\\n/, { skip: (f) => !f.endsWith(".tsx") }),
  "Sales OS in source": await grepSource(/sales[\s_-]?os/i),
  "codename in source": await grepSource(/\bleos\b/i),
  "Signal One Guard in source": await grepSource(/Signal One Guard/),
  "Signal One Security in source": await grepSource(/Signal One Security/),
  "Central Device / Central device in source": await grepSource(/central device/i),
  "Shared phone in source": await grepSource(/shared[\s-]+(phone|device)/i),
  "PSiRA in source": await grepSource(/psira/i, { skip: (f) => f.endsWith(".css") }),
  "1Community in source": await grepSource(/community/i, { skip: (f) => f.endsWith(".css") }),
  "title strings containing '| Signal One' (template appends it again)": await grepSource(/title:\s*["'`][^"'`]*\|\s*Signal One/),
};

// ---- colour scan: green-family colours in the stylesheets that style the homepage
const toHsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); const l = (max + min) / 2; let h = 0, s = 0; if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return { h, s, l }; };
const greens = [];
for (const f of ["app/home-conversion.css", "app/globals.css", "app/marketing-system.css"]) {
  (await readFile(f, "utf8")).split("\n").forEach((line, i) => {
    const colours = [];
    for (const m of line.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) { let x = m[1]; if (x.length === 3) x = x.split("").map((c) => c + c).join(""); colours.push({ raw: m[0], r: parseInt(x.slice(0, 2), 16), g: parseInt(x.slice(2, 4), 16), b: parseInt(x.slice(4, 6), 16) }); }
    for (const m of line.matchAll(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)([^)]*)\)/g)) colours.push({ raw: m[0], r: +m[1], g: +m[2], b: +m[3] });
    for (const c of colours) {
      const { h, s, l } = toHsl(c.r, c.g, c.b);
      // green family: green channel dominant over BOTH red and blue, or hue 70-170
      const greenDominant = c.g > c.r + 6 && c.g > c.b + 6;
      if ((h >= 70 && h <= 170 && s >= 0.12) || (greenDominant && s >= 0.1)) greens.push({ at: `${f}:${i + 1}`, colour: c.raw, hue: Math.round(h), sat: +s.toFixed(2), light: +l.toFixed(2), selector: line.split("{")[0].trim().slice(0, 110) });
    }
  });
}
report.greenFamilyColours = greens;

await writeFile(out, JSON.stringify(report, null, 2));
console.log("pages scanned:", Object.keys(report.pages).length);
console.log("distinct prices:", JSON.stringify(report.distinctPrices, null, 1));
console.log("naming totals:", Object.fromEntries(Object.entries(report.naming).map(([k, v]) => [k, v.total])));
console.log("green-family colour literals:", greens.length);
for (const [k, v] of Object.entries(report.sourceFindings)) console.log(`source: ${k}: ${v.length}`);
