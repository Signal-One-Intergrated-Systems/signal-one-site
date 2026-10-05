import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "public"];
const textExtensions = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".css", ".md",
  ".txt", ".html", ".xml", ".svg", ".yml", ".yaml",
]);

const compact = ["l", "e", "o", "s"].join("");
const separated = new RegExp(["l", "e", "o", "s"].join("[.\\s_-]*"), "i");
const compactPattern = new RegExp(compact, "i");
const violations = [];

async function walk(target) {
  let info;
  try {
    info = await stat(target);
  } catch {
    return;
  }

  if (info.isDirectory()) {
    for (const entry of await readdir(target)) {
      await walk(path.join(target, entry));
    }
    return;
  }

  const relative = path.relative(process.cwd(), target);
  if (compactPattern.test(relative) || separated.test(relative)) {
    violations.push(`${relative}: forbidden legacy brand token in path`);
  }

  if (!textExtensions.has(path.extname(target).toLowerCase())) return;

  const content = await readFile(target, "utf8");
  if (compactPattern.test(content) || separated.test(content)) {
    violations.push(`${relative}: forbidden legacy brand token in public source/content`);
  }
}

for (const root of roots) await walk(path.join(process.cwd(), root));

if (violations.length) {
  console.error("Public branding check failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Public branding check passed.");
