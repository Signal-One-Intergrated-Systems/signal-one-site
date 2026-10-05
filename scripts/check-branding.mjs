import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "public"];
const forbidden = /l[.]?e[.]?o[.]?s/i;
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md", ".txt", ".css", ".html", ".svg", ".xml"]);
const failures = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const relative = full.replaceAll("\\", "/");
    if (forbidden.test(relative)) failures.push(`forbidden public path: ${relative}`);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const content = await readFile(full, "utf8");
    if (forbidden.test(content)) failures.push(`forbidden public content: ${relative}`);
  }
}

for (const root of roots) await walk(root);

if (failures.length) {
  console.error("Signal One public-branding check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Signal One public-branding check passed.");
