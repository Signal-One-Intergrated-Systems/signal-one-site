import { expect, test } from "@playwright/test";

const routes = [
  "/get-started", "/contact", "/service", "/solutions/security",
  "/guard-marketplace", "/equipment-marketplace", "/pricing",
  "/guards", "/guards/join", "/security-trust",
];

for (const route of routes) {
  test(`page surface has no mobile overflow at ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      background: getComputedStyle(document.querySelector("main")!).backgroundColor,
      backgroundImage: getComputedStyle(document.querySelector("main")!).backgroundImage,
    }));
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.backgroundImage !== "none" || metrics.background !== "rgba(0, 0, 0, 0)").toBe(true);
  });
}

test("company-registration form renders high-contrast labels and light inputs", async ({ page }) => {
  await page.goto("/get-started");
  const label = page.getByText("Company name", { exact: true }).first();
  const field = page.getByRole("textbox", { name: "Company name" });
  await expect(label).toBeVisible();
  await expect(field).toBeVisible();
  const colors = await page.evaluate(() => {
    const label = document.querySelector(".s1-onboarding .field-label")!;
    const input = document.querySelector(".s1-onboarding .field-input")!;
    return { label: getComputedStyle(label).color, input: getComputedStyle(input).backgroundColor };
  });
  // Light-first (founder, 2026-11-26): labels use the ink role (#18242d) on a white field surface, 15.8:1.
  expect(colors.label).toBe("rgb(24, 36, 45)");
  expect(colors.input).toBe("rgb(255, 255, 255)");
});
