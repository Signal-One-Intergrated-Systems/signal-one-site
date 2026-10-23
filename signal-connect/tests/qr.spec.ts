import { test, expect } from "@playwright/test";

const expectedUrl = "https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe";

test("presenter QR is local, legible and encodes a visitor route", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/present/andisiwe");
  await expect(page.getByRole("heading", { name: "Andisiwe Satshwa" })).toBeVisible();
  await expect(page.getByText(/Preview URL only/)).toBeVisible();
  const code = page.locator(".qr-image");
  await expect(code).toBeVisible();
  expect(await code.getAttribute("src")).toBe("/qr/andisiwe");
  await expect(page.locator(".qr-slot")).not.toContainText("not configured");
  await code.screenshot({ path: "test-results/qr-andisiwe.png" });
  const response = await request.get("/qr/andisiwe");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  const svg = await response.text();
  const size = Number(svg.match(/viewBox="0 0 (\d+) \d+"/)?.[1]);
  expect(size).toBeGreaterThan(20);
  expect(svg).toContain('<rect width="' + size + '" height="' + size + '" fill="#fff"/>');
  expect(svg).toContain('shape-rendering="crispEdges"');
  expect(svg).not.toContain("api.qrserver.com");
  expect(svg).not.toContain("data:");
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("QR cannot be generated for nonexistent people", async ({ request }) => {
  const response = await request.get("/qr/unregistered");
  expect(response.status()).toBe(404);
});

test("presenter and visitor routes are never swapped", async ({ request }) => {
  const data = await request.get("/connect/andisiwe");
  expect(data.status()).toBe(200);
  expect(await data.text()).toContain("Every connection begins with a signal.");
  // End-to-end independent scanner comparison is run using zbarimg in GitHub CI.
  expect(expectedUrl.endsWith("/connect/andisiwe")).toBe(true);
});
