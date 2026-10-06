import { expect, test, type Page } from "@playwright/test";
import { decodeMailto, fillVisible, OK_BASE, walkJourney } from "./helpers";

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
      await page.getByRole("radio", { name: label }).check({ force: true });
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
    await c.run(page);
    const link = page.locator('a[href^="mailto:sales@signalone.co.za"][href*="subject="]').first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    const mail = decodeMailto((await link.getAttribute("href"))!);
    expect(mail.to).toBe("sales@signalone.co.za");
    expect(mail.subject).toBe("Signal One website: " + c.subject);
    expect(mail.body).toMatch(/: /);
    expect(mail.body).not.toContain("intent");
  });

  test(`success with mocked upstream: ${c.name}`, async ({ page, request }) => {
    await page.goto(OK_BASE + c.path);
    await c.run(page);
    await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('a[href^="mailto:sales@signalone.co.za"][href*="subject="]')).toHaveCount(0);
    const received = (await (await request.get("http://localhost:4010/received")).json()) as Array<{ auth?: string; body: { kind: string; data: { intent: string }; source: string } }>;
    const hit = received.reverse().find((r) => r.body?.data?.intent === c.intent);
    expect(hit, "upstream received the payload").toBeTruthy();
    expect(hit!.body.kind).toBe(c.kind);
    expect(hit!.body.source).toBe("signal-one-site");
    expect(hit!.auth).toBe("Bearer qa-token");
  });
}
