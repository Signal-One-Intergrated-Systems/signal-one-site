// Simulated persona walks: fresh browser context per persona, natural click paths, first-viewport evidence.
// No form is submitted; every non-GET request is aborted.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const BASE = process.env.BASE, OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const P = [
  ['security-company-owner', 1440, ['/', { click: 'role=link[name=/Explore 1GUARD Security Business/i]' }, { click: 'role=link[name=/Pricing/i] >> nth=0', fallback: '/pricing' }, '/get-started']],
  ['operations-director', 1440, ['/ptt-radio-rental', { click: 'role=link[name=/Request a radio quote/i] >> nth=0' }]],
  ['procurement-manager', 1440, ['/radios-equipment', '/equipment-marketplace', '/about']],
  ['property-manager', 1440, ['/', '/guard-marketplace', '/contact']],
  ['facilities-manager', 1280, ['/', '/equipment-marketplace', '/radios-equipment']],
  ['financial-director', 1440, ['/pricing', '/terms']],
  ['logistics-manager', 1280, ['/radios-equipment#tracking', '/radios-equipment?category=tracking&product=FMC920#quote']],
  ['construction-manager', 1024, ['/ptt-radio-rental', '/equipment-marketplace']],
  ['event-organiser', 390, ['/', '/ptt-radio-rental', '/radios-equipment#body-cameras']],
  ['small-business-owner', 390, ['/', '/service', '/contact']],
  ['it-manager', 1440, ['/security-trust', '/popia', '/privacy']],
  ['existing-customer', 1440, ['/', '/support']],
  ['security-guard', 390, ['/guards', '/guards/join']],
  ['job-applicant', 390, ['/join/sales']],
  ['unfamiliar-mobile-visitor', 390, ['/', { click: 'role=button[name=/Menu/i]' }]],
  ['inexperienced-visitor', 768, ['/', '/contact']],
];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const report = {};
  for (const [name, w, steps] of P) {
    const ctx = await b.newContext({ viewport: { width: w, height: w <= 390 ? 844 : w === 768 ? 1024 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.route('**/*', r => r.request().method() === 'GET' ? r.continue() : r.abort());
    report[name] = [];
    let i = 0;
    for (const step of steps) {
      try {
        if (typeof step === 'string') await page.goto(BASE + step, { waitUntil: 'networkidle' });
        else { try { await page.locator(step.click).first().click({ timeout: 5000 }); } catch (e) { if (step.fallback) await page.goto(BASE + step.fallback); else throw e; } await page.waitForLoadState('networkidle'); await page.waitForTimeout(1800); }
        await page.waitForTimeout(500);
        const info = await page.evaluate(() => {
          const vh = innerHeight; const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < vh && r.width > 0; };
          const h1 = document.querySelector('main h1');
          return {
            url: location.pathname + location.search + location.hash, title: document.title,
            h1: h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : null, h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + scrollY) : null,
            ctasInFirstView: [...document.querySelectorAll('main a.btn, main button.btn, main a.so-home-cta')].filter(inView).map(a => a.textContent.trim().replace(/\s+/g, ' ')),
            statuses: [...document.querySelectorAll('main .badge')].map(s => s.textContent.trim()).slice(0, 8),
            hasWhatsApp: /WhatsApp/i.test(document.body.innerText), hasPhone: /\+27|0\d{2} \d{3} \d{4}/.test(document.body.innerText),
            mentions: ['price', 'R2,50', 'deposit', 'delivery', '12, 24 or 36', 'quote', 'POPIA', 'support', 'PSiRA'].filter(k => document.body.innerText.toLowerCase().includes(k.toLowerCase())),
            screens: +(document.documentElement.scrollHeight / vh).toFixed(1),
          };
        });
        const shot = `${name}_${i}.jpg`;
        await page.screenshot({ path: path.join(OUT, shot), type: 'jpeg', quality: 60 });
        report[name].push({ ...info, shot });
      } catch (e) { report[name].push({ error: String(e.message).slice(0, 160) }); }
      i++;
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'journeys.json'), JSON.stringify(report, null, 1));
  await b.close(); console.log('ok');
})();
