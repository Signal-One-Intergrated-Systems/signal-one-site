/**
 * Public-truth gate. Runs before every build (prebuild) and, with --built,
 * after it (postbuild) against the rendered output in .next/server. With
 * --ocr it reads the text inside every image under public/images (see
 * scripts/ocr-images.mjs); the QA suite runs that mode.
 *
 * Fails on:
 *  - the internal platform codename, anywhere in public source, file paths,
 *    alt text or rendered output
 *  - wording the product truth forbids ("Shared Phone", "Verified" badges,
 *    software tiers, invented metrics, overseas city names)
 */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const builtMode = process.argv.includes("--built");
const ocrMode = process.argv.includes("--ocr");
const sourceRoots = ["app", "public"];
const builtRoot = ".next/server/app";

const codename = /l[.\s]?e[.\s]?o[.\s]?s/i;
const truthRules = [
  [/shared[\s-]+phones?/i, '"Shared Phone" (say "Central Device")'],
  [/\bVerified\b/, '"Verified" badge or claim'],
  [/\b(Starter|Enterprise)\b/, "software tier name"],
  [/\bProfessional (plan|tier|package)\b/i, "software tier name"],
  [/Irongate|98\.6%|4\.8\s*\/\s*5|3:41|180\+\s*countries/i, "invented metric from the retired fake dashboard"],
  [/\b(Toronto|Vancouver|Montreal|Calgary|Ottawa|New York|Chicago|Los Angeles|San Francisco|Seattle|Boston|Dallas|Houston|Miami)\b/, "overseas city name"],
];

const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md", ".txt", ".css", ".html", ".svg", ".xml", ".rsc", ".body", ".meta"]);
const failures = [];

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else yield full;
  }
}

function check(label, text, { codenameOnly = false } = {}) {
  if (codename.test(text)) failures.push(`${label}: internal platform codename`);
  if (codenameOnly) return;
  for (const [pattern, reason] of truthRules) {
    const match = text.match(pattern);
    if (match) failures.push(`${label}: ${reason} -> "${match[0]}"`);
  }
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
}

// 1. Source and public assets.
for (const root of sourceRoots) {
  for await (const file of files(root)) {
    const rel = file.replaceAll("\\", "/");
    if (codename.test(path.basename(rel)) || codename.test(rel)) failures.push(`path: ${rel}`);
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const content = await readFile(file, "utf8");
    // This script's own rule table is not public copy.
    check(rel, content, { codenameOnly: rel.endsWith(".css") });

    // 2. Alt text, explicitly.
    for (const match of content.matchAll(/\balt\s*[:=]\s*\{?\s*["'`]([^"'`]*)["'`]/g)) {
      check(`${rel} alt text`, match[1]);
    }
  }
}

// 3. Rendered output.
if (builtMode) {
  if (!existsSync(builtRoot)) {
    failures.push(`${builtRoot} not found; run after next build`);
  } else {
    let scanned = 0;
    for await (const file of files(builtRoot)) {
      const ext = path.extname(file).toLowerCase();
      if (![".html", ".rsc", ".body", ".meta"].includes(ext)) continue;
      const raw = await readFile(file, "utf8");
      const text = ext === ".html" ? visibleText(raw) : raw;
      check(`built ${file}`, text);
      for (const match of raw.matchAll(/\balt="([^"]*)"/g)) check(`built ${file} alt text`, match[1]);
      scanned += 1;
    }
    if (scanned === 0) failures.push(`no rendered files found under ${builtRoot}`);
    else console.log(`Scanned ${scanned} rendered files.`);
  }
}

// 4. Text inside images (addendum A1).
if (ocrMode) {
  const { ocrImages } = await import("./ocr-images.mjs");
  const problems = await ocrImages("public/images");
  for (const problem of problems) failures.push(`image text: ${problem}`);
  if (!problems.length) console.log("Image OCR gate passed (public/images).");
}

if (failures.length) {
  console.error("Signal One public-truth check failed:");
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Signal One public-truth check passed${builtMode ? " (source + rendered output)" : " (source)"}.`);
