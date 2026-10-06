import { expect, test } from "@playwright/test";
import { legacyRedirects, routes } from "./routes";

for (const route of routes) {
  test(`route ${route}: 200, one h1, title, canonical`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).trim().length).toBeGreaterThan(10);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, "canonical link").toBeTruthy();
    expect(new URL(canonical!, "http://x").pathname.replace(/\/$/, "") || "/").toBe(route);
  });
}

for (const [from, to] of legacyRedirects) {
  test(`redirect ${from} -> ${to} is a 308`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(new URL(response.headers()["location"], "http://localhost:3100").pathname).toBe(to);
  });
}

test("removed marketplace API returns 404", async ({ request }) => {
  expect((await request.get("/api/marketplace")).status()).toBe(404);
});

test("unknown route shows the branded 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /home|back/i }).first()).toBeVisible();
});

test("sitemap and robots", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of routes.filter((r) => r !== "/join/sales")) {
    expect(xml).toContain("<loc>");
    if (route !== "/") expect(xml).toContain(route + "</loc>");
  }
  expect(xml).not.toContain("/join/sales");
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
});

test("intake API validates input", async ({ request }) => {
  const bad = await request.post("/api/intake", { data: { kind: "nope", data: {} } });
  expect(bad.status()).toBe(400);
  const unconnected = await request.post("/api/intake", { data: { kind: "client", data: { a: "b" } } });
  expect(unconnected.status()).toBe(503);
});
