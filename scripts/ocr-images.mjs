/**
 * Image OCR gate (addendum A1). Reads the text inside every raster under
 * public/images/** with tesseract and fails on anything a public product
 * image must never show. Run by `node scripts/check-branding.mjs --ocr`
 * (npm run check:images) and by the QA suite. Needs the `tesseract` CLI
 * (apt install tesseract-ocr); it fails loudly when tesseract is missing
 * rather than passing silently.
 *
 * Also usable on any folder before committing new captures:
 *   node scripts/ocr-images.mjs path/to/captures
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

export const rejectRules = [
  [/l\W?e\W?o\W?s/i, "internal platform codename"],
  [/\bsmoke\b/i, '"Smoke" test-data label'],
  [/\btest(ing)?\b/i, '"Test" label'],
  [/\bQA\b/, '"QA" label'],
  [/\.local\b/i, ".local address"],
  [/\b[A-Z]{3,}_[A-Z_]{3,}\b/, "raw enum code"],
  [/(\+27|\b0)[\s-]?[1-8]\d[\s-]?\d{3}[\s-]?\d{4}\b/, "phone number"],
  [/\b(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}\b/, "US-format date"],
];

const rasters = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (rasters.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

function hasTesseract() {
  try {
    execFileSync("tesseract", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Returns a list of "file: reason (text)" problems. */
export async function ocrImages(root = "public/images") {
  if (!hasTesseract()) {
    return [`tesseract is not installed, so ${root} cannot be checked. Install tesseract-ocr.`];
  }
  const tmp = mkdtempSync(path.join(os.tmpdir(), "ocr-"));
  const problems = [];
  try {
    for await (const file of walk(root)) {
      // Upscale 3x on white (transparent cut-outs) so small UI text is read.
      const meta = await sharp(file).metadata();
      const png = path.join(tmp, "page.png");
      await sharp(file)
        .flatten({ background: "#ffffff" })
        .resize({ width: Math.round((meta.width || 1000) * Math.min(3, 2400 / (meta.width || 1000))) })
        .png()
        .toFile(png);
      const text = execFileSync("tesseract", [png, "-", "--psm", "11"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      for (const [pattern, reason] of rejectRules) {
        const hit = text.match(pattern);
        if (hit) problems.push(`${file}: ${reason} ("${hit[0]}")`);
      }
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = await ocrImages(process.argv[2] || "public/images");
  if (problems.length) {
    console.error("Image OCR gate failed:\n" + problems.map((p) => "  - " + p).join("\n"));
    process.exit(1);
  }
  console.log("Image OCR gate passed.");
}
