import { expect, test } from "@playwright/test";

test("homepage introduces purchasable journeys and clearly labels 1Community", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Run your business/ })).toBeVisible();
  // The approved page offers each product from the hero bar, the section wordmark and the section action:
  // every link carrying the name must lead to that product.
  for (const [name, href] of [[/Explore 1GUARD/, "/solutions/security"], [/Explore 1Service/, "/service"], [/Explore equipment/, "/equipment-marketplace"]] as const) {
    const links = await page.getByRole("link", { name }).all();
    expect(links.length, String(name)).toBeGreaterThanOrEqual(1);
    for (const link of links) await expect(link).toHaveAttribute("href", href);
  }
  await expect(page.getByText(/1Community is part of the future/)).toBeVisible();
  await expect(page.getByText(/1Community is part of the future/)).toBeVisible();
  await expect(page.locator(".s1-nav-upcoming")).toHaveCount(0);
  const trialLinks = await page.getByRole("link", { name: /Get 14 Day Free Trial/ }).all();
  expect(trialLinks.length).toBeGreaterThanOrEqual(1);
  for (const link of trialLinks) await expect(link).toHaveAttribute("href", "/get-started");
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
