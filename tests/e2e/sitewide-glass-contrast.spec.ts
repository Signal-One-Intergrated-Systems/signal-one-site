import { expect, test } from "@playwright/test";

const routes = [
  "/get-started", "/contact", "/workforce", "/solutions/security",
  "/guard-marketplace", "/equipment-marketplace", "/pricing",
  "/guards", "/guards/join", "/security-trust",
];

for (const route of routes) {
  test(`dark-glass UI has readable page surface and no mobile overflow at ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      background: getComputedStyle(document.querySelector("main")!).backgroundImage,
    }));
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.background).toContain("gradient");
  });
}

test("company-registration form renders high-contrast labels and dark inputs", async ({ page }) => {
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
  expect(colors.label).toBe("rgb(242, 250, 255)");
  expect(colors.input).not.toBe("rgb(255, 255, 255)");
});
