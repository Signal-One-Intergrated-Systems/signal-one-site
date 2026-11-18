import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { routes } from "./routes";

// Opt-in evidence collection. A screenshot being saved is not a visual pass:
// every page and section must be reviewed and recorded in the release audit.
const evidence = process.env.VISUAL_AUDIT_DIR;
test.skip(!evidence, "Set VISUAL_AUDIT_DIR to capture the complete visual review.");
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const width of [375, 768, 1440]) {
  for (const route of [...routes, "/visual-audit-missing-page", "/connect/andisiwe", "/present/andisiwe"]) {
    test(`visual evidence ${width} ${route}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main")).toBeVisible();
      // Visit the entire page, including lazy-loaded images, rather than only
      // taking a picture of the initial viewport.
      for (const image of await page.locator("main img").all()) {
        if (await image.isVisible()) {
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        }
      }
      for (const section of await page.locator("main section").all()) {
        if (await section.isVisible()) await section.scrollIntoViewIfNeeded();
      }
      if (await page.locator("footer").count()) await page.locator("footer").scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "--");
      const folder = path.join(evidence!, String(width));
      await fs.mkdir(folder, { recursive: true });
      await page.screenshot({ path: path.join(folder, `${slug}.png`), fullPage: true, animations: "disabled" });
      const inventory = await page.evaluate(() => ({
        url: location.pathname,
        overflow: document.documentElement.scrollWidth - innerWidth,
        images: Array.from(document.querySelectorAll<HTMLImageElement>("main img")).map(el => ({
          src: el.currentSrc, alt: el.alt, natural: [el.naturalWidth, el.naturalHeight],
          box: [el.clientWidth, el.clientHeight], fit: getComputedStyle(el).objectFit, position: getComputedStyle(el).objectPosition,
        })),
        text: Array.from(document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main p,main label,main legend,main a,main button,footer a")).filter(el => el.checkVisibility()).map(el => ({
          tag: el.tagName, text: el.innerText.trim(), color: getComputedStyle(el).color,
          background: getComputedStyle(el).backgroundColor, font: getComputedStyle(el).fontSize,
          weight: getComputedStyle(el).fontWeight, lineHeight: getComputedStyle(el).lineHeight,
          href: el.getAttribute("href"),
        })),
      }));
      await fs.writeFile(path.join(folder, `${slug}.json`), JSON.stringify(inventory, null, 2));
      expect(inventory.overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
    });
  }
}
