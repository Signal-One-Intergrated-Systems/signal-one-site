// Audit-only: builds contact sheets from the captured screenshots so many routes can be reviewed at once.
// Usage: node scripts/audit/contact-sheets.mjs <audit-out dir> <fold|full> <viewport> [screenshots|screenshots-dark]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const [OUT = "/home/claude/audit-out", kind = "fold", vp = "desktop", dir = "screenshots"] = process.argv.slice(2);
const src = path.join(OUT, dir, vp);
const files = fs.readdirSync(src).filter((f) => (kind === "fold" ? f.endsWith("--fold.png") : f.endsWith("--scrolled.jpg"))).sort();
const cfg = kind === "fold"
  ? { desktop: { cols: 2, rows: 3, w: 720, h: 450 }, tablet: { cols: 4, rows: 2, w: 410, h: 590 }, mobile: { cols: 6, rows: 2, w: 260, h: 563 } }[vp]
  : { desktop: { cols: 4, rows: 1, w: 400, h: 2600 }, tablet: { cols: 5, rows: 1, w: 320, h: 2600 }, mobile: { cols: 8, rows: 1, w: 195, h: 2600 } }[vp];
const per = cfg.cols * cfg.rows;
const label = (text, w) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="22"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-family="sans-serif" font-size="14" fill="#fff">${text}</text></svg>`);
for (let s = 0; s * per < files.length; s++) {
  const batch = files.slice(s * per, (s + 1) * per);
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const col = i % cfg.cols, row = Math.floor(i / cfg.cols);
    let img = sharp(path.join(src, batch[i]), { limitInputPixels: false });
    const meta = await img.metadata();
    if (kind === "full") {
      const scale = cfg.w / meta.width;
      const cropH = Math.min(meta.height, Math.round(cfg.h / scale));
      img = img.extract({ left: 0, top: 0, width: meta.width, height: cropH }).resize({ width: cfg.w });
    } else img = img.resize({ width: cfg.w, height: cfg.h, fit: "cover", position: "top" });
    composites.push({ input: await img.png().toBuffer(), left: col * (cfg.w + 8), top: row * (cfg.h + 30) + 22 });
    composites.push({ input: label(batch[i].replace(/--fold\.png|--scrolled\.jpg/, "") + (kind === "full" ? ` (${meta.height}px)` : ""), cfg.w), left: col * (cfg.w + 8), top: row * (cfg.h + 30) });
  }
  const out = path.join(OUT, "screenshots", "contact-sheets", `${dir === "screenshots" ? "light" : "dark"}-${vp}-${kind}-${s + 1}.jpg`);
  await sharp({ create: { width: cfg.cols * (cfg.w + 8), height: cfg.rows * (cfg.h + 30), channels: 3, background: "#333" } }).composite(composites).jpeg({ quality: 80 }).toFile(out);
  console.log(out, batch.map((b) => b.replace(/--fold\.png|--scrolled\.jpg/, "")).join(", "));
}
