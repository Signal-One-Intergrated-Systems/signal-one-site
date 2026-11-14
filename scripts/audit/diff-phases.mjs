#!/usr/bin/env node
// Audit helper (Phase 2): pixel diff of the Phase 1 and Phase 2 captures for every route x viewport.
// Usage: node scripts/audit/diff-phases.mjs <phase1-screenshots-dir> <phase2-screenshots-dir> <out.json>
// Compares <viewport>/<slug>--fold.png (same viewport, so same size) pixel by pixel, and the scroll-stitched
// <slug>--scrolled.jpg strips (height before/after, and pixel diff when the heights match).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [before, after, outFile] = process.argv.slice(2);
const THRESHOLD = 24; // per-channel difference that counts as a changed pixel (JPEG/AA noise is below this)

async function raw(file) {
  const { data, info } = await sharp(file, { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
function diff(a, b) {
  const h = Math.min(a.h, b.h), w = Math.min(a.w, b.w);
  let changed = 0, minY = -1, maxY = -1;
  const bands = new Array(Math.ceil(h / 100)).fill(0);
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * a.w + x) * 3, j = (y * b.w + x) * 3;
      if (Math.abs(a.data[i] - b.data[j]) > THRESHOLD || Math.abs(a.data[i + 1] - b.data[j + 1]) > THRESHOLD || Math.abs(a.data[i + 2] - b.data[j + 2]) > THRESHOLD) row++;
    }
    if (row) { changed += row; if (minY < 0) minY = y; maxY = y; bands[Math.floor(y / 100)] += row; }
  }
  return { pct: +((100 * changed) / (w * h)).toFixed(3), changedPixels: changed, rows: minY < 0 ? null : [minY, maxY], bandsOver1pct: bands.map((n, k) => ({ y: k * 100, pct: +((100 * n) / (w * 100)).toFixed(1) })).filter((s) => s.pct >= 1).map((s) => `${s.y}:${s.pct}%`) };
}

const rows = [];
for (const viewport of ["desktop", "tablet", "mobile"]) {
  const dir = path.join(before, viewport);
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith("--fold.png")).sort()) {
    const slug = f.replace("--fold.png", "");
    const row = { viewport, slug };
    const fa = path.join(after, viewport, f);
    if (!fs.existsSync(fa)) { rows.push({ ...row, error: "no phase 2 capture" }); continue; }
    const [a, b] = await Promise.all([raw(path.join(dir, f)), raw(fa)]);
    row.fold = { size: `${a.w}x${a.h}`, sameSize: a.w === b.w && a.h === b.h, ...diff(a, b) };
    const sa = path.join(dir, slug + "--scrolled.jpg"), sb = path.join(after, viewport, slug + "--scrolled.jpg");
    if (fs.existsSync(sa) && fs.existsSync(sb)) {
      const [p, q] = await Promise.all([raw(sa), raw(sb)]);
      row.full = { heightBefore: p.h, heightAfter: q.h, heightDelta: q.h - p.h, ...(p.h === q.h ? diff(p, q) : { pct: null, note: "heights differ; layout changed" }) };
    }
    row.changed = row.fold.pct >= 0.02 || (row.full ? row.full.heightDelta !== 0 || (row.full.pct ?? 0) >= 0.02 : false);
    rows.push(row);
    console.log(`${viewport.padEnd(8)} ${slug.padEnd(28)} fold ${String(row.fold.pct).padStart(7)}%  full ${row.full ? (row.full.heightDelta ? `height ${row.full.heightBefore} -> ${row.full.heightAfter}` : row.full.pct + "%") : "-"}  ${row.changed ? "CHANGED" : "same"}`);
  }
}
fs.writeFileSync(outFile, JSON.stringify({ threshold: THRESHOLD, compared: rows.length, changed: rows.filter((r) => r.changed).length, rows }, null, 1));
console.log(`compared ${rows.length}, changed ${rows.filter((r) => r.changed).length}`);
