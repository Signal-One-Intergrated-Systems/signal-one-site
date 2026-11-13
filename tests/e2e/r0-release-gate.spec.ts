import { expect, test } from "@playwright/test";
import { billableGuardDays, exVat, guardDayPrice, incVat, pricing } from "../../app/lib/pricing";
import { idempotencyKeyFor, newIdempotencyState, PRIVACY_NOTICE_VERSION } from "../../app/lib/intake";
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
    expect(h["strict-transport-security"]).toBe("max-age=31536000"); // this host only; subdomains are not bound yet
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBeTruthy();
    expect(h["permissions-policy"]).toContain("camera=()");
    const csp = h["content-security-policy"];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    // Cloudflare injects its Web Analytics beacon at the edge; the policy must let it load and report.
    expect(csp).toMatch(/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
    expect(csp).toMatch(/connect-src[^;]*https:\/\/cloudflareinsights\.com/);
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

const SITE = "http://localhost:3100";
const valid = {
  kind: "client",
  data: { intent: "consultation", name: "Synthetic QA" },
  consent: { processing: true, marketing: false, noticeVersion: "2026-11-12", capturedAt: new Date().toISOString() },
  idempotencyKey: "3f0e8f6a-5c0e-4b5e-9d3a-6b1f6f5d2a11",
};
const from = (origin: string) => ({ origin });
const uuid = () => crypto.randomUUID();

test("intake refuses a submission without processing consent", async ({ request }) => {
  const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, consent: { ...valid.consent, processing: false } }, headers: from(OK_BASE) });
  expect(res.status()).toBe(400);
});

test("intake refuses a missing or malformed idempotency key", async ({ request }) => {
  expect((await request.post(OK_BASE + "/api/intake", { data: { ...valid, idempotencyKey: "nope" }, headers: from(OK_BASE) })).status()).toBe(400);
});

test("intake refuses unknown intents, non-string fields and bad field names", async ({ request }) => {
  const post = (data: unknown) => request.post(OK_BASE + "/api/intake", { data: { ...valid, data }, headers: from(OK_BASE) });
  expect((await post({ intent: "free-money", name: "x" })).status()).toBe(400);
  expect((await post({ intent: "guard-profile", name: "x" })).status()).toBe(400); // a guard intent on kind=client
  expect((await post({ intent: "consultation", nested: { a: 1 } })).status()).toBe(400);
  expect((await post({ intent: "consultation", "bad name!": "x" })).status()).toBe(400);
});

test("intake refuses a post with no Origin or a foreign Origin", async ({ request }) => {
  expect((await request.post(OK_BASE + "/api/intake", { data: valid })).status()).toBe(403);
  expect((await request.post(OK_BASE + "/api/intake", { data: valid, headers: from("https://evil.example") })).status()).toBe(403);
});

test("a persisted-record receipt is required: the reply carries the stored record reference", async ({ request }) => {
  const key = uuid();
  const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, idempotencyKey: key }, headers: from(OK_BASE) });
  expect(res.status()).toBe(200);
  const body = await res.json();
  // An opaque submission reference, never a stored row's identifier, and one fixed record type per kind.
  expect(body.receipt.reference).toMatch(/^SO-[0-9A-HJKMNP-TV-Z]{12}$/);
  expect(body.receipt.recordType).toBe("website_enquiry");
  expect(body.receipt.idempotencyKey).toBe(key);
  expect(body.receipt.duplicate).toBe(false);

  // The same submission again: same record, flagged as a duplicate, no second record.
  const again = await (await request.post(OK_BASE + "/api/intake", { data: { ...valid, idempotencyKey: key }, headers: from(OK_BASE) })).json();
  expect(again.receipt.reference).toBe(body.receipt.reference);
  expect(again.receipt.duplicate).toBe(true);
});

