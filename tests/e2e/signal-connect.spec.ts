import { expect, test } from "@playwright/test";

const PAGE = "/connect/andisiwe.html";
const VISITOR = "/connect/andisiwe";

test("QR destination opens visitor introduction, not presenter", async ({ page }) => {
  await page.goto(VISITOR);
  await expect(page.getByRole("heading", { name: /One promise/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Connect with Andisiwe/ })).toBeVisible();
});

test("presenter shortcut displays scannable QR and correct Founder title", async ({ page }) => {
  await page.goto(PAGE + "?presenter=1");
  await expect(page.getByRole("heading", { name: /Every connection begins with a signal/i })).toBeVisible();
  await expect(page.locator('svg[aria-label="QR for Andisiwe Satshwa Signal Connect page"]')).toBeVisible();
  await expect(page.getByText("Founder", { exact: true })).toBeVisible();
});

test("visitor can save founder contact without completing form", async ({ page }) => {
  await page.goto(PAGE);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Save Andisiwe.s contact/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Signal-One-Andisiwe.vcf");
});

test("photographic story preserves five chapters", async ({ page }) => {
  await page.goto(PAGE);
  await page.getByRole("button", { name: /Explore the Signal One story/i }).click();
  for (const chapter of ["WIN", "HIRE", "RUN", "EQUIP", "PROVE"]) {
    await expect(page.getByText(new RegExp("/ " + chapter))).toBeVisible();
    await expect(page.locator(".story-image")).toBeVisible();
    if (chapter !== "PROVE") await page.getByRole("button", { name: /Continue/i }).click();
  }
  await page.getByRole("button", { name: /Connect/i }).click();
  await expect(page.getByRole("heading", { name: /What can we connect for you/i })).toBeVisible();
});

test("unconnected intake refuses false success and offers email handoff", async ({ page }) => {
  await page.goto(PAGE);
  await page.getByRole("button", { name: /Connect with Andisiwe/i }).click();
  await page.locator("#fullName").fill("Thandi Mokoena");
  await page.locator("#email").fill("thandi@example.com");
  await page.locator("#contactConsent").check();
  await page.locator("#submitButton").click();
  await expect(page.getByText(/Nothing has been saved/)).toBeVisible();
  await expect(page.locator('a[href^="mailto:sales@signalone.co.za"]')).toBeVisible();
  await expect(page.getByText(/You're connected/)).toHaveCount(0);
});

test("configured intake records approved introduction and shows confirmation", async ({ page, request }) => {
  await page.goto("http://localhost:3101" + PAGE);
  await page.getByRole("button", { name: /Connect with Andisiwe/i }).click();
  await page.locator("#fullName").fill("Lebo Dlamini");
  await page.locator("#company").fill("Example Security");
  await page.locator("#email").fill("lebo@example.com");
  await page.locator('[data-interest="guard"]').click();
  await page.locator("#contactConsent").check();
  await page.locator("#submitButton").click();
  await expect(page.getByRole("heading", { name: /connected/i })).toBeVisible();
  const received = (await (await request.get("http://localhost:4010/received")).json()) as Array<{
    body: { kind: string; source: string; data: Record<string, string> };
  }>;
  const match = received.reverse().find((r) => r.body.data?.intent === "signal-connect-introduction"
    && r.body.data?.fullName === "Lebo Dlamini");
  expect(match).toBeTruthy();
  expect(match!.body.kind).toBe("client");
  expect(match!.body.source).toBe("signal-one-site");
  expect(match!.body.data.presenterId).toBe("andisiwe");
  expect(match!.body.data.interests).toContain("Guard");
});
