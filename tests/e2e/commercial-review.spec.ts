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

test("homepage hero leads with radios, then 1GUARD, and the header links to pricing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const actions = page.locator(".so-hero-actions");
  const links = actions.getByRole("link");
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveText(/Buy or rent radios/);
  await expect(links.nth(0)).toHaveAttribute("href", "/radios-equipment");
  await expect(links.nth(0)).toHaveClass(/so-home-cta/);
  await expect(links.nth(1)).toHaveText(/Explore 1GUARD/);
  await expect(links.nth(1)).toHaveAttribute("href", "/solutions/security");
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
  await page.getByRole("banner").getByRole("button", { name: "Communications" }).click();
  await expect(page.getByRole("banner").getByRole("link", { name: /Radios and push-to-talk/ })).toHaveAttribute("href", "/radios-equipment");
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

test("staging walkthrough fixes hold: catalogue cards, E600 link, Help me choose, 1GUARD pilot and trial CTAs", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/radios-equipment");
  // SW-01: the single body-camera card keeps its text visible beside the image.
  const sc780 = page.locator("article").filter({ hasText: "SC780" }).first();
  const quote = sc780.getByRole("link", { name: /Request a quote/ });
  await expect(quote).toBeVisible();
  const [img, link] = await Promise.all([sc780.locator("img").first().boundingBox(), quote.boundingBox()]);
  expect(link!.x, "the quote link sits outside the image panel").toBeGreaterThanOrEqual(img!.x + img!.width - 1);
  // SW-02: a product without a verified image shows a same-size typographic panel.
  await expect(page.locator("article").filter({ hasText: "P30G Pro" }).first()).toContainText("The exact variant and its photograph are confirmed in your quote");
  // SW-03 + founder 2026-11-27: the E600 is coming soon; its card registers interest, never a quote or order.
  const e600 = page.locator("article").filter({ hasText: "EasyTalk" }).first();
  await expect(e600).toContainText("Coming soon");
  await expect(e600).toContainText("no order, deposit or payment is taken");
  await expect(e600.getByRole("link", { name: /Request a quote/ })).toHaveCount(0);
  await e600.getByRole("link", { name: /Register interest/ }).click();
  await expect(page.getByLabel("Radio", { exact: true })).toHaveValue("EasyTalk E600 (coming soon, register interest)");
  await expect(page.getByText("Not yet available. This registers interest without obligation")).toBeVisible();
  await expect(page.getByRole("radio", { name: "12 months" })).toHaveCount(0);
  // SW-10: Help me choose asks about the team, not a model or term.
  await page.goto("/radios-equipment?quoteType=Help%20me%20choose#quote-form");
  await expect(page.getByLabel("What do you need?")).toHaveValue("Help me choose");
  await expect(page.getByLabel("Radio", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("How many people need radios?")).toBeVisible();
  // SW-06/07: 1GUARD landing pages carry the Pilot label and a trial button in the body.
  for (const route of ["/guard-patrol-software", "/guard-attendance-software", "/solutions/security"]) {
    await page.goto(route);
    await expect(page.locator("main").getByText("Pilot", { exact: true }).first(), route).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: "Request a 14-day trial" }).first(), route).toHaveAttribute("href", "/get-started");
  }
  // SW-05: only the approved status vocabulary.
  for (const route of ["/pricing", "/security-trust", "/about", "/guard-marketplace", "/guards"]) {
    await page.goto(route);
    const text = await page.locator("main").innerText();
    expect(text, route).not.toMatch(/\bBeta\b|MVP in development/);
  }
});

test("communications separate the radio from the service and list ways to buy without prices or financing", async ({ page }) => {
  await page.goto("/radios-equipment");
  const section = page.locator("#ways-to-buy");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Buy the radio. Subscribe to the service.");
  for (const route of ["Outright purchase", "Corporate and fleet", "Radios with a monthly service", "Radios with an annual package", "Managed fleet rental", "Wholesale and resale"]) {
    await expect(section.getByText(route, { exact: true })).toBeVisible();
  }
  await expect(section).toContainText("confirmed in a written quotation before anything is supplied");
  await expect(section).not.toContainText(/R\s?\d|unlimited|per month from|financ|credit/i);
});

test("grouped header menus: single row, disclosure buttons, Escape and outside click close, partner links", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const banner = page.getByRole("banner");
  const nav = banner.getByRole("navigation", { name: "Primary" });
  // Products stay one click away; the header has no trial button.
  await expect(nav.getByRole("link", { name: /1GUARD/ })).toHaveAttribute("href", "/solutions/security");
  await expect(nav.getByRole("link", { name: /1Service/ })).toHaveAttribute("href", "/service");
  await expect(banner.getByRole("link", { name: /14-day trial/i })).toHaveCount(0);
  const partners = nav.getByRole("button", { name: "Partners" });
  await expect(partners).toHaveAttribute("aria-expanded", "false");
  await partners.click();
  await expect(partners).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: /Become a reseller/ })).toHaveAttribute("href", "/partners/reseller");
  await expect(nav.getByRole("link", { name: /Become a sales partner/ })).toHaveAttribute("href", "/partners/sales");
  await page.keyboard.press("Escape");
  await expect(partners).toHaveAttribute("aria-expanded", "false");
  await expect(partners).toBeFocused();
  await nav.getByRole("button", { name: "Communications" }).click();
  await expect(nav.getByRole("link", { name: /Ways to buy/ })).toBeVisible();
  await page.mouse.click(700, 600);
  await expect(nav.getByRole("link", { name: /Ways to buy/ })).toBeHidden();
  // Still one row: every primary entry sits on the same line as the logo.
  const tops = await nav.locator(":scope > a, :scope > div > button").evaluateAll(nodes => nodes.map(n => Math.round(n.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  await partners.click();
  await nav.getByRole("link", { name: /Become a reseller/ }).click();
  await expect(page).toHaveURL(/\/partners\/reseller$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sell professional communications");
});

test("partner pages state the approved policy and never publish prices, credit or earnings", async ({ page }) => {
  await page.goto("/partners/reseller");
  const policy = page.locator("[data-reseller-policy]");
  await expect(policy).toContainText("Wholesale purchases are prepaid.");
  await expect(policy).toContainText("needs a separate application and approval");
  await expect(policy).toContainText("non-exclusive unless a written agreement says otherwise");
  await expect(page.locator('[data-planned="true"]')).toContainText("In development");
  const reseller = await page.locator("main").innerText();
  expect(reseller).not.toMatch(/R\s?\d|% (off|discount|margin)|guaranteed/i);
  await page.goto("/partners/sales");
  const sales = await page.locator("main").innerText();
  expect(sales).toContain("not a salaried job");
  expect(sales).toContain("We do not publish rates or earnings estimates");
  expect(sales).not.toMatch(/R\s?\d|\d+\s?%|guaranteed income|earn up to/i);
  await page.goto("/");
  const section = page.locator("#partners");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("Grow your business with Signal One.");
  await expect(section.getByRole("link", { name: /Become a Reseller/ })).toHaveAttribute("href", "/partners/reseller");
  await expect(section.getByRole("link", { name: /Become a Sales Partner/ })).toHaveAttribute("href", "/partners/sales");
});

