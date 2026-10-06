/**
 * Captures the Signal One Guard screens used in the product-proof frames.
 *
 *   GUARD_CAPTURE_URL=https://staging.example GUARD_CAPTURE_USER=... GUARD_CAPTURE_PASS=... \
 *     node scripts/capture-product.mjs
 *
 * Credentials come from the environment only; never commit them. Run it once
 * the curated demo tenant (docs/PHOTOGRAPHY_BRIEF.md, "Product capture") is on
 * staging. Playwright is not a dependency of the site: run it with
 * `npx -p playwright node scripts/capture-product.mjs` or install it locally.
 *
 * Optional env:
 *   GUARD_CAPTURE_MOBILE_URL  page for the guard mobile view (default: GUARD_CAPTURE_URL)
 *   GUARD_CAPTURE_HIDE        CSS selector to hide before capture (for example the Central Device tab)
 *   GUARD_CAPTURE_OUT         output directory (default public/images/product-proof)
 *
 * Output (2x): my-operation.png, control-room.png, proof-of-service.png,
 * people-access.png (1440 viewport, 2880px wide) and guard-mobile.png
 * (390 viewport, 780px wide). Then cut the crops listed in app/lib/productProof.ts.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.env.GUARD_CAPTURE_URL;
const user = process.env.GUARD_CAPTURE_USER;
const pass = process.env.GUARD_CAPTURE_PASS;
const outDir = process.env.GUARD_CAPTURE_OUT || "public/images/product-proof";

if (!base || !user || !pass) {
  console.error("Set GUARD_CAPTURE_URL, GUARD_CAPTURE_USER and GUARD_CAPTURE_PASS.");
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run: npx -p playwright node scripts/capture-product.mjs");
  process.exit(1);
}

const screens = [
  { file: "my-operation", tab: /my operation|command/i },
  { file: "control-room", tab: /control room/i },
  { file: "proof-of-service", tab: /proof of service/i },
  { file: "people-access", tab: /people and access/i },
];

async function login(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  const email = page.locator('input[type="email"], input[name="email"], input[name="username"], input[autocomplete="username"]').first();
  if (await email.count()) {
    await email.fill(user);
    await page.locator('input[type="password"]').first().fill(pass);
    await page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first().click();
    await page.waitForLoadState("networkidle");
  }
}

async function tidy(page) {
  if (process.env.GUARD_CAPTURE_HIDE) {
    await page.addStyleTag({ content: process.env.GUARD_CAPTURE_HIDE + "{display:none!important}" });
  }
  await page.waitForTimeout(800);
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

// Desktop: 1440 viewport at 2x.
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await desktop.newPage();
await login(page, base);
for (const screen of screens) {
  await page.getByRole("link", { name: screen.tab }).first().click().catch(async () => {
    await page.getByText(screen.tab).first().click();
  });
  await page.waitForLoadState("networkidle");
  await tidy(page);
  await page.screenshot({ path: path.join(outDir, screen.file + ".png") });
  console.log("saved", screen.file + ".png");
}

// Guard mobile view: 390 viewport at 2x.
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const phone = await mobile.newPage();
await login(phone, process.env.GUARD_CAPTURE_MOBILE_URL || base);
await tidy(phone);
await phone.screenshot({ path: path.join(outDir, "guard-mobile.png") });
console.log("saved guard-mobile.png");

await browser.close();
