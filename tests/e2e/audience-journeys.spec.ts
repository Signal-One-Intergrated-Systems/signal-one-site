import { expect, test } from "@playwright/test";

test("homepage routes each visitor to an accurate next step", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Find your place in Signal One." });
  await expect(section).toBeVisible();
  const destinations = [
    ["Start company onboarding", "/get-started"],
    ["Explore 1Workforce", "/workforce"],
    ["Create a guard profile", "/guards/join"],
    ["Explore equipment", "/equipment-marketplace"],
    ["View sales opportunities", "/join/sales"],
  ] as const;
  for (const [label, destination] of destinations) {
    await expect(section.getByRole("link", { name: label })).toHaveAttribute("href", destination);
  }
  await expect(section.getByText(/Marketplace matching is still in development/)).toBeVisible();
  await expect(section.getByText(/Sales OS is reserved for Signal One representatives/)).toBeVisible();
});

test("visitor journeys stay usable at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Start company onboarding" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
