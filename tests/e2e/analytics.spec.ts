import { expect, test, type Page } from "@playwright/test";
import { fillVisible, OK_BASE, walkJourney } from "./helpers";

const all = [
  "hero_product_proof",
  "hero_pricing",
  "guard_pricing_interaction",
  "consultation_start",
  "consultation_complete",
  "marketplace_interest",
  "equipment_quote_start",
  "equipment_quote_complete",
  "client_onboarding_start",
  "client_onboarding_complete",
  "guard_join_start",
  "guard_join_complete",
  "sales_application_start",
  "sales_application_complete",
];

async function record(page: Page) {
  const seen: string[] = [];
  await page.exposeFunction("__rec", (name: string) => seen.push(name));
  await page.addInitScript(() => {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...args: unknown[]) => {
      if (args[0] === "event") (window as unknown as { __rec: (n: string) => void }).__rec(String(args[1]));
    };
  });
  return seen;
}

test("hero buttons fire hero_product_proof and hero_pricing", async ({ page }) => {
  const seen = await record(page);
  await page.goto("/");
  await page.locator('[data-analytics-event="hero_product_proof"]').first().click();
  await expect.poll(() => seen).toContain("hero_product_proof");
  await page.goto("/");
  await page.locator('[data-analytics-event="hero_pricing"]').first().click();
  await expect.poll(() => seen).toContain("hero_pricing");
});

test("calculator fires guard_pricing_interaction", async ({ page }) => {
  const seen = await record(page);
  await page.goto("/pricing");
  await page.locator("#calculator input").first().fill("40");
  await expect.poll(() => seen).toContain("guard_pricing_interaction");
});

test("contact fires consultation_start and consultation_complete", async ({ page }) => {
  const seen = await record(page);
  await page.goto(OK_BASE + "/contact");
  await fillVisible(page, "main form");
  await page.locator("main form button[type=submit]").click();
  await expect.poll(() => seen).toEqual(expect.arrayContaining(["consultation_start", "consultation_complete"]));
});

test("marketplace interest fires marketplace_interest", async ({ page }) => {
  const seen = await record(page);
  await page.goto(OK_BASE + "/guard-marketplace");
  await fillVisible(page, "main form");
  await page.locator("main form button[type=submit]").click();
  await expect.poll(() => seen).toContain("marketplace_interest");
});

test("equipment quote fires start and complete", async ({ page }) => {
  const seen = await record(page);
  await page.goto(OK_BASE + "/radios-equipment");
  await fillVisible(page, "main form");
  await page.locator("main form button[type=submit]").click();
  await expect.poll(() => seen).toEqual(expect.arrayContaining(["equipment_quote_start", "equipment_quote_complete"]));
});

test("client onboarding fires start and complete", async ({ page }) => {
  const seen = await record(page);
  await page.goto(OK_BASE + "/get-started");
  await walkJourney(page);
  await expect.poll(() => seen).toEqual(expect.arrayContaining(["client_onboarding_start", "client_onboarding_complete"]));
});

test("guard join fires start and complete", async ({ page }) => {
  const seen = await record(page);
  await page.goto(OK_BASE + "/guards/join");
  await page.getByRole("button", { name: "Start my profile" }).click();
  await walkJourney(page);
  await expect.poll(() => seen).toEqual(expect.arrayContaining(["guard_join_start", "guard_join_complete"]));
});

test("sales application fires start and complete", async ({ page }) => {
  const seen = await record(page);
  await page.goto(OK_BASE + "/join/sales");
  await walkJourney(page, "#apply");
  await expect.poll(() => seen).toEqual(expect.arrayContaining(["sales_application_start", "sales_application_complete"]));
});

test("the event vocabulary has exactly 14 names", async () => {
  expect(new Set(all).size).toBe(14);
});
