import { expect, test } from "@playwright/test";

test("public routes share a scene shell and product navigation still works", async ({ page }) => {
 await page.goto("/");
 await expect(page.locator(".s1-scene-route")).toBeVisible();
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1Service/ }).click();
 await expect(page.locator(".sg-entry-wordmark")).toContainText("1Service");
 await expect(page).toHaveURL(/\/service$/);
 await expect(page.locator(".s1-scene-route")).toHaveAttribute("data-scene-route", "/service");
 await expect(page.locator(".s1-scene-route")).not.toHaveAttribute("data-scene-exit", "");
 await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "idle");
 await expect(page.locator("main")).toBeVisible();
});

test("reduced-motion navigation remains immediate and form inputs are accessible", async ({ page }) => {
 await page.emulateMedia({ reducedMotion: "reduce" });
 await page.goto("/get-started");
 await expect(page.getByRole("textbox", { name: "Company name" })).toBeVisible();
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1GUARD/ }).click();
 await expect(page).toHaveURL(/\/solutions\/security$/);
});

test("sealed shutters prevent the previous page scrolling through the glass", async ({ page }) => {
 await page.goto("/");
 await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
 const originalScrollY = await page.evaluate(() => window.scrollY);
 expect(originalScrollY).toBeGreaterThan(300);

 const overlay = page.locator(".sg-entry-overlay");
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1Service/ }).click();
 await expect(overlay).toHaveAttribute("data-guard-entry", "closing");
 expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

 // The old page must remain at precisely the same scroll position as glass closes.
 await page.waitForTimeout(350);
 expect(await page.evaluate(() => window.scrollY)).toBe(originalScrollY);

 // Once sealed, the underlay is opaque, so route replacement cannot show through.
 await expect(overlay).toHaveAttribute("data-guard-entry", "sealed", { timeout: 4000 });
 expect(await overlay.evaluate(node => getComputedStyle(node).backgroundColor)).toBe("rgb(25, 33, 39)");

 await expect(page).toHaveURL(/\\/service$/);
 await expect(overlay).toHaveAttribute("data-guard-entry", "opening", { timeout: 7000 });
 // The destination must already be landed at the top BEFORE glass opens.
 expect(await page.evaluate(() => window.scrollY)).toBe(0);
 await expect(overlay).toHaveAttribute("data-guard-entry", "idle", { timeout: 7000 });
 expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
});
