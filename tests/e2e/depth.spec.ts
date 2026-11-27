import { expect, test } from "@playwright/test";
import { routes } from "./routes";

/**
 * Depth direction (founder, 2026-11-27; docs/launch/DEPTH_SYSTEM.md) and its supplementary directive.
 * Visual quality is judged from screenshots; these tests guard the structure that makes it possible.
 */

const buyerRoutes = routes.filter((route) => !route.startsWith("/guards") && !route.startsWith("/join"));

test("the header carries no trial button on buyer pages, at desktop and in the mobile sheet", async ({ page }) => {
  for (const route of ["/", "/radios-equipment", "/solutions/security", "/pricing"]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const header = page.locator("header.glass-nav");
    await expect(header.getByRole("link", { name: /14-day trial/i }), route).toHaveCount(0);
    await expect(header.locator("a[href='/get-started']"), route).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Menu" }).click();
    const sheet = page.locator("#mobile-nav");
    await expect(sheet).toBeVisible();
    await expect(sheet.locator("a[href='/get-started']"), route + " mobile sheet").toHaveCount(0);
    await page.keyboard.press("Escape");
  }
});

test("the trial stays reachable inside the 1GUARD journeys", async ({ page }) => {
  for (const route of ["/solutions/security", "/guard-patrol-software", "/guard-attendance-software", "/pricing"]) {
    await page.goto(route);
    await expect(page.locator("main a[href='/get-started']").first(), route).toBeVisible();
  }
});

for (const width of [1024, 1280, 1440, 1600, 1920]) {
  test(`the floating header is one detached pill on one row at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/radios-equipment");
    const m = await page.evaluate(() => {
      const pill = document.querySelector("header.glass-nav > .wrap")!.getBoundingClientRect();
      const items = [...document.querySelectorAll("header.glass-nav > .wrap a, header.glass-nav > .wrap button")]
        .filter((n) => (n as HTMLElement).offsetParent !== null)
        .map((n) => ({ h: n.getBoundingClientRect().height, lines: Math.round(n.getBoundingClientRect().height / parseFloat(getComputedStyle(n).lineHeight || "20")) }));
      return { top: pill.top, left: pill.left, right: innerWidth - pill.right, height: pill.height, tallest: Math.max(...items.map((i) => i.h)), overflow: document.documentElement.scrollWidth - innerWidth };
    });
    expect(m.top, "detached from the top").toBeGreaterThanOrEqual(10);
    expect(m.left, "detached from the left").toBeGreaterThanOrEqual(16);
    expect(m.right, "detached from the right").toBeGreaterThanOrEqual(16);
    expect(m.height).toBeLessThanOrEqual(66);
    expect(m.tallest, "every header label on one line").toBeLessThanOrEqual(56);
    expect(m.overflow).toBeLessThanOrEqual(1);
  });
}

test("every marketing section names one depth material, and no scene photograph repeats across the site", async ({ page }) => {
  const seen = new Map<string, string>();
  for (const route of buyerRoutes.concat(["/guards", "/join/sales"] as never[])) {
    await page.goto(route);
    await page.waitForFunction(() => document.documentElement.hasAttribute("data-after-load"));
    const sections = await page.evaluate(() =>
      [...document.querySelectorAll("main > section")].map((s) => ({
        cls: s.className,
        hero: s.classList.contains("so-hero"),
        bg: getComputedStyle(s).backgroundImage,
      })),
    );
    for (const s of sections) {
      if (s.hero) continue;
      const legal = route === "/privacy" || route === "/popia" || route === "/terms" || route === "/security-trust";
      if (!legal) expect(s.cls, `${route}: section without a depth material`).toMatch(/\bmat-/);
      for (const [, url] of s.bg.matchAll(/url\("?([^")]+)"?\)/g)) {
        const path = new URL(url).pathname;
        if (seen.has(path)) expect(seen.get(path), `${path} is the environment of two pages`).toBe(route);
        seen.set(path, route);
      }
    }
  }
});

test("midnight is a slab on the content edge, never a full-bleed band", async ({ page }) => {
  for (const [route, selector] of [["/", ".so-guard-section"], ["/solutions/security", "section.mat-midnight"], ["/radios-equipment", "section.mat-midnight"]] as const) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const box = await page.locator(selector).first().evaluate((n) => {
      const r = n.getBoundingClientRect();
      return { left: r.left, right: innerWidth - r.right, radius: parseFloat(getComputedStyle(n).borderTopLeftRadius) };
    });
    expect(box.left, route).toBeGreaterThanOrEqual(39);
    expect(box.right, route).toBeGreaterThanOrEqual(39);
    expect(box.radius, route).toBeGreaterThanOrEqual(24);
  }
});

test("genuine 1GUARD screenshot slots render nothing until real captures are supplied", async ({ page }) => {
  for (const route of ["/", "/solutions/security"]) {
    await page.goto(route);
    await expect(page.locator("[data-guard-screens]"), route).toHaveCount(0);
  }
});

/* The hero radio (supplementary directive item 1, founder authorisation 2026-11-27): mounted in the hero. */
test.describe("hero radio", () => {
  test("keyboard focus shows the label and Enter navigates to /radios-equipment", async ({ page }) => {
    await page.goto("/");
    const radio = page.locator("a.so-radio");
    await expect(radio).toHaveCount(1);
    await radio.focus();
    await expect(radio.locator(".so-radio-label")).toHaveCSS("opacity", "1");
    await expect(radio).toHaveAttribute("href", "/radios-equipment");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/radios-equipment", { timeout: 10_000 });
  });

  test("reduced motion navigates immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const radio = page.locator("a.so-radio");
    await expect(radio).toHaveCount(1);
    const started = Date.now();
    await radio.click();
    await page.waitForURL("**/radios-equipment", { timeout: 5_000 });
    expect(Date.now() - started).toBeLessThan(2_000);
  });

  test("without JavaScript the radio is a plain link", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("http://localhost:3100/");
    const radio = page.locator("a.so-radio");
    await expect(radio).toHaveCount(1);
    await radio.click();
    await page.waitForURL("**/radios-equipment");
    await context.close();
  });
});

test.describe("hero composition (founder, 2026-11-27)", () => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    test(`no glass panel; the radio stands clear of the copy and the rail at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const copy = page.locator(".so-hero-copy");
      const style = await copy.evaluate(el => { const s = getComputedStyle(el); return [s.backgroundImage, s.backgroundColor, s.backdropFilter, s.borderTopWidth]; });
      expect(style).toEqual(["none", "rgba(0, 0, 0, 0)", "none", "0px"]);
      const [c, r, bar] = await Promise.all([copy.boundingBox(), page.locator("a.so-radio").boundingBox(), page.locator(".so-hero-bar").boundingBox()]);
      expect(c && r && bar).toBeTruthy();
      const apart = (a: NonNullable<typeof c>, b: NonNullable<typeof c>) =>
        a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y;
      expect(apart(c!, r!), "radio overlaps the copy").toBe(true);
      expect(apart(bar!, r!), "radio overlaps the business-areas rail").toBe(true);
      // The first screen shows the headline and the primary action.
      const primary = await page.locator(".so-hero-actions .so-home-cta").boundingBox();
      const h1 = await page.locator("#so-hero-title").boundingBox();
      expect(h1!.y + h1!.height).toBeLessThanOrEqual(viewport.height);
      if (viewport.width >= 1200) expect(primary!.y + primary!.height).toBeLessThanOrEqual(viewport.height);
    });
  }
});
