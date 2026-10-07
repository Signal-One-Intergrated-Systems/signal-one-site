import { expect, test } from "@playwright/test";
import { routes } from "./routes";

const indexable = routes.filter((r) => r !== "/join/sales");

test("titles and descriptions are unique and security-focused", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    const description = (await page.locator('meta[name="description"]').getAttribute("content")) || "";
    expect(title.length, `${route} title`).toBeLessThanOrEqual(70);
    expect(description.length, `${route} description`).toBeGreaterThan(60);
    expect(description.length, `${route} description`).toBeLessThanOrEqual(220);
    expect(titles.has(title), `duplicate title ${title}`).toBe(false);
    expect(descriptions.has(description), `duplicate description on ${route}`).toBe(false);
    titles.add(title);
    descriptions.add(description);
  }
});

for (const route of indexable) {
  test(`og image for ${route}`, async ({ page, request }) => {
    await page.goto(route);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og, "og:image").toBeTruthy();
    const response = await request.get(new URL(og!, "http://localhost:3100").pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).length).toBeGreaterThan(5_000);
  });
}

test("JSON-LD: Organization and SoftwareApplication, no ratings or reviews", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw!) as { "@graph": Array<Record<string, unknown>> };
  const org = data["@graph"].find((n) => n["@type"] === "Organization") as Record<string, unknown>;
  const app = data["@graph"].find((n) => n["@type"] === "SoftwareApplication") as Record<string, unknown>;
  expect(org.name).toBe("Signal One: Integrated Systems");
  expect(org.email).toBe("sales@signalone.co.za");
  expect(app.name).toBe("Signal One Guard");
  const spec = (app.offers as Record<string, unknown>).priceSpecification as Record<string, unknown>;
  expect(spec.price).toBe("2.00");
  expect(spec.priceCurrency).toBe("ZAR");
  expect(spec.unitText).toBe("per guard per day");
  expect(spec.valueAddedTaxIncluded).toBe(false);
  expect(raw).not.toMatch(/aggregateRating|"review"|ratingValue/);
});

test("canonical host redirect is off by default", async ({ request }) => {
  const response = await request.get("/pricing", { headers: { host: "signal-one.up.railway.app" }, maxRedirects: 0 });
  expect(response.status()).toBe(200);
});

test("canonical host redirect sends railway.app hosts to the canonical domain when enabled", async ({ request }) => {
  const redirected = await request.get("http://localhost:3102/pricing?x=1", { headers: { host: "signal-one.up.railway.app" }, maxRedirects: 0 });
  expect(redirected.status()).toBe(308);
  expect(redirected.headers()["location"]).toBe("https://signalone.co.za/pricing?x=1");
  const normal = await request.get("http://localhost:3102/pricing", { maxRedirects: 0 });
  expect(normal.status()).toBe(200);
});
