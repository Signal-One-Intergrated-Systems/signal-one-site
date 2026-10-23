import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`presenter ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/present/andisiwe');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { name: 'Andisiwe Satshwa' })).toBeVisible();
    await expect(page.getByText('Founder', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).toMatch(/Inter/i);
    expect(await page.evaluate(() => [...document.fonts].some(font => /Inter/i.test(font.family) && font.status === 'loaded'))).toBe(true);
    const rings = page.locator('header circle');
    await expect(rings).toHaveCount(3);
    for (const [i, radius] of ['15','9.5','4'].entries()) await expect(rings.nth(i)).toHaveAttribute('r', radius);
    await page.screenshot({ path: `test-results/presenter-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}
test('vCard, manifest, route distinction and unknown profile', async ({ request, page }) => {
  const card = await request.get('/contact/andisiwe');
  expect(card.status()).toBe(200);
  expect(card.headers()['content-type']).toContain('text/vcard');
  expect(await card.text()).toContain('FN:Andisiwe Satshwa\r\nORG:Signal One Integrated Systems\r\nTITLE:Founder');
  expect(await card.text()).toContain('TEL;TYPE=CELL:+27606335870');
  expect(await card.text()).toContain('TEL;TYPE=WORK,VOICE:+27100231810');
  expect((await request.get('/contact/unknown')).status()).toBe(404);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.start_url).toBe('/present/andisiwe');
  for (const path of ['/icon.png', '/apple-icon.png']) { const icon = await request.get(path); expect(icon.status()).toBe(200); expect(icon.headers()['content-type']).toContain('image/png'); }
  await page.goto('/connect/andisiwe');
  await expect(page.getByRole('heading', { level: 1, name: 'Andisiwe Satshwa' })).toBeVisible();
  await expect(page.getByText('andisiwe@signalone.co.za')).toBeVisible();
  await expect(page.locator('form')).toHaveCount(0);
});
test('reduced motion and keyboard access', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/present/andisiwe');
  expect(await page.locator('.s1-pulse').evaluate(el => getComputedStyle(el, '::after').animationName)).toBe('none');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
});
test('offline public profile after shell caching', async ({ page, context }) => {
  await page.goto('/present/andisiwe');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Andisiwe Satshwa' })).toBeVisible();
  expect(await page.evaluate(() => [...document.fonts].some(font => /Inter/i.test(font.family) && font.status === 'loaded'))).toBe(true);
});
