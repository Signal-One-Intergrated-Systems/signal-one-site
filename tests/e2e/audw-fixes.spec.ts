import { expect, test, type Page } from "@playwright/test";
import { PRIVACY_NOTICE_VERSION } from "../../app/lib/intake";
import { hydrated, OK_BASE } from "./helpers";

/**
 * Regression tests for the independent website audit AUDW-1 (docs/launch/WEBSITE_AUDIT_AUDW1.md).
 * Servers (playwright.config.ts): 3100 no receiver, 3101 receiver + every kind, 3102 receiver + the
 * PRODUCTION DEFAULT kinds (client only), 3104 receiver URL without a token.
 */
const NO_RECEIVER = "http://localhost:3100";
const DEFAULT_KINDS = "http://localhost:3102";
const NO_TOKEN = "http://localhost:3104";

// ---------- AUDW-03: the form progress track is visible and exposes the current step ----------

async function stepperState(page: Page) {
  const track = page.locator(".stepper-track").filter({ visible: true });
  await expect(track).toHaveCount(1);
  const box = (await track.boundingBox())!;
  const current = track.locator('li[aria-current="step"]');
  await expect(current).toHaveCount(1);
  const currentBox = (await current.boundingBox())!;
  const states = await track.locator("li").evaluateAll((items) => items.map((li) => li.getAttribute("data-state")));
  return { box, currentBox, states, index: states.indexOf("current") };
}

