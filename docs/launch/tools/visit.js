const { chromium } = require('playwright');
const [,, url, w, h, name] = process.argv;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,200)); });
  p.on('requestfailed', r => errs.push('REQFAIL '+r.url().slice(0,150)+' '+(r.failure()||{}).errorText));
  p.on('response', r => { if (r.status()>=400) errs.push('HTTP '+r.status()+' '+r.url().slice(0,150)); });
  const t0 = Date.now();
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e=>errs.push('GOTO '+e.message));
  const loadMs = Date.now()-t0;
  await p.waitForTimeout(800);
  await p.screenshot({ path: `shots/${name}-viewport.png` });
  // scroll through to trigger lazy content
  await p.evaluate(async () => { for (let y=0; y<document.body.scrollHeight; y+=600) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,120)); } window.scrollTo(0,0); });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `shots/${name}-full.png`, fullPage: true });
  const info = await p.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width>0 && r.height>0 && s.visibility!=='hidden' && s.display!=='none'; };
    return {
      title: document.title,
      desc: document.querySelector('meta[name=description]')?.content,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      docH: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      headings: [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(e=>e.tagName+': '+e.innerText.replace(/\s+/g,' ').trim().slice(0,110)),
      header: [...document.querySelectorAll('header a, header button, nav a, nav button')].filter(vis).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim()+' -> '+(e.getAttribute('href')||'[btn]')),
      ctas: [...document.querySelectorAll('main a, main button')].filter(vis).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,60)+' -> '+(e.getAttribute('href')||'[btn]')),
      footer: [...document.querySelectorAll('footer a')].map(e=>e.innerText.replace(/\s+/g,' ').trim()+' -> '+e.getAttribute('href')),
      imgs: [...document.images].map(i=>({src:i.currentSrc.split('/').pop().slice(0,60), ok:i.complete&&i.naturalWidth>0, alt:i.alt.slice(0,50), w:Math.round(i.getBoundingClientRect().width), nw:i.naturalWidth})),
    };
  });
  console.log(JSON.stringify({url, w, loadMs, errs, ...info}, null, 1));
  await b.close();
})();
