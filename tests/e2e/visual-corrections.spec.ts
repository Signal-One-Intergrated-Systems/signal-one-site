import { expect, test } from "@playwright/test";
import { decodeMailto, fillVisible, hydrated, OK_BASE } from "./helpers";

// These are measured foreground/background ratios, not checks for a gradient.
for (const route of ["/popia", "/privacy", "/terms", "/security-trust"]) {
  test(`legal text and navigation meet AA contrast: ${route}`, async ({ page }) => {
    await page.goto(route);
    const ratios = await page.locator("main p, main h1, main h2, main nav a, main .s1-legal-copy, main .s1-legal-note").evaluateAll(elements => {
      const rgb = (color: string) => (color.match(/[\d.]+/g) || []).map(Number);
      const luminance = (color: number[]) => color.slice(0, 3).map(x => x / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((total, x, i) => total + x * [.2126, .7152, .0722][i], 0);
      return elements.filter(el => el.checkVisibility()).map(el => {
        const style = getComputedStyle(el);
        let node: Element | null = el;
        let background: number[] = [];
        while (node) {
          const current = getComputedStyle(node);
          const candidate = rgb(current.backgroundColor);
          if (candidate.length === 3 || candidate[3] === 1) { background = candidate; break; }
          node = node.parentElement;
        }
        const fg = luminance(rgb(style.color)), bg = luminance(background);
        return { text: el.textContent?.trim().slice(0, 60), ratio: (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05), background };
      });
    });
    expect(ratios.length).toBeGreaterThan(8);
    expect(ratios.filter(item => item.background.length === 0 || item.ratio < 4.5)).toEqual([]);
  });
}

for (const width of [375, 768, 1440]) {
  test(`all four service scenes retain the complete photograph at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/service");
    const photos = page.locator(".s1-service-capability img");
    await expect(photos).toHaveCount(4);
    for (const photo of await photos.all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const geometry = await photo.evaluate(el => ({ fit: getComputedStyle(el).objectFit, width: el.clientWidth, height: el.clientHeight }));
      expect(geometry.fit).toBe("contain");
      expect(geometry.width / geometry.height).toBeCloseTo(16 / 9, 1);
    }
  });
}

for (const width of [375, 768, 1100]) {
  test(`menu opens, traps focus, closes and unlocks scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/service");
    await hydrated(page, "header button");
    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.click();
    const menu = page.locator("#mobile-nav");
    await expect(menu).toBeVisible();
    const links = menu.locator("a");
    await links.last().focus();
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(links.last()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    await toggle.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(menu).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  });
}

test("purchase requests exclude a previous rental term and retain the selected model", async ({ page }) => {
  await page.goto("/radios-equipment?category=radio&product=Hytera%20PNC360S#quote");
  await hydrated(page);
  await expect(page.getByLabel("Radio", { exact: true })).toHaveValue("Hytera PNC360S");
  await page.getByLabel("Buy or rent?").selectOption("Rent radios");
  await page.getByRole("radio", { name: "24 months" }).check();
  await page.getByLabel("Buy or rent?").selectOption("Buy radios");
  await expect(page.getByRole("group", { name: "Rental term" })).toHaveCount(0);
  await fillVisible(page, "main form");
  await page.getByRole("button", { name: "Request a quote", exact: true }).click();
  const fallback = page.locator('main form a[href^="mailto:"][href*="subject="]');
  await expect(fallback).toBeVisible();
  const mail = decodeMailto((await fallback.getAttribute("href"))!);
  expect(mail.body).toContain("Buy radios");
  expect(mail.body).toContain("Hytera PNC360S");
  expect(mail.body).not.toContain("24 months");
  expect(mail.subject).not.toContain("rental");
});

test("product-specific quote links select the correct category and model", async ({ page }) => {
  await page.goto("/radios-equipment");
  await page.getByRole("link", { name: /Request a quote for FMC920/ }).click();
  await expect(page.getByRole("radio", { name: "Tracking", exact: true })).toBeChecked();
  await expect(page.getByLabel("Tracker", { exact: true })).toHaveValue("FMC920");
  await page.getByRole("link", { name: /Request a quote for SC780/ }).click();
  await expect(page.getByRole("radio", { name: "Body cameras", exact: true })).toBeChecked();
  await expect(page.getByLabel("How many cameras?")).toBeVisible();
});

test("radio purchase succeeds with the existing consultation receiver contract", async ({ page }) => {
  await page.goto(OK_BASE + "/radios-equipment?quoteType=Buy%20radios#quote");
  await hydrated(page);
  await fillVisible(page, "main form");
  const request = page.waitForRequest(req => req.url().endsWith("/api/intake") && req.method() === "POST");
  await page.getByRole("button", { name: "Request a quote", exact: true }).click();
  const payload = (await request).postDataJSON();
  expect(payload.data.intent).toBe("consultation");
  expect(payload.data.quoteType).toBe("Buy radios");
  await expect(page.getByText("Quote request received", { exact: true })).toBeVisible();
});
