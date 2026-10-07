import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { routes } from "./routes";

test.describe("no horizontal scroll at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const route of routes) {
    test(route, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test("branding check passes on rendered HTML", () => {
  const out = execFileSync("node", ["scripts/check-branding.mjs", "--built"], { encoding: "utf8" });
  expect(out).toContain("passed");
});

test("rendered pages never show forbidden wording", async ({ request }) => {
  const forbidden = [/\bLEOS\b/, /shared[\s-]+phones?/i, /\bVerified\b/, /\b(Starter|Enterprise)\b/];
  for (const route of routes) {
    const html = (await (await request.get(route)).text()).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
    const text = html.replace(/<[^>]+>/g, " ");
    for (const pattern of forbidden) expect(text, `${route} ${pattern}`).not.toMatch(pattern);
  }
});

test("SOS is never described as offline or queued", async ({ request }) => {
  for (const route of routes) {
    const html = (await (await request.get(route)).text()).replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
    const text = html.replace(/<[^>]+>/g, " ");
    expect(text, route).not.toMatch(/SOS[^.]*(offline|queue)/i);
  }
});
