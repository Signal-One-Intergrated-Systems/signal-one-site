import { expect, test } from "@playwright/test";

test("the flagship journey explains real GUARD workflows without pretending to be live", async ({ page }) => {
  await page.goto("/");
  const journey = page.getByRole("region", { name: "Every action. One connected record." });
  await expect(journey).toBeVisible();
  await expect(journey.getByText("not a live system or fabricated dashboard")).toBeVisible();

  const prove = journey.getByRole("button", { name: "04 The client sees proof" });
  await prove.click();
  await expect(prove).toHaveAttribute("aria-pressed", "true");
  await expect(journey.getByRole("heading", { name: "Close the loop with proof the client can access." })).toBeVisible();
  await expect(journey.getByText("Client proof of service")).toBeVisible();

  await prove.press("ArrowLeft");
  await expect(journey.getByRole("heading", { name: "When attention is needed, there is a clear next action." })).toBeVisible();
  await expect(journey.getByText("SOS delivery requires a mobile signal")).toBeVisible();
});

test("the operational journey remains fully usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const journey = page.getByRole("region", { name: "Every action. One connected record." });
  await expect(journey.getByRole("button", { name: "Play the guided journey" })).toBeDisabled();
  await journey.getByRole("button", { name: "02 The patrol is recorded" }).click();
  await expect(journey.getByRole("heading", { name: "The patrol has evidence, not a paper trail." })).toBeVisible();
});

for (const width of [320, 360, 390, 768, 1440]) {
  test("operational motion has no horizontal scroll at " + width + "px", async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
