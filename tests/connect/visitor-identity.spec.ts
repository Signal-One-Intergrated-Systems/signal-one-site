import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`visitor identity card ${width}px is readable, branded and accessible`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/connect/andisiwe");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole("heading", { level: 1, name: "Andisiwe Satshwa" })).toBeVisible();
    await expect(page.getByText("Founder", { exact: true })).toBeVisible();
    await expect(page.getByText("Signal One Integrated Systems", { exact: true }).first()).toBeVisible();
    const save = page.getByRole("link", { name: "Save Andisiwe’s contact" });
    await expect(save).toBeVisible();
    await expect(save).toHaveAttribute("href", "/contact/andisiwe");
    await expect(page.getByRole("heading", { name: "Discover Signal One" })).toBeVisible();
    await expect(page.getByText("Coming soon", { exact: true })).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Share my details/i })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator("body").evaluate(el => getComputedStyle(el).fontFamily)).toMatch(/Inter/i);
    const dimensions = await save.evaluate(el => {
      const box = el.getBoundingClientRect();
      return { height: box.height, width: box.width, radius: getComputedStyle(el).borderRadius };
    });
    expect(dimensions.height).toBeGreaterThanOrEqual(48);
    expect(dimensions.radius).toBe("10px");
    await page.screenshot({ path: `connect-test-results/visitor-${width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(axe.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("visitor can save a real vCard without story, email or login", async ({ page, request }) => {
  await page.goto("/connect/andisiwe");
  const contact = page.getByRole("link", { name: "Save Andisiwe’s contact" });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    contact.click(),
  ]);
  expect(download.suggestedFilename()).toBe("andisiwe.vcf");
  const response = await request.get("/contact/andisiwe");
  expect(response.status()).toBe(200);
  const vcf = await response.text();
  expect(vcf).toContain("FN:Andisiwe Satshwa\r\n");
  expect(vcf).toContain("TITLE:Founder\r\n");
  expect(vcf).toContain("TEL;TYPE=CELL:+27606335870");
  expect(vcf).toContain("TEL;TYPE=WORK,VOICE:+27100231810");
  expect(vcf).toContain("EMAIL;TYPE=WORK:andisiwe@signalone.co.za");
  expect(await page.locator("form").count()).toBe(0);
});

test("email introduction opens only after visitor opts in; no automatic send", async ({ page }) => {
  await page.goto("/connect/andisiwe");
  const share = page.getByRole("button", { name: /Share my details/i });
  await expect(share).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("form")).toHaveCount(0);
  await share.click();
  await expect(share).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("heading", { name: "Introduce yourself" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Prepare email" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open email app" })).toHaveCount(0);
  await expect(page.getByText(/Nothing is sent automatically/)).toBeVisible();
});

test("story is accurately marked unavailable rather than a fake CTA", async ({ page }) => {
  await page.goto("/connect/andisiwe");
  const heading = page.getByRole("heading", { name: "Discover Signal One" });
  await expect(heading).toBeVisible();
  await expect(page.getByText("The interactive five-chapter story is being prepared.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Visit Signal One/i })).toHaveAttribute("href", "https://signalone.co.za");
  await expect(page.getByRole("link", { name: /Discover Signal One/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Discover Signal One/i })).toHaveCount(0);
});

test("contact saving is visible above fold on an iPhone-sized screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/connect/andisiwe");
  const save = page.getByRole("link", { name: "Save Andisiwe’s contact" });
  const box = await save.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThan(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
});

test("short viewport scrolls naturally without losing contact action", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto("/connect/andisiwe");
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "connect-test-results/visitor-short-390.png", fullPage: true });
});

test("unknown profile fails closed and no personal data form is introduced", async ({ page, request }) => {
  expect((await request.get("/connect/missing")).status()).toBe(404);
  await page.goto("/connect/andisiwe");
  await expect(page.getByText("Viewing this card does not submit your contact details or create a lead.")).toBeVisible();
  await expect(page.locator("input, textarea, form")).toHaveCount(0);
});

test("recipient sees a compact physical-card composition with small black-and-white portrait", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/connect/andisiwe");
  const card = page.locator('section[aria-label="Andisiwe Satshwa digital business card"]');
  await expect(card).toBeVisible();
  await expect(card.getByRole("heading", { level: 1, name: "Andisiwe Satshwa" })).toBeVisible();
  const photo = card.getByRole("img", { name: "Black-and-white portrait of Andisiwe Satshwa" });
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const photoBox = await photo.boundingBox();
  expect(photoBox!.width).toBeLessThanOrEqual(110);
  const bounds = await card.boundingBox();
  expect(bounds!.height).toBeLessThanOrEqual(410);
  const saveBounds = await page.getByRole("link", { name: "Save Andisiwe’s contact" }).boundingBox();
  expect(saveBounds!.y + saveBounds!.height).toBeLessThanOrEqual(844);
  const media = await request.get("/connect-assets/andisiwe-bw.webp");
  expect(media.status()).toBe(200);
  expect(media.headers()["content-type"]).toContain("image/webp");
  expect((await media.body()).length).toBeLessThan(12000);
});

test("email WhatsApp and office telephone are actionable; CTA affordances read as buttons", async ({ page }) => {
  await page.goto("/connect/andisiwe");
  const card = page.locator('section[aria-label="Andisiwe Satshwa digital business card"]');
  await expect(card.getByRole("link", { name: /andisiwe@signalone.co.za/i })).toHaveAttribute("href", "mailto:andisiwe@signalone.co.za");
  await expect(card.getByRole("link", { name: /060 633 5870/ })).toHaveAttribute("href", "https://wa.me/27606335870");
  await expect(card.getByRole("link", { name: /010 023 1810/ })).toHaveAttribute("href", "tel:+27100231810");
  await expect(page.getByRole("link", { name: /^Call/i })).toHaveAttribute("href", "tel:+27100231810");
  await expect(page.getByRole("link", { name: /^WhatsApp/i }).last()).toHaveAttribute("href", "https://wa.me/27606335870");
  for (const control of [page.getByRole("link", { name: "Save Andisiwe’s contact" }), page.getByRole("button", { name: /Share my details/i })]) {
    const m = await control.evaluate(el => ({ cursor:getComputedStyle(el).cursor, height:el.getBoundingClientRect().height, radius:getComputedStyle(el).borderRadius }));
    expect(m.cursor).toBe("pointer");
    expect(m.height).toBeGreaterThanOrEqual(48);
    expect(m.radius).toBe("10px");
  }
});

for (const width of [320, 360, 390]) {
  test(`contact email stays readable on narrow ${width}px viewports`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/connect/andisiwe");
    await page.evaluate(() => document.fonts.ready);
    const email = page.getByText("andisiwe@signalone.co.za", { exact: true });
    const lines = await email.evaluate(el => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return [...range.getClientRects()].filter(rect => rect.width > 0).length;
    });
    expect(lines).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("WhatsApp label and phone number never overlap on standard mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/connect/andisiwe");
  const row = page.locator('section[aria-label="Andisiwe Satshwa digital business card"] a[href="https://wa.me/27606335870"]');
  const label = await row.locator("span").nth(0).boundingBox();
  const value = await row.locator("span").nth(1).boundingBox();
  expect(label).not.toBeNull();
  expect(value).not.toBeNull();
  expect(label!.x + label!.width + 3).toBeLessThanOrEqual(value!.x);
});
