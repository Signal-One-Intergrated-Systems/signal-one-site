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

test("prominent marketing photographs show people; architecture is background context", async ({ page }) => {
  const peopleFirst: Record<string, string> = {
    "/": "approved-security-chef-daylight-2026.png",
    "/solutions/security": "team-briefing",
    "/service": "service-restaurant-operations.jpg",
    "/equipment-marketplace": "guard-site-operations.webp",
    "/guard-marketplace": "team-briefing.webp",
    "/guards": "guard-site-operations",
    "/join/sales": "team-briefing",
    "/guard-attendance-software": "guard-site-operations",
    "/guard-patrol-software": "checkpoint",
    "/ptt-radio-rental": "team-briefing",
    "/radios-equipment": "warehouse-security",
  };
  for (const [route, expected] of Object.entries(peopleFirst)) {
    await page.goto(route);
    const discovered = await page.locator("main img").evaluateAll(imgs =>
      imgs.map(img => ({ src: img.getAttribute("src") ?? "", alt: img.getAttribute("alt") ?? "" }))
    );
    const match = discovered.find(img => img.src.includes(expected));
    expect(match, `No people-first photography on ${route}`).toBeTruthy();
    expect(match?.alt.toLowerCase()).not.toContain("empty");
    expect(match?.alt.toLowerCase()).not.toContain("unoccupied");
  }
  for (const [route, expectedScene] of [
    ["/solutions/security", "control-room.svg"],
    ["/service", "service-dining.svg"],
    ["/equipment-marketplace", "connectivity.svg"],
    ["/guard-marketplace", "campus.svg"],
  ] as const) {
    await page.goto(route);
    const background = await page.locator("main section").first().evaluate(node => getComputedStyle(node).backgroundImage);
    expect(background, `Missing supporting context scene on ${route}`).toContain(expectedScene);
  }
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


test("responsive approved hero shows the full image stage before the glass message", async ({ page }) => {
  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 1024 });
    await page.goto("/");
    const media = page.locator(".so-hero-media");
    const panel = page.locator(".so-hero-copy");
    const image = page.locator(".so-hero-photo");
    await expect(media).toBeVisible();
    await expect(image).toBeVisible();
    const m = await media.boundingBox();
    const p = await panel.boundingBox();
    expect(m).not.toBeNull();
    expect(p).not.toBeNull();
    if (m && p) {
      expect(m.height, "People need a meaningful image stage").toBeGreaterThan(265);
      expect(p.y, "Glass should start after the image, apart from a small float overlap")
        .toBeGreaterThanOrEqual(m.y + m.height - 55);
    }
    await expect(page.locator(".so-hero-copy a[href='/get-started']")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("homepage Guard and Service put people ahead of their section environments", async ({ page, request }) => {
  await page.goto("/");
  const assets = [
    [".so-vertical-visual-guard img", "/images/photo/control-room-team.webp", "image/webp"],
    [".so-vertical-visual-service img", "/images/home/service-restaurant-operations.jpg", "image/jpeg"],
  ] as const;
  for (const [selector, expected, mime] of assets) {
    const photo = page.locator(selector);
    await expect(photo).toHaveAttribute("src", new RegExp(expected.split("/").pop()!));
    const response = await request.get(expected);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain(mime);
  }
  await expect(page.locator(".so-hero-photo")).toHaveAttribute("src", /approved-security-chef-daylight-2026\.png/);
  for (const route of ["/", "/solutions/security", "/service"]) {
    await page.goto(route);
    const visibleImages = await page.locator("main img").evaluateAll(imgs =>
      imgs.filter(img => img.getBoundingClientRect().width > 100).map(img => img.getAttribute("alt")?.toLowerCase() || "")
    );
    expect(visibleImages.some(alt => /security|team|guard|officer|kitchen|restaurant/.test(alt))).toBe(true);
  }
});

test("approved homepage guard-and-chef photograph remains separate from interactive controls", async ({ page, request }) => {
  const photoPath = "/images/home/approved-security-chef-daylight-2026.png";
  const response = await request.get(photoPath);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  expect((await response.body()).byteLength).toBeGreaterThan(50000);
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const image = page.locator(".so-hero-photo");
    const alt = await image.getAttribute("alt") || "";
    expect(alt).toMatch(/security officer/i);
    expect(alt).toMatch(/chef/i);
    expect(alt).toMatch(/SECURITY vest/i);
    const dimensions = await image.evaluate(img => {
      const box = img.getBoundingClientRect();
      const media = img.parentElement!.getBoundingClientRect();
      return {width:box.width, mediaWidth:media.width,
        naturalWidth:(img as HTMLImageElement).naturalWidth};
    });
    expect(dimensions.naturalWidth).toBeGreaterThan(700);
    if (viewport.width >= 1024) {
      expect(dimensions.width).toBeLessThan(dimensions.mediaWidth * 0.65);
      expect(dimensions.width).toBeGreaterThan(dimensions.mediaWidth * 0.5);
    } else {
      expect(dimensions.width).toBeGreaterThan(viewport.width - 2);
    }
    await expect(page.getByRole("link", { name: /get 14 day free trial/i }).first()).toBeVisible();
    await expect(page.locator(".s1-hero-globe-canvas")).toBeVisible();
  }
});
