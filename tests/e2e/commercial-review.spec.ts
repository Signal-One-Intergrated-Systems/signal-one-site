import { expect, test } from "@playwright/test";
import { leadJourney } from "../../app/lib/analytics";
import { routes } from "./routes";

// Independent commercial review, 2026-11-26: contact channels, trial wording, social metadata,
// canonical host, measurable journeys and verified equipment specifications.

const OLD_WHATSAPP = /60\s?633\s?5870|27606335870/;

test("approved contact channels appear on About, Support, Contact and the footer; the old number nowhere", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const html = await page.content();
    expect(html, `${route} still carries the retired WhatsApp number`).not.toMatch(OLD_WHATSAPP);
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "+27 77 484 4280" })).toHaveAttribute("href", "https://wa.me/27774844280");
    await expect(footer.getByRole("link", { name: "support@signalone.co.za" })).toHaveAttribute("href", "mailto:support@signalone.co.za");
    await expect(footer.getByRole("link", { name: "sales@signalone.co.za" })).toHaveAttribute("href", "mailto:sales@signalone.co.za");
  }
  for (const route of ["/about", "/support", "/contact"]) {
    await page.goto(route);
    await expect(page.locator("main").getByText("+27 77 484 4280").first(), route).toBeVisible();
    await expect(page.locator("main").getByText("support@signalone.co.za").first(), route).toBeVisible();
  }
});

test("footer email addresses survive Cloudflare email obfuscation (no-JS readable)", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('<!--email_off--><a href="mailto:sales@signalone.co.za"');
  expect(html).toContain('<!--email_off--><a href="mailto:support@signalone.co.za"');
});

test("trial calls to action say it is a request, never an instant free trial", async ({ page }) => {
  for (const route of ["/", "/pricing", "/solutions/security", "/get-started"]) {
    await page.goto(route);
    await expect(page.getByText(/get 14 day free trial/i)).toHaveCount(0);
  }
  await page.goto("/get-started");
  const steps = page.getByRole("list", { name: "How a 1GUARD trial works" });
  await expect(steps).toContainText("Nothing is activated and nothing is charged");
  await expect(steps).toContainText("start when your first guard clocks in");
  await expect(steps).toContainText("nothing is charged automatically");
});

test("homepage hero offers both current journeys and the header links to pricing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const actions = page.locator(".so-hero-actions");
  await expect(actions.getByRole("link", { name: /Request a 14-day trial/ })).toHaveAttribute("href", "/get-started");
  await expect(actions.getByRole("link", { name: /Radios & connectivity/ })).toHaveAttribute("href", "/radios-equipment");
  await expect(page.locator(".so-hero-lead")).toContainText("managed business communications");
  await expect(page.getByRole("banner").getByRole("link", { name: "Pricing", exact: true })).toHaveAttribute("href", "/pricing");
});

test("every route has its own Open Graph title, description and URL matching its canonical; no doubled brand", async ({ page }) => {
  const ogTitles = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    expect(title, `${route} repeats the brand`).not.toMatch(/Signal One.*\|\s*Signal One/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    const ogTitle = (await page.locator('meta[property="og:title"]').getAttribute("content")) || "";
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute("content");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(ogUrl, `${route} og:url`).toBe(canonical);
    expect(new URL(canonical!).pathname.replace(/\/$/, "") || "/", `${route} canonical path`).toBe(route);
    expect(ogTitle, `${route} og:title`).toBe(title);
    expect(ogDescription, `${route} og:description`).toBe(description);
    expect(ogTitles.has(ogTitle), `duplicate og:title ${ogTitle}`).toBe(false);
    ogTitles.add(ogTitle);
    expect(await page.locator('meta[property="og:image"]').count(), `${route} og:image`).toBeGreaterThan(0);
  }
});

test("a missing page is a true 404 with no canonical and noindex", async ({ request, page }) => {
  const response = await request.get("/this-page-does-not-exist");
  expect(response.status()).toBe(404);
  await page.goto("/this-page-does-not-exist");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  expect(await page.locator('meta[name="robots"][content*="noindex"]').count()).toBeGreaterThan(0);
});

