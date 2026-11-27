// Founder-lock control: capture the homepage hero (header hidden) at five widths, twice, for pixel diffs.
const { chromium } = require('playwright'); const fs = require('fs');
const [BASE, OUT] = [process.env.BASE, process.env.OUT]; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
    await p.addStyleTag({ content: 'header.glass-nav{visibility:hidden!important}' });
    for (const k of [0, 1]) {
      const box = await p.locator('.so-hero').boundingBox();
      await p.screenshot({ path: `${OUT}/hero_${w}_${k}.png`, fullPage: true, clip: { x: 0, y: Math.max(0, box.y), width: w, height: Math.floor(box.height) } });
      console.log(w, k, JSON.stringify(box)); await p.waitForTimeout(1200);
    }
    await ctx.close();
  }
  await b.close();
})();
