import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const origin = 'https://www.signalone.co.za';
const visitor = origin + '/connect/andisiwe';
const release = process.env.EXPECTED_RELEASE;

test.beforeEach(async ({ page }) => {
  // Read-only live verification: no form/network POST or real mail/call/share.
  await page.route('**/*', async route => {
    if (!['GET','HEAD'].includes(route.request().method())) await route.abort();
    else await route.continue();
  });
});
test('actual HTTPS response belongs to the exact reviewed release; review gates remain closed', async ({ request }) => {
  if (process.env.CONNECT_LIVE_TEST_BASE) expect(release).toBe('local');
  else expect(release).toMatch(/^[0-9a-f]{40}$/);
  const response = await request.get('/api/connect-status');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ release, mode:'review-only', backendIntake:'disabled', automaticSubmission:false, offlineShell:'disabled' });
  for(const path of ['/connect/andisiwe','/present/andisiwe','/qr/andisiwe']) {
    const response = await request.get(path, {maxRedirects:0}); expect(response.status()).toBe(200);
    expect(response.headers()['x-signal-connect-release']).toBe(release);
    expect(response.headers()['x-robots-tag']).toContain('noindex');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.headers()['referrer-policy']).toBe('no-referrer');
    expect(response.headers()['x-frame-options']).toBe('DENY');
    expect(response.headers()['permissions-policy']).toBe('camera=(), microphone=(), geolocation=()');
  }
});
test('live marketing home/contact/navigation are preserved and Connect is unlisted', async ({ page, request }) => {
  await page.goto('/'); await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  if (!(await page.locator('header nav').first().isVisible())) {
    await page.getByRole('button', { name: /menu/i }).click();
  }
  await expect(page.locator('header nav:visible').first()).toBeVisible();
  expect(await page.locator('a[href="/connect/andisiwe"]').count()).toBe(0);
  await page.goto('/contact'); await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  expect(await page.getByRole('heading',{level:1}).innerText()).not.toContain('Andisiwe');
  await expect(page.locator('main form')).toBeVisible();
  const sitemap=await request.get('/sitemap.xml'); expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain('/connect/'); expect(await sitemap.text()).not.toContain('/present/');
});
test('live visitor brand, safe collection gate and direct business contact actions', async ({ page, context }, info) => {
  await page.goto('/connect/andisiwe'); await page.evaluate(()=>document.fonts.ready);
  await expect(page.getByRole('heading',{name:'Andisiwe Satshwa',exact:true})).toBeVisible();
  await expect(page.getByText('Founder',{exact:true})).toBeVisible();
  expect(await page.locator('header nav').count()).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex.*nofollow/);
  const image=page.getByAltText('Black-and-white portrait of Andisiwe Satshwa');
  expect(await image.evaluate(el=>el instanceof HTMLImageElement && el.complete && el.naturalWidth>0)).toBe(true);
  const cdp = await context.newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const doc = await cdp.send('DOM.getDocument');
  const heading = await cdp.send('DOM.querySelector', {nodeId:doc.root.nodeId,selector:'h1'});
  const fonts = await cdp.send('CSS.getPlatformFontsForNode',{nodeId:heading.nodeId});
  expect(fonts.fonts.some(font=>font.isCustomFont && /Inter/i.test(font.familyName) && font.glyphCount>0)).toBe(true);
  expect(await page.locator('a[href="mailto:andisiwe@signalone.co.za"]').count()).toBe(1);
  expect(await page.locator('a[href="tel:+27100231810"]').count()).toBe(1);
  expect(await page.locator('a[href="https://wa.me/27606335870"]').count()).toBe(1);
  await expect(page.getByRole('link',{name:/Save.*contact/i})).toHaveCount(0);
  await expect(page.locator('form,input,textarea')).toHaveCount(0);
  const photo=await image.boundingBox();expect(photo!.width).toBeLessThanOrEqual(100);expect(photo!.height).toBeLessThanOrEqual(115);
  expect((await new AxeBuilder({page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"]}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({path:info.outputPath('live-visitor.png'),fullPage:true});
});
test('website action returns to the existing marketing application without Connect chrome', async ({page})=>{
  await page.goto('/present/andisiwe');
  const link=page.getByRole('link',{name:'Visit Signal One',exact:true});
  await expect(link).toHaveAttribute('href','https://signalone.co.za');
  if(process.env.CONNECT_LIVE_TEST_BASE) await page.goto('/'); // explicit loopback instrument control only
  else await link.click();
  await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  expect(new URL(page.url()).pathname).toBe('/');
  expect(await page.getByRole('heading',{level:1}).innerText()).not.toBe('Andisiwe Satshwa');
  await expect(page.locator('header')).toBeVisible();
});
test('live reciprocal exchange is unarmed: no PII form, fake receipt, locked controls or browser storage', async ({page},info)=>{
  await page.goto('/connect/andisiwe');
  await expect(page.getByRole('heading',{name:'Let’s connect.'})).toBeVisible();
  await expect(page.getByText('Online introductions are not available yet.',{exact:false})).toBeVisible();
  await expect(page.locator('form,input,textarea')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Connect with Andisiwe',exact:true})).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Save Contact',exact:true})).toHaveCount(0);
  await expect(page.getByText(/locked|unlock|padlock/i)).toHaveCount(0);
  expect(await page.evaluate(async()=>(await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  expect((await new AxeBuilder({page:page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"]}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({path:info.outputPath('live-exchange-gate.png'),fullPage:true});
});
test('live presenter, QR and share/copy fallback use exact same review visitor URL', async ({ page }, info) => {
  await page.addInitScript(()=>{
    Object.defineProperty(navigator,'share',{configurable:true,value:undefined});
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied by synthetic QA policy');}}});
  });
  await page.goto('/present/andisiwe');await expect(page.getByRole('heading',{name:'Andisiwe Satshwa',exact:true})).toBeVisible();
  await expect(page.getByText('Review access only',{exact:false})).toBeVisible();
  const image=page.locator('img[src="/qr/andisiwe"]');await expect(image).toBeVisible();
  expect(await image.evaluate(el=>el instanceof HTMLImageElement && el.complete && el.naturalWidth>0)).toBe(true);
  await page.getByRole('button',{name:'Share link',exact:true}).click();await expect(page.getByLabel('Visitor link',{exact:true})).toHaveValue(visitor);
  await page.getByRole('button',{name:'Copy link',exact:true}).click();await expect(page.getByLabel('Visitor link',{exact:true})).toHaveValue(visitor);
  await expect(page.getByRole('link',{name:'Preview the visitor card',exact:false})).toHaveAttribute('href',visitor);
  expect((await new AxeBuilder({page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"]}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await image.screenshot({path:info.outputPath('live-qr.png')});await page.screenshot({path:info.outputPath('live-presenter.png'),fullPage:true});
});
test('unknown contacts fail closed and vCard delivery requires a persisted exchange', async ({ request }) => {
  for(const path of ['/connect/unknown','/present/unknown','/contact/unknown','/qr/unknown'])expect((await request.get(path)).status()).toBe(404);
  for(const suffix of ['', '?scope=platform','?persisted=true']) {
    const card=await request.get('/contact/andisiwe'+suffix);expect(card.status()).toBe(403);
    expect(card.headers()['cache-control']).toContain('no-store');expect(await card.text()).not.toContain('BEGIN:VCARD');
  }
});
