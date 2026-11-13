/**
 * AUDIT step 7 (interaction): navigation menu at every breakpoint, footer accordions, tabs, rails, the
 * guard-day calculator, the skip link, and a real click on every link and button in <main> of every page.
 * A control is recorded as DEAD when a click produces no navigation, no scroll, no DOM change and no state change.
 * Report-only. Local build only; external, mailto: and tel: links are listed, never opened.
 */
import { test, type Page } from "@playwright/test";
import { contextOptions, pageRoutes, shotPath, writeJson, type ViewportName } from "./lib";

test.describe.configure({ mode: "parallel" });
const marketing = pageRoutes.filter((r) => r.group === "marketing" && r.slug !== "workforce");

async function settle(page: Page) {
  await page.waitForLoadState("networkidle").catch(() => undefined);
  await page.waitForFunction(() => { const h = document.querySelector("header"); return !h || Object.keys(h).some((k) => k.startsWith("__react")); }, undefined, { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(350);
}
const snapshot = (page: Page) => page.evaluate(() => ({
  path: location.pathname, hash: location.hash, scrollY: Math.round(window.scrollY), nodes: document.querySelectorAll("body *").length,
  expanded: Array.from(document.querySelectorAll("[aria-expanded]")).map((e) => e.getAttribute("aria-expanded")).join(","),
  openDetails: document.querySelectorAll("details[open]").length, checked: document.querySelectorAll("input:checked").length,
  selectedTabs: Array.from(document.querySelectorAll("[role=tab]")).map((e) => e.getAttribute("aria-selected")).join(","),
  text: document.body.innerText.length, focus: document.activeElement ? document.activeElement.tagName + ":" + (document.activeElement.textContent || "").trim().slice(0, 30) : "",
  railScroll: Array.from(document.querySelectorAll(".hardware-rail")).map((r) => Math.round((r as HTMLElement).scrollLeft)).join(","),
}));
type Snap = Awaited<ReturnType<typeof snapshot>>;
const changed = (a: Snap, b: Snap) => (Object.keys(a) as Array<keyof Snap>).filter((k) => a[k] !== b[k]);

// ---------- A. navigation menu at every breakpoint, for the three header "worlds" ----------
test("nav breakpoint sweep", async ({ browser }) => {
  const widths = [360, 390, 640, 768, 820, 1023, 1024, 1100, 1180, 1279, 1280, 1440, 1920];
  const rows: unknown[] = [];
  for (const route of ["/", "/pricing", "/guards", "/join/sales"]) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.goto(route, { waitUntil: "networkidle" });
      await settle(page);
      const before = await page.evaluate(() => {
        const vis = (el: Element | null) => { if (!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
        const toggle = document.querySelector("header button[aria-controls=mobile-nav]");
        const primary = document.querySelector('header nav[aria-label="Primary"]');
        const cta = Array.from(document.querySelectorAll("header a.btn")).find((a) => vis(a)) || null;
        const header = document.querySelector("header");
        const wrap = document.querySelector("header > .wrap");
        const logoBoxes = Array.from(document.querySelectorAll("header a[aria-label$=home] > span")).filter((s) => vis(s)).map((s) => Math.round(s.getBoundingClientRect().width));
        return {
          toggleVisible: vis(toggle), primaryNavVisible: vis(primary), primaryLinksVisible: primary ? Array.from(primary.querySelectorAll("a")).filter((a) => vis(a)).length : 0,
          secondaryLinksVisible: Array.from(document.querySelectorAll("header > .wrap > div.hidden a:not(.btn)")).filter((a) => vis(a)).length,
          ctaVisible: !!cta, ctaText: cta ? (cta.textContent || "").trim() : "",
          headerOverflow: wrap ? wrap.scrollWidth > wrap.clientWidth + 1 : false, headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
          logoVariantsVisible: logoBoxes, docOverflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      let afterClick: unknown = null;
      if (before.toggleVisible) {
        await page.locator("header button[aria-controls=mobile-nav]").click();
        await page.waitForTimeout(300);
        afterClick = await page.evaluate(() => {
          const sheet = document.getElementById("mobile-nav");
          const toggle = document.querySelector("header button[aria-controls=mobile-nav]");
          const r = sheet ? sheet.getBoundingClientRect() : null;
          const cs = sheet ? getComputedStyle(sheet) : null;
          return {
            ariaExpanded: toggle?.getAttribute("aria-expanded"), toggleText: (toggle?.textContent || "").trim(), sheetInDom: !!sheet,
            sheetDisplay: cs?.display ?? null, sheetWidth: r ? Math.round(r.width) : 0, sheetHeight: r ? Math.round(r.height) : 0,
            sheetVisible: !!sheet && !!r && r.width > 0 && r.height > 0 && cs?.display !== "none",
            sheetLinks: sheet ? Array.from(sheet.querySelectorAll("a")).map((a) => (a.textContent || "").trim().slice(0, 30)) : [],
            bodyOverflowLocked: document.body.style.overflow === "hidden",
            focusInsideSheet: !!sheet && sheet.contains(document.activeElement),
          };
        });
        const state = afterClick as { sheetVisible: boolean };
        if (!state.sheetVisible || [1024, 1100, 820, 390].includes(width)) await page.screenshot({ path: shotPath("screenshots", "interaction", `nav-${route === "/" ? "home" : route.slice(1).replace(/\//g, "-")}-${width}-menu-open`) });
      }
      rows.push({ route, width, ...before, afterClick, primaryNavReachable: before.primaryNavVisible || (afterClick as { sheetVisible?: boolean } | null)?.sheetVisible === true });
      await context.close();
    }
  }
  writeJson("parts/interaction/nav-sweep.json", rows);
});

// ---------- B. mobile menu behaviour: open, Escape, focus return, link click ----------
for (const viewport of ["mobile", "tablet"] as ViewportName[]) {
  test(`mobile menu behaviour ${viewport}`, async ({ browser }) => {
    const out: unknown[] = [];
    for (const route of ["/", "/guards", "/join/sales"]) {
      const context = await browser.newContext(contextOptions(viewport));
      const page = await context.newPage();
      await page.goto(route, { waitUntil: "networkidle" });
      await settle(page);
      const toggle = page.locator("header button[aria-controls=mobile-nav]");
      const row: Record<string, unknown> = { route, viewport, toggleVisible: await toggle.isVisible() };
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(250);
        row.opened = await page.locator("#mobile-nav").isVisible();
        row.focusMovedIntoSheet = await page.evaluate(() => !!document.getElementById("mobile-nav")?.contains(document.activeElement));
        row.sheetLinks = await page.locator("#mobile-nav a").evaluateAll((els) => els.map((a) => ({ text: (a.textContent || "").trim().slice(0, 40), href: a.getAttribute("href"), h: Math.round(a.getBoundingClientRect().height) })));
        row.backgroundScrollLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
        // focus trap: Tab through more elements than the sheet holds and see whether focus leaves the sheet while it is open
        const leaks: string[] = [];
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press("Tab");
          const where = await page.evaluate(() => { const a = document.activeElement; const inSheet = !!document.getElementById("mobile-nav")?.contains(a); const inHeader = !!a?.closest("header"); return inSheet ? "sheet" : inHeader ? "header" : (a?.tagName || "?") + ":" + (a?.textContent || "").trim().slice(0, 30); });
          if (where !== "sheet" && where !== "header") { leaks.push(where); break; }
        }
        row.focusLeavesOpenSheetTo = leaks;
        await page.screenshot({ path: shotPath("screenshots", "interaction", `menu-${viewport}-${route === "/" ? "home" : route.slice(1).replace(/\//g, "-")}-open`) });
        await page.keyboard.press("Escape");
        await page.waitForTimeout(200);
        row.closedByEscape = !(await page.locator("#mobile-nav").count());
        row.focusReturnedToToggle = await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "mobile-nav");
        await toggle.click();
        await page.waitForTimeout(200);
        const first = page.locator("#mobile-nav ul a").first();
        const href = await first.getAttribute("href");
        await first.click();
        const target = (href || "").split("#")[0];
        await page.waitForURL((u) => u.pathname === target, { timeout: 10_000 }).catch(() => undefined);
        await page.waitForTimeout(1900);
        row.linkClicked = href;
        row.arrived = new URL(page.url()).pathname === target;
        row.sheetClosedAfterNavigation = !(await page.locator("#mobile-nav").count());
        row.scrollUnlockedAfterNavigation = await page.evaluate(() => document.body.style.overflow !== "hidden" && document.documentElement.style.overflow !== "hidden");
      }
      out.push(row);
      await context.close();
    }
    writeJson(`parts/interaction/menu-${viewport}.json`, out);
  });
}

// ---------- C. every control in <main> on every page; header + footer links once per viewport ----------
for (const viewport of ["desktop", "mobile"] as ViewportName[]) {
  for (const route of marketing.concat(pageRoutes.filter((r) => r.group !== "marketing"))) {
    test(`controls ${viewport} ${route.path}`, async ({ browser }) => {
      const context = await browser.newContext(contextOptions(viewport));
      // never leave the local build
      await context.route((url) => !/^https?:\/\/localhost:32\d\d\//.test(url.href) && /^https?:/.test(url.href), (r) => r.abort());
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 300)));
      await page.goto(route.path, { waitUntil: "networkidle" });
      await settle(page);

      const scope = route.path === "/" ? "body" : "main"; // header + footer are exercised once, from the home page
      const linkList = await page.evaluate((scopeSel) => {
        const vis = (el: Element) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
        const seen = new Set<string>();
        return Array.from(document.querySelectorAll(scopeSel + " a[href]")).map((a, index) => {
          const el = a as HTMLAnchorElement; let kind = "internal";
          try { const u = new URL(el.href); if (u.protocol === "mailto:" || u.protocol === "tel:") kind = u.protocol.slice(0, -1); else if (u.origin !== location.origin) kind = "external"; } catch { kind = "invalid"; }
          const region = el.closest("header") ? "header" : el.closest("footer") ? "footer" : "main";
          return { index, href: el.getAttribute("href") || "", kind, target: el.target, text: ((el.getAttribute("aria-label") || el.textContent || "").trim()).slice(0, 60), visible: vis(el), region };
        }).filter((l) => { const k = l.region + "|" + l.href; if (seen.has(k)) return false; seen.add(k); return true; });
      }, scope);

      const linkResults: unknown[] = [];
      for (const link of linkList) {
        if (link.kind !== "internal") { linkResults.push({ ...link, result: "not-clicked (" + link.kind + ")" }); continue; }
        if (!link.visible) { linkResults.push({ ...link, result: "not-visible at this viewport" }); continue; }
        if (page.url() !== new URL(route.path, page.url()).href || (await page.evaluate(() => window.scrollY)) > 0) { await page.goto(route.path, { waitUntil: "networkidle" }); await settle(page); }
        const loc = page.locator(scope + " a[href]").nth(link.index);
        const before = await snapshot(page);
        const t0 = Date.now();
        let clickError = "";
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        const beforeScrolled = await snapshot(page);
        await loc.click({ timeout: 6000 }).catch((e) => { clickError = String(e.message).split("\n")[0].slice(0, 200); });
        const dest = new URL(link.href, "http://localhost:3200" + route.path);
        const samePage = dest.pathname === new URL(page.url()).pathname && !clickError && dest.pathname === before.path;
        if (!samePage) await page.waitForURL((u) => u.pathname !== before.path, { timeout: 9000 }).catch(() => undefined);
        else await page.waitForTimeout(900);
        const after = await snapshot(page);
        const diff = changed(beforeScrolled, after);
        const navigated = after.path !== before.path;
        const expectedPath = dest.pathname;
        let landedOnAnchor: boolean | null = null;
        if (navigated && dest.hash) {
          await page.waitForTimeout(2200);
          landedOnAnchor = await page.evaluate((id) => { const el = document.getElementById(id); if (!el) return false; const top = el.getBoundingClientRect().top; return top > -40 && top < window.innerHeight * 0.6; }, decodeURIComponent(dest.hash.slice(1)));
        }
        linkResults.push({
          ...link, clickError: clickError || undefined, navigated, arrivedAt: after.path + after.hash, expectedPath,
          arrivedWhereExpected: navigated ? after.path === expectedPath || (await page.evaluate(() => location.pathname)) === expectedPath : null,
          landedOnAnchor, ms: Date.now() - t0, changed: diff,
          result: clickError ? "CLICK-FAILED" : navigated ? "navigated" : diff.length ? "in-page (" + diff.join(",") + ")" : "DEAD (no navigation, scroll or state change)",
        });
      }

      // buttons, summaries, tabs (not form submit buttons: those are exercised in 03-forms)
      await page.goto(route.path, { waitUntil: "networkidle" });
      await settle(page);
      const buttonList = await page.evaluate((scopeSel) => {
        const vis = (el: Element) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
        return Array.from(document.querySelectorAll(scopeSel + " button, " + scopeSel + " summary, " + scopeSel + " [role=tab], " + scopeSel + " [role=button]")).map((b, index) => ({
          index, tag: b.tagName.toLowerCase(), type: b.getAttribute("type") || "", role: b.getAttribute("role") || "", text: ((b.getAttribute("aria-label") || b.textContent || "").trim()).slice(0, 60),
          visible: vis(b), disabled: (b as HTMLButtonElement).disabled === true, inForm: !!b.closest("form"), region: b.closest("header") ? "header" : b.closest("footer") ? "footer" : "main",
        }));
      }, scope);
      const buttonResults: unknown[] = [];
      for (const b of buttonList) {
        if (!b.visible) { buttonResults.push({ ...b, result: "not-visible at this viewport" }); continue; }
        if (b.disabled) { buttonResults.push({ ...b, result: "disabled" }); continue; }
        if (b.inForm && b.type === "submit") { buttonResults.push({ ...b, result: "form submit: see forms audit" }); continue; }
        const loc = page.locator(scope + " button, " + scope + " summary, " + scope + " [role=tab], " + scope + " [role=button]").nth(b.index);
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        const before = await snapshot(page);
        let clickError = "";
        await loc.click({ timeout: 5000 }).catch((e) => { clickError = String(e.message).split("\n")[0].slice(0, 200); });
        await page.waitForTimeout(650);
        const after = await snapshot(page);
        const diff = changed(before, after);
        buttonResults.push({ ...b, clickError: clickError || undefined, changed: diff, result: clickError ? "CLICK-FAILED" : diff.length ? "responded (" + diff.join(",") + ")" : "DEAD (no observable change)" });
        if (after.path !== before.path) { await page.goto(route.path, { waitUntil: "networkidle" }); await settle(page); }
      }

      // calculator, rails
      await page.goto(route.path, { waitUntil: "networkidle" });
      await settle(page);
      const widgets = await page.evaluate(async () => {
        const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const out: Record<string, unknown> = {};
        const rails = Array.from(document.querySelectorAll(".hardware-rail")) as HTMLElement[];
        out.rails = rails.map((r) => ({ scrollWidth: r.scrollWidth, clientWidth: r.clientWidth, scrollable: r.scrollWidth > r.clientWidth + 2, items: r.querySelectorAll("li").length }));
        const numbers = Array.from(document.querySelectorAll("main input[type=number], main input[type=range]")) as HTMLInputElement[];
        out.numericInputs = numbers.map((n) => ({ name: n.name, id: n.id, min: n.min, max: n.max, value: n.value, label: (n.labels && n.labels[0] ? n.labels[0].textContent || "" : n.getAttribute("aria-label") || "").trim().slice(0, 60), inForm: !!n.closest("form") }));
        await delay(10);
        return out;
      });
      let calculator: unknown = null;
      const calcInputs = page.locator("main input[type=number]:not(form input)");
      if ((await calcInputs.count()) >= 2) {
        const region = page.locator("main section:has(> div input[type=number]):has([aria-live])");
        const read = async () => (await region.count()) ? (await region.first().innerText()).replace(/\s+/g, " ").slice(0, 400) : "";
        const initial = await read();
        await calcInputs.nth(0).fill("10"); await calcInputs.nth(1).fill("30"); await page.waitForTimeout(250);
        const at300 = await read();
        await calcInputs.nth(0).fill("1"); await calcInputs.nth(1).fill("1"); await page.waitForTimeout(250);
        const at1 = await read();
        await calcInputs.nth(0).fill("-5"); await page.waitForTimeout(250);
        const negative = await read();
        await calcInputs.nth(0).fill("abc").catch(() => undefined); await page.waitForTimeout(150);
        calculator = { initial, tenGuardsThirtyDays: at300, oneGuardOneDay: at1, negativeGuards: negative, showsR750: /R\s?750/.test(at300), showsR86250: /862[,.]50/.test(at300) };
      }

      // skip link
      await page.goto(route.path, { waitUntil: "networkidle" });
      await settle(page);
      await page.keyboard.press("Tab");
      const skip = await page.evaluate(() => { const a = document.activeElement as HTMLElement | null; const r = a?.getBoundingClientRect(); return { tag: a?.tagName, text: (a?.textContent || "").trim().slice(0, 40), href: a?.getAttribute("href"), visibleWhenFocused: !!r && r.width > 10 && r.height > 10 && r.top >= 0 && r.left >= 0 }; });
      let skipWorks: unknown = null;
      if (skip.href === "#main") {
        await page.keyboard.press("Enter");
        await page.waitForTimeout(400);
        skipWorks = await page.evaluate(() => ({ hash: location.hash, mainExists: !!document.getElementById("main"), mainTop: Math.round(document.getElementById("main")?.getBoundingClientRect().top ?? -1) }));
      }

      writeJson(`parts/interaction/controls/${viewport}/${route.slug}.json`, { route: route.path, viewport, scope, pageErrors: errors, links: linkResults, buttons: buttonResults, widgets, calculator, skipLink: { firstTabStop: skip, afterEnter: skipWorks } });
      await context.close();
    });
  }
}

