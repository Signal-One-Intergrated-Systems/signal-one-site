import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
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
for (const width of [320, 360, 390, 430, 768, 1024, 1440, 1920, 2560]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  for (const route of routes) {
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
await writeFile(dir + "/viewport-checks.json", JSON.stringify(checks, null, 2));
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
  await videoPage.getByRole("tab", { name }).click();
  await videoPage.waitForTimeout(1100);
}
await videoPage.getByRole("button", { name: "Company scope" }).click();
await videoPage.waitForTimeout(700);
await videoPage.getByRole("button", { name: "Close", exact: true }).click();
await videoPage.getByRole("tab", { name: "02 Hire" }).click();
await videoPage.waitForTimeout(1000);
await videoPage.getByRole("button", { name: "Next equipment model" }).click();
await videoPage.waitForTimeout(1200);
const videoPath = await videoPage.video().path();
await context.close();
await writeFile(
  "docs/qa/mission/video/recording.json",
  JSON.stringify({ videoPath }, null, 2),
);
await browser.close();
console.log(
  JSON.stringify({
    checks: checks.length,
    overflow: checks.filter((check) => check.scrollWidth > check.clientWidth),
    badStatus: checks.filter((check) => check.status !== 200),
  }),
);
