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

test("1GUARD screenshot slots show genuine captures, each labelled as synthetic demo data", async ({ page }) => {
  for (const [route, count] of [["/", 1], ["/solutions/security", 2]] as const) {
    await page.goto(route);
    const slot = page.locator("[data-guard-screens]");
    await expect(slot, route).toHaveCount(1);
    const figures = slot.locator("figure");
    await expect(figures, route).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      await expect(figures.nth(i).locator("figcaption"), route).toContainText("real app, synthetic demo data");
      await expect(figures.nth(i).locator("img"), route).toHaveAttribute("alt", /^1GUARD /);
    }
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
  const sizes = [
    { width: 2560, height: 1440 }, { width: 1920, height: 1080 }, { width: 1680, height: 1050 }, { width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 1280, height: 800 },
    { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 740 },
  ];
  for (const viewport of sizes) {
    test(`no glass panel; the whole photograph; the radio clear of the copy, rail and fold at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const copy = page.locator(".so-hero-copy");
      const style = await copy.evaluate(el => { const s = getComputedStyle(el); return [s.backgroundImage, s.backgroundColor, s.backdropFilter, s.borderTopWidth]; });
      expect(style).toEqual(["none", "rgba(0, 0, 0, 0)", "none", "0px"]);
      // The photograph is never letterboxed or pillarboxed: its box has the photograph's own proportions.
      const photo = await page.locator(".so-hero-media img.so-hero-photo").boundingBox();
      expect(Math.abs(photo!.width / photo!.height - 1672 / 941), "photo box proportions").toBeLessThan(0.01);
      // Full width up to the photograph's native 1672 px, never upscaled beyond it.
      expect(photo!.width).toBeGreaterThanOrEqual(Math.min(viewport.width, 1672) - 1);
      expect(photo!.width).toBeLessThanOrEqual(1672 + 1);
      const radio = (await page.locator("a.so-radio").boundingBox())!;
      const parts = await page.locator(".so-hero-copy > :is(p, h1), .so-hero-actions > a").evaluateAll(nodes =>
        nodes.filter(n => n.getBoundingClientRect().height > 0).map(n => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, what: n.className || n.tagName }; }));
      const bar = (await page.locator(".so-hero-bar").boundingBox())!;
      const apart = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
        a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y;
      for (const part of parts) expect(apart(part, radio), `radio overlaps ${part.what}`).toBe(true);
      expect(apart(bar, radio), "radio overlaps the business-areas rail").toBe(true);
      // The radio stands on the photograph and inside the first screen.
      expect(radio.y + radio.height).toBeLessThanOrEqual(Math.min(photo!.y + photo!.height, viewport.height) + 1);
      expect(radio.y).toBeGreaterThanOrEqual(photo!.y);
      // The rail never covers the photograph, and on laptops starts wholly below the fold.
      expect(bar.y).toBeGreaterThanOrEqual(photo!.y + photo!.height - 1);
      if (viewport.width >= 1280) expect(bar.y >= viewport.height || bar.y + bar.height <= viewport.height, "rail whole or wholly below the fold").toBe(true);
      // The first screen shows the headline; from 1024 px also the primary action.
      const h1 = (await page.locator("#so-hero-title").boundingBox())!;
      expect(h1.y + h1.height).toBeLessThanOrEqual(viewport.height);
      const primary = (await page.locator(".so-hero-actions .so-home-cta").boundingBox())!;
      if (viewport.width >= 1024) expect(primary.y + primary.height).toBeLessThanOrEqual(viewport.height);
    });
  }

  test("the radio skips the page shutter: its press is the transition", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    // Record every shutter phase as it happens: the radio's press must not be followed by the shutter.
    await page.evaluate(() => {
      const overlay = document.querySelector(".sg-entry-overlay")!;
      const seen: (string | null)[] = [];
      (window as unknown as { __shutter: typeof seen }).__shutter = seen;
      new MutationObserver(() => seen.push(overlay.getAttribute("data-guard-entry"))).observe(overlay, { attributes: true, attributeFilter: ["data-guard-entry"] });
    });
    await page.locator("a.so-radio").click();
    await page.waitForURL("**/radios-equipment", { timeout: 5_000 });
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => (window as unknown as { __shutter: string[] }).__shutter), "no shutter phase after the radio's press").toEqual([]);
  });
});
