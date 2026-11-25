const { chromium } = require('playwright');
const [,, url, w, h, name, scale='0.5'] = process.argv;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale, isMobile: +w<700, hasTouch: +w<700 });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(800);
  const H = await p.evaluate(()=>document.documentElement.scrollHeight);
  let i=0;
  for (let y=0; y<H; y+= +h - 60) {
    await p.evaluate(y=>window.scrollTo(0,y), y);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `shots/${name}-w${String(i).padStart(2,'0')}.png` });
    i++;
  }
  console.log(name, 'docH', H, 'shots', i);
  await b.close();
})();