// ---------- D. footer accordions (<details>) on their own, with the mobile menu closed ----------
// (In section C the Menu button is clicked first and its open sheet then covers the footer, so the
//  footer summaries are verified here instead.)
for (const viewport of ["desktop", "tablet", "mobile"] as ViewportName[]) {
  test(`footer accordions ${viewport}`, async ({ browser }) => {
    const context = await browser.newContext(contextOptions(viewport));
    const page = await context.newPage();
    await page.goto("/pricing", { waitUntil: "networkidle" });
    await settle(page);
    const summaries = page.locator("footer details > summary");
    const rows: unknown[] = [];
    for (let i = 0; i < (await summaries.count()); i++) {
      const s = summaries.nth(i);
      await s.scrollIntoViewIfNeeded();
      const before = await s.evaluate((el) => { const d = el.parentElement as HTMLDetailsElement; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const icon = el.querySelector("span"); return { title: (el.textContent || "").trim(), open: d.open, w: Math.round(r.width), h: Math.round(r.height), cursor: cs.cursor, iconShown: icon ? getComputedStyle(icon).display !== "none" : false, links: d.querySelectorAll("li a").length, linksVisible: Array.from(d.querySelectorAll("li a")).filter((a) => a.getBoundingClientRect().height > 0).length }; });
      let clickError = "";
      await s.click({ timeout: 5000 }).catch((e) => { clickError = String(e.message).split("\n")[0]; });
      await page.waitForTimeout(250);
      const afterFirst = await s.evaluate((el) => { const d = el.parentElement as HTMLDetailsElement; return { open: d.open, linksVisible: Array.from(d.querySelectorAll("li a")).filter((a) => a.getBoundingClientRect().height > 0).length }; });
      await s.click({ timeout: 5000 }).catch(() => undefined);
      await page.waitForTimeout(250);
      const afterSecond = await s.evaluate((el) => (el.parentElement as HTMLDetailsElement).open);
      await s.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(200);
      const afterEnter = await s.evaluate((el) => (el.parentElement as HTMLDetailsElement).open);
      if (afterEnter !== before.open) { await page.keyboard.press("Enter"); await page.waitForTimeout(150); }
      rows.push({ ...before, clickError: clickError || undefined, afterFirstClick: afterFirst, afterSecondClickOpen: afterSecond, keyboardEnterToggles: afterEnter !== afterSecond, toggles: afterFirst.open !== before.open });
    }
    await page.locator("footer").screenshot({ path: shotPath("screenshots", "interaction", `footer-${viewport}`) }).catch(() => undefined);
    writeJson(`parts/interaction/footer-${viewport}.json`, rows);
    await context.close();
  });
}
