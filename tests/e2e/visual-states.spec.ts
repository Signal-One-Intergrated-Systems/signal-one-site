import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fillVisible, hydrated } from "./helpers";

const evidence = process.env.VISUAL_AUDIT_DIR;
test.skip(!evidence, "Opt-in visual review of every form step and interaction state.");
test.use({ reducedMotion: "reduce" });

for (const width of [375, 768, 1440]) {
  for (const route of ["/get-started", "/guards/join", "/join/sales"]) {
    test(`journey states ${width} ${route}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const folder = path.join(evidence!, "states", String(width));
      await fs.mkdir(folder, { recursive: true });
      const slug = route.slice(1).replaceAll("/", "--");
      if (route === "/guards/join") await page.getByRole("button", { name: "Start my profile" }).click();
      await hydrated(page);
      for (let step = 1; step <= 12; step++) {
        const form = page.locator("main form").first();
        if (!(await form.count())) break;
        await form.scrollIntoViewIfNeeded();
        await form.screenshot({ path: path.join(folder, `${slug}-${String(step).padStart(2, "0")}.png`), animations: "disabled", style: "header { visibility: hidden !important; }" });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        await fillVisible(page, "main form");
        const submit = form.locator("button[type=submit]");
        const label = await submit.innerText();
        const heading = await form.locator("h1,h2,h3").first().innerText();
        await submit.click();
        if (/^(Send|Submit)/i.test(label)) {
          await expect(form.locator('a[href^="mailto:"][href*="subject="]')).toBeVisible();
          await form.screenshot({ path: path.join(folder, `${slug}-email-fallback.png`), animations: "disabled", style: "header { visibility: hidden !important; }" });
          return;
        }
        await expect(form.locator("h1,h2,h3").first()).not.toHaveText(heading);
      }
      throw new Error("Journey did not reach its review and email fallback state");
    });
  }
  test(`equipment variants and menu ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const folder = path.join(evidence!, "states", String(width));
    await fs.mkdir(folder, { recursive: true });
    await page.goto("/radios-equipment#quote");
    await hydrated(page);
    for (const choice of ["Buy radios", "Rent radios", "Compare buying and renting"]) {
      await page.getByLabel("Buy or rent?").selectOption(choice);
      await page.locator("main form").screenshot({ path: path.join(folder, `equipment-${choice.replaceAll(" ", "-")}.png`), animations: "disabled", style: "header { visibility: hidden !important; }" });
    }
    for (const category of ["Tracking", "Body cameras"]) {
      await page.getByRole("radio", { name: category, exact: true }).check();
      await page.locator("main form").screenshot({ path: path.join(folder, `equipment-${category.replaceAll(" ", "-")}.png`), animations: "disabled", style: "header { visibility: hidden !important; }" });
    }
    if (width < 1280) {
      await page.locator('button[aria-controls="mobile-nav"]').click();
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.screenshot({ path: path.join(folder, "menu-open.png") });
    }
  });
}