for (const width of [390, 1440]) {
  test(`AUDW-03 the guard profile progress track is drawn and names the current step (${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(NO_RECEIVER + "/guards/join");
    await hydrated(page);
    const first = await stepperState(page);
    expect(first.box.height, "track height").toBeGreaterThan(4);
    expect(first.box.width, "track width").toBeGreaterThan(200);
    expect(first.currentBox.height).toBeGreaterThan(4);
    expect(first.states).toHaveLength(9);
    expect(first.index).toBe(0);
    await page.getByRole("button", { name: "Start my profile" }).click();
    const second = await stepperState(page);
    expect(second.index).toBe(1);
    expect(second.states[0]).toBe("done");
    // Finished, current and remaining segments are told apart by fill, not only by hue.
    const fills = await page.locator(".stepper-track li").evaluateAll((items) =>
      items.slice(0, 3).map((li) => getComputedStyle(li).backgroundColor),
    );
    expect(fills[2]).toBe("rgba(0, 0, 0, 0)");
    expect(fills[0]).not.toBe(fills[2]);
  });

  test(`AUDW-03 onboarding and the sales application show one progress track (${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(NO_RECEIVER + "/get-started");
    await hydrated(page);
    const onboarding = await stepperState(page);
    expect(onboarding.box.height).toBeGreaterThan(4);
    expect(onboarding.states).toHaveLength(5);
    await page.goto(NO_RECEIVER + "/join/sales#apply");
    await hydrated(page);
    const sales = await stepperState(page);
    expect(sales.box.height).toBeGreaterThan(4);
    expect(sales.states).toHaveLength(7);
    expect(sales.index).toBe(0);
  });
}

// ---------- AUDW-02: the status answer is what POST /api/intake will actually do, per kind ----------

test("AUDW-02 status reports per kind: URL, token and SIGNAL_ONE_INTAKE_KINDS all count", async ({ request }) => {
  const status = async (base: string, kind?: string) => {
    const res = await request.get(base + "/api/intake/status" + (kind ? "?kind=" + kind : ""));
    expect(res.headers()["cache-control"]).toContain("no-store");
    return { code: res.status(), body: await res.json() };
  };
  // Production default: receiver connected, only client enquiries enabled.
  expect((await status(DEFAULT_KINDS)).body).toEqual({ onlineSubmissionAvailable: true, kinds: { client: true, guard: false, sales: false } });
  expect((await status(DEFAULT_KINDS, "client")).body.onlineSubmissionAvailable).toBe(true);
  expect((await status(DEFAULT_KINDS, "guard")).body.onlineSubmissionAvailable).toBe(false);
  expect((await status(DEFAULT_KINDS, "sales")).body.onlineSubmissionAvailable).toBe(false);
  // Every kind enabled.
  expect((await status(OK_BASE)).body.kinds).toEqual({ client: true, guard: true, sales: true });
  // A URL without a token is not connected (the intake route answers 503 for it).
  expect((await status(NO_TOKEN)).body).toEqual({ onlineSubmissionAvailable: false, kinds: { client: false, guard: false, sales: false } });
  expect((await status(NO_RECEIVER, "client")).body.onlineSubmissionAvailable).toBe(false);
  expect((await status(DEFAULT_KINDS, "constructor")).code).toBe(400);
  // The status body never carries the receiver's address or token.
  expect(JSON.stringify((await status(DEFAULT_KINDS)).body)).not.toMatch(/4010|qa-token|http/);
});

test("AUDW-02 a URL without a token answers 503 with the email route, as the status says", async ({ request }) => {
  const res = await request.post(NO_TOKEN + "/api/intake", {
    data: {
      kind: "client",
      data: { intent: "consultation", name: "Synthetic QA" },
      consent: { processing: true, marketing: false, noticeVersion: PRIVACY_NOTICE_VERSION, capturedAt: new Date().toISOString() },
      idempotencyKey: crypto.randomUUID(),
    },
    headers: { origin: NO_TOKEN },
  });
  expect(res.status()).toBe(503);
  expect((await res.json()).message).toContain("sales@signalone.co.za");
});

test("AUDW-02 with the default kinds, guard and sales journeys say 'handled by email' on step 1; client forms do not", async ({ page }) => {
  await page.goto(DEFAULT_KINDS + "/guards/join");
  await hydrated(page);
  const guard = page.locator('[data-intake-availability="guard"]');
  await expect(guard).toBeVisible();
  await expect(guard).toContainText("Guard profiles are currently handled by email.");
  await expect(page.getByRole("button", { name: "Start my profile" })).toBeVisible(); // still on step 1
  expect(await guard.locator("a").getAttribute("href")).toBe("mailto:sales@signalone.co.za?subject=Signal%20One%20website%3A%20Guard%20join");

  await page.goto(DEFAULT_KINDS + "/join/sales#apply");
  await hydrated(page);
  const sales = page.locator('[data-intake-availability="sales"]');
  await expect(sales).toBeVisible();
  await expect(sales).toContainText("Job applications are currently handled by email.");

  // Client enquiries ARE connected on this server: no banner may claim otherwise.
  for (const path of ["/get-started", "/contact", "/radios-equipment"]) {
    await page.goto(DEFAULT_KINDS + path);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("[data-intake-availability]"), path).toHaveCount(0);
  }
});

test("AUDW-02 with every kind connected no journey shows the email notice; with none, all do", async ({ page }) => {
  for (const path of ["/guards/join", "/join/sales"]) {
    await page.goto(OK_BASE + path);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("[data-intake-availability]"), path).toHaveCount(0);
    await page.goto(NO_RECEIVER + path);
    await expect(page.locator("[data-intake-availability]"), path).toBeVisible();
  }
});

// ---------- AUDW-04 / 05 / 06: persistent, accessible validation in the multi-step journeys ----------

async function seed(page: Page, key: string, stepIndex: number, values: Record<string, string>) {
  await page.addInitScript(([k, v]) => window.localStorage.setItem(k, v), [key, JSON.stringify({ stepIndex, values })] as const);
}

async function expectProblem(page: Page, message: string) {
  const summary = page.locator("main form [data-error-summary]");
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("link", { name: message })).toBeVisible();
}

