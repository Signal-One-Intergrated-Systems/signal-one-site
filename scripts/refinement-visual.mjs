import { chromium } from "@playwright/test";
import { mkdir, writeFile, rename } from "node:fs/promises";
const dir = "docs/qa/mission/refinement/after";
await mkdir(dir, { recursive: true });
const b = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const checks = [];
for (const width of [320, 360, 390, 430, 768, 1024, 1440, 1920, 2560]) {
  const p = await b.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  await p.goto("http://localhost:3150", { waitUntil: "networkidle" });
  const flow = p.locator("#home-workflow");
  for (let step = 0; step < 3; step++) {
    await flow.getByRole("tab").nth(step).click();
    checks.push({
      width,
      step,
      ...(await p.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))),
      guideHeight: (await p.locator(".home-workflow-guide").boundingBox())
        .height,
    });
    if ([390, 768, 1440].includes(width))
      await flow.screenshot({
        path: `${dir}/${["field", "record", "proof"][step]}-${width}.png`,
      });
  }
  await flow.getByRole("tab").first().click();
  await p.evaluate(() => scrollTo(0, 0));
  await p.screenshot({ path: `${dir}/hero-${width}.png` });
  if ([390, 768, 1440].includes(width)) {
    await p.locator(".deferred-equipment").evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 88));
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${dir}/equipment-${width}.png` });
  }
  await p.close();
}
await writeFile(
  `${dir}/state-layout-checks.json`,
  JSON.stringify(checks, null, 2),
);
for (const width of [1440, 390]) {
  const context = await b.newContext({
    viewport: { width, height: width === 390 ? 844 : 1000 },
    recordVideo: { dir, size: { width, height: width === 390 ? 844 : 1000 } },
  });
  const p = await context.newPage();
  const start = Date.now();
  const annotations = [];
  const mark = (label) =>
    annotations.push({
      seconds: Math.round((Date.now() - start) / 100) / 10,
      label,
    });
  const pause = (ms) => p.waitForTimeout(ms);
  const visit = async (locator) => {
    await locator.evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 88,
        behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
          ? "instant"
          : "smooth",
      }),
    );
    await pause(900);
  };
  mark("Navigation and initial paint (raw browser recording)");
  await p.goto("http://localhost:3150", { waitUntil: "networkidle" });
  await pause(1800);
  const flow = p.locator("#home-workflow");
  await visit(flow);
  mark("Visible checkpoint narrative; anchored field photograph");
  await pause(2200);
  await flow.getByRole("button", { name: "NFC tag", exact: true }).click();
  mark("NFC method and readable feedback");
  await pause(1800);
  await flow.getByRole("button", { name: "Follow the NFC record" }).click();
  mark("Record fields enter; photograph stays in place");
  await pause(2800);
  await flow
    .getByRole("button", { name: "Follow the service evidence" })
    .click();
  mark("Possible assessments; no fabricated customer record");
  await pause(2800);
  await flow.getByRole("button", { name: "Client scope" }).click();
  mark("Company scope");
  await pause(1800);
  if (width === 390) {
    await visit(p.getByRole("button", { name: "Menu", exact: true }));
    await p.getByRole("button", { name: "Menu", exact: true }).click();
    mark("Mobile navigation");
    await pause(1600);
    await p.keyboard.press("Escape");
  } else {
    await visit(
      p.getByRole("button", { name: "Experience GUARD", exact: true }),
    );
    await p
      .getByRole("button", { name: "Experience GUARD", exact: true })
      .click();
    await pause(1600);
    mark("Optional expanded workflow");
    const dialog = p.getByRole("dialog");
    await dialog.getByRole("tab", { name: "04 Respond" }).click();
    await pause(1400);
    await dialog.getByRole("switch", { name: "Mobile signal" }).click();
    mark("SOS signal limitation");
    await pause(2200);
    await p.keyboard.press("Escape");
  }
  await visit(p.locator(".business-journey"));
  await p
    .getByRole("tab", { name: width === 390 ? "Run" : "03 Run", exact: true })
    .click();
  mark("Business continuity: RUN");
  await pause(2400);
  await visit(p.locator(".deferred-equipment"));
  mark("Exact-model equipment and thumbnails");
  await pause(2200);
  await p.getByRole("button", { name: "Next equipment model" }).click();
  mark("Tracker selection; shorter product transition");
  await pause(2400);
  const path = await p.video().path();
  await context.close();
  await rename(path, `${dir}/motion-${width}.webm`);
  await writeFile(
    `${dir}/motion-${width}-timeline.json`,
    JSON.stringify(annotations, null, 2),
  );
}
await b.close();
console.log({
  checks: checks.length,
  overflow: checks.filter((x) => x.scrollWidth > x.clientWidth),
  unstableWidths: [
    ...new Set(
      checks
        .filter((x) =>
          checks.some(
            (y) =>
              x.width === y.width &&
              Math.abs(x.guideHeight - y.guideHeight) > 1,
          ),
        )
        .map((x) => x.width),
    ),
  ],
});
