// W1 capture: full-page per route x viewport, computed-style data at 1440/390 (same collector as ws-a2).
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const ROOT = process.env.ROOT; const BASE = process.env.BASE;
const ROUTES = ['/', '/solutions/security', '/pricing', '/radios-equipment', '/ptt-radio-rental', '/equipment-marketplace',
  '/guard-patrol-software', '/guard-attendance-software', '/guard-marketplace', '/service', '/contact', '/get-started',
  '/guards', '/guards/join', '/security-trust', '/popia', '/privacy', '/terms', '/join/sales', '/about', '/support', '/this-page-does-not-exist-a2'];
const VPS = { d: [1440, 900], l: [1280, 800], k: [1024, 768], t: [768, 1024], m: [390, 844] };
const slug = r => r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_');
const jobs = []; const only = (process.env.ONLY || '').split(',').filter(Boolean); const vks = (process.env.VKS || 'd,l,k,t,m').split(',');
for (const r of ROUTES) for (const vk of vks) if (!only.length || only.includes(r)) jobs.push([r, vk]);
function collect() {
  const sectionOf = el => {
    let n = el, last = null;
    while (n && n !== document.body) {
      if (n.parentElement && (n.parentElement.tagName === 'MAIN' || n.parentElement === document.body)) { last = n; break; }
      n = n.parentElement;
    }
    if (!last) return 'body';
    const h = last.querySelector('h1,h2,h3');
    const idx = last.parentElement ? Array.from(last.parentElement.children).indexOf(last) : -1;
    return `${last.tagName.toLowerCase()}#${idx}${last.id ? '#' + last.id : ''}${last.className && typeof last.className === 'string' ? '.' + last.className.split(/\s+/).slice(0, 2).join('.') : ''}|${h ? h.textContent.trim().slice(0, 50) : ''}`;
  };
  const vis = (el, cs) => {
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const ownText = el => Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
  const sx = window.scrollX, sy = window.scrollY;
  const out = { url: location.href, title: document.title, docH: document.documentElement.scrollHeight, vw: innerWidth, els: [], imgs: [], bgs: [], sections: [], heads: [], fields: [], btns: [], icons: [], containers: [] };
  const all = document.querySelectorAll('body *');
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (!vis(el, cs)) continue;
    const r = el.getBoundingClientRect();
    const t = ownText(el);
    const tag = el.tagName.toLowerCase();
    const cls = (typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '')).slice(0, 160);
    const sec = sectionOf(el);
    const rec = {
      tag, cls, sec, x: Math.round(r.left + sx), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height),
      txt: t.slice(0, 60), bg: cs.backgroundColor, color: cs.color, bc: cs.borderTopColor, bw: cs.borderTopWidth, bs: cs.borderTopStyle,
      bimg: cs.backgroundImage === 'none' ? '' : cs.backgroundImage.slice(0, 400), shadow: cs.boxShadow, op: cs.opacity, bf: cs.backdropFilter || cs.webkitBackdropFilter || 'none',
      ff: cs.fontFamily, fw: cs.fontWeight, fs: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing, rad: cs.borderTopLeftRadius,
      mw: cs.maxWidth, pl: cs.paddingLeft, pr: cs.paddingRight, pt: cs.paddingTop, pb: cs.paddingBottom, mh: cs.minHeight, disp: cs.display, tt: cs.textTransform,
    };
    out.els.push(rec);
    if (/^h[1-4]$/.test(tag)) out.heads.push({ tag, cls, sec, txt: el.textContent.trim().slice(0, 80), fs: cs.fontSize, fw: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, color: cs.color, ff: cs.fontFamily, w: rec.w, x: rec.x, y: rec.y, mt: cs.marginTop, mb: cs.marginBottom, maxw: cs.maxWidth });
    if (tag === 'img') {
      out.imgs.push({ sec, src: el.getAttribute('src'), cur: el.currentSrc, nw: el.naturalWidth, nh: el.naturalHeight, rw: rec.w, rh: rec.h, x: rec.x, y: rec.y, alt: el.getAttribute('alt'), fit: cs.objectFit, pos: cs.objectPosition, loading: el.getAttribute('loading'), sizes: el.getAttribute('sizes'), cls, complete: el.complete,
        parentCls: (el.parentElement && typeof el.parentElement.className === 'string') ? el.parentElement.className.slice(0, 120) : '',
        near: (() => { let p = el.parentElement; for (let i = 0; i < 6 && p; i++) { const h = p.querySelector('h1,h2,h3,h4,figcaption,p'); if (h && h.textContent.trim()) return h.textContent.trim().slice(0, 90); p = p.parentElement; } return ''; })() });
    }
    if (cs.backgroundImage.includes('url(')) out.bgs.push({ sec, tag, cls, bimg: cs.backgroundImage.slice(0, 500), size: cs.backgroundSize, pos: cs.backgroundPosition, w: rec.w, h: rec.h, x: rec.x, y: rec.y });
    if (['input', 'select', 'textarea', 'label'].includes(tag)) out.fields.push({ tag, type: el.getAttribute('type'), cls, sec, w: rec.w, h: rec.h, fs: cs.fontSize, fw: cs.fontWeight, color: cs.color, bg: cs.backgroundColor, bc: cs.borderTopColor, bw: cs.borderTopWidth, rad: cs.borderTopLeftRadius, pl: cs.paddingLeft, accent: cs.accentColor, txt: el.textContent.trim().slice(0, 50), req: el.required || false });
    const isBtn = tag === 'button' || /\bbtn\b|btn-|button|cta/i.test(cls) || el.getAttribute('role') === 'button';
    if (isBtn && (tag === 'a' || tag === 'button')) out.btns.push({ tag, cls, sec, txt: el.textContent.trim().slice(0, 50), w: rec.w, h: rec.h, bg: cs.backgroundColor, bimg: rec.bimg.slice(0, 120), color: cs.color, bc: cs.borderTopColor, bw: cs.borderTopWidth, rad: cs.borderTopLeftRadius, fs: cs.fontSize, fw: cs.fontWeight, pl: cs.paddingLeft, pt: cs.paddingTop, shadow: cs.boxShadow, bf: rec.bf, x: rec.x, y: rec.y });
    if (tag === 'svg') out.icons.push({ sec, cls: (el.getAttribute('class') || '').slice(0, 80), w: rec.w, h: rec.h, stroke: cs.stroke, fill: cs.fill, color: cs.color, sw: cs.strokeWidth, vb: el.getAttribute('viewBox') });
    if (cs.maxWidth !== 'none' && cs.marginLeft === cs.marginRight && parseFloat(cs.marginLeft) > 0 && r.width > 300) out.containers.push({ sec, tag, cls, mw: cs.maxWidth, w: rec.w, pl: cs.paddingLeft, pr: cs.paddingRight, x: rec.x });
  }
  const main = document.querySelector('main');
  const tops = main ? Array.from(main.children) : [];
  const hdr = document.querySelector('header'); const ftr = document.querySelector('footer');
  for (const s of [hdr, ...tops, ...(ftr && !tops.includes(ftr) ? [ftr] : [])]) {
    if (!s) continue; const cs = getComputedStyle(s); const r = s.getBoundingClientRect();
    // first and last visible content boxes inside section (text-bearing or img)
    let cTop = Infinity, cBot = -Infinity;
    s.querySelectorAll('h1,h2,h3,h4,p,img,a,button,li,figure,form,input,svg').forEach(e => { const rr = e.getBoundingClientRect(); const c = getComputedStyle(e); if (rr.height > 0 && c.visibility !== 'hidden' && c.display !== 'none') { cTop = Math.min(cTop, rr.top); cBot = Math.max(cBot, rr.bottom); } });
    const inner = Array.from(s.querySelectorAll('section'));
    out.sections.push({ tag: s.tagName.toLowerCase(), id: s.id, cls: (typeof s.className === 'string' ? s.className : '').slice(0, 200), y: Math.round(r.top + sy), h: Math.round(r.height), pt: cs.paddingTop, pb: cs.paddingBottom, mt: cs.marginTop, mb: cs.marginBottom, mh: cs.minHeight, bg: cs.backgroundColor, bimg: cs.backgroundImage.slice(0, 300), contentTop: Math.round(cTop - r.top), contentBottomGap: Math.round(r.bottom - cBot), head: (s.querySelector('h1,h2,h3') || { textContent: '' }).textContent.trim().slice(0, 60),
      inner: inner.slice(0, 12).map(i => { const c = getComputedStyle(i); const rr = i.getBoundingClientRect(); return { cls: (typeof i.className === 'string' ? i.className : '').slice(0, 140), y: Math.round(rr.top + sy), h: Math.round(rr.height), pt: c.paddingTop, pb: c.paddingBottom, mh: c.minHeight, bg: c.backgroundColor, bimg: c.backgroundImage.slice(0, 200), head: (i.querySelector('h1,h2,h3') || { textContent: '' }).textContent.trim().slice(0, 60) }; }) });
  }
  return out;
}


