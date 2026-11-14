/**
 * AUDIT step 7 (site level): sitemap, robots, redirects, internal link resolution (status + anchor targets),
 * OG image endpoints, titles, canonicals, response headers, API route behaviour on GET.
 * HTTP only, against the local build. External links are listed and never fetched.
 */
import { test } from "@playwright/test";
import { legacyRedirects } from "../e2e/routes";
import { BASE, pageRoutes, writeJson } from "./lib";

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const pick = (html: string, re: RegExp) => { const m = html.match(re); return m ? decode(m[1]) : null; };

test("site-level HTTP audit", async ({ request }) => {
  const get = async (path: string) => {
    const r = await request.get(BASE + path, { maxRedirects: 0, failOnStatusCode: false });
    return { status: r.status(), location: r.headers()["location"] || null, headers: r.headers(), text: async () => r.text(), bytes: (await r.body()).length };
  };

  // --- pages: status, headers, head tags from the server HTML (no JavaScript)
  const pages: Record<string, unknown>[] = [];
  const htmlByPath = new Map<string, string>();
  for (const route of pageRoutes) {
    const r = await get(route.path);
    const html = r.status === 200 || r.status === 404 ? await r.text() : "";
    htmlByPath.set(route.path, html);
    const title = pick(html, /<title>([^<]*)<\/title>/);
    pages.push({
      path: route.path, status: r.status, location: r.location, htmlBytes: r.bytes,
      title, titleSuffixRepeated: title ? /\|\s*Signal One\s*\|\s*Signal One\s*$/.test(title) : null,
      description: pick(html, /<meta name="description" content="([^"]*)"/), canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
      robotsMeta: pick(html, /<meta name="robots" content="([^"]*)"/), xRobotsTag: r.headers["x-robots-tag"] || null,
      ogImage: pick(html, /<meta property="og:image" content="([^"]*)"/), ogUrl: pick(html, /<meta property="og:url" content="([^"]*)"/), ogTitle: pick(html, /<meta property="og:title" content="([^"]*)"/),
      twitterImage: pick(html, /<meta name="twitter:image" content="([^"]*)"/), twitterTitle: pick(html, /<meta name="twitter:title" content="([^"]*)"/),
      lang: pick(html, /<html[^>]* lang="([^"]*)"/), h1Count: (html.match(/<h1[\s>]/g) || []).length,
      csp: r.headers["content-security-policy"] || null, hsts: r.headers["strict-transport-security"] || null, cacheControl: r.headers["cache-control"] || null,
      xFrameOptions: r.headers["x-frame-options"] || null, referrerPolicy: r.headers["referrer-policy"] || null,
      literalBackslashN: (html.replace(/<script[\s\S]*?<\/script>/g, "").match(/[^<>]{0,60}\\n[^<>]{0,60}/g) || []).slice(0, 5),
    });
  }

  // --- sitemap + robots
  const sitemapRes = await get("/sitemap.xml");
  const sitemapXml = await sitemapRes.text();
  const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  const sitemap: Record<string, unknown>[] = [];
  for (const url of sitemapUrls) {
    const path = new URL(url).pathname || "/";
    const r = await get(path);
    sitemap.push({ url, localPath: path, status: r.status, location: r.location });
  }
  const robotsRes = await get("/robots.txt");
  const robotsTxt = await robotsRes.text();

  // --- redirects
  const redirects: Record<string, unknown>[] = [];
  for (const [from, to] of legacyRedirects.concat([["/workforce", "/service"]])) {
    const r = await get(from);
    redirects.push({ from, expected: to, status: r.status, location: r.location, note: from === "/workforce" ? "page-level permanentRedirect(), not in next.config redirects" : "next.config.ts redirects()" });
  }
  // trailing slash / case / www-style variants of real routes
  const variants: Record<string, unknown>[] = [];
  for (const path of ["/pricing/", "/Pricing", "/PRICING", "/pricing.html", "/index.html", "/home", "/guards/", "/solutions/security/", "/join", "/solutions", "/guard", "/1guard", "/1service", "/equipment", "/about", "/careers", "/login", "/signup", "/trial", "/demo", "/blog", "/faq", "/support"]) {
    const r = await get(path);
    variants.push({ path, status: r.status, location: r.location });
  }

  // --- internal links: every href in every page's server HTML
  const linkSources = new Map<string, Set<string>>();
  const external = new Map<string, Set<string>>();
  const protocolLinks = new Map<string, Set<string>>();
  for (const [path, html] of htmlByPath) {
    for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const href = decode(m[1]);
      const bucket = href.startsWith("mailto:") || href.startsWith("tel:") ? protocolLinks : /^https?:\/\//.test(href) ? external : linkSources;
      const key = bucket === linkSources && href.startsWith("#") ? path + href : href;
      if (!bucket.has(key)) bucket.set(key, new Set());
      bucket.get(key)!.add(path);
    }
  }
  const internalLinks: Record<string, unknown>[] = [];
  for (const [href, sources] of linkSources) {
    const [pathAndQuery, hash] = href.split("#");
    const path = pathAndQuery || "/";
    let r = await get(path);
    const chain = [r.status];
    let finalPath = path;
    for (let hop = 0; hop < 5 && r.status >= 300 && r.status < 400 && r.location; hop++) { finalPath = new URL(r.location, BASE).pathname; r = await get(finalPath); chain.push(r.status); }
    let anchorExists: boolean | null = null;
    if (hash) { const html = r.status === 200 ? await r.text() : ""; anchorExists = new RegExp(`\\bid="${hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html); }
    internalLinks.push({ href, finalPath, statusChain: chain, ok: chain[chain.length - 1] === 200, redirected: chain.length > 1, hash: hash || null, anchorExists, linkedFrom: Array.from(sources).slice(0, 30), linkedFromCount: sources.size });
  }

  // --- OG images and icons
  const ogImages: Record<string, unknown>[] = [];
  for (const p of pages as Array<{ path: string; ogImage: string | null }>) {
    if (!p.ogImage) { ogImages.push({ page: p.path, ogImage: null }); continue; }
    const local = new URL(p.ogImage).pathname + new URL(p.ogImage).search;
    const r = await get(local);
    ogImages.push({ page: p.path, ogImage: p.ogImage, localPath: local, status: r.status, contentType: r.headers["content-type"], bytes: r.bytes });
  }
  const statics: Record<string, unknown>[] = [];
  for (const path of ["/favicon.ico", "/icon.png", "/apple-icon.png", "/og-image.jpg", "/manifest.webmanifest", "/manifest.json", "/data/world.geojson", "/qr/andisiwe", "/contact/andisiwe", "/qr/nobody", "/contact/nobody", "/api/intake/status", "/api/connect-status", "/api/intake", "/api/contact-intake", "/api/marketplace", "/.well-known/security.txt", "/humans.txt", "/sw.js"]) {
    const r = await get(path);
    statics.push({ path, status: r.status, contentType: r.headers["content-type"] || null, bytes: r.bytes, cacheControl: r.headers["cache-control"] || null, xRobotsTag: r.headers["x-robots-tag"] || null, body: /json|text\/plain/.test(r.headers["content-type"] || "") ? (await r.text()).slice(0, 300) : undefined });
  }

  writeJson("parts/site-level.json", {
    pages, sitemap: { status: sitemapRes.status, urls: sitemapUrls, entries: sitemap, xml: sitemapXml }, robots: { status: robotsRes.status, text: robotsTxt },
    redirects, variants, internalLinks,
    externalLinks: Array.from(external, ([href, s]) => ({ href, linkedFrom: Array.from(s), fetched: false })),
    protocolLinks: Array.from(protocolLinks, ([href, s]) => ({ href: href.slice(0, 200), linkedFrom: Array.from(s) })),
    ogImages, statics,
  });
});
