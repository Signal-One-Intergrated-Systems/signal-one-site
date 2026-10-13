import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
for (const [name, url] of [
  ["atex", "https://atexsolutions.io/"],
  ["production", "https://www.signalone.co.za/"],
]) {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      proxy: { server: process.env.HTTPS_PROXY },
    });
    try {
      const response = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      results.push({
        name,
        width,
        status: response?.status(),
        url: page.url(),
        title: await page.title(),
      });
      await page.screenshot({
        path: `docs/qa/mission/before/${name}-${width}.png`,
      });
    } catch (error) {
      results.push({ name, width, error: String(error) });
    }
    await page.close();
  }
}
await writeFile(
  "docs/qa/mission/before/network-observations.json",
  JSON.stringify(results, null, 2),
);
for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto("http://localhost:3150", { waitUntil: "networkidle" });
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 650
  ) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: `docs/qa/mission/before/home-${width}.png`,
    fullPage: true,
  });
  await page.close();
}
await browser.close();