/** A field marked invalid and described by a visible message with this text. */
async function expectFieldError(field: import("@playwright/test").Locator, message: string) {
  await expect(field).toHaveAttribute("aria-invalid", "true");
  const ids = ((await field.getAttribute("aria-describedby")) || "").split(" ").filter(Boolean);
  const texts = await Promise.all(ids.map((id) => field.page().locator("#" + CSS_escape(id)).innerText().catch(() => "")));
  expect(texts).toContain(message);
}

// Element ids from React's useId contain characters that need escaping in a CSS selector.
function CSS_escape(id: string) {
  return id.replace(/([^A-Za-z0-9_-])/g, "\\$1");
}

test("AUDW-04 guard join: an empty step shows every problem, inline and in a focused summary", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(NO_RECEIVER + "/guards/join");
  await hydrated(page);
  await page.getByRole("button", { name: "Start my profile" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expectProblem(page, "Enter your full name.");
  await expectProblem(page, "Choose the work you do.");
  await expectFieldError(page.locator("main form input[name=fullName]"), "Enter your full name.");
  await expectFieldError(page.locator("main form input[name=role]").first(), "Choose the work you do.");
  // Still on the same step, and the summary link moves focus to the field.
  await expect(page.locator(".stepper-track li[aria-current=step]")).toHaveAttribute("data-state", "current");
  await page.locator("main form [data-error-summary]").getByRole("link", { name: "Enter your full name." }).click();
  await expect(page.locator("main form input[name=fullName]")).toBeFocused();
  // Correcting a field clears its message.
  await page.locator("main form input[name=fullName]").fill("Synthetic QA");
  await expect(page.locator("main form input[name=fullName]")).not.toHaveAttribute("aria-invalid", "true");
});

test("AUDW-04 guard join: 'choose at least one' is listed in the summary and described on every box", async ({ page }) => {
  await seed(page, "signal-one-guard-join-v3", 4, { experienceYears: "1 to 2 years" });
  await page.goto(NO_RECEIVER + "/guards/join");
  await hydrated(page);
  await expect(page.getByRole("heading", { name: "Your experience" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expectProblem(page, "Choose at least one type of site.");
  const boxes = page.locator('fieldset[data-multi="siteTypes"] input[type=checkbox]');
  for (const box of await boxes.all()) await expectFieldError(box, "Choose at least one type of site.");
  await page.locator("main form [data-error-summary]").getByRole("link", { name: "Choose at least one type of site." }).click();
  await expect(boxes.first()).toBeFocused();
  // Choosing one removes the message at once.
  await boxes.nth(1).check();
  await expect(page.locator('fieldset[data-multi="siteTypes"] .field-error')).toHaveCount(0);
  await expect(boxes.first()).not.toHaveAttribute("aria-invalid", "true");
});

test("AUDW-06 guard join review: an unticked consent box is a listed problem and nothing is sent", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.url().endsWith("/api/intake") && r.method() === "POST") posts.push(r.url());
  });
  await seed(page, "signal-one-guard-join-v3", 8, { fullName: "Synthetic QA", role: "Supervisor", mobile: "0820000000", contactPreference: "SMS" });
  await page.goto(NO_RECEIVER + "/guards/join");
  await hydrated(page);
  await page.getByRole("button", { name: "Send my profile" }).click();
  await expectProblem(page, "Tick the consent box to send your details.");
  await expectFieldError(page.locator('input[name="consent-processing"]'), "Tick the consent box to send your details.");
  expect(posts).toEqual([]);
  // Going to another step takes the summary with it.
  await page.getByRole("button", { name: "Edit About you" }).click();
  await expect(page.locator("main form [data-error-summary]")).toHaveCount(0);
});

