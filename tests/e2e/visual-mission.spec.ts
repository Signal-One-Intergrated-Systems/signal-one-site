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
  await expect(page.getByRole("link", { name: /explore 1guard security business operating system/i })).toHaveAttribute("href", "/solutions/security");
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
    "/": "approved-full-scene-guard-chef-2026.png",
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
    ["/solutions/security", "security-site-planning.webp"],
    ["/service", "hotel-reception-welcome.webp"],
    ["/equipment-marketplace", "warehouse-security-check.webp"],
    ["/guard-marketplace", "security-interview-training.webp"],
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
        expect(background, `${name} should have its appropriate SME-scaled context`).toContain(
          name === "guard" ? "/images/photo/guard-site-operations.webp" :
          name === "service" ? "/images/home/panels/hire-hospitality.webp" :
          "/images/photo/warehouse-security.webp"
        );
        const match = background.match(/url\((?:["'])?([^)"']+)/);
        expect(match, `${name} must point to its contextual image`).not.toBeNull();
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
    [".so-vertical-visual-guard img", "/images/home/approved-sme-security-control-room-2026.png", "image/png"],
    [".so-vertical-visual-service img", "/images/home/service-restaurant-operations.jpg", "image/jpeg"],
  ] as const;
  for (const [selector, expected, mime] of assets) {
    const photo = page.locator(selector);
    await expect(photo).toHaveAttribute("src", new RegExp(expected.split("/").pop()!));
    const response = await request.get(expected);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain(mime);
  }
  await expect(page.locator(".so-hero-photo")).toHaveAttribute("src", /approved-full-scene-guard-chef-2026\.png/);
  for (const route of ["/", "/solutions/security", "/service"]) {
    await page.goto(route);
    const visibleImages = await page.locator("main img").evaluateAll(imgs =>
      imgs.filter(img => img.getBoundingClientRect().width > 100).map(img => img.getAttribute("alt")?.toLowerCase() || "")
    );
    expect(visibleImages.some(alt => /security|team|guard|officer|kitchen|restaurant/.test(alt))).toBe(true);
  }
});

test("approved homepage guard-and-chef photograph remains separate from interactive controls", async ({ page, request }) => {
  const photoPath = "/images/home/approved-full-scene-guard-chef-2026.png";
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
      const nav = document.querySelector("header.glass-nav > .wrap")?.getBoundingClientRect();
      return {width:box.width, mediaWidth:media.width, imageTop:box.top,
        navBottom:nav?.bottom ?? 0,
        naturalWidth:(img as HTMLImageElement).naturalWidth};
    });
    expect(dimensions.naturalWidth).toBeGreaterThan(0);
    if (viewport.width >= 1024) {
      expect(dimensions.width, "Scene must span the globe and the people").toBeGreaterThan(dimensions.mediaWidth * 0.98);
      expect(dimensions.width).toBeLessThanOrEqual(dimensions.mediaWidth + 1);
    } else {
      expect(dimensions.width).toBeGreaterThan(viewport.width - 2);
      if (viewport.width <= 670) {
        expect(dimensions.imageTop, "Photo must start below the mobile navigation pill").toBeGreaterThanOrEqual(dimensions.navBottom - 3);
      }
    }
    await expect(page.getByRole("link", { name: /get 14 day free trial/i }).first()).toBeVisible();
    await expect(page.locator(".s1-hero-globe-canvas")).toBeVisible();
  }
});


