const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  let ctx = await b.newContext({ viewport:{width:1440,height:900} }); let p = await ctx.newPage();
  await p.goto('https://signalone.co.za/ptt-radio-rental', { waitUntil:'networkidle' });
  const seq=[];
  for (let i=0;i<14;i++){ await p.keyboard.press('Tab'); seq.push(await p.evaluate(()=>{const e=document.activeElement; const s=getComputedStyle(e); return (e.innerText||e.getAttribute('aria-label')||e.tagName).trim().slice(0,35)+(s.outlineStyle!=='none'||s.boxShadow!=='none'?' [ring]':' [NO-RING]');})); }
  console.log('TAB order rental:', seq.join(' | '));
  await p.keyboard.press('Shift+Tab');
  await p.screenshot({path:'shots/kbd-focus.png'});
  await ctx.close();
  // mobile menu
  ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true }); p = await ctx.newPage();
  await p.goto('https://signalone.co.za/', { waitUntil:'networkidle' });
  await p.getByRole('button', { name: /menu/i }).click(); await p.waitForTimeout(700);
  await p.screenshot({path:'shots/menu-390.png'});
  console.log('menu items:', await p.evaluate(()=>[...document.querySelectorAll('[role=dialog] a, nav[aria-label] a, #mobile-menu a')].filter(a=>a.getBoundingClientRect().height>0).map(a=>a.innerText.trim()).join(' | ')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  console.log('menu closes on Esc:', await p.evaluate(()=>document.activeElement.innerText.trim().slice(0,20)));
  await ctx.close();
  // 200% text
  ctx = await b.newContext({ viewport:{width:1280,height:800} }); p = await ctx.newPage();
  await p.goto('https://signalone.co.za/radios-equipment', { waitUntil:'networkidle' });
  await p.addStyleTag({content:'html{font-size:200% !important}'}); await p.waitForTimeout(600);
  console.log('200% text overflowX:', await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
  await p.screenshot({path:'shots/text200.png'});
  await b.close();
})();
