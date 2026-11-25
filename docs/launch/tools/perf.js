const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const path of ['/', '/ptt-radio-rental', '/radios-equipment']) {
    const ctx = await b.newContext({ ...devices['Moto G4'] });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline:false, latency:150, downloadThroughput:1.6*1024*1024/8, uploadThroughput:750*1024/8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.addInitScript(() => { window.__lcp=0; window.__cls=0; window.__lcpEl='';
      new PerformanceObserver(l=>{ for (const e of l.getEntries()) { window.__lcp=e.startTime; window.__lcpEl=(e.element&&(e.element.tagName+' '+(e.element.className+'').slice(0,40)))||e.url; } }).observe({type:'largest-contentful-paint', buffered:true});
      new PerformanceObserver(l=>{ for (const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value; }).observe({type:'layout-shift', buffered:true}); });
    let bytes=0; p.on('response', async r=>{ const h=r.headers()['content-length']; if(h) bytes+= +h; });
    const t0=Date.now(); await p.goto('https://signalone.co.za'+path, { waitUntil:'load', timeout:90000 }); const load=Date.now()-t0;
    await p.waitForTimeout(4000);
    const m = await p.evaluate(()=>({lcp:Math.round(window.__lcp), lcpEl:window.__lcpEl, cls:+window.__cls.toFixed(3), fcp:Math.round((performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||0), ttfb:Math.round(performance.getEntriesByType('navigation')[0].responseStart)}));
    console.log(path, JSON.stringify({ load, ...m, transferKB: Math.round(bytes/1024) }));
    await ctx.close();
  }
  await b.close();
})();
