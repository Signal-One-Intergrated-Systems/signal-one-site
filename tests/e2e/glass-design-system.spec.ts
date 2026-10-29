import { expect, test } from "@playwright/test";

const routes = ["/", "/service", "/solutions/security", "/equipment-marketplace", "/contact", "/guard-marketplace"];

for (const path of routes) {
  test(`marketing shell and layout do not overflow at ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const nav = page.locator("header.glass-nav > .wrap");
    await expect(nav).toBeVisible();
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      navTop: document.querySelector("header.glass-nav")?.getBoundingClientRect().top,
      navWidth: document.querySelector("header.glass-nav > .wrap")?.getBoundingClientRect().width,
    }));
    expect(metrics.overflow).toBe(false);
    expect(metrics.navWidth).toBeLessThanOrEqual(390);
    expect(metrics.navTop).toBeGreaterThanOrEqual(-80);
  });
}

test("contact retains accessible fields and receives the unified light glass treatment", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByLabel("Your name")).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await expect(page.locator("select").first()).toBeVisible();
  const background = await page.locator("main").evaluate(el => getComputedStyle(el).backgroundImage);
  expect(background).toContain("gradient");
});

test("desktop product routes preserve brand and do not offer 1Community as live product", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/service");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1GUARD/ })).toBeVisible();
  await expect(page.locator(".s1-nav-upcoming")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Request a walkthrough/ }).first()).toHaveAttribute("href", "/contact");
});
