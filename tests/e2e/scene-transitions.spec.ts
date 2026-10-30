import { expect, test } from "@playwright/test";



test("public routes share a scene shell and product navigation still works", async ({ page }) => {
 await page.setViewportSize({ width: 1440, height: 900 });
 await page.goto("/");
 await expect(page.locator(".s1-scene-route")).toBeVisible();
 await page.locator('header a[href="/service"]:visible').first().click();
 await expect(page.locator(".sg-entry-wordmark")).toContainText("1Service");
 await expect(page).toHaveURL(/\/service$/);
 await expect(page.locator(".s1-scene-route")).toHaveAttribute("data-scene-route", "/service");
 await expect(page.locator(".s1-scene-route")).not.toHaveAttribute("data-scene-exit", "");
 await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "idle");
 await expect(page.locator("main")).toBeVisible();
});

test("reduced-motion navigation remains immediate and form inputs are accessible", async ({ page }) => {
 await page.setViewportSize({ width: 1440, height: 900 });
 await page.emulateMedia({ reducedMotion: "reduce" });
 await page.goto("/get-started");
 await expect(page.getByRole("textbox", { name: "Company name" })).toBeVisible();
 await page.locator('header a[href="/solutions/security"]:visible').first().click();
 await expect(page).toHaveURL(/\/solutions\/security$/);
});


test("glass shutters conceal scroll reset and reveal only the landed destination", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/service");
  await page.evaluate(() => window.scrollTo({ top: 1250, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

  const overlay = page.locator(".sg-entry-overlay");
  await page.locator('header a[href="/solutions/security"]:visible').first().click();
  await expect(overlay).toHaveAttribute("data-guard-entry", "closing");
  // Browser-test clicks can scroll the header link into view before clicking.
  // Once the shutter STARTS, however, the old page must remain stationary.
  const duringClose = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(130);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - duringClose)).toBeLessThan(3);
  await expect(overlay).toHaveAttribute("data-guard-entry", "sealed", { timeout: 6000 });
  await expect(overlay).toHaveCSS("background-color", "rgb(25, 37, 43)");
  await expect(page.locator("html")).toHaveClass(/s1-route-navigation/);
  await page.waitForURL(/\/solutions\/security$/);
  await expect(overlay).toHaveAttribute("data-guard-entry", "opening", { timeout: 7000 });
  // The destination scroll position is settled BEFORE the doors start opening.
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(3);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await expect(overlay).toHaveAttribute("data-guard-entry", "idle", { timeout: 6000 });
  await expect(page.locator("html")).not.toHaveClass(/s1-route-navigation/);
  await expect(page.locator(".s1-scene-route")).toHaveAttribute("data-scene-route", "/solutions/security");
  await expect(page.locator("main h1").first()).toBeVisible();
});

test("route navigation from a deeply scrolled destination never animates page upward under glass", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/solutions/security");
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await page.locator('header a[href="/service"]:visible').first().click();
  await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "sealed", { timeout: 6000 });
  await page.waitForURL(/\/service$/);
  await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "opening", { timeout: 7000 });
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(3);
  await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "idle", { timeout: 6000 });
  await expect(page.locator(".s1-scene-route")).toHaveAttribute("data-scene-route", "/service");
});

test("responsive page change keeps the curtain above content without a scroll flash", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/service");
  await page.evaluate(() => window.scrollTo({ top: 1000, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(150);
  // The mobile header opens its own navigation sheet.
  await page.getByRole("button", { name: /Menu/ }).click();
  await page.locator('#mobile-nav a[href="/solutions/security"]').click();
  await page.waitForURL(/\/solutions\/security$/);
  await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "opening", { timeout: 7000 });
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(3);
  await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "idle", { timeout: 6000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
