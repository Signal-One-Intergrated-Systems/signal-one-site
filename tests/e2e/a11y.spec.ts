import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./routes";

for (const width of [390, 1440]) {
  test.describe(`axe at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    for (const route of routes) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        // Include the complete rendered page, including lazy manufacturer images.
        // Measure after image loading completes so lower sections have their
        // final layout, rather than sampling during loading and repositioning.
        for (const image of await page.locator("main img").all()) {
          if (!(await image.isVisible())) continue;
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        const results = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
        const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(
          bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => `${n.target.join(" ")}: ${n.failureSummary}`).join(" | ")}`),
        ).toEqual([]);
      });
    }
  });
}
