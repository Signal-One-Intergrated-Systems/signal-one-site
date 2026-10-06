import type { Page } from "@playwright/test";

export const OK_BASE = "http://localhost:3101";

/** Fill every empty visible field in `scope`, choose the first option of each group. */
export async function fillVisible(page: Page, scope = "main") {
  for (const el of await page.$$(`${scope} input:not([type=checkbox]):not([type=radio]):not([type=hidden]), ${scope} textarea`)) {
    if (!(await el.isVisible()) || (await el.inputValue())) continue;
    const type = await el.getAttribute("type");
    const name = (await el.getAttribute("name")) || "";
    const value =
      type === "email" || /email/i.test(name) ? "tester@example.co.za"
      : type === "tel" || /mobile|phone/i.test(name) ? "0821234567"
      : type === "url" ? "https://example.co.za/me"
      : type === "month" ? "2027-06"
      : type === "number" ? "5"
      : "Test value";
    await el.fill(value).catch(() => undefined);
  }
  for (const select of await page.$$(`${scope} select`)) {
    if (!(await select.isVisible()) || (await select.inputValue())) continue;
    const values = await select.$$eval("option", (o) => o.map((x) => (x as HTMLOptionElement).value).filter(Boolean));
    if (values[0]) await select.selectOption(values[0]);
  }
  const radioNames = new Set(await page.$$eval(`${scope} input[type=radio]`, (r) => r.map((x) => (x as HTMLInputElement).name)));
  for (const name of radioNames) {
    if (await page.locator(`${scope} input[type=radio][name="${name}"]:checked`).count()) continue;
    await page.locator(`${scope} input[type=radio][name="${name}"]`).first().check({ force: true });
  }
  const groups: Record<string, import("@playwright/test").ElementHandle[]> = {};
  for (const box of await page.$$(`${scope} input[type=checkbox]`)) {
    const name = (await box.getAttribute("name")) || "_";
    (groups[name] ||= []).push(box);
  }
  for (const list of Object.values(groups)) {
    let any = false;
    for (const box of list) if (await box.isChecked()) any = true;
    if (!any) await list[0].check({ force: true });
  }
}

/** Walk a multi-step journey to its end by filling each step and pressing the form's submit button. */
export async function walkJourney(page: Page, scope = "main", maxSteps = 14) {
  for (let step = 0; step < maxSteps; step++) {
    await fillVisible(page, scope);
    const submit = page.locator(`${scope} form button[type=submit]`).first();
    if (!(await submit.count())) return;
    const label = (await submit.innerText()).trim();
    await submit.click();
    await page.waitForTimeout(450);
    if (/^(Send|Submit)/i.test(label)) {
      await page.waitForTimeout(800);
      return;
    }
  }
}

export async function installGtagStub(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __events: Array<[string, string, Record<string, unknown>]>; gtag: (...a: unknown[]) => void };
    w.__events = [];
    w.gtag = (...args: unknown[]) => {
      w.__events.push(args as [string, string, Record<string, unknown>]);
    };
  });
}

export async function events(page: Page): Promise<string[]> {
  return page.evaluate(() => ((window as unknown as { __events: Array<[string, string]> }).__events || []).filter((e) => e[0] === "event").map((e) => e[1]));
}

export function decodeMailto(href: string) {
  const url = new URL(href);
  return { to: url.pathname, subject: url.searchParams.get("subject") || "", body: url.searchParams.get("body") || "" };
}
