import { test, expect } from "@playwright/test";

test("visitor opening follows the Signal One mark, not an unrelated global entrance", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/connect/andisiwe");

  const motion = await page.evaluate(() => {
    const mark = document.querySelector("header .s1-pulse")!;
    const card = document.querySelector('[aria-label="Andisiwe Satshwa digital business card"]')!;
    const actions = document.querySelector('[aria-label="Contact actions"]')!;
    const discovery = document.querySelector('section[aria-labelledby="discovery-heading"]')!;
    const pulsing = getComputedStyle(mark, "::after");
    const cardStyle = getComputedStyle(card);
    const actionStyle = getComputedStyle(actions);
    const discoveryStyle = getComputedStyle(discovery);
    return {
      pulseName: pulsing.animationName,
      pulseDuration: pulsing.animationDuration,
      pulseIterations: pulsing.animationIterationCount,
      cardName: cardStyle.animationName,
      cardDuration: cardStyle.animationDuration,
      cardDelay: cardStyle.animationDelay,
      actionName: actionStyle.animationName,
      actionDelay: actionStyle.animationDelay,
      discoveryName: discoveryStyle.animationName,
      discoveryDelay: discoveryStyle.animationDelay,
      genericMainName: getComputedStyle(document.getElementById("main")!).animationName,
    };
  });

  expect(motion.pulseName).toBe("signal-pulse");
  expect(motion.pulseDuration).toBe("2.8s");
  expect(motion.pulseIterations).toBe("infinite");
  expect(motion.cardName).toContain("signal-arrival");
  expect(motion.cardDuration).toBe("0.32s");
  expect(motion.cardDelay).toBe("0s");
  expect(motion.actionName).toContain("signal-arrival");
  expect(motion.actionDelay).toBe("0.07s");
  expect(motion.discoveryName).toContain("signal-arrival");
  expect(motion.discoveryDelay).toBe("0.14s");
  expect(motion.genericMainName).toBe("none");
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("reduced motion renders complete card with zero entrance or pulse animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 667 });
  await page.goto("/connect/andisiwe");
  const state = await page.evaluate(() => ({
    pulse: getComputedStyle(document.querySelector("header .s1-pulse")!, "::after").animationName,
    card: getComputedStyle(document.querySelector('[aria-label="Andisiwe Satshwa digital business card"]')!).animationName,
    actions: getComputedStyle(document.querySelector('[aria-label="Contact actions"]')!).animationName,
    discovery: getComputedStyle(document.querySelector('section[aria-labelledby="discovery-heading"]')!).animationName,
    scroll: document.documentElement.scrollWidth <= innerWidth,
  }));
  expect(state).toEqual({
    pulse: "none", card: "none", actions: "none", discovery: "none", scroll: true,
  });
  await expect(page.getByRole("heading", { name: "Andisiwe Satshwa" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toBeVisible();
});

test("presenter keeps actual scannable QR static while header pulses", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/present/andisiwe");
  const pulse = await page.locator("header .s1-pulse").evaluate(el =>
    getComputedStyle(el, "::after").animationName,
  );
  expect(pulse).toBe("signal-pulse");
  const qr = page.locator(".qr-image");
  await expect(qr).toBeVisible();
  const qrAnimation = await qr.evaluate(el => getComputedStyle(el).animationName);
  expect(qrAnimation).toBe("none");
});

test("opt-in exchange and story transitions use the same short arrival, never a second pulse", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/connect/andisiwe");
  await page.getByRole("button", { name: "Share my details" }).click();
  const panel = page.getByRole("heading", { name: "Introduce yourself" }).locator("..");
  const panelState = await panel.evaluate(el => {
    const s = getComputedStyle(el);
    return { name: s.animationName, duration: s.animationDuration, count: s.animationIterationCount };
  });
  expect(panelState.name).toContain("signal-arrival");
  expect(panelState.duration).toBe("0.32s");
  expect(panelState.count).toBe("1");
  await expect(page.getByRole("link", { name: "Save Andisiwe’s contact" })).toBeVisible();

  await page.goto("/review/story/andisiwe");
  const mediaState = await page.locator("[data-review-media]").evaluate(el => {
    const s = getComputedStyle(el);
    return { name: s.animationName, duration: s.animationDuration, count: s.animationIterationCount };
  });
  expect(mediaState.name).toContain("signal-arrival");
  expect(mediaState.duration).toBe("0.32s");
  expect(mediaState.count).toBe("1");
  await expect(page.getByRole("button", { name: "Next chapter" })).toBeEnabled();
});