async function run([route, vk], browser) {
  const [w, h] = VPS[vk];
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.route('**/*', r => r.request().method() === 'GET' ? r.continue() : r.abort());
  const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
  const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1200);
  const s = slug(route);
  let y = 0, i = 0;
  while (true) {
    await page.evaluate(yy => window.scrollTo(0, yy), y); await page.waitForTimeout(400); i++;
    const nowH = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y + h >= nowH || i > 40) break; y += Math.round(h * 0.8);
  }
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(700);
  let data = null;
  if (vk === 'd' || vk === 'm') { data = await page.evaluate(collect); data.status = resp ? resp.status() : null; data.errs = errs; data.route = route; data.vk = vk; data.vw = w; data.vh = h;
    fs.writeFileSync(path.join(ROOT, 'data', `${s}__${vk}.json`), JSON.stringify(data)); }
  await page.screenshot({ path: path.join(ROOT, 'full', `${s}__${w}.jpg`), type: 'jpeg', quality: 55, fullPage: true }).catch(e => console.log('fullfail', s, vk, e.message));
  await ctx.close();
  console.log('done', route, w, resp && resp.status(), errs.length ? 'ERRS ' + errs.join(' | ') : '');
}
(async () => {
  fs.mkdirSync(path.join(ROOT, 'full'), { recursive: true }); fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let k = 0; const N = +(process.env.N || 4);
  await Promise.all(Array.from({ length: N }, async () => { while (k < jobs.length) { const j = jobs[k++]; try { await run(j, browser); } catch (e) { console.log('ERR', j, e.message); } } }));
  await browser.close();
})();
