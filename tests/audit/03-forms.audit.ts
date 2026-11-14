/**
 * AUDIT step 7 (forms). LOCAL ONLY: port 3200 has no intake upstream (the API answers 503), port 3201
 * forwards to the repo's own mock intake on localhost:4010. Nothing is posted anywhere else; every
 * non-localhost request is aborted.
 *
 * Per form: field inventory (labels, required, autocomplete), empty submit, invalid input, the UI when the
 * upstream is unavailable (must be an honest "not sent" state, never a success) and the UI on a mocked success.
 */
import { test, type Page } from "@playwright/test";
import { fillVisible, hydrated, tick } from "../e2e/helpers";
import { BASE, OK_BASE, contextOptions, shotPath, writeJson, type ViewportName } from "./lib";

test.describe.configure({ mode: "parallel" });

type FormCase = { id: string; path: string; scope: string; start?: (page: Page) => Promise<void>; multiStep: boolean };
const cases: FormCase[] = [
  { id: "contact", path: "/contact", scope: "main form", multiStep: false },
  { id: "marketplace-interest", path: "/guard-marketplace", scope: "main form", multiStep: false },
  { id: "equipment-quote-radios", path: "/radios-equipment", scope: "main form", multiStep: false, start: async (p) => tick(p.getByRole("radio", { name: "Radios and PTT", exact: true })) },
  { id: "equipment-quote-tracking", path: "/radios-equipment", scope: "main form", multiStep: false, start: async (p) => tick(p.getByRole("radio", { name: "Tracking", exact: true })) },
  { id: "equipment-quote-bodycam", path: "/radios-equipment", scope: "main form", multiStep: false, start: async (p) => tick(p.getByRole("radio", { name: "Body cameras", exact: true })) },
  { id: "client-onboarding", path: "/get-started", scope: "main form", multiStep: true },
  { id: "guard-join", path: "/guards/join", scope: "main form", multiStep: true, start: async (p) => { await p.getByRole("button", { name: "Start my profile" }).click(); await p.waitForTimeout(300); } },
  { id: "sales-application", path: "/join/sales", scope: "#apply form", multiStep: true },
];