test("the site passes the receiver's record type through, and refuses a guard or sales application acknowledged as a sales lead", async ({ request }) => {
  const guard = await (await request.post(OK_BASE + "/api/intake", { data: { ...valid, kind: "guard", data: { intent: "guard-profile", name: "Synthetic QA" }, idempotencyKey: uuid() }, headers: from(OK_BASE) })).json();
  expect(guard.receipt.recordType).toBe("guard_application");
  const sales = await (await request.post(OK_BASE + "/api/intake", { data: { ...valid, kind: "sales", data: { intent: "sales-representative-application", name: "Synthetic QA" }, idempotencyKey: uuid() }, headers: from(OK_BASE) })).json();
  expect(sales.receipt.recordType).toBe("recruitment_application");
  // The site's own rule (not the mock's): a non-client kind acknowledged as crm_lead is not accepted.
  const wrong = await request.post(OK_BASE + "/api/intake", { data: { ...valid, kind: "guard", data: { intent: "guard-profile", name: "Synthetic QA", qaReceipt: "lead-for-application" }, idempotencyKey: uuid() }, headers: from(OK_BASE) });
  expect(wrong.status()).toBe(502);
  expect((await wrong.json()).receipt).toBeUndefined();
});

test("an enquiry acknowledged with an internal record type is not accepted: the reply never varies with what the receiver did", async ({ request }) => {
  // A receiver that answers "crm_lead" for some enquiries and something else for others would tell a caller
  // whether a company was already known. The site accepts exactly one type per kind and nothing else.
  const leaked = await request.post(OK_BASE + "/api/intake", { data: { ...valid, data: { ...valid.data, qaReceipt: "internal-type-for-client" }, idempotencyKey: uuid() }, headers: from(OK_BASE) });
  expect(leaked.status()).toBe(502);
  const body = await leaked.json();
  expect(body.receipt).toBeUndefined();
  expect(JSON.stringify(body)).not.toContain("LEAD-123458");
});

test("two different enquiries get two different references, and the reply has the same shape for both", async ({ request }) => {
  const send = async () => (await request.post(OK_BASE + "/api/intake", { data: { ...valid, idempotencyKey: uuid() }, headers: from(OK_BASE) })).json();
  const [a, b] = [await send(), await send()];
  expect(a.receipt.reference).not.toBe(b.receipt.reference);
  expect(Object.keys(a).sort()).toEqual(Object.keys(b).sort());
  expect(Object.keys(a.receipt).sort()).toEqual(Object.keys(b.receipt).sort());
  expect(a.message).toBe(b.message);
  expect(a.receipt.recordType).toBe(b.receipt.recordType);
});

test("unknown or prototype-named kinds are an ordinary 400, never a server error", async ({ request }) => {
  for (const kind of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
    const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, kind }, headers: from(OK_BASE) });
    expect(res.status(), kind).toBe(400);
  }
});

test("consent must be to the notice published now", async ({ request }) => {
  expect(valid.consent.noticeVersion).toBe(PRIVACY_NOTICE_VERSION);
  const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, consent: { ...valid.consent, noticeVersion: "2020-01-01" } }, headers: from(OK_BASE) });
  expect(res.status()).toBe(400);
});

test("a receiver credential or routing failure is ours: generic 502, no receiver text reaches the visitor", async ({ request }) => {
  const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, data: { ...valid.data, qaReceipt: "upstream-401" }, idempotencyKey: uuid() }, headers: from(OK_BASE) });
  expect(res.status()).toBe(502);
  expect(JSON.stringify(await res.json())).not.toMatch(/credential|internal|receiver/i);
});

test("a receiver validation answer (422) is shown to the visitor", async ({ request }) => {
  const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, data: { ...valid.data, qaReceipt: "upstream-422" }, idempotencyKey: uuid() }, headers: from(OK_BASE) });
  expect(res.status()).toBe(422);
  expect((await res.json()).message).toBe("Please give a company email address.");
});

test("the canonical site and its www twin are both accepted origins; a look-alike is not", async ({ request }) => {
  // The test servers run with the default canonical URL (https://signalone.co.za).
  for (const origin of ["https://signalone.co.za", "https://www.signalone.co.za"]) {
    expect((await request.post("/api/intake", { data: valid, headers: from(origin) })).status(), origin).toBe(503);
  }
  for (const origin of ["https://signalone.co.za.evil.example", "https://evilsignalone.co.za", "null"]) {
    expect((await request.post("/api/intake", { data: valid, headers: from(origin) })).status(), origin).toBe(403);
  }
});

