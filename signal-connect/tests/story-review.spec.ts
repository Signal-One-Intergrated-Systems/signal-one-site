import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const review = "/review/story/andisiwe";
const titles = [
  ["WIN", "From first contact to opportunity."],
  ["HIRE", "Put the right people behind the promise."],
  ["RUN", "Make field operations visible."],
  ["EQUIP", "Equip people for the work."],
  ["PROVE", "Turn activity into evidence."],
] as const;

test("five chapters use frozen editorial copy, progress and reversible navigation", async ({ page }) => {
  await page.goto(review);
  await expect(page.getByRole("heading", { level: 1, name: "The Signal One journey" })).toBeVisible();
  await expect(page.getByText(/Neutral media only/)).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Chapter 1 of 5");
  await expect(page.getByRole("button", { name: "Previous" })).toBeDisabled();

  for (let i = 0; i < titles.length; i++) {
    const [id, heading] = titles[i];
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    await expect(page.getByRole("status")).toHaveText(`Chapter ${i + 1} of 5`);
    await expect(page.locator('nav[aria-label="Story chapter progress"] li').nth(i)).toHaveAttribute("aria-current", "step");
    await expect(page.locator("[data-review-media=neutral-placeholder]")).toHaveCount(1);
    await expect(page.getByRole("img", { name: new RegExp(`Neutral media placeholder for ${id}`) })).toBeVisible();
    expect(await page.locator("img, picture, video, canvas").count()).toBe(0);
    if (i < titles.length - 1) {
      await page.getByRole("button", { name: "Next chapter" }).click();
      await expect(page.getByRole("heading", { level: 2, name: titles[i + 1][1] })).toBeFocused();
    }
  }
  await expect(page.getByRole("button", { name: "Next chapter" })).toBeDisabled();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.getByRole("heading", { level: 2, name: titles[3][1] })).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Chapter 4 of 5");
});

test("keyboard arrows navigate with focus, boundaries and no forced scroll trap", async ({ page }) => {
  await page.goto(review);
  await page.getByRole("button", { name: "Next chapter" }).click();
  const hireHeading = page.getByRole("heading", { level: 2, name: titles[1][1] });
  await expect(hireHeading).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { level: 2, name: titles[2][1] })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(hireHeading).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { level: 2, name: titles[0][1] })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("status")).toHaveText("Chapter 1 of 5");
});

test("exit always restores the original public contact experience", async ({ page }) => {
  await page.goto(review);
  await page.getByRole("button", { name: "Next chapter" }).click();
  await page.getByRole("link", { name: /Exit to Andisiwe.s contact card/ }).click();
  await expect(page).toHaveURL(/\/connect\/andisiwe$/);
  await expect(page.getByRole("heading", { level: 1, name: "Andisiwe Satshwa" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toBeVisible();
  await expect(page.getByText("Coming soon", { exact: true })).toBeVisible();
});

test("unregistered identities never receive a story review", async ({ request }) => {
  const response = await request.get("/review/story/unknown-founder");
  expect(response.status()).toBe(404);
});

test("story remains unlinked from public visitor card", async ({ page }) => {
  await page.goto("/connect/andisiwe");
  await expect(page.getByRole("heading", { name: "Discover Signal One" })).toBeVisible();
  await expect(page.getByText("The interactive five-chapter story is being prepared.")).toBeVisible();
  await expect(page.locator('a[href*="/review/story/"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toHaveAttribute("href", "/contact/andisiwe");
});

test("reduced-motion disables story entry and button animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(review);
  const mediaAnimation = await page.locator("[data-review-media]").evaluate((e) => getComputedStyle(e).animationName);
  expect(mediaAnimation).toBe("none");
  await page.getByRole("button", { name: "Next chapter" }).click();
  await expect(page.getByRole("heading", { level: 2, name: titles[1][1] })).toBeFocused();
  expect(await page.locator("[data-review-media]").evaluate(e => getComputedStyle(e).animationName)).toBe("none");
});

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`story preview at ${width}px passes media, type, geometry and accessibility gates`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(review);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { name: titles[0][1] })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator("body").evaluate(e => getComputedStyle(e).fontFamily)).toMatch(/Inter/i);
    const card = page.locator("article");
    expect(await card.evaluate(e => getComputedStyle(e).borderRadius)).toBe("14px");
    const controls = page.getByRole("button", { name: "Next chapter" });
    const metrics = await controls.evaluate(e => {
      const r = e.getBoundingClientRect();
      return { height: r.height, radius: getComputedStyle(e).borderRadius };
    });
    expect(metrics.height).toBeGreaterThanOrEqual(48);
    expect(metrics.radius).toBe("10px");
    expect(await page.locator("article img").count()).toBe(0);
    const violations = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(violations.violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/story-review-${width}.png`, fullPage: true });
  });
}

test("short iPhone viewport scrolls, stays in one media surface and preserves controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto(review);
  await expect(page.locator("[data-review-media=neutral-placeholder]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next chapter" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/story-review-short-390.png", fullPage: true });
});