test("AUDW-04 sales application and onboarding validate each step the same way", async ({ page }) => {
  await page.goto(NO_RECEIVER + "/join/sales#apply");
  await hydrated(page);
  await page.locator("#apply").getByRole("button", { name: "Continue" }).click();
  await expectProblem(page, "Choose the role you are applying for.");
  await expectProblem(page, "Choose where you would sell.");
  await expectFieldError(page.locator("main form select[name=region]"), "Choose where you would sell.");

  await page.goto(NO_RECEIVER + "/get-started");
  await hydrated(page);
  await page.getByRole("button", { name: "Continue" }).click();
  await expectProblem(page, "Enter your company name.");
  await expectProblem(page, "Choose what best describes your operation.");
  await expectProblem(page, "Choose where you mainly operate.");
  await expectFieldError(page.locator("main form input[name=companyName]"), "Enter your company name.");
});

test("AUDW-05/06 an empty quote lists natural sentences, including the consent box, in one round", async ({ page }) => {
  await page.goto(NO_RECEIVER + "/radios-equipment#quote");
  await hydrated(page);
  await page.locator("main form button[type=submit]").first().click();
  const summary = page.locator("main form [data-error-summary]");
  await expect(summary).toBeFocused();
  const text = await summary.innerText();
  expect(text).not.toMatch(/\?\./);
  expect(text).not.toMatch(/\bsim\b|\bptt\b/); // acronyms keep their capitals
  for (const message of [
    "Choose what you need.",
    "Enter how many radios you need.",
    "Choose what you need for SIM, data and PTT.",
    "Enter where the radios will be used.",
    "Tick the consent box to send your details.",
  ]) {
    await expect(summary.getByRole("link", { name: message })).toBeVisible();
  }
});

// ---------- AUDW-08 / 09: attribution forwarded only as the receiver accepts it, only on enquiries ----------

type Received = Array<{ body: { idempotencyKey: string; kind: string; attribution?: Record<string, string> } }>;

async function forwarded(request: import("@playwright/test").APIRequestContext, kind: "client" | "guard", attribution: unknown) {
  const key = crypto.randomUUID();
  const data = kind === "client" ? { intent: "consultation", name: "Synthetic QA" } : { intent: "guard-profile", fullName: "Synthetic QA" };
  const res = await request.post(OK_BASE + "/api/intake", {
    data: { kind, data, consent: { processing: true, marketing: false, noticeVersion: PRIVACY_NOTICE_VERSION, capturedAt: new Date().toISOString() }, idempotencyKey: key, attribution },
    headers: { origin: OK_BASE },
  });
  expect(res.status()).toBe(200);
  const received = (await (await request.get("http://localhost:4010/received")).json()) as Received;
  return received.find((r) => r.body.idempotencyKey === key)!.body;
}

test("AUDW-08 a malformed capturedAt is dropped on its own; attribution without a campaign key is not sent", async ({ request }) => {
  expect(await forwarded(request, "client", { utm_source: "google", capturedAt: "whatever" })).toMatchObject({ attribution: { utm_source: "google" } });
  expect((await forwarded(request, "client", { utm_source: "google", capturedAt: "2026-13-45T99:99:99Z" })).attribution).toEqual({ utm_source: "google" });
  const iso = "2026-11-26T08:15:30.123Z";
  expect((await forwarded(request, "client", { gclid: "QA.audw-08", capturedAt: iso })).attribution).toEqual({ gclid: "QA.audw-08", capturedAt: iso });
  const noCampaign = await forwarded(request, "client", { landingPath: "/x", capturedAt: iso, evil: "1" });
  expect(Object.keys(noCampaign)).not.toContain("attribution");
});

test("AUDW-09 attribution is never forwarded with a guard application, even when a request carries it", async ({ request }) => {
  const body = await forwarded(request, "guard", { utm_source: "google", gclid: "QA.audw-09" });
  expect(body.kind).toBe("guard");
  expect(Object.keys(body)).not.toContain("attribution");
});

