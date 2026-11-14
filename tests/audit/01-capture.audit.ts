/**
 * AUDIT step 7 (capture): every page route x {desktop, tablet, mobile} x {light, dark colour scheme}.
 * Screenshots (above the fold + full page after one complete scroll), console/page errors, failed requests,
 * responses >= 400, horizontal overflow, images, links, buttons, axe, SEO, contrast and transfer sizes.
 * Light scheme additionally re-loads each page with prefers-reduced-motion: reduce.
 * Report-only: a test here fails only when the harness itself cannot run; defects are written to JSON.
 */
import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { collectDom, contextOptions, installVitals, pageRoutes, scrollThrough, shotPath, stitchedCapture, viewports, writeJson, type ViewportName } from "./lib";

test.describe.configure({ mode: "parallel" });

const schemes = (process.env.AUDIT_SCHEMES || "light,dark").split(",") as Array<"light" | "dark">;
const onlyViewports = (process.env.AUDIT_VIEWPORTS || "desktop,tablet,mobile").split(",") as ViewportName[];
const onlySlug = process.env.AUDIT_SLUG;

type Net = { url: string; type: string; status: number; mime: string; bytes: number; fromCache: boolean };

for (const scheme of schemes) {
  for (const viewport of onlyViewports) {
    for (const route of pageRoutes) {
      if (onlySlug && route.slug !== onlySlug) continue;
      test(`capture ${scheme} ${viewport} ${route.path}`, async ({ browser }) => {
        const context = await browser.newContext(contextOptions(viewport, { colorScheme: scheme }));
        const page = await context.newPage();
        await installVitals(page);

        const consoleMessages: Array<{ type: string; text: string; location: string }> = [];
        const pageErrors: string[] = [];
        const failedRequests: Array<{ url: string; failure: string; resourceType: string }> = [];
        const badResponses: Array<{ url: string; status: number; resourceType: string }> = [];
        page.on("console", (m) => {
          if (m.type() === "error" || m.type() === "warning") consoleMessages.push({ type: m.type(), text: m.text().slice(0, 600), location: m.location().url + ":" + m.location().lineNumber });
        });
        page.on("pageerror", (e) => pageErrors.push(String(e.message || e).slice(0, 800)));
        page.on("requestfailed", (r) => failedRequests.push({ url: r.url().slice(0, 300), failure: r.failure()?.errorText || "", resourceType: r.resourceType() }));
        page.on("response", (r) => { if (r.status() >= 400) badResponses.push({ url: r.url().slice(0, 300), status: r.status(), resourceType: r.request().resourceType() }); });

        const cdp = await context.newCDPSession(page);
        await cdp.send("Network.enable");
        const net = new Map<string, Net>();
        cdp.on("Network.responseReceived", (e) => { net.set(e.requestId, { url: e.response.url, type: e.type, status: e.response.status, mime: e.response.mimeType, bytes: 0, fromCache: Boolean(e.response.fromDiskCache) }); });
        cdp.on("Network.loadingFinished", (e) => { const n = net.get(e.requestId); if (n) n.bytes = e.encodedDataLength; });

        const started = Date.now();
        const response = await page.goto(route.path, { waitUntil: "networkidle", timeout: 60_000 });
        await page.evaluate(() => document.fonts.ready.then(() => true));
        await page.waitForTimeout(900);
        const chain: string[] = [];
        for (let r = response?.request().redirectedFrom(); r; r = r.redirectedFrom()) chain.unshift(r.url().replace(/^https?:\/\/[^/]+/, "") + " -> " + ((await r.response())?.status() ?? "?"));

        const foldFile = shotPath(scheme === "dark" ? "screenshots-dark" : "screenshots", viewport, route.slug + "--fold");
        await page.screenshot({ path: foldFile });
        const vitalsAtLoad = await page.evaluate(() => (window as unknown as { __audit: Record<string, number | string> }).__audit);
        const navTiming = await page.evaluate(() => { const n = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined; return n ? { ttfb: Math.round(n.responseStart), domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), transferSize: n.transferSize, decodedBodySize: n.decodedBodySize } : null; });
        const loadMs = Date.now() - started;

        await scrollThrough(page);
        await page.waitForLoadState("networkidle").catch(() => undefined);
        await page.waitForTimeout(2200); // homepage panel entrances run up to ~1.65s
        const fullFile = shotPath(scheme === "dark" ? "screenshots-dark" : "screenshots", viewport, route.slug);
        await page.screenshot({ path: fullFile, fullPage: true });

        const dom = await page.evaluate(collectDom);
        // what a visitor sees while scrolling (scroll-driven animations resolved at each position)
        const scrolledFile = fullFile.replace(/\.png$/, "--scrolled.jpg");
        let stitched: unknown = null;
        try { stitched = await stitchedCapture(page, scrolledFile); } catch (error) { stitched = { error: String(error).slice(0, 300) }; }
        const vitalsAfterScroll = await page.evaluate(() => (window as unknown as { __audit: Record<string, number | string> }).__audit);

        let axe: unknown = null;
        try {
          const results = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).analyze();
          axe = {
            violationCount: results.violations.length,
            byImpact: results.violations.reduce<Record<string, number>>((acc, v) => { const k = v.impact || "unknown"; acc[k] = (acc[k] || 0) + 1; return acc; }, {}),
            nodesByImpact: results.violations.reduce<Record<string, number>>((acc, v) => { const k = v.impact || "unknown"; acc[k] = (acc[k] || 0) + v.nodes.length; return acc; }, {}),
            violations: results.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes.slice(0, 6).map((n) => ({ target: n.target.join(" "), html: n.html.slice(0, 200), summary: (n.failureSummary || "").slice(0, 400) })) })),
            incomplete: results.incomplete.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
            passes: results.passes.length,
          };
        } catch (error) { axe = { error: String(error).slice(0, 500) }; }

        const requests = Array.from(net.values());
        const byType: Record<string, { count: number; bytes: number }> = {};
        for (const r of requests) { const k = r.type; byType[k] = byType[k] || { count: 0, bytes: 0 }; byType[k].count += 1; byType[k].bytes += r.bytes; }
        const imageRequests = requests.filter((r) => r.type === "Image").sort((a, b) => b.bytes - a.bytes);
        const perf = {
          loadMsWallClock: loadMs, navTiming, requestCount: requests.length, transferredBytes: requests.reduce((s, r) => s + r.bytes, 0), byType,
          totalJsBytes: byType.Script?.bytes || 0, totalCssBytes: byType.Stylesheet?.bytes || 0, totalImageBytes: byType.Image?.bytes || 0, totalFontBytes: byType.Font?.bytes || 0,
          largestImage: imageRequests[0] ? { url: imageRequests[0].url.replace(/^https?:\/\/[^/]+/, "").slice(0, 300), bytes: imageRequests[0].bytes } : null,
          imagesOver200KB: imageRequests.filter((r) => r.bytes > 200 * 1024).map((r) => ({ url: r.url.replace(/^https?:\/\/[^/]+/, "").slice(0, 300), bytes: r.bytes })),
          lcpMs: Math.round(Number(vitalsAtLoad.lcp)), lcpElement: vitalsAtLoad.lcpEl, lcpUrl: String(vitalsAtLoad.lcpUrl).replace(/^https?:\/\/[^/]+/, "").slice(0, 300),
          clsAtLoad: +Number(vitalsAtLoad.cls).toFixed(4), clsAfterScroll: +Number(vitalsAfterScroll.cls).toFixed(4), layoutShiftsAfterScroll: vitalsAfterScroll.shifts,
          externalRequests: requests.filter((r) => !/^https?:\/\/localhost:32\d\d/.test(r.url) && !r.url.startsWith("data:") && !r.url.startsWith("blob:")).map((r) => r.url.slice(0, 200)),
          note: "transfer sizes are the local `next start` gzip sizes over HTTP/1.1; production (Cloudflare) may differ",
        };
        const servedAssets = requests.filter((r) => r.type === "Image" || /\.(geojson|woff2?)(\?|$)/.test(r.url)).map((r) => {
          let original = ""; let pathname = r.url;
          try { const u = new URL(r.url); pathname = u.pathname; if (u.pathname === "/_next/image") original = u.searchParams.get("url") || ""; } catch { /* keep */ }
          return { path: pathname.slice(0, 200), original, status: r.status, bytes: r.bytes, mime: r.mime };
        });

        // prefers-reduced-motion pass (light scheme only; the scheme does not change motion rules)
        let reducedMotion: unknown = null;
        if (scheme === "light") {
          const rm = await context.newPage();
          await rm.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
          await rm.goto(route.path, { waitUntil: "networkidle", timeout: 60_000 });
          await rm.waitForTimeout(700);
          const probe = async () => rm.evaluate(async () => {
            const sel = (el: Element) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
            const anims = document.getAnimations();
            const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
            let canvasChanged: boolean | null = null;
            if (canvas) { const a = canvas.toDataURL(); await new Promise((r) => setTimeout(r, 900)); canvasChanged = a !== canvas.toDataURL(); }
            const withMotionCss = Array.from(document.querySelectorAll("body *")).filter((el) => {
              const cs = getComputedStyle(el);
              const anim = cs.animationName !== "none" && parseFloat(cs.animationDuration) > 0.01;
              const tr = cs.transitionDuration.split(",").some((d) => parseFloat(d) > 0.01) && /transform|opacity|all/.test(cs.transitionProperty);
              return anim || tr;
            });
            return {
              mediaMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
              runningAnimations: anims.filter((a) => a.playState === "running").length,
              runningList: anims.filter((a) => a.playState === "running").map((a) => { const t = (a.effect as KeyframeEffect | null)?.target; return ((a as CSSAnimation).animationName || (a as CSSTransition).transitionProperty || "anim") + " on " + (t ? sel(t) : "?"); }).slice(0, 15),
              elementsWithMovementCss: withMotionCss.length,
              movementCssSample: withMotionCss.slice(0, 15).map((el) => { const cs = getComputedStyle(el); return sel(el) + " {animation:" + cs.animationName + " " + cs.animationDuration + "; transition:" + cs.transitionProperty.slice(0, 40) + " " + cs.transitionDuration.slice(0, 30) + "}"; }),
              pendingMotion: document.querySelectorAll('[data-motion-state="pending"]').length,
              motionEnabledClass: !!document.querySelector(".so-motion-enabled"),
              revealWaiting: document.querySelectorAll('.reveal-group[data-reveal="waiting"]').length,
              overlayDisplay: (() => { const o = document.querySelector(".sg-entry-overlay"); return o ? getComputedStyle(o).display : "not-in-dom"; })(),
              scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
              canvasPresent: !!canvas, canvasChanged,
              hiddenInMain: Array.from(document.querySelectorAll("main *")).filter((el) => { const r = el.getBoundingClientRect(); return r.width > 40 && r.height > 20 && Number(getComputedStyle(el).opacity) < 0.05 && !el.closest("[aria-hidden=true]"); }).length,
            };
          });
          const atLoad = await probe();
          await scrollThrough(rm);
          const afterScroll = await probe();
          // an internal navigation must be immediate (no shutter) under reduced motion
          let navigation: unknown = null;
          const link = rm.locator('footer a[href="/pricing"], footer a[href="/"]').first();
          if (route.group === "marketing" && (await link.count())) {
            const href = await link.getAttribute("href");
            const t0 = Date.now();
            await link.click();
            await rm.waitForURL((u) => u.pathname === href, { timeout: 8000 }).catch(() => undefined);
            navigation = { clicked: href, arrived: new URL(rm.url()).pathname === href, ms: Date.now() - t0 };
          }
          reducedMotion = { atLoad, afterScroll, navigation };
          await rm.close();
        }

        writeJson(`parts/capture/${scheme}/${viewport}/${route.slug}.json`, {
          route: route.path, slug: route.slug, group: route.group, note: route.note || null, scheme, viewport, viewportSize: viewports[viewport],
          status: response?.status() ?? null, finalUrl: page.url().replace(/^https?:\/\/[^/]+/, ""), redirectChain: chain,
          responseHeaders: response ? Object.fromEntries(Object.entries(response.headers()).filter(([k]) => /^(content-security-policy|strict-transport-security|x-robots-tag|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|cache-control|content-type|content-encoding|x-nextjs-cache|link)$/.test(k))) : null,
          screenshots: { fold: foldFile, full: fullFile, scrolled: scrolledFile, stitched },
          consoleMessages, pageErrors, failedRequests, badResponses, dom, axe, perf, servedAssets, reducedMotion,
        });
        await context.close();
      });
    }
  }
}
