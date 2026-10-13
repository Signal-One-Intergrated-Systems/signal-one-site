import { chromium } from "@playwright/test";
import { mkdir, writeFile, rename, readFile } from "node:fs/promises";
const dir = "docs/qa/mission/after";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const routes = [
  "/",
  "/solutions/security",
  "/guard-patrol-software",
  "/guard-attendance-software",
  "/guard-marketplace",
  "/radios-equipment",
  "/pricing",
  "/get-started",
  "/contact",
  "/guards",
  "/guards/join",
  "/join/sales",
];
const checks = [];
const captureRoutes = process.env.MISSION_ROUTES?.split(",") || routes;
for (const width of process.env.MISSION_INTERACTIONS_ONLY
  ? []
  : [320, 360, 390, 430, 768, 1024, 1440, 1920, 2560]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  for (const route of captureRoutes) {
    const response = await page.goto("http://localhost:3150" + route, {
      waitUntil: "networkidle",
    });
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(40);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
    }));
    checks.push({ route, width, status: response.status(), ...layout });
    if ([390, 768, 1440].includes(width) || route === "/")
      await page.screenshot({
        path:
          dir +
          "/" +
          (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) +
          "-" +
          width +
          ".png",
        fullPage: true,
      });
  }
  await page.close();
}
if (process.env.MISSION_ROUTES && checks.length) {
  const previous = JSON.parse(
    await readFile(dir + "/viewport-checks.json", "utf8"),
  );
  checks.push(
    ...previous.filter((check) => !captureRoutes.includes(check.route)),
  );
}
if (checks.length) {
  await writeFile(
    dir + "/viewport-checks.json",
    JSON.stringify(checks, null, 2),
  );
}
if (process.env.MISSION_MATRIX_ONLY) {
  console.log(JSON.stringify({ checks: checks.length, overflow: checks.filter(check => check.scrollWidth > check.clientWidth), badStatus: checks.filter(check => check.status !== 200) }));
  await browser.close();
  process.exit(0);
}
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3150", { waitUntil: "networkidle" });
await page.screenshot({ path: dir + "/hero-desktop.png" });
await page
  .getByRole("button", { name: "Experience GUARD", exact: true })
  .click();
await page.waitForTimeout(650);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: dir + "/demo-desktop.png" });
await page.getByRole("tab", { name: "04 Respond" }).click();
await page.getByRole("switch", { name: "Mobile signal" }).click();
await page.screenshot({ path: dir + "/sos-no-signal.png" });
await page.getByRole("button", { name: "Close", exact: true }).click();
await page.close();
const reduced = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await reduced.goto("http://localhost:3150/solutions/security", {
  waitUntil: "networkidle",
});
await reduced.locator("#experience").scrollIntoViewIfNeeded();
await reduced.screenshot({ path: dir + "/reduced-motion.png" });
await reduced.addStyleTag({
  content:
    "*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}",
});
await reduced.screenshot({ path: dir + "/glass-disabled-mobile.png" });
await reduced.close();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  recordVideo: {
    dir: "docs/qa/mission/video",
    size: { width: 1280, height: 900 },
  },
});
const videoPage = await context.newPage();
await videoPage.goto("http://localhost:3150", { waitUntil: "networkidle" });
await videoPage.waitForTimeout(800);
await videoPage
  .getByRole("button", { name: "Experience GUARD", exact: true })
  .click();
await videoPage.waitForTimeout(900);
await videoPage.getByRole("button", { name: "NFC", exact: true }).click();
await videoPage.waitForTimeout(600);
await videoPage.getByRole("button", { name: "Record the NFC scan" }).click();
await videoPage.waitForTimeout(1200);
for (const name of ["03 Supervise", "04 Respond", "05 Prove"]) {
  await videoPage
    .getByRole("dialog")
    .getByRole("tab", { name, exact: true })
    .click();
  await videoPage.waitForTimeout(1100);
}
await videoPage.getByRole("button", { name: "Company scope" }).click();
await videoPage.waitForTimeout(700);
await videoPage.getByRole("button", { name: "Close", exact: true }).click();
await videoPage.getByRole("tab", { name: "02 Hire" }).click();
await videoPage.waitForTimeout(1000);
await videoPage.locator(".deferred-equipment").scrollIntoViewIfNeeded();
await videoPage.getByRole("button", { name: "Next equipment model" }).click();
await videoPage.waitForTimeout(1200);
const videoPath = await videoPage.video().path();
await context.close();
await rename(videoPath, "docs/qa/mission/video/motion.webm");
await writeFile(
  "docs/qa/mission/video/recording.json",
  JSON.stringify(
    {
      videoPath: "motion.webm",
      description:
        "Actual Chromium recording of checkpoint workflow, scope, business chapters and equipment controls",
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  JSON.stringify({
    checks: checks.length,
    overflow: checks.filter((check) => check.scrollWidth > check.clientWidth),
    badStatus: checks.filter((check) => check.status !== 200),
  }),
);
