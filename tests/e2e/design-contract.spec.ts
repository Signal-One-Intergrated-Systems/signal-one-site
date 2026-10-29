import { expect, test } from "@playwright/test";

/** Rendered design-contract checks across the actual marketing shell. */
test("official header lockup respects its size and stays clear of the menu", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const brand = page.locator('header a[aria-label*="home"]').first();
    await expect(brand).toBeVisible();
    const checks = await page.evaluate(() => {
      const header = document.querySelector("header.glass-nav")!;
      const link = header.querySelector('a[aria-label*="home"]')!;
      const logo = [...link.querySelectorAll(".s1-mark")].find(n => n.getBoundingClientRect().width > 0);
      const descriptor = [...link.querySelectorAll("span")].find(n => n.textContent?.trim() === "INTEGRATED SYSTEMS" && n.getBoundingClientRect().width > 0);
      const menu = header.querySelector('button[aria-controls="mobile-nav"]');
      const rect = link.getBoundingClientRect();
      const menuRect = menu?.getBoundingClientRect();
      const desktopNav = header.querySelector('nav[aria-label="Primary"]');
      const navLink = desktopNav?.querySelector("a");
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        markWidth: logo?.getBoundingClientRect().width ?? 0,
        descriptorSize: descriptor ? parseFloat(getComputedStyle(descriptor).fontSize) : null,
        overlap: menu && getComputedStyle(menu).display !== "none" && menuRect ? rect.right > menuRect.left + 1 : false,
        navSize: navLink && getComputedStyle(desktopNav!).display !== "none" ? parseFloat(getComputedStyle(navLink).fontSize) : null,
      };
    });
    expect(checks.overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(checks.overlap, `brand clashes with menu at ${width}px`).toBe(false);
    expect(checks.markWidth).toBeGreaterThanOrEqual(20);
    if (checks.descriptorSize !== null) expect(checks.descriptorSize).toBeGreaterThanOrEqual(10);
    if (checks.navSize !== null) expect(checks.navSize).toBeGreaterThanOrEqual(14);
  }
});

test("marketing form has the canonical 3px keyboard focus and readable controls", async ({ page }) => {
  await page.goto("/get-started");
  const field = page.getByRole("textbox", { name: "Company name" });
  await expect(field).toBeVisible();
  await field.focus();
  const metrics = await field.evaluate(node => ({
    outlineWidth: getComputedStyle(node).outlineWidth,
    height: node.getBoundingClientRect().height,
    fontSize: parseFloat(getComputedStyle(node).fontSize),
  }));
  expect(metrics.outlineWidth).toBe("3px");
  expect(metrics.height).toBeGreaterThanOrEqual(52);
  expect(metrics.fontSize).toBeGreaterThanOrEqual(16);
});