test("desktop homepage shows the entire approved guard and chef photograph with no zoom", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1536, height: 960 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const image = page.locator(".so-hero-photo");
    await expect(image).toHaveAttribute("src", /approved-full-scene-guard-chef-2026[.]png/);
    const layout = await image.evaluate(img => {
      const media = img.parentElement!.getBoundingClientRect();
      const picture = img.getBoundingClientRect();
      const nav = document.querySelector("header.glass-nav > .wrap")?.getBoundingClientRect();
      const styles = getComputedStyle(img);
      return {
        fit: styles.objectFit,
        width: picture.width, height: picture.height,
        mediaRight: media.right, pictureRight: picture.right,
        pictureTop: picture.top, navBottom: nav?.bottom ?? 0,
        naturalWidth: (img as HTMLImageElement).naturalWidth,
        naturalHeight: (img as HTMLImageElement).naturalHeight,
      };
    });
    expect(layout.fit, "Keep the entire photograph, never object-fit:cover").toBe("contain");
    expect(layout.width, "Wide photograph should extend behind the globe").toBeGreaterThanOrEqual(viewport.width - 2);
    expect(layout.naturalWidth).toBeGreaterThan(0);
    expect(layout.naturalHeight).toBeGreaterThan(0);
    expect(layout.pictureRight).toBeLessThanOrEqual(layout.mediaRight + 1);
    expect(layout.pictureTop, "Chef's hat must start below glass navigation").toBeGreaterThanOrEqual(layout.navBottom - 3);
    const ratio = layout.naturalWidth / layout.naturalHeight;
    const fitWidth = Math.min(layout.width, layout.height * ratio);
    const fitHeight = Math.min(layout.height, layout.width / ratio);
    expect(fitWidth).toBeGreaterThan(0);
    expect(fitHeight).toBeGreaterThan(0);
    expect(fitWidth).toBeLessThanOrEqual(layout.width + 1);
    expect(fitHeight).toBeLessThanOrEqual(layout.height + 1);
  }
});


// Wide full scene must be the foreground image layer across the *whole* hero,
// not a cropped 59% panel on the right. The globe and glass must remain intact.
test("approved full-scene hero spans behind the globe without cropping the chef on desktop", async ({page,request}) => {
  const source="/images/home/approved-full-scene-guard-chef-2026.png";
  const resp=await request.get(source);
  expect(resp.status()).toBe(200);
  expect(resp.headers()["content-type"]).toContain("image/png");
  for(const width of [1280,1440,1536,1920]){
    await page.setViewportSize({width,height:960});
    await page.goto("/");
    const metrics=await page.locator(".so-hero-photo").evaluate(img=>{
      const imageRect=img.getBoundingClientRect();
      const mediaRect=img.parentElement!.getBoundingClientRect();
      const style=getComputedStyle(img);
      return {imgWidth:imageRect.width,mediaWidth:mediaRect.width,fit:style.objectFit,
        mask:style.maskImage,position:style.objectPosition,photoLoaded:(img as HTMLImageElement).naturalWidth>0};
    });
    expect(metrics.photoLoaded).toBe(true);
    expect(metrics.fit).toBe("contain");
    expect(metrics.imgWidth).toBeGreaterThan(metrics.mediaWidth * 0.98);
    expect(metrics.mask).toBe("none");
    await expect(page.locator(".s1-hero-globe-canvas")).toBeVisible();
    await expect(page.getByRole("link",{name:/get 14 day free trial/i}).first()).toBeVisible();
  }
});