test("AUDW-09 after a campaign visit, the browser sends no attribution with a guard profile", async ({ page }) => {
  let sent: Record<string, unknown> | null = null;
  await page.route("**/api/intake", async (route) => {
    sent = JSON.parse(route.request().postData() || "{}");
    await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "QA: not sent" }) });
  });
  await page.goto(NO_RECEIVER + "/guards?utm_source=google&utm_medium=cpc&utm_campaign=qa-guards&gclid=QA.audw-09");
  await page.waitForLoadState("networkidle");
  expect(await page.evaluate(() => sessionStorage.getItem("s1.attribution.v1"))).toContain("qa-guards");
  await seed(page, "signal-one-guard-join-v3", 8, { fullName: "Synthetic QA", role: "Supervisor", mobile: "0820000000", contactPreference: "SMS" });
  await page.goto(NO_RECEIVER + "/guards/join");
  await hydrated(page);
  await page.locator('input[name="consent-processing"]').check();
  await page.getByRole("button", { name: "Send my profile" }).click();
  await expect(page.getByText("QA: not sent")).toBeVisible();
  expect(sent).not.toBeNull();
  expect(sent!.kind).toBe("guard");
  expect(Object.keys(sent!)).not.toContain("attribution");
});

// ---------- AUDW-01: the notice describes the campaign processing, and its version moved ----------

test("AUDW-01 the privacy notice describes campaign information and shows the version consent cites", async ({ page }) => {
  expect(PRIVACY_NOTICE_VERSION).toBe("2026-11-26");
  await page.goto(NO_RECEIVER + "/privacy");
  const section = page.locator("#campaign-information");
  await expect(section.getByRole("heading", { name: "Campaign information" })).toBeVisible();
  const text = await section.innerText();
  for (const fact of ["utm_source", "gclid", "gbraid", "wbraid", "session storage", "not in a cookie", "never attached to a guard profile or a job application", "record reference", "not sent to Google", "Retention and rights"]) {
    expect(text, fact).toContain(fact);
  }
  await expect(page.getByText("Notice version 2026-11-26.")).toBeVisible();
});

// ---------- AUDW-07: the guard-day equation is readable at 1024 ----------

test("AUDW-07 the guard-day boxes on /pricing are not crushed at 1024", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto(NO_RECEIVER + "/pricing");
  const heading = page.getByRole("heading", { name: "What is a guard day?" });
  const boxes = heading.locator("xpath=following-sibling::div[1]").locator(".rounded-card");
  await expect(boxes).toHaveCount(3);
  for (const box of await boxes.all()) {
    const { width } = (await box.boundingBox())!;
    expect(width, "guard-day box width").toBeGreaterThan(140);
    // No word is broken across lines: the label's words each fit on a line.
    const label = box.locator("p").last();
    const lines = await label.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
    expect(lines, "label lines").toBeLessThanOrEqual(3);
  }
});

// ---------- AUDW-11: /about labels match the rest of the site ----------

test("AUDW-11 /about labels equipment By quote and names only labels the site uses", async ({ page }) => {
  await page.goto(NO_RECEIVER + "/about");
  const offers = page.locator("#about-offers").locator("xpath=..");
  await expect(offers.locator(".badge", { hasText: /^Available$/ })).toHaveCount(0);
  await expect(offers.locator(".badge-quote", { hasText: "By quote" })).toHaveCount(2);
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/marked available, pilot, in development or planned/);
  expect(text).toMatch(/(Pilot|Live), Beta, In development, Coming soon or By quote/);
});

// ---------- AUDW-10: homepage photographs are shown without JavaScript ----------

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("AUDW-10 the homepage panel photographs are not hidden", async ({ page }) => {
    await page.goto(NO_RECEIVER + "/");
    const photos = page.locator(".so-panel-photo-image");
    expect(await photos.count()).toBeGreaterThan(0);
    const displays = await photos.evaluateAll((imgs) => imgs.map((img) => getComputedStyle(img).display));
    expect(displays.filter((d) => d === "none")).toEqual([]);
  });
});
