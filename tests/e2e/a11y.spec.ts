import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./routes";

for (const width of [390, 1440]) {
  test.describe(`axe at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const route of routes) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        const results = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
        const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(
          bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`),
        ).toEqual([]);
      });
    }
  });
}
