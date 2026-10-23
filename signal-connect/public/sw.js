// Public profile only. No form, visitor data, API writes or third-party requests cached.
const CACHE = "signal-connect-foundation-v3-01";
const SHELL = ["/present/andisiwe", "/contact/andisiwe", "/icon.png", "/apple-icon.png"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(async cache => {
  await cache.addAll(SHELL);
  const html = await (await cache.match("/present/andisiwe")).text();
  const assets = [...new Set([...html.matchAll(/(?:src|href)="([^" ]+)"/g)].map(match => match[1]).filter(url => url.startsWith("/_next/static/")))];
  await cache.addAll(assets);
  for (const url of assets.filter(url => url.endsWith(".css"))) {
    const css = await (await cache.match(url)).text();
    const fonts = [...css.matchAll(/url\(([^)]+)\)/g)].map(match => new URL(match[1].replace(/["']/g, ""), self.location.origin + url)).filter(url => url.origin === self.location.origin && url.pathname.startsWith("/_next/static/"));
    await cache.addAll(fonts.map(url => url.href));
  }
})); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("signal-connect-") && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => { const url = new URL(event.request.url); if (event.request.method !== "GET" || url.origin !== self.location.origin || event.request.headers.has("RSC")) return; if (!SHELL.includes(url.pathname) && !url.pathname.startsWith("/_next/static/")) return; event.respondWith(fetch(event.request).then(response => { if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy))); } return response; }).catch(() => caches.match(event.request).then(response => response || Response.error()))); });