test("the idempotency key follows the payload: identical retry keeps it, any edit replaces it", () => {
  const state = newIdempotencyState();
  const first = idempotencyKeyFor(state, "client", { intent: "consultation", phone: "0110000000", name: "A" }, false);
  expect(first).toMatch(/^[0-9a-f-]{36}$/);
  expect(idempotencyKeyFor(state, "client", { name: "A", intent: "consultation", phone: "0110000000" }, false)).toBe(first); // same content, other order
  const corrected = idempotencyKeyFor(state, "client", { intent: "consultation", phone: "0110000001", name: "A" }, false);
  expect(corrected).not.toBe(first);
  expect(idempotencyKeyFor(state, "client", { intent: "tracking-quote", phone: "0110000001", name: "A" }, false)).not.toBe(corrected);
  const optedIn = idempotencyKeyFor(state, "client", { intent: "tracking-quote", phone: "0110000001", name: "A" }, true);
  expect(idempotencyKeyFor(state, "client", { intent: "tracking-quote", phone: "0110000001", name: "A" }, true)).toBe(optedIn);
});

for (const [mode, why] of [["none", "a bare 200 with no receipt"], ["wrong-key", "a receipt for a different submission"], ["no-id", "a receipt without a record identifier"], ["bad-time", "a receipt whose saved time is not a real timestamp"]] as const) {
  test(`an upstream 2xx is not proof of a save: ${why} is reported as not received`, async ({ request }) => {
    const res = await request.post(OK_BASE + "/api/intake", { data: { ...valid, data: { ...valid.data, qaReceipt: mode }, idempotencyKey: uuid() }, headers: from(OK_BASE) });
    expect(res.status()).toBe(502);
    const body = await res.json();
    expect(body.receipt).toBeUndefined();
    expect(body.message).toMatch(/could not confirm that this was saved/i);
  });
}

test("intake throttles one caller that floods the receiver (429 with Retry-After) and releases others", async ({ request }) => {
  const flood = "http://localhost:3102";
  const as = (ip: string) => ({ ...from(flood), "x-qa-edge-client-ip": ip });
  let last = 0;
  let retryAfter: string | undefined;
  for (let i = 0; i < 14; i++) {
    const res = await request.post(flood + "/api/intake", { data: { ...valid, idempotencyKey: uuid() }, headers: as("198.51.100.21") });
    last = res.status();
    retryAfter = res.headers()["retry-after"];
    if (last === 429) break;
  }
  expect(last).toBe(429);
  expect(retryAfter).toBe("600");
  // A different caller is unaffected.
  expect((await request.post(flood + "/api/intake", { data: { ...valid, idempotencyKey: uuid() }, headers: as("198.51.100.22") })).status()).toBe(200);
});

test("the throttle cannot be dodged by forging X-Forwarded-For when the trusted edge header is configured", async ({ request }) => {
  const flood = "http://localhost:3102";
  let last = 0;
  for (let i = 0; i < 16; i++) {
    last = (await request.post(flood + "/api/intake", { data: { ...valid, idempotencyKey: uuid() }, headers: { ...from(flood), "x-qa-edge-client-ip": "198.51.100.7", "x-forwarded-for": `203.0.113.${i}` } })).status();
  }
  expect(last).toBe(429);
});

test("while no receiver is connected, a flood never takes the honest 503 away from anyone", async ({ request }) => {
  // Production today: nothing connected. Thirty posts from one address must all get 503 (with the email route), never 429.
  const statuses = new Set<number>();
  for (let i = 0; i < 30; i++) statuses.add((await request.post("/api/intake", { data: { ...valid, idempotencyKey: uuid() }, headers: from(SITE) })).status());
  expect([...statuses]).toEqual([503]);
});

