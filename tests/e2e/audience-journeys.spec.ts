import { expect, test } from "@playwright/test";

test("homepage introduces purchasable journeys and clearly labels 1Community", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Run the business/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore 1GUARD/ })).toHaveAttribute("href", "/solutions/security");
  await expect(page.getByRole("link", { name: /Explore 1Service/ })).toHaveAttribute("href", "/service");
  await expect(page.getByRole("link", { name: /Explore equipment/ })).toHaveAttribute("href", "/equipment-marketplace");
  await expect(page.getByText(/1Community is part of the future/)).toBeVisible();
  await expect(page.getByText(/1Community is part of the future/)).toBeVisible();
  await expect(page.locator(".s1-nav-upcoming")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Get 14 Day Free Trial/ })).toHaveAttribute("href", "/get-started");
});

test("site pill stays usable on a phone and does not offer 1Community as a live route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.locator(".s1-mobile-upcoming")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: /1Service/ })).toHaveAttribute("href", "/service");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
