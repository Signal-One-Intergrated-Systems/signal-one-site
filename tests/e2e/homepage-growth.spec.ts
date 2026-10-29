import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`conversion homepage keeps globe, clear product paths and no overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /Run the business/ })).toBeVisible();
    await expect(page.locator(".s1-hero-globe-layer")).toBeAttached();
    await expect(page.locator(".so-hero-media img")).toBeVisible();
    await expect(page.locator(".so-hero-bar")).toBeVisible();
    await expect(page.locator("#service")).toContainText("IN DEVELOPMENT");
    await expect(page.locator("#equipment")).toContainText("Hytera PNC360S");
    await expect(page.locator("#equipment")).toContainText("Teltonika FMB920");
    const trial = page.locator(".so-hero-actions").getByRole("link", { name: /Get 14 Day Free Trial/ });
    await expect(trial).toHaveAttribute("href", "/get-started");
    const state = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const trial = main.querySelector(".so-hero-actions .so-home-cta")!;
      const image = main.querySelector(".so-hero-media img") as HTMLImageElement;
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        height: trial.getBoundingClientRect().height,
        font: getComputedStyle(trial).fontFamily,
        imageLoaded: image.complete && image.naturalWidth > 0,
      };
    });
    expect(state.overflow).toBeLessThanOrEqual(1);
    expect(state.height).toBeGreaterThanOrEqual(48);
    expect(state.font.toLowerCase()).toContain("inter");
    expect(state.imageLoaded).toBe(true);
  });
}

test("1Service is represented as in-development, not as a live restaurant product", async ({ page }) => {
  await page.goto("/service");
  await expect(page.getByRole("heading", { level: 1, name: /1Service/ })).toBeVisible();
  await expect(page.getByText(/In development/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Discuss early access/ })).toHaveAttribute("href", "/contact");
});

test("old 1Workforce route retains a permanent path to the new product", async ({ page }) => {
  await page.goto("/workforce");
  await expect(page).toHaveURL(/\/service$/);
});

test("trial registration is truthful when no delivery service is configured", async ({ page }) => {
  await page.goto("/get-started");
  await expect(page.getByRole("textbox", { name: "Company name" })).toBeVisible();
  await expect(page.getByText("Trial requests are currently handled by email.")).toBeVisible();
  await expect(page.getByRole("radio", { name: "Restaurant or hospitality" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Security services" })).toBeVisible();
});
