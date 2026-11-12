import { expect, test } from "@playwright/test";

test("public routes share a scene shell and product navigation still works", async ({ page }) => {
 await page.goto("/");
 await expect(page.locator(".s1-scene-route")).toBeVisible();
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1Service/ }).click();
 await expect(page.locator(".sg-entry-wordmark")).toContainText("1Service");
 await expect(page).toHaveURL(/\/service$/);
 await expect(page.locator(".s1-scene-route")).toHaveAttribute("data-scene-route", "/service");
 await expect(page.locator(".s1-scene-route")).not.toHaveAttribute("data-scene-exit", "");
 await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "idle");
 await expect(page.locator("main")).toBeVisible();
});

test("reduced-motion navigation remains immediate and form inputs are accessible", async ({ page }) => {
 await page.emulateMedia({ reducedMotion: "reduce" });
 await page.goto("/get-started");
 await expect(page.getByRole("textbox", { name: "Company name" })).toBeVisible();
 await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1GUARD/ }).click();
 await expect(page).toHaveURL(/\/solutions\/security$/);
});

test("sealed shutters prevent the previous page scrolling through the glass", async ({ page }) => {
 await page.goto("/");
 await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
 const originalScrollY = await page.evaluate(() => window.scrollY);
 expect(originalScrollY).toBeGreaterThan(300);

 const overlay = page.locator(".sg-entry-overlay");
 // Record each phase inside the page at the instant it begins. Reading these from the test process after
 // the fact races the transition itself (a phase can end between two round-trips: seen 1 run in 12).
 await page.evaluate(() => {
  const node = document.querySelector(".sg-entry-overlay") as HTMLElement;
  const log: Array<{ phase: string; background: string; path: string; scrollY: number; overflow: string }> = [];
  (window as unknown as { __phases: typeof log }).__phases = log;
  new MutationObserver(() => log.push({
   phase: node.dataset.guardEntry || "",
   background: getComputedStyle(node).backgroundColor,
   path: location.pathname,
   scrollY: window.scrollY,
   overflow: document.documentElement.style.overflow,
  })).observe(node, { attributes: true, attributeFilter: ["data-guard-entry"] });
 });

 // A real pointer click at the link's on-screen position. locator.click() first runs
 // scrollIntoViewIfNeeded, which itself moves a page whose header is sticky (measured:
 // 900 -> 540 before any site code runs), so it cannot observe what a visitor sees.
 const box = await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1Service/ }).boundingBox();
 expect(box).not.toBeNull();
 await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);

 await expect(page).toHaveURL(/service$/, { timeout: 8000 });
 await expect(overlay).toHaveAttribute("data-guard-entry", "idle", { timeout: 9000 });
 expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");

 const phases = await page.evaluate(() => (window as unknown as { __phases: Array<{ phase: string; background: string; path: string; scrollY: number; overflow: string }> }).__phases);
 expect(phases.map(entry => entry.phase)).toEqual(["closing", "sealed", "opening", "idle"]);
 const [closing, sealed, opening] = phases;
 // The old page stays exactly where it was, scroll-locked, while the glass closes.
 expect(closing.path).toBe("/");
 expect(closing.scrollY).toBe(originalScrollY);
 expect(closing.overflow).toBe("hidden");
 // Sealed: still the old page, still at the same position, and the underlay is already opaque,
 // so the route replacement that follows cannot show through.
 expect(sealed.path).toBe("/");
 expect(sealed.scrollY).toBe(originalScrollY);
 expect(sealed.background).toBe("rgb(25, 33, 39)");
 // The destination has landed at the top BEFORE the glass opens.
 expect(opening.path).toBe("/service");
 expect(opening.scrollY).toBe(0);
});

test("focusing a header link with the keyboard does not move a scrolled page, and Enter then transitions in place", async ({ page }) => {
 await page.goto("/");
 await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
 const originalScrollY = await page.evaluate(() => window.scrollY);
 expect(originalScrollY).toBeGreaterThan(300);
 // An ordinary focus, exactly as Tab gives it (NOT preventScroll): the browser is free to scroll the
 // link "into view", and did, about a second later, while a top scroll-padding covered the header.
 const link = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /1Service/ });
 await link.evaluate((node: HTMLElement) => node.focus());
 await expect(link).toBeFocused();
 await page.waitForTimeout(1500);
 expect(await page.evaluate(() => window.scrollY)).toBe(originalScrollY);

 await page.keyboard.press("Enter");
 await expect(page.locator(".sg-entry-overlay")).toHaveAttribute("data-guard-entry", "closing");
 await page.waitForTimeout(600);
 expect(await page.evaluate(() => window.scrollY)).toBe(originalScrollY);
 await expect(page).toHaveURL(/service$/, { timeout: 8000 });
});

test("in-page anchors and focused controls still clear the sticky header", async ({ page }) => {
 await page.emulateMedia({ reducedMotion: "reduce" });
 await page.goto("/#guard");
 await page.waitForTimeout(800);
 const headerBottom = await page.locator("header.glass-nav").evaluate(node => node.getBoundingClientRect().bottom);
 const sectionTop = await page.locator("#guard").evaluate(node => node.getBoundingClientRect().top);
 // The section starts at or below the header's lower edge (within a few pixels), not hidden beneath it.
 expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 8);
 expect(sectionTop).toBeLessThan(headerBottom + 60);
});
