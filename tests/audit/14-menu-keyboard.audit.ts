/**
 * AUDIT (final release check, item 3): what the navigation menu does under real keyboard events.
 * Widths 390, 820, 1024, 1180; routes / and /pricing. Report only: writes parts/menu-keyboard-<label>.json.
 * env: AUDIT_LABEL
 */
import { test, type Page } from "@playwright/test";
import { writeJson } from "./lib";

const where = (page: Page) => page.evaluate(() => {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return "BODY";
  const zone = el.closest("#mobile-nav") ? "sheet" : el.matches('header button[aria-controls="mobile-nav"]') ? "toggle" : el.closest("header") ? "header-bar" : el.closest("main") ? "MAIN (behind)" : el.closest("footer") ? "FOOTER (behind)" : "OTHER (behind)";
  return zone + ": " + el.tagName.toLowerCase() + " " + JSON.stringify((el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30));
});

test("menu keyboard behaviour", async ({ browser }) => {
  test.setTimeout(20 * 60_000);
  const out: unknown[] = [];
  for (const width of [390, 820, 1024, 1180]) {
    for (const route of ["/", "/pricing"]) {
      const context = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 1, locale: "en-ZA", reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const toggle = page.locator('header button[aria-controls="mobile-nav"]');
      const sheet = page.locator("#mobile-nav");
      const r: Record<string, unknown> = { width, route, toggleVisible: await toggle.isVisible() };
      r.ariaControls = await toggle.getAttribute("aria-controls");
      r.expandedClosed = await toggle.getAttribute("aria-expanded");

      // open with Enter
      await toggle.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(250);
      r.enterOpens = (await sheet.count()) === 1;
      r.expandedOpen = await toggle.getAttribute("aria-expanded");
      r.sheetIdMatchesAriaControls = (await sheet.getAttribute("id").catch(() => null)) === r.ariaControls;
      r.focusAfterEnterOpen = await where(page);
      // Escape closes and returns focus
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      r.escapeCloses = (await sheet.count()) === 0;
      r.focusAfterEscape = await where(page);
      // open with Space
      await toggle.focus();
      await page.keyboard.press("Space");
      await page.waitForTimeout(250);
      r.spaceOpens = (await sheet.count()) === 1;
      r.focusAfterSpaceOpen = await where(page);

      // Tab forward through and past the end
      const focusables = await sheet.locator("a, button").count();
      const forward: string[] = [];
      for (let i = 0; i < focusables + 6; i++) { await page.keyboard.press("Tab"); forward.push(await where(page)); }
      r.sheetFocusables = focusables;
      r.tabForward = forward;
      r.tabForwardEscapesBehind = forward.some((f) => /behind|BODY/.test(f));
      // back to the first sheet link, then Shift+Tab past the start
      await sheet.locator("a").first().focus();
      const backward: string[] = [];
      for (let i = 0; i < 8; i++) { await page.keyboard.press("Shift+Tab"); backward.push(await where(page)); }
      r.shiftTabBackward = backward;
      r.shiftTabEscapesBehind = backward.some((f) => /behind|BODY/.test(f));
      r.sheetStillOpenAfterTabbing = (await sheet.count()) === 1;

      // background scroll while open
      if ((await sheet.count()) === 0) { await toggle.focus(); await page.keyboard.press("Enter"); await page.waitForTimeout(200); }
      const before = await page.evaluate(() => Math.round(scrollY));
      await page.mouse.move(width / 2, 500);
      await page.mouse.wheel(0, 900);
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(350);
      r.backgroundScrolledBy = (await page.evaluate(() => Math.round(scrollY))) - before;
      r.bodyOverflowWhileOpen = await page.evaluate(() => getComputedStyle(document.body).overflow);

      // close with the button (keyboard)
      await toggle.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(250);
      r.buttonCloses = (await sheet.count()) === 0;
      r.focusAfterButtonClose = await where(page);
      r.expandedAfterClose = await toggle.getAttribute("aria-expanded");
      r.bodyOverflowAfterClose = await page.evaluate(() => getComputedStyle(document.body).overflow);

      // activate a link with the keyboard
      await toggle.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(250);
      const target = sheet.locator("ul a").nth(1);
      r.linkActivated = await target.getAttribute("href");
      await target.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL((u) => u.pathname === r.linkActivated, { timeout: 15_000 }).catch(() => undefined);
      await page.waitForTimeout(600);
      r.arrivedAt = new URL(page.url()).pathname;
      r.sheetClosedAfterNavigation = (await sheet.count()) === 0;
      r.focusAfterNavigation = await where(page);
      await page.keyboard.press("Tab");
      r.firstTabAfterNavigation = await where(page);
      r.bodyOverflowAfterNavigation = await page.evaluate(() => getComputedStyle(document.body).overflow);
      out.push(r);
      console.log(JSON.stringify(r));
      await context.close();
    }
  }
  writeJson(`parts/menu-keyboard-${process.env.AUDIT_LABEL || "after"}.json`, out);
});