test("www redirects permanently to the canonical host, keeping path and query", async ({ request }) => {
  const response = await request.get("/pricing?utm_source=test&x=1", { headers: { host: "www.signalone.co.za" }, maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers()["location"]).toBe("https://signalone.co.za/pricing?utm_source=test&x=1");
  const plain = await request.get("/pricing", { maxRedirects: 0 });
  expect(plain.status()).toBe(200);
});

test("radio purchase, radio rental and 1GUARD trial enquiries are measured as separate journeys", () => {
  expect(leadJourney({ intent: "consultation", quoteType: "Buy radios" })).toBe("radio_purchase");
  expect(leadJourney({ intent: "equipment-rental-quote", quoteType: "Rent radios" })).toBe("radio_rental");
  expect(leadJourney({ intent: "consultation", quoteType: "Compare buying and renting" })).toBe("radio_compare");
  expect(leadJourney({ intent: "company-onboarding", nextStep: "Request a 14-day 1GUARD trial (activation subject to confirmation)" })).toBe("guard_trial");
  expect(leadJourney({ intent: "company-onboarding", nextStep: "A walkthrough call" })).toBe("onboarding");
  expect(leadJourney({ intent: "consultation" })).toBe("general_enquiry");
});

test("radio cards show verified manufacturer specifications with their source, and no unverified SOS claim", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/radios-equipment");
  const html = await page.content();
  expect(html).not.toMatch(/PoC radio with SOS|SOS button/);
  const p30 = page.locator("article").filter({ hasText: "P30 Lite PoC" }).first();
  await expect(p30).toContainText("IP54");
  await expect(p30).toContainText("3,300 mAh");
  await expect(p30.getByRole("link", { name: "Hytera South Africa" })).toHaveAttribute("href", "https://hytera.co.za/products/p30-lite");
  const pnc = page.locator("article").filter({ hasText: "Hytera PNC360S" }).first();
  await expect(pnc).toContainText("IP67");
  await expect(pnc).toContainText("4,000 mAh");
});

test("rental page separates the radio, optional connectivity and what the written quote confirms", async ({ page }) => {
  await page.goto("/ptt-radio-rental");
  const main = page.locator("main");
  await expect(main).toContainText("Push-to-talk service, SIM and data are a separate monthly line");
  await expect(main).toContainText("nothing here is included unless your quote says so");
  await expect(main).toContainText("Renting a radio does not yet connect it to 1GUARD");
});

test("the four communications journeys are discoverable and open the right quote", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const home = page.getByRole("list", { name: "Four ways to start" });
  for (const title of ["Buy & Connect", "Managed Fleet Rental", "Already Own Radios", "Help Me Choose"]) await expect(home.getByRole("link", { name: new RegExp(title) })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "Communications", exact: true })).toHaveAttribute("href", "/radios-equipment");
  await page.goto("/radios-equipment");
  const hub = page.locator("#journeys");
  await expect(hub.getByRole("heading", { name: "Already Own Radios" })).toBeVisible();
  await expect(hub).toContainText("Compatibility is never assumed");
  await hub.getByRole("link", { name: /Request an assessment/ }).click();
  await expect(page.getByLabel("What do you need?")).toHaveValue("Connect radios I already own");
  await expect(page.getByLabel("Radio", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("How many radios do you have?")).toBeVisible();
  // Nothing in the offer is priced, called free, or claimed as financed.
  const text = (await page.locator("main").innerText()).toLowerCase();
  expect(text).not.toMatch(/\bfree\b|financ|twelve months connected|r\s?\d+[,.]?\d*\s*(per|\/)\s*(month|radio)/);
});

test("founder-approved commercial rules are stated: guard days, trial, reply time, retention, privacy address", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.locator("main")).toContainText("A guard day is used only when a guard clocks in and out");
  await expect(page.locator("main")).toContainText("never expire while your account is active");
  await page.goto("/contact");
  await expect(page.locator("main")).toContainText("within one business day");
  await page.goto("/privacy");
  await expect(page.locator("main")).toContainText("erased 12 months after our last contact");
  await expect(page.locator("main")).toContainText("privacy@signalone.co.za");
  for (const route of ["/about", "/privacy", "/terms", "/contact"]) {
    await page.goto(route);
    expect(await page.content(), `${route} shows the registered company name`).not.toMatch(/Lancesat/i);
  }
});

test("the EasyTalk E600 is listed with its manufacturer image and supplied specifications, no SOS claim", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/radios-equipment");
  const e600 = page.locator("article").filter({ hasText: "EasyTalk" }).first();
  await expect(e600.getByRole("img", { name: /EasyTalk E600/ })).toBeVisible();
  await expect(e600).toContainText("IP68");
  await expect(e600).toContainText("3,000 mAh");
  await expect(e600).not.toContainText("SOS");
});
