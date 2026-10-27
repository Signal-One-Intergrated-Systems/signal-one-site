import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function openForm(page: import("@playwright/test").Page) {
  await page.goto("/connect/andisiwe");
  await page.getByRole("button", { name: /Share my details/i }).click();
  await expect(page.getByRole("heading", { name: "Introduce yourself" })).toBeVisible();
}

test("closed by default; preparing an invalid email never launches or stores anything", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", req => { if (req.method() !== "GET") posts.push(req.url()); });
  await openForm(page);
  await expect(page.getByRole("link", { name: "Open email app" })).toHaveCount(0);
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.locator("p[role=alert]")).toContainText("Correct the highlighted fields");
  await expect(page.getByText("Enter your full name (2–80 characters).")).toBeVisible();
  await expect(page.getByText("Confirm that you choose to include your details")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open email app" })).toHaveCount(0);
  expect(posts).toEqual([]);
});

test("valid email produces only a user-controlled mailto handoff", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", req => { if (req.method() !== "GET") posts.push(req.url()); });
  await openForm(page);
  await page.getByRole("textbox", { name: /Full name/i }).fill("Lerato Molefe");
  await page.getByRole("textbox", { name: "Email address" }).fill("lerato@example.org");
  await page.getByRole("textbox", { name: /Company/i }).fill("Safety Operations");
  await page.getByLabel("What interests you?").selectOption("Security operations and Guard");
  await page.getByRole("textbox", { name: /Short message/i }).fill("We want to review patrol management.");
  await page.getByRole("checkbox", { name: /I choose to include these details/i }).check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  const link = page.getByRole("link", { name: "Open email app" });
  await expect(link).toBeVisible();
  const href = await link.getAttribute("href");
  expect(href).toMatch(/^mailto:sales@signalone\.co\.za\?/);
  const mailto = new URL(href!);
  expect(mailto.searchParams.get("subject")).toContain("Andisiwe Satshwa");
  expect(mailto.searchParams.get("body")).toContain("Lerato Molefe");
  expect(mailto.searchParams.get("body")).toContain("Security operations and Guard");
  expect(mailto.searchParams.get("body")).toContain("We want to review patrol management.");
  await expect(page.getByText(/The message is prepared, not sent or saved/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toHaveAttribute("href", "/contact/andisiwe");
  expect(posts).toEqual([]);
});

test("phone-only contact works and malformed email is rejected", async ({ page }) => {
  await openForm(page);
  await page.getByRole("textbox", { name: /Full name/i }).fill("Nomsa Dube");
  await page.getByRole("textbox", { name: "Email address" }).fill("broken-at-example");
  await page.getByRole("textbox", { name: "Phone number" }).fill("+27 82 123 4567");
  await page.getByRole("checkbox", { name: /I choose to include these details/i }).check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open email app" })).toHaveCount(0);
  await page.getByRole("textbox", { name: "Email address" }).clear();
  await page.getByRole("button", { name: "Prepare email" }).click();
  const mailto = new URL((await page.getByRole("link", { name: "Open email app" }).getAttribute("href"))!);
  expect(mailto.searchParams.get("body")).toContain("+27 82 123 4567");
});

test("dismissing the optional form erases every entered value and prepared email", async ({ page }) => {
  await openForm(page);
  const name = page.getByRole("textbox", { name: /Full name/i });
  await name.fill("Private User");
  await page.getByRole("textbox", { name: "Email address" }).fill("private@example.org");
  await page.getByRole("checkbox", { name: /I choose to include these details/i }).check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.getByRole("link", { name: "Open email app" })).toBeVisible();
  await page.getByRole("button", { name: /Share my details/i }).click();
  await expect(page.locator("form")).toHaveCount(0);
  await page.getByRole("button", { name: /Share my details/i }).click();
  await expect(page.getByRole("textbox", { name: /Full name/i })).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "Email address" })).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: /I choose to include these details/i })).not.toBeChecked();
  await expect(page.getByRole("link", { name: "Open email app" })).toHaveCount(0);
});

test("denied clipboard offers a read-only message instead of claiming a copy", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", {
    configurable: true, value: { writeText: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) },
  }));
  await openForm(page);
  await page.getByRole("textbox", { name: /Full name/i }).fill("Musa Nkosi");
  await page.getByRole("textbox", { name: "Email address" }).fill("musa@example.org");
  await page.getByRole("checkbox", { name: /I choose to include these details/i }).check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  await page.getByRole("button", { name: "Copy email instead" }).click();
  await expect(page.getByRole("textbox", { name: "Copy this message manually" })).toHaveValue(/Musa Nkosi/);
  await expect(page.getByText(/Email message copied/)).toHaveCount(0);
});

test("successful clipboard copy is not a claim that an email was delivered", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: (value: string) => {
      (window as typeof window & { __preparedEmail?: string }).__preparedEmail = value;
      return Promise.resolve();
    } },
  }));
  await openForm(page);
  await page.getByRole("textbox", { name: /Full name/i }).fill("Sam Khumalo");
  await page.getByRole("textbox", { name: "Email address" }).fill("sam@example.org");
  await page.getByRole("checkbox", { name: /I choose to include these details/i }).check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  await page.getByRole("button", { name: "Copy email instead" }).click();
  expect(await page.evaluate(() => (window as typeof window & { __preparedEmail?: string }).__preparedEmail)).toContain("Sam Khumalo");
  await expect(page.getByRole("status").last()).toContainText("Paste it into your email application");
  await expect(page.getByText(/The message is prepared, not sent or saved/)).toBeVisible();
});

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`expanded exchange at ${width}px stays within screen and passes accessibility`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 430 ? 667 : 900 });
    await openForm(page);
    await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const prepare = page.getByRole("button", { name: "Prepare email" });
    const height = await prepare.evaluate(x => x.getBoundingClientRect().height);
    expect(height).toBeGreaterThanOrEqual(48);
    const audit = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(audit.violations).toEqual([]);
    await page.screenshot({ path: `connect-test-results/exchange-${width}.png`, fullPage: true });
  });
}