const describeFields = (page: Page, scope: string) => page.evaluate((scopeSel) => {
  const form = document.querySelector(scopeSel) as HTMLFormElement | null;
  if (!form) return { formFound: false, fields: [], noValidate: null, submitButtons: [] as string[], stepText: "" };
  const vis = (el: Element) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
  const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter((el) => (el as HTMLInputElement).type !== "hidden").map((el) => {
    const f = el as HTMLInputElement;
    const labels = f.labels ? Array.from(f.labels).map((l) => (l.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean) : [];
    const group = f.closest("fieldset")?.querySelector("legend")?.textContent?.replace(/\s+/g, " ").trim() || "";
    const r = f.getBoundingClientRect();
    const cs = getComputedStyle(f);
    return {
      tag: f.tagName.toLowerCase(), type: f.type, name: f.name, id: f.id, label: (labels[0] || f.getAttribute("aria-label") || "").slice(0, 90), legend: group.slice(0, 80),
      hasLabel: labels.length > 0 || !!f.getAttribute("aria-label") || !!f.getAttribute("aria-labelledby"), required: f.required, ariaRequired: f.getAttribute("aria-required"),
      autocomplete: f.getAttribute("autocomplete"), inputMode: f.getAttribute("inputmode"), placeholder: f.getAttribute("placeholder"), maxLength: f.maxLength > 0 ? f.maxLength : null, pattern: f.getAttribute("pattern"),
      visible: vis(f), heightPx: Math.round(r.height), fontPx: parseFloat(cs.fontSize), describedBy: f.getAttribute("aria-describedby"),
    };
  });
  return {
    formFound: true, noValidate: form.noValidate, fields,
    submitButtons: Array.from(form.querySelectorAll("button[type=submit]")).filter(vis).map((b) => (b.textContent || "").trim()),
    otherButtons: Array.from(form.querySelectorAll("button:not([type=submit])")).filter(vis).map((b) => (b.textContent || "").trim()),
    stepText: (form.querySelector("[aria-current=step], .t-kicker, legend, h2, h3")?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100),
  };
}, scope);

const validationState = (page: Page, scope: string) => page.evaluate((scopeSel) => {
  const form = document.querySelector(scopeSel) as HTMLFormElement | null;
  if (!form) return null;
  const txt = (el: Element) => (el.textContent || "").replace(/\s+/g, " ").trim();
  const a = document.activeElement as HTMLElement | null;
  return {
    ariaInvalid: Array.from(form.querySelectorAll("[aria-invalid=true]")).map((el) => (el as HTMLInputElement).name || el.id),
    nativeInvalid: Array.from(form.querySelectorAll(":invalid")).filter((el) => el.tagName !== "FIELDSET").map((el) => (el as HTMLInputElement).name || el.id),
    alerts: Array.from(form.querySelectorAll("[role=alert]")).map(txt).filter(Boolean).map((t) => t.slice(0, 200)),
    errorTexts: Array.from(form.querySelectorAll(".field-error, [id$='-error'], .text-danger, [class*='danger']")).map(txt).filter(Boolean).map((t) => t.slice(0, 160)).slice(0, 20),
    status: Array.from(document.querySelectorAll("main [role=status]")).map(txt).filter(Boolean).map((t) => t.slice(0, 300)),
    focused: a ? a.tagName.toLowerCase() + (a.getAttribute("name") ? "[name=" + a.getAttribute("name") + "]" : "") + (a.id ? "#" + a.id : "") : "",
    focusedIsInvalidField: !!a && (a.getAttribute("aria-invalid") === "true" || a.matches(":invalid")),
    errorsLinkedToFields: Array.from(form.querySelectorAll("[aria-invalid=true]")).every((el) => { const id = el.getAttribute("aria-describedby"); return !!id && id.split(/\s+/).some((x) => !!document.getElementById(x)); }),
  };
}, scope);

async function walk(page: Page, scope: string, record?: (step: number) => Promise<void>) {
  for (let step = 0; step < 16; step++) {
    if (record) await record(step);
    await fillVisible(page, scope);
    const submit = page.locator(`${scope} button[type=submit]`).first();
    if (!(await submit.count())) return;
    const label = (await submit.innerText()).trim();
    await submit.click();
    await page.waitForTimeout(500);
    if (/^(Send|Submit)/i.test(label)) { await page.waitForTimeout(1200); return; }
  }
}

for (const c of cases) {
  for (const viewport of ["desktop", "mobile"] as ViewportName[]) {
    test(`form ${c.id} ${viewport}`, async ({ browser }) => {
      const result: Record<string, unknown> = { id: c.id, path: c.path, viewport, multiStep: c.multiStep };
      const newPage = async (base: string) => {
        const context = await browser.newContext(contextOptions(viewport));
        await context.route((url) => /^https?:/.test(url.href) && !/^https?:\/\/localhost:(32\d\d|4010)\//.test(url.href), (r) => r.abort());
        const page = await context.newPage();
        const posts: Array<{ url: string; status: number; body: string }> = [];
        page.on("response", async (r) => { if (r.request().method() === "POST") posts.push({ url: r.url().replace(/^https?:\/\/[^/]+/, ""), status: r.status(), body: (await r.text().catch(() => "")).slice(0, 400) }); });
        await page.goto(base + c.path, { waitUntil: "networkidle" });
        await hydrated(page, c.scope.includes("#apply") ? "#apply" : "main").catch(() => undefined);
        await page.waitForTimeout(400);
        if (c.start) await c.start(page).catch((e) => { result.startError = String(e.message).slice(0, 200); });
        return { context, page, posts };
      };
      const shot = (name: string) => shotPath("screenshots", "forms", `${c.id}-${viewport}-${name}`);
      const safely = async (label: string, fn: () => Promise<void>) => { try { await fn(); } catch (e) { result[label + "Error"] = String((e as Error).message).split("\n")[0].slice(0, 300); } };

      // 1 + 2: inventory and empty submit
      await safely("empty", async () => {
        const { context, page, posts } = await newPage(BASE);
        result.availabilityNotice = await page.locator("main [role=status]").allInnerTexts().catch(() => []);
        result.firstStep = await describeFields(page, c.scope);
        const submit = page.locator(`${c.scope} button[type=submit]`).first();
        if (await submit.count()) {
          await submit.scrollIntoViewIfNeeded();
          await submit.click();
          await page.waitForTimeout(700);
          result.emptySubmit = { ...(await validationState(page, c.scope)), postsMade: posts.length, posts };
          await page.locator(c.scope).first().screenshot({ path: shot("1-empty-submit") }).catch(async () => { await page.screenshot({ path: shot("1-empty-submit") }); });
        } else result.emptySubmit = { note: "no submit button visible on first step" };
        await context.close();
      });

      // 3: invalid input
      await safely("invalid", async () => {
        const { context, page, posts } = await newPage(BASE);
        const filled: string[] = [];
        // multi-step journeys: walk forward until a step holds an email/phone field
        for (let step = 0; step < 12; step++) {
          const targets = page.locator(`${c.scope} input[type=email]:visible, ${c.scope} input[type=tel]:visible, ${c.scope} input[name*=email i]:visible, ${c.scope} input[name*=phone i]:visible, ${c.scope} input[name*=mobile i]:visible`);
          if (await targets.count()) break;
          if (!c.multiStep) break;
          await fillVisible(page, c.scope);
          const next = page.locator(`${c.scope} button[type=submit]`).first();
          if (!(await next.count()) || /^(Send|Submit)/i.test((await next.innerText()).trim())) break;
          await next.click();
          await page.waitForTimeout(450);
        }
        await fillVisible(page, c.scope);
        for (const el of await page.locator(`${c.scope} input:visible`).elementHandles()) {
          const type = await el.getAttribute("type"); const name = (await el.getAttribute("name")) || "";
          if (type === "email" || /email/i.test(name)) { await el.fill("not-an-email"); filled.push(name + "=not-an-email"); }
          else if (type === "tel" || /phone|mobile|whatsapp/i.test(name)) { await el.fill("12"); filled.push(name + "=12"); }
          else if (type === "url") { await el.fill("not a url"); filled.push(name + "=not a url"); }
        }
        const submit = page.locator(`${c.scope} button[type=submit]`).first();
        const label = (await submit.count()) ? (await submit.innerText()).trim() : "";
        if (await submit.count()) { await submit.click(); await page.waitForTimeout(800); }
        result.invalidInput = { filled, submitLabel: label, ...(await validationState(page, c.scope)), postsMade: posts.length, posts, stillOnSameStep: (await submit.count()) ? (await page.locator(`${c.scope} button[type=submit]`).first().innerText().catch(() => "")).trim() === label : null };
        await page.locator(c.scope).first().screenshot({ path: shot("2-invalid-input") }).catch(async () => { await page.screenshot({ path: shot("2-invalid-input") }); });
        await context.close();
      });

      // 4: upstream unavailable (no SIGNAL_ONE_INTAKE_URL): must be honest
      await safely("unavailable", async () => {
        const { context, page, posts } = await newPage(BASE);
        const steps: unknown[] = [];
        if (c.multiStep) await walk(page, c.scope, async (step) => { const d = await describeFields(page, c.scope); if (d.formFound) steps.push({ step, ...d }); });
        else { await fillVisible(page, c.scope); await page.locator(`${c.scope} button[type=submit]`).first().click(); }
        await page.waitForTimeout(2500);
        const mainText = (await page.locator("main").innerText()).replace(/\s+/g, " ");
        const formText = (await page.locator(c.scope).first().innerText().catch(() => "")).replace(/\s+/g, " ");
        result.steps = steps.length ? steps : undefined;
        result.upstreamUnavailable = {
          posts, apiStatus: posts.find((p) => p.url.startsWith("/api/intake"))?.status ?? null,
          alerts: await page.locator("main [role=alert]").allInnerTexts(), statuses: await page.locator("main [role=status]").allInnerTexts(),
          mailtoFallback: await page.locator('main a[href^="mailto:sales@signalone.co.za"][href*="subject="]').count(),
          mailtoHrefSample: ((await page.locator('main a[href^="mailto:sales@signalone.co.za"][href*="subject="]').first().getAttribute("href").catch(() => "")) || "").slice(0, 260),
          successLikeWording: (mainText.match(/thank you[^.]*\.|we(?:'|’)ve received[^.]*\.|has been (?:sent|received|submitted)[^.]*\.|successfully[^.]*\.|we(?:'|’)ll be in touch[^.]*\.|request received[^.]*\./gi) || []).slice(0, 6),
          formTextAfter: formText.slice(0, 700),
        };
        await page.screenshot({ path: shot("3-upstream-unavailable"), fullPage: false });
        await context.close();
      });

      // 5: mocked success (local mock intake only)
      await safely("success", async () => {
        const { context, page, posts } = await newPage(OK_BASE);
        if (c.multiStep) await walk(page, c.scope); else { await fillVisible(page, c.scope); await page.locator(`${c.scope} button[type=submit]`).first().click(); }
        await page.waitForTimeout(2500);
        const mainText = (await page.locator("main").innerText()).replace(/\s+/g, " ");
        result.mockedSuccess = {
          posts, apiStatus: posts.find((p) => p.url.startsWith("/api/intake"))?.status ?? null,
          statuses: await page.locator("main [role=status]").allInnerTexts(), alerts: await page.locator("main [role=alert]").allInnerTexts(),
          mailtoFallback: await page.locator('main a[href^="mailto:sales@signalone.co.za"][href*="subject="]').count(),
          reference: (mainText.match(/QA-[A-Z-]+-\d+/) || [])[0] || null, formStillPresent: await page.locator(c.scope).count(),
          focusAfter: await page.evaluate(() => { const a = document.activeElement; return a ? a.tagName.toLowerCase() + (a.getAttribute("role") ? "[role=" + a.getAttribute("role") + "]" : "") : ""; }),
        };
        await page.screenshot({ path: shot("4-mocked-success"), fullPage: false });
        await context.close();
      });

      writeJson(`parts/forms/${c.id}--${viewport}.json`, result);
    });
  }
}

// Signal Connect: with the exchange gate closed (no CONNECT_* env) the visitor card must not offer a live form.
test("connect forms state (exchange gate closed)", async ({ browser }) => {
  const context = await browser.newContext(contextOptions("mobile"));
  await context.route((url) => /^https?:/.test(url.href) && !/^https?:\/\/localhost:32\d\d\//.test(url.href), (r) => r.abort());
  const page = await context.newPage();
  const out: Record<string, unknown> = {};
  for (const path of ["/connect/andisiwe", "/present/andisiwe"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    out[path] = {
      forms: await page.locator("form").count(), inputs: await page.locator("input, select, textarea").count(),
      buttons: await page.locator("button").allInnerTexts(), links: await page.locator("a[href]").evaluateAll((els) => els.map((a) => ({ text: (a.textContent || "").trim().slice(0, 50), href: a.getAttribute("href") }))),
      text: (await page.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 900),
    };
  }
  const status = await page.request.get(BASE + "/api/connect-status");
  out.connectStatus = await status.json();
  writeJson("parts/forms/connect.json", out);
  await context.close();
});