test("every product wordmark shares the same numeral height, baseline and proportional gap", async ({ page }) => {
  const checkSignatures = async () => {
    const signatures = await page.locator(".s1-product-signature:visible").evaluateAll(nodes =>
      nodes.map(node => {
        const one = node.querySelector<HTMLElement>(".s1-product-signature__one")!;
        const name = node.querySelector<HTMLElement>(".s1-product-signature__name")!;
        const oneRect = one.getBoundingClientRect();
        const nameRect = name.getBoundingClientRect();
        const oneStyle = getComputedStyle(one);
        const nameStyle = getComputedStyle(name);
        return {
          product: name.textContent?.trim() ?? "",
          oneSize: parseFloat(oneStyle.fontSize),
          nameSize: parseFloat(nameStyle.fontSize),
          oneWeight: oneStyle.fontWeight,
          nameWeight: nameStyle.fontWeight,
          oneHeight: oneRect.height,
          nameHeight: nameRect.height,
          top: oneRect.top,
          nameTop: nameRect.top,
          gap: nameRect.left - oneRect.right,
        };
      })
    );
    expect(signatures.length, "Expected product logos to render").toBeGreaterThan(0);
    for (const signature of signatures) {
      expect(signature.oneSize, signature.product).toBe(signature.nameSize);
      expect(signature.oneWeight, signature.product).toBe(signature.nameWeight);
      expect(Math.abs(signature.oneHeight - signature.nameHeight), signature.product).toBeLessThan(1);
      expect(Math.abs(signature.top - signature.nameTop), signature.product).toBeLessThan(1);
      expect(signature.gap / signature.oneSize, signature.product).toBeGreaterThan(0.055);
      expect(signature.gap / signature.oneSize, signature.product).toBeLessThan(0.065);
    }
    return signatures.map(item => item.product);
  };

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    if (viewport.width <= 768) {
      const menu = page.getByRole("button", { name: "Menu" });
      await menu.click();
    }
    const names = await checkSignatures();
    expect(names).toContain("GUARD");
    expect(names).toContain("Service");
    expect(names).toContain("Community");

    await page.goto("/service");
    expect((await checkSignatures())).toContain("Service");
  }
});


test("homepage shows credible SME-scale guard operations and an accurately labelled connected journey", async ({page,request}) => {
  const imagePath="/images/home/approved-sme-security-control-room-2026.png";
  const source=await request.get(imagePath);
  expect(source.status()).toBe(200);
  expect(source.headers()["content-type"]).toContain("image/png");
  expect((await source.body()).byteLength).toBeGreaterThan(100000);
  for(const viewport of [{width:375,height:812},{width:768,height:1024},{width:1440,height:900}]){
    await page.setViewportSize(viewport);
    await page.goto("/");
    const photograph=page.locator(".so-vertical-visual-guard img");
    await expect(photograph).toHaveAttribute("alt",/security office for an SME.*supervisor/i);
    const sizes=await photograph.evaluate(img=>({
      loaded:(img as HTMLImageElement).naturalWidth,
      frame:img.parentElement?.getBoundingClientRect().width ?? 0
    }));
    expect(sizes.loaded).toBeGreaterThan(0);
    expect(sizes.frame).toBeGreaterThan(250);
    await expect(page.getByRole("heading",{name:/Every part of your business/i})).toBeVisible();
    await expect(page.getByRole("heading",{name:/A better way to run the whole business/i})).toBeVisible();
    await expect(page.locator(".so-lifecycle li")).toHaveCount(8);
    await expect(page.locator(".so-marketplace-grid article")).toHaveCount(3);
    await expect(page.locator(".so-marketplace-grid").getByText(/In development/)).toBeVisible();
    await expect(page.locator(".so-marketplace-grid").getByText(/Planned/)).toBeVisible();
    await expect(page.locator(".so-marketplace-grid").getByText(/Quote-led/)).toBeVisible();
    await expect(page.getByRole("link",{name:/Explore guard hiring/i})).toHaveAttribute("href","/guard-marketplace");
    await expect(page.getByRole("link",{name:/Discover 1Service/i})).toHaveAttribute("href","/service");
    await expect(page.getByRole("link",{name:/Browse technology/i})).toHaveAttribute("href","/equipment-marketplace");
  }
});


