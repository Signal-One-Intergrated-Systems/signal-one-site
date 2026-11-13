// Audit-only: pixel-compare the light-scheme and dark-scheme full-page captures of every route x viewport.
// Usage: node scripts/audit/diff-schemes.mjs <audit-out dir>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const OUT = process.argv[2] || "/home/claude/audit-out";
const rows = [];
for (const vp of ["desktop", "tablet", "mobile"]) {
  for (const f of fs.readdirSync(path.join(OUT, "screenshots", vp)).filter((f) => f.endsWith(".png") && !f.includes("--fold")).sort()) {
    const a = path.join(OUT, "screenshots", vp, f), b = path.join(OUT, "screenshots-dark", vp, f);
    if (!fs.existsSync(b)) { rows.push({ vp, file: f, error: "no dark capture" }); continue; }
    const [A, B] = await Promise.all([a, b].map((p) => sharp(p, { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true })));
    if (A.info.width !== B.info.width || A.info.height !== B.info.height) { rows.push({ vp, file: f, sizeLight: A.info.width + "x" + A.info.height, sizeDark: B.info.width + "x" + B.info.height, differs: "page size differs" }); continue; }
    let diff = 0, minY = Infinity, maxY = -1, minX = Infinity, maxX = -1;
    const w = A.info.width, ch = A.info.channels;
    for (let i = 0; i < A.data.length; i += ch) {
      if (Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]) > 24) {
        diff++; const px = i / ch; const y = Math.floor(px / w), x = px % w;
        if (y < minY) minY = y; if (y > maxY) maxY = y; if (x < minX) minX = x; if (x > maxX) maxX = x;
      }
    }
    const total = A.data.length / ch;
    rows.push({ vp, file: f, size: w + "x" + A.info.height, differingPixels: diff, percent: +(100 * diff / total).toFixed(4), box: diff ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : null });
  }
}
fs.writeFileSync(path.join(OUT, "data", "scheme-diff.json"), JSON.stringify(rows, null, 1));
for (const r of rows) console.log([r.vp, r.file, r.size || "", r.differs || (r.differingPixels + " px"), (r.percent ?? "") + "%", r.box ? JSON.stringify(r.box) : ""].join(" | "));
console.log("pairs:", rows.length, "identical (<=0.01%):", rows.filter((r) => r.percent !== undefined && r.percent <= 0.01).length, "differing:", rows.filter((r) => r.differs || r.percent > 0.01).length);
