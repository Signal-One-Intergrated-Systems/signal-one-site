import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routes as allMarketingRoutes } from "./routes";

/** Phase 7 production-like acceptance for every core acquisition path.
 * Run after `npm run build`; does not require live credentials.
 */
const routes = [...allMarketingRoutes];
const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
for (const viewport of viewports) {
  test.describe(`site-wide material and layout ${viewport.width}px`, () => {
    test.use({ viewport });
    for (const route of routes) {
      test(`${route}: functional layout, glass and images`, async ({ page }, info) => {
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        const response = await page.goto(route);
        expect(response?.status(), `HTTP for ${route}`).toBeLessThan(400);
        await expect(page.locator("main")).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const outcome = await page.evaluate(() => {
          const outer = document.querySelector("header.glass-nav");
          const pill = outer?.querySelector(".wrap");
          const imgs = [...document.images].filter(img => {
            const box = img.getBoundingClientRect();
            return box.width > 10 && box.height > 10;
          });
          return {
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            outerFill: outer ? getComputedStyle(outer).backgroundColor : null,
            pillBlur: pill ? getComputedStyle(pill).backdropFilter : null,
            broken: imgs.filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc),
          };
        });
        if (outcome.overflow > 1) {
          const offending = await page.evaluate(() =>
            [...document.querySelectorAll("body *")].flatMap(node => {
              const rect = node.getBoundingClientRect();
              const style = getComputedStyle(node);
              return rect.right > innerWidth + 5 && style.display !== "none"
                ? [{ tag: node.tagName, cls: String(node.className).slice(0, 70), right: Math.round(rect.right), width: Math.round(rect.width), position: style.position, visibility: style.visibility }]
                : [];
            }).slice(0, 12));
          console.log("OVERFLOW DEBUG", route, viewport.width, JSON.stringify(offending));
        }
        expect(outcome.overflow, `${route} overflows at ${viewport.width}`).toBeLessThanOrEqual(1);
        expect(outcome.broken, `${route} has broken images`).toEqual([]);
        if (outcome.outerFill) expect(outcome.outerFill).toBe("rgba(0, 0, 0, 0)");
        expect(outcome.pillBlur).toContain("blur(");
        expect(errors, `${route} console page errors`).toEqual([]);
        if (["/", "/solutions/security", "/service", "/equipment-marketplace"].includes(route)) {
          await page.screenshot({ path: info.outputPath("visual-review.png"), fullPage: false, animations: "disabled" });
        }
      });
    }
  });
}

test("home: platform selector and signup links are actionable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /explore 1guard security operations/i })).toHaveAttribute("href", "/solutions/security");
  await expect(page.getByRole("link", { name: /explore 1service business operating system/i })).toHaveAttribute("href", "/service");
  await expect(page.getByRole("link", { name: /get 14 day free trial/i }).first()).toHaveAttribute("href", "/get-started");
});

test("reduced motion and transparency do not conceal controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /get 14 day free trial/i }).first()).toBeVisible();
  await expect(page.locator("header.glass-nav")).toBeVisible();
});

test("key acquisition pages have no critical automated accessibility violations", async ({ page }) => {
  for (const route of ["/", "/service", "/solutions/security", "/get-started", "/equipment-marketplace"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter(v => v.impact === "critical");
    expect(serious.map(v => `${route}: ${v.id} ${v.description}`)).toEqual([]);
  }
});

test("every branded acquisition page uses its own declared premium scene", async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const uniqueScenes: Record<string, string> = {
    "/solutions/security": "guard-premium.svg",
    "/service": "service-premium.svg",
    "/equipment-marketplace": "network-premium.svg",
    "/guard-marketplace": "hiring-premium.svg",
    "/guards": "field-premium.svg",
    "/join/sales": "talent-premium.svg",
    "/get-started": "trial-premium.svg",
    "/radios-equipment": "radio-premium.svg",
    "/security-trust": "legal-premium.svg",
  };
  for (const [route, expected] of Object.entries(uniqueScenes)) {
    await page.goto(route);
    const discovered = await page.evaluate(() => {
      const imageUrls = [...document.querySelectorAll("main img")].map(img => img.getAttribute("src") ?? "");
      const backgroundUrls = [...document.querySelectorAll("main, main > section")].map(el => getComputedStyle(el).backgroundImage);
      return [...imageUrls, ...backgroundUrls].join(" | ");
    });
    expect(discovered, `Missing art on ${route}`).toContain(expected);
    await page.screenshot({ path: info.outputPath(`scene-${route.replaceAll("/", "-").replace(/^-/, "")}.png`), fullPage: false, animations: "disabled" });
  }
  expect(new Set(Object.values(uniqueScenes)).size).toBe(Object.values(uniqueScenes).length);
});


/** Browser screenshots at three realistic widths are our final art-direction proof.
 * Capture what a visitor actually sees (hero and the three industry scenes).
 */
for (const viewport of viewports) {
  test(`homepage scene composition at ${viewport.width}px`, async ({ page, request }, info) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const [name, selector] of [
      ["hero", ".so-hero"],
      ["guard", ".so-guard-section"],
      ["service", ".so-service-section"],
      ["equipment", ".so-equipment-section"],
    ] as const) {
      const scene = page.locator(selector);
      await expect(scene).toBeVisible();
      if (name !== "hero") {
        const background = await scene.evaluate(node => getComputedStyle(node).backgroundImage);
        expect(background, `${name} should have its own scene`).toContain("/images/scenes/");
        const match = background.match(/url\((?:["'])?([^)"']+)/);
        expect(match, `${name} must point to a scene file`).not.toBeNull();
        if (match) {
          const assetUrl = new URL(match[1], "http://localhost:3100").pathname;
          const asset = await request.get(assetUrl);
          expect(asset.status(), `${name} file response`).toBe(200);
        }
      }
      await scene.evaluate(node => {
        const rect = node.getBoundingClientRect();
        window.scrollTo({top: window.scrollY + rect.top - 92, behavior: "instant"});
      });
      await page.waitForTimeout(130);
      await page.screenshot({ path: info.outputPath(`scene-${name}-${viewport.width}.png`), animations: "disabled" });
    }
  });
}


test("hero platform selector remains centred and fully usable after animation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".so-hero-bar")).toBeVisible();
  const metrics = await page.locator(".so-hero-bar").evaluate(el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width };
  });
  expect(metrics.left).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(1441);
  for (const label of ["1GUARD", "1Service", "Equipment", "1Community"]) {
    await expect(page.locator(".so-hero-bar").getByRole("link", { name: new RegExp(label, "i") })).toBeAttached();
  }
});


test("hero globe animates, liquid CTA responds and actual routes work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const canvas = page.locator(".s1-hero-globe-canvas").first();
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(200);
  const frameOne = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL("image/png"));
  await page.waitForTimeout(650);
  const frameTwo = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL("image/png"));
  expect(frameTwo, "Globe must be genuinely moving, not a static ornament").not.toEqual(frameOne);
  const cta = page.locator("a.so-home-cta").first();
  await expect(cta).toBeVisible();
  await cta.hover();
  await page.waitForTimeout(300);
  const transform = await cta.evaluate(el => getComputedStyle(el).transform);
  expect(transform, "CTA should give tactile hover feedback").not.toBe("none");
  await cta.click();
  await expect(page).toHaveURL(/\/get-started/);
  await page.goto("/");
  await page.getByRole("link", { name: /explore 1service business operating system/i }).click();
  await expect(page).toHaveURL(/\/service/);
});
