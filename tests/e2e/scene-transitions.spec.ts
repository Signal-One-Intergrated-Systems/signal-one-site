import { expect, test } from "@playwright/test";

test("public routes share a scene shell and product navigation still works", async ({ page }) => {
 await page.goto("/");
 await expect(page.locator(".s1-scene-route")).toBeVisible();
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1Workforce/ }).click();
 await expect(page).toHaveURL(/\/workforce$/);
 await expect(page.locator(".s1-scene-route")).toHaveAttribute("data-scene-route", "/workforce");
 await expect(page.locator("main")).toBeVisible();
});

test("reduced-motion navigation remains immediate and form inputs are accessible", async ({ page }) => {
 await page.emulateMedia({ reducedMotion: "reduce" });
 await page.goto("/get-started");
 await expect(page.getByRole("textbox", { name: "Company name" })).toBeVisible();
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1GUARD/ }).click();
 await expect(page).toHaveURL(/\/solutions\/security$/);
});
