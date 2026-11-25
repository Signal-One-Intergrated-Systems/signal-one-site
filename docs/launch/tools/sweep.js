const { chromium } = require('playwright');
const fs = require('fs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const routes = fs.readFileSync('routes-sitemap.txt','utf8').trim().split('\n').map(u=>u.replace('https://signalone.co.za','')||'/')
  .concat(['/join/sales','/about','/support','/login','/faq','/this-page-does-not-exist']);
const widths = [[1920,1080],[1440,900],[1280,720],[1024,768],[768,1024],[430,932],[390,844],[360,740]];
(async () => {
  const b = await chromium.launch();
  const out = [];
  for (const r of routes) for (const [w,h] of widths) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile: w<700, hasTouch: w<700 });
    const p = await ctx.newPage(); const errs=[];
    p.on('console', m => { if (m.type()==='error' && !/cloudflareinsights|ERR_TUNNEL/.test(m.text())) errs.push(m.text().slice(0,160)); });
    p.on('response', x => { if (x.status()>=400 && !/cloudflareinsights/.test(x.url())) errs.push(x.status()+' '+x.url().slice(0,120)); });
    let status=0; try { const resp = await p.goto('https://signalone.co.za'+r, { waitUntil:'networkidle', timeout:45000 }); status=resp.status(); } catch(e){ errs.push('GOTO '+e.message.slice(0,80)); }
    await p.evaluate(async () => { for (let y=0; y<document.documentElement.scrollHeight; y+=500) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); } window.scrollTo(0,0); });
    await p.waitForTimeout(400);
    const d = await p.evaluate((w) => {
      const vis = el => { const r=el.getBoundingClientRect(); const s=getComputedStyle(el); return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'; };
      const wide = [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(); return r.right>window.innerWidth+1 && vis(e) && getComputedStyle(e).position!=='fixed';}).slice(0,3).map(e=>e.tagName+'.'+(e.className+'').slice(0,40));
      const small = w<700 ? [...document.querySelectorAll('a,button,input,select,[role=button]')].filter(vis).filter(e=>{const r=e.getBoundingClientRect(); return (r.height<24||r.width<24);}).map(e=>(e.innerText||e.getAttribute('aria-label')||e.tagName).trim().slice(0,30)) : [];
      return { title:document.title, h1:[...document.querySelectorAll('h1')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,90)), desc:!!document.querySelector('meta[name=description]'), canon:document.querySelector('link[rel=canonical]')?.href||null,
        docH:document.documentElement.scrollHeight, ovx:document.documentElement.scrollWidth-window.innerWidth, wide,
        brokenImg:[...document.images].filter(i=>i.complete && i.naturalWidth===0 && i.getAttribute('src')).map(i=>i.getAttribute('src').slice(0,80)),
        smallTargets: small.slice(0,8), smallCount: small.length,
        trialCTAs:[...document.querySelectorAll('a')].filter(vis).filter(a=>/free trial/i.test(a.innerText)).length };
    }, w);
    let axe=null;
    if (w===1440 || w===390) { await p.addScriptTag({content: axeSrc}); axe = await p.evaluate(async()=>{ const r = await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}); return r.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length, ex:v.nodes[0].target.join(' ').slice(0,80)})); }); }
    out.push({ r, w, status, errs:[...new Set(errs)].slice(0,5), ...d, axe });
    process.stdout.write('.');
    await ctx.close();
  }
  fs.writeFileSync('sweep.json', JSON.stringify(out,null,1));
  await b.close();
})();