test("homepage panels enter from coordinated different directions without shifting the layout", async ({ page, request }) => {
  const photoPath = "/images/home/approved-sme-security-control-room-2026.png";
  const photo = await request.get(photoPath);
  expect(photo.status()).toBe(200);
  expect(photo.headers()["content-type"]).toContain("image/png");
  expect((await photo.body()).byteLength).toBeGreaterThan(500_000);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const scope = page.locator("main.so-home[data-motion-scope]");
  await expect(scope).toHaveClass(/so-motion-enabled/);

  const patterns = [
    ["#solutions", "left", "right"],
    ["#guard", "top", "left"],
    ["#service", "right", "top"],
    [".so-ecosystem-section", "left", "right"],
    [".so-marketplace-section", "right", "top"],
    ["#equipment", "right", "left"],
    [".so-onboarding-section", "top", "left"],
    ["#community", "left", "right"],
  ] as const;

  for (const [section, first, second] of patterns) {
    await expect(page.locator(`${section} [data-motion-from="${first}"]`).first()).toHaveCount(1);
    await expect(page.locator(`${section} [data-motion-from="${second}"]`).first()).toHaveCount(1);
  }
  const photoEl = page.locator(".so-vertical-visual-guard img");
  await expect(photoEl).toHaveAttribute("src", /approved-sme-security-control-room-2026[.]png/);

  const photoPanel = page.locator("#guard [data-motion-from='top']");
  await expect(photoPanel).toHaveAttribute("data-motion-state", "pending");
  await page.locator("#guard").scrollIntoViewIfNeeded();
  await expect(photoPanel).toHaveAttribute("data-motion-state", "shown");
  await expect(photoPanel).toHaveCSS("opacity", "1");

  await page.locator(".so-marketplace-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".so-marketplace-grid article").first()).toHaveAttribute("data-motion-state","shown");
  const metric = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(metric).toBeLessThanOrEqual(1);

  await page.locator("#solutions").scrollIntoViewIfNeeded();
  // Previously visited content stays visible, never disappears on reverse scroll.
  await expect(photoPanel).toHaveAttribute("data-motion-state", "shown");
});

test("homepage respects reduced motion and keeps all content readable without scroll transforms", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.setViewportSize({width:375,height:812});
  await page.goto("/");
  const root=page.locator(".so-home");
  await expect(root).not.toHaveClass(/so-motion-enabled/);
  const motion=page.locator("#guard [data-motion-from]");
  await expect(motion.first()).toHaveCSS("opacity","1");
  await expect(motion.first()).toHaveCSS("transform","none");
  await expect(page.getByRole("link",{name:/get 14 day free trial/i}).first()).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});


test("homepage contextual panels use correct local documentary photographs rather than empty glass cards", async ({ page, request }) => {
  const sources = [
    "win-work", "prove-work", "manage-grow", "hire-security",
    "hire-hospitality", "onboarding-sme", "customer-enquiry",
    "team-dispatch", "invoice-confirm",
  ];
  for (const name of sources) {
    const response = await request.get(`/images/home/panels/${name}.webp`);
    expect(response.status(), `Image not available: ${name}`).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).byteLength).toBeGreaterThan(15000);
  }
  for (const size of [{width:375,height:812},{width:768,height:1024},{width:1440,height:900}]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await expect(page.locator(".so-value-rail .so-panel-photo")).toHaveCount(3);
    await expect(page.locator(".so-lifecycle .so-panel-photo--mini")).toHaveCount(8);
    await expect(page.locator(".so-marketplace-grid .so-panel-photo")).toHaveCount(3);
    await expect(page.locator(".so-journey-grid .so-panel-photo")).toHaveCount(3);
    const descriptions = await page.locator(".so-panel-photo img").evaluateAll(images =>
      images.map(img => img.getAttribute("alt") ?? "")
    );
    expect(descriptions.every(description => description.length > 30)).toBe(true);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator(".so-hero-photo")).toHaveAttribute("src",/approved-full-scene-guard-chef-2026[.]png/);
    await expect(page.locator(".so-vertical-visual-guard img")).toHaveAttribute("src", /approved-sme-security-control-room-2026[.]png/);
  }
});

