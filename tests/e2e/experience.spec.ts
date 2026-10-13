import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("hero opens a real modal, keeps keyboard focus inside and restores it on Escape", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Experience GUARD",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("dialog") !== null,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("QR/NFC interaction advances to recorded evidence and tabs support arrow keys", async ({
  page,
}) => {
  await page.goto("/solutions/security");
  const experience = page.locator("#experience");
  await experience.getByRole("button", { name: "NFC", exact: true }).click();
  await experience.getByRole("button", { name: "Record the NFC scan" }).click();
  await expect(
    experience.getByRole("heading", {
      name: "One scan. Evidence with context.",
    }),
  ).toBeVisible();
  const tab = experience.getByRole("tab", { name: "02 Record" });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    experience.getByRole("tab", { name: "03 Supervise" }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    experience.getByRole("tab", { name: "05 Prove" }),
  ).toHaveAttribute("aria-selected", "true");
  await experience.getByRole("button", { name: "Company scope" }).click();
  await expect(
    experience.getByText("Company scope → service across its clients"),
  ).toBeVisible();
});

test("SOS cannot be acknowledged without signal; restoring signal restarts the example", async ({
  page,
}) => {
  await page.goto("/solutions/security");
  const experience = page.locator("#experience");
  await experience.getByRole("tab", { name: "04 Respond" }).click();
  await experience.getByRole("switch", { name: "Mobile signal" }).click();
  await expect(
    experience.getByRole("button", { name: "Acknowledge SOS" }),
  ).toBeDisabled();
  await expect(
    experience.getByText("Signal required.", { exact: true }),
  ).toBeVisible();
  await experience.getByRole("switch", { name: "Mobile signal" }).click();
  await experience.getByRole("button", { name: "Acknowledge SOS" }).click();
  await expect(
    experience.getByText("Acknowledged.", { exact: true }),
  ).toBeVisible();
  await experience.getByRole("button", { name: "Resolve SOS" }).click();
  await expect(
    experience.getByText("Resolved.", { exact: true }),
  ).toBeVisible();
});

test.describe("reduced motion and mobile touch", () => {
  test.use({
    contextOptions: { reducedMotion: "reduce" },
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  test("manual workflow stays usable without autoplay or animations", async ({
    page,
  }) => {
    await page.goto("/solutions/security");
    const experience = page.locator("#experience");
    await expect(
      experience.getByRole("button", { name: "Play guided tour" }),
    ).toHaveCount(0);
    await experience.getByRole("tab", { name: "05 Prove" }).tap();
    await expect(
      experience.getByRole("heading", {
        name: "Close the loop with service evidence.",
      }),
    ).toBeVisible();
    expect(
      await experience
        .locator(".ops-visual-inner")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
  });
  test("equipment model selection reaches the correctly prefilled quote", async ({
    page,
  }) => {
    await page.goto("/radios-equipment");
    await page.locator(".deferred-equipment").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Tracking", exact: true }).tap();
    await page.getByRole("button", { name: "Teltonika FMB920" }).tap();
    await page.getByRole("link", { name: "Enquire about this model" }).tap();
    await expect(page.locator('select[name="product"]')).toHaveValue("FMB920");
  });
});

for (const width of [320, 360, 390, 430, 768, 1024, 1440, 1920, 2560]) {
  test(`guided demo and equipment remain contained at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Experience GUARD", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const box = await page.getByRole("dialog").boundingBox();
    expect(box!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    for (const route of ["/radios-equipment", "/pricing"]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

for (const width of [390, 1440]) {
  test(`all guided-demo stages pass accessibility checks at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Experience GUARD", exact: true })
      .click();
    for (const name of [
      "01 Scan",
      "02 Record",
      "03 Supervise",
      "04 Respond",
      "05 Prove",
    ]) {
      await page
        .getByRole("dialog")
        .getByRole("tab", { name, exact: true })
        .click();
      const results = await new AxeBuilder({
        page: page as unknown as ConstructorParameters<
          typeof AxeBuilder
        >[0]["page"],
      })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations.map((item) => ({
          id: item.id,
          targets: item.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
    }
  });
}

test("mobile navigation traps keyboard focus and restores the page on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  const menu = page.getByRole("navigation", { name: "Mobile", exact: true });
  const last = menu.getByRole("link").last();
  await last.focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeFocused();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test('equipment has a genuine presentation and quotation links without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3100/radios-equipment');
  await expect(page.locator('.deferred-equipment').getByRole('heading', { name: 'Hytera PNC360S' })).toBeVisible();
  await expect(page.locator('.deferred-equipment').getByRole('link', { name: 'Enquire about this model' })).toHaveAttribute('href', '/radios-equipment?model=Hytera%20PNC360S#quote');
  await context.close();
});
