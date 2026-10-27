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
    await expect(page.getByRole("link",{name:/Save.*contact/i})).toHaveCount(0);
    await expect(page.getByRole("heading",{name:"Let’s connect."})).toBeVisible();
    await expect(page.locator("form,input,textarea")).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator("body").evaluate(el=>getComputedStyle(el).fontFamily)).toMatch(/Inter/i);
    await page.screenshot({ path: `connect-test-results/visitor-${width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(axe.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("unarmed exchange has no data collection, misleading controls or vCard bypass",async({page,request})=>{
  await page.goto("/connect/andisiwe");
  await expect(page.locator("form,input,textarea")).toHaveCount(0);
  await expect(page.getByRole("link",{name:/Save.*contact/i})).toHaveCount(0);
  await expect(page.getByText(/locked|unlock|padlock/i)).toHaveCount(0);
  for(const suffix of ["","?scope=platform","?persisted=true"])expect((await request.get("/contact/andisiwe"+suffix)).status()).toBe(403);
  expect((await request.get("/contact/unknown")).status()).toBe(404);
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
  const introduction = await page.getByRole("heading", { name: "Let’s connect." }).boundingBox();
  expect(introduction!.y + introduction!.height).toBeLessThanOrEqual(844);
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