test("slower homepage panel entrances animate with extended easing and preserve reduced-motion support", async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/");
  await expect(page.locator(".so-home")).toHaveClass(/so-motion-enabled/);
  const panel = page.locator("#guard [data-motion-from='top']");
  await expect(panel).toHaveAttribute("data-motion-state","pending");
  const before = await panel.evaluate(node => {
    const style=getComputedStyle(node);
    return {duration:style.transitionDuration,from:node.getAttribute("data-motion-from")};
  });
  expect(before.from).toBe("top");
  expect(parseFloat(before.duration)).toBeGreaterThanOrEqual(1.6);
  await page.locator("#guard").scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute("data-motion-state","shown");
  await expect(panel).toHaveCSS("opacity","1",{timeout:6000});

  await page.emulateMedia({reducedMotion:"reduce"});
  await expect(page.locator(".so-home")).not.toHaveClass(/so-motion-enabled/);
  await expect(panel).toHaveCSS("transform","none");
  await expect(panel).toHaveCSS("opacity","1");
});


test("approved security, hotel and service scenes are distinct across homepage panels", async ({page,request}) => {
  const newScenes = [
    "security-site-planning", "hotel-reception-welcome", "hospitality-team-briefing",
    "security-office-park-site-review", "warehouse-security-check", "security-access-scan",
    "security-operations-review", "security-interview-training", "restaurant-staff-briefing",
    "cafe-team-planning", "security-team-briefing", "facility-reception-service",
  ];
  for(const scene of newScenes){
    const url=`/images/editorial/${scene}.webp`;
    const response=await request.get(url);
    expect(response.status(),url).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).byteLength).toBeGreaterThan(18000);
  }
  for(const width of [390,768,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto("/");
    const srcs=await page.locator(".so-panel-photo img").evaluateAll(nodes=>nodes.map(node=>{
      const raw=node.getAttribute("src")||"";
      try {
        const url=new URL(raw,location.origin);
        return decodeURIComponent(url.searchParams.get("url")||url.pathname);
      } catch{return raw;}
    }));
    expect(srcs.length).toBe(17);
    expect(new Set(srcs).size,"Every card uses a different subject").toBe(17);
    const approved=srcs.filter(src=>src.includes("/images/editorial/"));
    expect(approved.length).toBe(12);
    for(const scene of newScenes)expect(approved.some(src=>src.includes(`${scene}.webp`))).toBe(true);
    const sections=[
      ["#solutions","hero-integrated-security.webp"],
      ["#guard","guard-site-operations.webp"],
      ["#service","hire-hospitality.webp"],
      [".so-ecosystem-section","team-dispatch.webp"],
      [".so-marketplace-section","team-briefing.webp"],
      ["#equipment","warehouse-security.webp"],
      [".so-onboarding-section","onboarding-sme.webp"],
      ["#community","win-work.webp"],
    ] as const;
    for(const [selector,image] of sections){
      const bg=await page.locator(selector).evaluate(node=>getComputedStyle(node).backgroundImage);
      expect(bg,`Scene missing on ${selector}`).toContain(image);
      expect(bg).toContain("url(");
    }
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test("industry marketing pages keep real-world photo backdrops and readable copy",async({page})=>{
  for(const [route,expected] of [
    ["/solutions/security","security-site-planning.webp"],
    ["/service","hotel-reception-welcome.webp"],
    ["/guards","security-access-scan.webp"],
    ["/guard-marketplace","security-interview-training.webp"],
    ["/equipment-marketplace","warehouse-security-check.webp"],
    ["/contact","security-office-park-site-review.webp"],
    ["/pricing","security-operations-review.webp"],
    ["/get-started","hospitality-team-briefing.webp"],
  ] as const){
    await page.goto(route);
    const main=page.locator("main#main");
    await expect(main).toHaveClass(/s1-scene-page/);
    const bg=await main.evaluate(node=>getComputedStyle(node).backgroundImage);
    expect(bg).toContain(expected);
    await expect(page.locator("main h1").first()).toBeVisible();
  }
  await page.goto("/");
  const footer=await page.locator("footer").first().evaluate(node=>getComputedStyle(node).backgroundImage);
  expect(footer).toContain("estate-response-night-band.webp");
});
