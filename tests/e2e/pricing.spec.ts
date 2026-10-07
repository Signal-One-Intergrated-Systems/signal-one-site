import { expect, test } from "@playwright/test";
import { guardDayPrice, schemaPrice } from "../../app/lib/pricing";
import { routes } from "./routes";

// A guard-day price is an "R<amount>" followed by "per guard", "per day" or "/day",
// or preceded by "×". Every one rendered anywhere must come from app/lib/pricing.ts.
function priceStrings(html: string) {
  const attrs = [...html.matchAll(/(?:content|alt|title)="([^"]*)"/g)].map((m) => m[1]);
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;| /g, " ");
  const found: string[] = [];
  for (const chunk of [text, ...attrs]) {
    for (const m of chunk.matchAll(/(×\s*)?\bR\s?\d[\d ]*(?:[.,]\d{1,2})?(?=\s*(?:per guard|per day|\/day|\/guard))/gi)) found.push(m[0]);
    for (const m of chunk.matchAll(/×\s*R\s?\d+(?:[.,]\d{1,2})?/g)) found.push(m[0]);
  }
  return found.map((s) => s.replace(/^×\s*/, "").replace(/\s+/g, ""));
}

test("every rendered guard-day price comes from lib/pricing.ts", async ({ request }) => {
  let seen = 0;
  for (const route of routes) {
    const html = await (await request.get(route)).text();
    for (const price of priceStrings(html)) {
      seen += 1;
      expect(price, route).toBe(guardDayPrice.replace(/\s+/g, ""));
    }
  }
  // The price appears on many pages; if this drops to zero the matcher is broken.
  expect(seen).toBeGreaterThan(10);
});

test("JSON-LD and pricing OG use the same price", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain(`"price":"${schemaPrice}"`);
  const og = await (await request.get("/pricing")).text();
  expect(og).toContain(guardDayPrice + " per guard per day");
});
