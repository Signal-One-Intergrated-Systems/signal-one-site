import { expect, test } from "@playwright/test";
import { billableGuardDays, exVat, guardDayPrice, incVat, pricing } from "../../app/lib/pricing";
import { hydrated, OK_BASE, tick } from "./helpers";

/**
 * R0 release gate (founder instruction, 2026-11-12).
 * R2.50 per guard per day excluding VAT is final: 300 guard days = R750 ex VAT.
 */
test("300 guard days cost R750 excluding VAT, R862.50 including VAT", () => {
  expect(pricing.pricePerGuardDay).toBe(2.5);
  expect(guardDayPrice).toBe("R2,50");
  expect(exVat(300)).toBe(750);
  expect(incVat(exVat(300))).toBeCloseTo(862.5, 6);
  expect(exVat(billableGuardDays(4))).toBe(25); // 10 guard-day minimum
});

test("pricing page publishes R2,50 and the R750 worked example, never R2 flat", async ({ page }) => {
  await page.goto("/pricing");
  const text = (await page.locator("main").innerText()).replace(/\u00a0/g, " ");
  expect(text).toContain("R2,50");
  expect(text).not.toMatch(/R2 per guard/);
  // Worked example: 10 guards x 30 days = 300 guard days = R750 excluding VAT.
  const row = page.locator("tbody tr").filter({ has: page.locator("td", { hasText: /^300$/ }) });
  await expect(row).toHaveCount(1);
  await expect(row.locator("td").last()).toHaveText(/^R\s?750$/);
});

test("structured data carries 2.50 ZAR", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('"price":"2.50"');
  expect(html).not.toContain('"price":"2.00"');
});

for (const path of ["/", "/pricing", "/get-started", "/contact", "/api/intake/status"]) {
  test(`security headers on ${path}`, async ({ request }) => {
    const h = (await request.get(path)).headers();
    expect(h["strict-transport-security"]).toContain("max-age=31536000");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBeTruthy();
    expect(h["permissions-policy"]).toContain("camera=()");
    const csp = h["content-security-policy"];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
}

test("the content security policy does not break any public page", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text()); });
  for (const path of ["/", "/pricing", "/get-started", "/contact", "/solutions/security", "/radios-equipment", "/guards/join", "/join/sales", "/service"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }
  expect(violations).toEqual([]);
});

const valid = {
  kind: "client",
  data: { intent: "consultation", name: "Synthetic QA" },
  consent: { processing: true, marketing: false, noticeVersion: "2026-11-12", capturedAt: new Date().toISOString() },
  idempotencyKey: "3f0e8f6a-5c0e-4b5e-9d3a-6b1f6f5d2a11",
};

test("intake refuses a submission without processing consent", async ({ request }) => {
  const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, consent: { ...valid.consent, processing: false } } });
  expect(res.status()).toBe(400);
});

test("intake refuses a missing or malformed idempotency key", async ({ request }) => {
  expect((await request.post(OK_BASE + "/api/intake", { data: { ...valid, idempotencyKey: "nope" } })).status()).toBe(400);
});

test("intake refuses a cross-origin browser post", async ({ request }) => {
  const res = await request.post(OK_BASE + "/api/intake", { data: valid, headers: { origin: "https://evil.example" } });
  expect(res.status()).toBe(403);
});

test("intake throttles a connection that floods it (429 with Retry-After)", async ({ request }) => {
  let last = 0;
  let retryAfter: string | undefined;
  for (let i = 0; i < 14; i++) {
    const res = await request.post("http://localhost:3102/api/intake", { data: valid });
    last = res.status();
    retryAfter = res.headers()["retry-after"];
    if (last === 429) break;
  }
  expect(last).toBe(429);
  expect(retryAfter).toBe("600");
});

test("with no receiver configured the API says nothing was sent (503), never success", async ({ request }) => {
  const res = await request.post("/api/intake", { data: valid });
  expect(res.status()).toBe(503);
  expect((await res.json()).message).toMatch(/nothing was sent/i);
});

test("contact form forwards consent, a separate marketing choice and an idempotency key", async ({ page, request }) => {
  await page.goto(OK_BASE + "/contact");
  await hydrated(page);
  const form = page.locator("main form").first();
  const marketing = form.locator('input[name="consent-marketing"]');
  await expect(marketing).not.toBeChecked(); // never pre-ticked
  await expect(form.getByRole("link", { name: "Privacy notice" })).toHaveAttribute("href", "/privacy");
  for (const el of await form.locator("input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea").all()) {
    const type = (await el.getAttribute("type")) || "text";
    await el.fill(type === "email" ? "qa.r0@example.com" : type === "tel" ? "0110000000" : "R0 gate synthetic");
  }
  for (const sel of await form.locator("select").all()) await sel.selectOption({ index: 1 });
  await tick(form.locator('input[name="consent-processing"]'));
  await form.locator("button[type=submit]").click();
  await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 15_000 });
  type Hit = { headers?: Record<string, string>; body: { contract?: string; idempotencyKey?: string; consent?: { processing: boolean; marketing: boolean; noticeVersion: string; recordedAt: string }; data: Record<string, string> } };
  const received = (await (await request.get("http://localhost:4010/received")).json()) as Hit[];
  const hit = received.reverse().find((r) => r.body?.data?.email === "qa.r0@example.com");
  expect(hit, "receiver got the submission").toBeTruthy();
  expect(hit!.body.contract).toBe("website-intake/v1");
  expect(hit!.body.consent).toMatchObject({ processing: true, marketing: false, noticeVersion: "2026-11-12" });
  expect(hit!.body.consent!.recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(hit!.body.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
  expect(hit!.headers?.["idempotency-key"]).toBe(hit!.body.idempotencyKey);
});
