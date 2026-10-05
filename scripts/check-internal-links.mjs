import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const appRoot = path.join(process.cwd(), "app");
const sources = [];
const pageRoutes = new Map();
const idsByRoute = new Map();
const links = [];

async function walk(target) {
  const info = await stat(target);
  if (info.isDirectory()) {
    for (const entry of await readdir(target)) await walk(path.join(target, entry));
    return;
  }
  if (!/\.(?:ts|tsx|js|jsx)$/.test(target)) return;
  sources.push(target);
}

function routeForPage(file) {
  const relative = path.relative(appRoot, file).replaceAll(path.sep, "/");
  if (!relative.endsWith("/page.tsx") && relative !== "page.tsx") return null;
  const dir = relative === "page.tsx" ? "" : relative.slice(0, -"/page.tsx".length);
  const clean = dir
    .split("/")
    .filter((part) => part && !/^\(.+\)$/.test(part))
    .join("/");
  if (clean.includes("[") || clean.includes("@")) return null;
  return clean ? "/" + clean : "/";
}

await walk(appRoot);

for (const file of sources) {
  const content = await readFile(file, "utf8");
  const route = routeForPage(file);
  if (route) {
    pageRoutes.set(route, file);
    const ids = new Set([...content.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
    idsByRoute.set(route, ids);
  }

  for (const match of content.matchAll(/\bhref\s*=\s*["'](\/[^"']*)["']/g)) {
    links.push({ file, href: match[1] });
  }
  for (const match of content.matchAll(/\bhref\s*=\s*\{\s*["'](\/[^"']*)["']\s*\}/g)) {
    links.push({ file, href: match[1] });
  }
}

const failures = [];
for (const { file, href } of links) {
  const [pathnameRaw, hashRaw] = href.split("#", 2);
  const pathname = pathnameRaw || "/";
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (!pageRoutes.has(cleanPath)) {
    failures.push(`${path.relative(process.cwd(), file)} -> ${href}: route does not exist`);
    continue;
  }
  if (hashRaw && !idsByRoute.get(cleanPath)?.has(hashRaw)) {
    failures.push(`${path.relative(process.cwd(), file)} -> ${href}: anchor does not exist`);
  }
}

if (failures.length) {
  console.error("Internal link check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Internal link check passed: ${links.length} static internal links checked across ${pageRoutes.size} routes.`);
