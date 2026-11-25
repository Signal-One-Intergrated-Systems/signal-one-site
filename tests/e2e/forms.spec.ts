import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { decodeMailto, fillVisible, hydrated, OK_BASE, tick, walkJourney } from "./helpers";
import contract from "../../contracts/website-intake.contract.v1.json";
import manifest from "../../contracts/form-manifest.v1.json";

/**
 * Fields the real LEOS receiver accepts per intent: the VENDORED LEOS contract (generated in LEOS from
 * the receiver's own code; refreshed with scripts/contract-release-check.mjs). A key outside it is
 * refused 422 and the enquiry is lost.
 */
function expectReceiverAccepts(intent: string, data: Record<string, string>) {
  const allowed = (contract.intents as Record<string, { fields: string[] }>)[intent]?.fields;
  expect(allowed, `receiver knows intent ${intent}`).toBeTruthy();
  const unknown = Object.keys(data).filter((key) => key !== "intent" && !allowed.includes(key));
  expect(unknown, `fields the receiver would refuse for ${intent}`).toEqual([]);
}

type Case = {
  name: string;
  path: string;
  subject: string;
  intent: string;
  kind: "client" | "guard" | "sales";
  prepare?: (page: Page) => Promise<void>;
  run: (page: Page) => Promise<void>;
};

const simple = async (page: Page) => {
  await hydrated(page);
  await fillVisible(page, "main form");
  await page.locator("main form button[type=submit]").first().click();
};

const cases: Case[] = [
  { name: "contact", path: "/contact", subject: "Consultation request", intent: "consultation", kind: "client", run: simple },
  { name: "marketplace interest", path: "/guard-marketplace", subject: "Guard Marketplace interest", intent: "marketplace-interest", kind: "client", run: simple },
  ...(
    [
      ["Radios and PTT", "Equipment rental quote", "equipment-rental-quote"],
      ["Tracking", "Tracking quote", "tracking-quote"],
      ["Body cameras", "Body camera rental quote", "bodycam-rental-quote"],
    ] as const
  ).map(([label, subject, intent]): Case => ({
    name: `equipment quote: ${label}`,
    path: "/radios-equipment",
    subject,
    intent,
    kind: "client",
    run: async (page) => {
      await hydrated(page);
      await tick(page.getByRole("radio", { name: label, exact: true }));
      if (label === "Radios and PTT") await page.getByLabel("Buy or rent?").selectOption("Rent radios");
      await simple(page);
    },
  })),
  { name: "client onboarding", path: "/get-started", subject: "Client onboarding", intent: "company-onboarding", kind: "client", run: (p) => walkJourney(p) },
  {
    name: "guard join",
    path: "/guards/join",
    subject: "Guard join",
    intent: "guard-profile",
    kind: "guard",
    run: async (page) => {
      await page.getByRole("button", { name: "Start my profile" }).click();
      await walkJourney(page);
    },
  },
  { name: "sales application", path: "/join/sales", subject: "Sales application", intent: "sales-representative-application", kind: "sales", run: (p) => walkJourney(p, "#apply") },
];