test("with no receiver configured the API says nothing was sent (503), never success", async ({ request }) => {
  const res = await request.post("/api/intake", { data: valid, headers: from(SITE) });
  expect(res.status()).toBe(503);
  const body = await res.json();
  expect(body.message).toMatch(/nothing was sent/i);
  expect(body.receipt).toBeUndefined();
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
  await expect(page.locator("[data-receipt-reference]")).toContainText(/Reference: SO-[0-9A-HJKMNP-TV-Z]{12}/);
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

// PatrolStory is the only component whose cards wait off to the side; it renders on this route.
for (const route of ["/guard-patrol-software"]) {
  test(`cards waiting to slide in never widen the page at tablet width: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    // Hold every reveal group in its off-to-the-side waiting state: the worst case, deterministically.
    const groups = await page.evaluate(() => {
      const all = [...document.querySelectorAll<HTMLElement>(".reveal-group")];
      all.forEach((group) => group.setAttribute("data-reveal", "waiting"));
      return all.length;
    });
    expect(groups).toBeGreaterThan(0);
    // Let the cards finish travelling to their waiting offset, and confirm one really is displaced.
    await page.waitForTimeout(1500);
    const displaced = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".reveal-group > .reveal")].some((card) => card.getBoundingClientRect().right > window.innerWidth));
    expect(displaced, "a waiting card sits past the right edge").toBe(true);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("consent ticks are never restored from a previous session on the same device", async ({ page }) => {
  // What an earlier build (or another person on a shared phone) left behind: a saved journey on its last step, both boxes ticked.
  await page.addInitScript(() => {
    window.localStorage.setItem("signal-one-client-onboarding-v4", JSON.stringify({ stepIndex: 4, values: {}, consent: true, marketing: true }));
  });
  await page.goto("/get-started");
  const processing = page.locator('input[name="consent-processing"]');
  await expect(processing).toBeVisible({ timeout: 15_000 }); // resumed on the final step
  await expect(processing).not.toBeChecked();
  await expect(page.locator('input[name="consent-marketing"]')).not.toBeChecked();
  // And nothing about consent is written back.
  await page.locator('input[name="consent-marketing"]').check();
  await page.waitForTimeout(300);
  const saved = await page.evaluate(() => window.localStorage.getItem("signal-one-client-onboarding-v4") || "");
  expect(saved).not.toMatch(/consent|marketing/);
});

for (const status of [403, 429, 502, 503, 504]) {
  test(`a ${status} from the form service never dead-ends the visitor: the email route is offered`, async ({ page }) => {
    await page.route("**/api/intake", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ message: "QA refusal" }) }));
    await page.goto("/contact");
    await hydrated(page);
    const form = page.locator("main form").first();
    for (const el of await form.locator("input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea").all()) {
      const type = (await el.getAttribute("type")) || "text";
      await el.fill(type === "email" ? "qa.fallback@example.com" : type === "tel" ? "0110000000" : "Fallback synthetic");
    }
    for (const sel of await form.locator("select").all()) await sel.selectOption({ index: 1 });
    await tick(form.locator('input[name="consent-processing"]'));
    await form.locator("button[type=submit]").click();
    await expect(page.locator('main a[href^="mailto:sales@signalone.co.za"]').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("[data-receipt-reference]")).toHaveCount(0);
  });
}

test("a 400 the visitor can fix shows the message without diverting them to email", async ({ page }) => {
  await page.route("**/api/intake", (route) => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: "QA: please correct the form" }) }));
  await page.goto("/contact");
  await hydrated(page);
  const form = page.locator("main form").first();
  for (const el of await form.locator("input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea").all()) {
    const type = (await el.getAttribute("type")) || "text";
    await el.fill(type === "email" ? "qa.fix@example.com" : type === "tel" ? "0110000000" : "Fix synthetic");
  }
  for (const sel of await form.locator("select").all()) await sel.selectOption({ index: 1 });
  await tick(form.locator('input[name="consent-processing"]'));
  await form.locator("button[type=submit]").click();
  await expect(page.getByText("QA: please correct the form")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('main form a[href^="mailto:"]')).toHaveCount(0);
});
