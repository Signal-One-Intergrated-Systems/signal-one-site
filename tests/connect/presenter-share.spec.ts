import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const visitorUrl = "https://www.signalone.co.za/connect/andisiwe";

test("presenter native share uses a trusted visitor URL in the click gesture", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: (data: ShareData) => {
        (window as typeof window & { __shared?: ShareData }).__shared = data;
        return Promise.resolve();
      },
    });
  });
  await page.goto("/present/andisiwe");
  await expect(page.getByRole("heading", { name: "Andisiwe Satshwa" })).toBeVisible();
  await page.getByRole("button", { name: "Share link" }).click();
  const data = await page.evaluate(() => (window as typeof window & { __shared?: ShareData }).__shared);
  expect(data?.url).toBe(visitorUrl);
  expect(data?.title).toContain("Andisiwe Satshwa");
  expect(data?.url).not.toContain("/present/");
  await expect(page.locator(".share-fallback")).toHaveCount(0);
});

test("unsupported native share copies the same visitor URL", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (value: string) => {
          (window as typeof window & { __copied?: string }).__copied = value;
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto("/present/andisiwe");
  await page.getByRole("button", { name: "Share link" }).click();
  const copied = await page.evaluate(() => (window as typeof window & { __copied?: string }).__copied);
  expect(copied).toBe(visitorUrl);
  await expect(page.getByRole("status").last()).toHaveText("Link copied.");
  await expect(page.locator(".share-fallback")).toHaveCount(0);
});

test("Copy link is independent of native share and confirms clipboard success", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: () => { throw new Error("Unexpected share invocation"); },
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (value: string) => {
          (window as typeof window & { __copied?: string }).__copied = value;
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto("/present/andisiwe");
  await page.getByRole("button", { name: "Copy link" }).click();
  expect(await page.evaluate(() => (window as typeof window & { __copied?: string }).__copied)).toBe(visitorUrl);
  await expect(page.getByText("Link copied.")).toBeVisible();
});

test("clipboard rejection exposes a selectable link, never a fake copied state", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) },
    });
  });
  await page.goto("/present/andisiwe");
  await page.getByRole("button", { name: "Copy link" }).click();
  const input = page.getByRole("textbox", { name: "Visitor link" });
  await expect(input).toBeVisible();
  await expect(input).toHaveValue(visitorUrl);
  await expect(page.getByText("Use the link below to share this card.")).toBeVisible();
  await expect(page.getByText("Link copied.")).toHaveCount(0);
});

test("native share cancellation does not show an error or fake completion", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: () => Promise.reject(new DOMException("Cancelled", "AbortError")),
    });
  });
  await page.goto("/present/andisiwe");
  await page.getByRole("button", { name: "Share link" }).click();
  await expect(page.locator(".share-fallback")).toHaveCount(0);
  await expect(page.getByText("Link copied.")).toHaveCount(0);
  await expect(page.getByText("Use the link below to share this card.")).toHaveCount(0);
});

test("native share failure reveals manual URL without claiming sharing succeeded", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: () => Promise.reject(new DOMException("Denied", "NotAllowedError")),
    });
  });
  await page.goto("/present/andisiwe");
  await page.getByRole("button", { name: "Share link" }).click();
  await expect(page.getByRole("textbox", { name: "Visitor link" })).toHaveValue(visitorUrl);
});

test("presenter remains usable on short phones with clear actions and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto("/present/andisiwe");
  await expect(page.locator(".qr-image")).toBeVisible();
  const rect = await page.locator(".qr-image").boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.y + rect!.height).toBeLessThanOrEqual(667);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("button", { name: "Share link" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy link" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Preview the visitor card/ })).toHaveAttribute("href", visitorUrl);
  const axe = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(axe.violations).toEqual([]);
});

test("QR remains available after offline reload once cached on an installed shell", async ({ page, context }) => {
  await page.goto("/present/andisiwe");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.locator(".qr-image")).toBeVisible();
  await expect.poll(async () => page.locator(".qr-image").evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".qr-image")).toBeVisible();
  expect(await page.locator(".qr-image").evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});