for (const c of cases) {
  test(`503 fallback: ${c.name}`, async ({ page }) => {
    await page.goto(c.path);
    await page.waitForLoadState("networkidle");
    await c.run(page);
    const link = page.locator('main form a[href^="mailto:sales@signalone.co.za"][href*="subject="]').first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    const mail = decodeMailto((await link.getAttribute("href"))!);
    expect(mail.to).toBe("sales@signalone.co.za");
    expect(mail.subject).toBe("Signal One website: " + c.subject);
    expect(mail.body).toMatch(/: /);
    expect(mail.body).not.toContain("intent");
  });

  test(`success with mocked upstream: ${c.name}`, async ({ page, request }) => {
    await page.goto(OK_BASE + c.path);
    await page.waitForLoadState("networkidle");
    await c.run(page);
    await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('main form a[href^="mailto:sales@signalone.co.za"][href*="subject="]')).toHaveCount(0);
    const received = (await (await request.get("http://localhost:4010/received")).json()) as Array<{ auth?: string; body: { kind: string; data: { intent: string }; source: string } }>;
    const hit = received.reverse().find((r) => r.body?.data?.intent === c.intent);
    expect(hit, "upstream received the payload").toBeTruthy();
    expect(hit!.body.kind).toBe(c.kind);
    expect(hit!.body.source).toBe("signal-one-site");
    expectReceiverAccepts(hit!.body.data.intent, hit!.body.data as unknown as Record<string, string>);
    // The form manifest (contracts/form-manifest.v1.json) must list every field this form sent; the
    // observation is also written for scripts/form-manifest.mjs --write.
    const sent = Object.keys(hit!.body.data).filter((k) => k !== "intent").sort();
    const listed = manifest.forms.find((f) => f.path === c.path && f.intent === c.intent)?.fields ?? [];
    expect(sent.filter((k) => !listed.includes(k)), `fields missing from the form manifest for ${c.path}#${c.intent}`).toEqual([]);
    mkdirSync("test-results/form-manifest", { recursive: true });
    writeFileSync(`test-results/form-manifest/${c.name.replace(/[^a-z0-9]+/gi, "-")}.json`, JSON.stringify({ journey: c.name, path: c.path, kind: c.kind, intent: c.intent, fields: sent }));
    // A visit without campaign parameters sends no attribution key at all (v1 receivers refuse unknown keys).
    expect(Object.keys(hit!.body)).not.toContain("attribution");
    expect(hit!.auth).toBe("Bearer qa-token");
  });
}

test("a campaign visit's attribution reaches the receiver with the enquiry, cleaned", async ({ page, request }) => {
  // Land from an ad on the rental page, then follow the site's own path to the quote form.
  await page.goto(OK_BASE + "/ptt-radio-rental?utm_source=google&utm_medium=cpc&utm_campaign=qa-radio-rental&gclid=QA.test-123&utm_term=%3Cscript%3E");
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Request a radio quote" }).first().click();
  await page.waitForURL(/radios-equipment/);
  await hydrated(page);
  await page.getByLabel("Buy or rent?").selectOption("Rent radios");
  await simple(page);
  await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 15_000 });
  const received = (await (await request.get("http://localhost:4010/received")).json()) as Array<{ body: { data: { intent: string }; attribution?: Record<string, string> | null } }>;
  const hit = received.reverse().find((r) => r.body?.attribution?.utm_campaign === "qa-radio-rental");
  expect(hit, "upstream received the attribution").toBeTruthy();
  expect(hit!.body.attribution).toMatchObject({ utm_source: "google", utm_medium: "cpc", gclid: "QA.test-123", landingPath: "/ptt-radio-rental" });
  // Markup in a parameter is dropped, never forwarded into the CRM.
  expect(hit!.body.attribution!.utm_term).toBeUndefined();
});

test("an empty quote shows every problem at once, next to each field and in a focused summary", async ({ page }) => {
  await page.goto("/radios-equipment#quote");
  await hydrated(page);
  await page.locator("main form button[type=submit]").first().click();
  const summary = page.locator("main form [data-error-summary]");
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  const invalid = page.locator('main form [aria-invalid="true"]');
  expect(await invalid.count(), "more than the first field is flagged").toBeGreaterThan(3);
  // Each flagged field points at a visible message.
  const quantity = page.locator("main form input[name=quantity]");
  await expect(quantity).toHaveAttribute("aria-invalid", "true");
  const describedBy = (await quantity.getAttribute("aria-describedby"))!;
  await expect(page.locator("#" + describedBy.split(" ").pop())).toHaveText(/Enter/);
  // Correcting a field clears its message; the summary links move focus to the field.
  await quantity.fill("12");
  await expect(quantity).not.toHaveAttribute("aria-invalid", "true");
  await summary.getByRole("link").first().click();
  await expect(page.locator(":focus")).toHaveAttribute("aria-invalid", "true");
});

test("pages with their own closing action do not stack the footer band; legal pages keep it", async ({ page }) => {
  for (const route of ["/", "/ptt-radio-rental", "/radios-equipment", "/guards", "/join/sales", "/support", "/no-such-page"]) {
    await page.goto(route);
    await expect(page.locator(".s1-premium-footer-intro"), route).toHaveCount(0);
  }
  await page.goto("/privacy");
  await expect(page.locator(".s1-premium-footer-intro")).toHaveCount(1);
  await expect(page.locator(".s1-footer-main-cta")).toHaveAttribute("href", "/contact");
});
