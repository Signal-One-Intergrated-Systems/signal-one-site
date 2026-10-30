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
    ["/solutions/security", "business-park.webp"],
    ["/service", "hotel-lobby.webp"],
    ["/equipment-marketplace", "enterprise-showroom.webp"],
    ["/guard-marketplace", "business-park.webp"],
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
          name === "guard" ? "/images/backgrounds/small-control-room.webp" :
          name === "service" ? "/images/backgrounds/restaurant-dining.webp" :
          "/images/backgrounds/enterprise-showroom.webp"
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


test("hero background is an empty restaurant, approved people photograph is inside a glass pane", async ({page,request}) => {
  const scene = await request.get("/images/backgrounds/restaurant-courtyard.webp");
  expect(scene.status()).toBe(200);
  expect(scene.headers()["content-type"]).toContain("image/webp");
  const photo = await request.get("/images/home/approved-full-scene-guard-chef-2026.png");
  expect(photo.status()).toBe(200);
  for(const viewport of [{width:375,height:812},{width:768,height:1024},{width:1440,height:900},{width:1920,height:1080}]){
    await page.setViewportSize(viewport);
    await page.goto("/");
    const environment=page.locator(".so-hero-media .so-hero-background-photo");
    await expect(environment).toHaveAttribute("src",/restaurant-courtyard[.]webp/);
    await expect(environment).toBeVisible();
    const people=page.locator(".so-hero-people-glass .so-hero-photo");
    await expect(people).toHaveAttribute("src",/approved-full-scene-guard-chef-2026[.]png/);
    await expect(people).toBeVisible();
    const placement=await people.evaluate(img=>{
      const panel=img.closest(".so-hero-people-glass")!;
      const pic=img.getBoundingClientRect();
      const glass=panel.getBoundingClientRect();
      const style=getComputedStyle(img);
      return {fit:style.objectFit, within:pic.left >= glass.left-2 && pic.right <= glass.right+2,
        width:glass.width,height:glass.height,natural:(img as HTMLImageElement).naturalWidth};
    });
    expect(placement.fit).toBe("contain");
    expect(placement.within).toBe(true);
    expect(placement.width).toBeGreaterThan(200);
    expect(placement.height).toBeGreaterThan(150);
    expect(placement.natural).toBeGreaterThan(0);
    await expect(page.locator(".s1-hero-globe-canvas")).toBeVisible();
    await expect(page.locator(".so-hero-copy a[href='/get-started']")).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("approved 1GUARD and 1Service people remain in foreground photo frames",async({page,request})=>{
  await page.goto("/");
  for(const [selector,file,mime] of [
    [".so-vertical-visual-guard img","/images/home/approved-sme-security-control-room-2026.png","image/png"],
    [".so-vertical-visual-service img","/images/home/service-restaurant-operations.jpg","image/jpeg"]
  ] as const){
    await expect(page.locator(selector)).toHaveAttribute("src",new RegExp(file.split("/").at(-1)!.replace(/[.]/g,"[.]")));
    const r=await request.get(file);
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toContain(mime);
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
    // Next/Image lazily fetches below-the-fold photographs; wait until visible
    // and decoded before asserting dimensions, including in cold CI browsers.
    await photograph.scrollIntoViewIfNeeded();
    await expect.poll(async () => photograph.evaluate(img => (img as HTMLImageElement).naturalWidth),
      {timeout:10000}).toBeGreaterThan(0);
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
    await expect(page.locator(".so-hero-people-glass .so-hero-photo")).toHaveAttribute("src",/approved-full-scene-guard-chef-2026[.]png/);
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
    const srcs=await page.locator(".so-value-rail .so-panel-photo img, .so-lifecycle .so-panel-photo img, .so-marketplace-grid .so-panel-photo img, .so-journey-grid .so-panel-photo img").evaluateAll(nodes=>nodes.map(node=>{
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
      ["#solutions","business-park.webp"],
      ["#guard","small-control-room.webp"],
      ["#service","restaurant-dining.webp"],
      [".so-ecosystem-section","business-park.webp"],
      [".so-marketplace-section","hotel-lobby.webp"],
      ["#equipment","enterprise-showroom.webp"],
      [".so-onboarding-section","hotel-corridor.webp"],
      ["#community","restaurant-courtyard.webp"],
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
    ["/solutions/security","business-park.webp"],
    ["/service","hotel-lobby.webp"],
    ["/guards","business-park.webp"],
    ["/guard-marketplace","business-park.webp"],
    ["/equipment-marketplace","enterprise-showroom.webp"],
    ["/contact","hotel-lobby.webp"],
    ["/pricing","business-park.webp"],
    ["/get-started","restaurant-courtyard.webp"],
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
  expect(footer).toContain("hotel-corridor.webp");
});

test("marketing backgrounds contain only verified empty environments and people stay in glass frames",async({page,request})=>{
 const environments=[
  "restaurant-courtyard","business-park","small-control-room","restaurant-dining",
  "hotel-lobby","warehouse-yard","enterprise-showroom","hotel-corridor",
 ];
 for(const name of environments){
   const response=await request.get(`/images/backgrounds/${name}.webp`);
   expect(response.status()).toBe(200);
   expect(response.headers()["content-type"]).toContain("image/webp");
 }
 for(const route of ["/","/solutions/security","/service","/guards","/equipment-marketplace","/guard-marketplace","/contact","/pricing","/get-started"]){
   await page.goto(route);
   const selectors=route==="/" ?
     [".so-hero-media","#solutions","#guard","#service",".so-ecosystem-section",".so-marketplace-section","#equipment",".so-onboarding-section","#community"] :
     ["main#main","main#main > section:first-child"];
   for(const selector of selectors){
     if(selector === ".so-hero-media"){
       const image=page.locator(".so-hero-media .so-hero-background-photo");
       await expect(image).toHaveAttribute("src",/restaurant-courtyard[.]webp/);
       continue;
     }
     const background=await page.locator(selector).first().evaluate(n=>getComputedStyle(n).backgroundImage);
     expect(background,selector+" "+route).not.toMatch(/\/images\/(editorial|photo|home\/panels|home\/approved)/);
     expect(background,selector+" "+route).toContain("/images/backgrounds/");
   }
 }
 await page.goto("/service");
 await expect(page.locator("#vision .s1-glass-people-photo img")).toHaveCount(4);
});
