import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`Stage A visitor/manual contact ${width}px: brand, accessibility and no submission`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: width === 390 ? 667 : 900 });
    const errors: string[] = [];
    const privateRequests: string[] = [];
    const synthetic = 'StageAFixtureOnly';
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', request => {
      if (request.url().includes(synthetic) || request.postData()?.includes(synthetic) || request.url().includes('/api/contact-intake')) privateRequests.push(request.method() + ' ' + new URL(request.url()).pathname);
    });
    await page.goto('/connect/andisiwe');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('link', { name: /Save Andisiwe/ })).toBeVisible();
    await page.getByRole('button', { name: 'Share my details' }).click();
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    await expect(page.getByText('Signal Connect does not save or send them.', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Prepare email', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Correct the highlighted fields' })).toBeVisible();
    expect((await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await page.getByLabel('Full name').fill(synthetic);
    await page.getByLabel('Phone number').fill('+27110000000');
    await page.getByRole('checkbox').check();
    expect(await page.getByLabel('Full name').evaluate(el => getComputedStyle(el).fontSize)).toBe('17px');
    await page.getByRole('button', { name: 'Prepare email', exact: true }).click();
    const handoff = page.getByRole('link', { name: 'Open email app', exact: true });
    await expect(handoff).toBeVisible();
    const href = new URL((await handoff.getAttribute('href'))!);
    expect(href.protocol).toBe('mailto:');
    expect(href.pathname).toBe('sales@signalone.co.za');
    expect(href.searchParams.get('body')).toContain('Phone: +27110000000');
    expect(href.searchParams.get('body')).not.toContain('Email:');
    await expect(page.getByText('The message is prepared, not sent or saved.', { exact: false })).toBeVisible();
    expect((await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `connect-test-results/${info.project.name}-manual-${width}.png`, fullPage: true });
    const browserState = await page.evaluate(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, databases: await indexedDB.databases() }));
    expect(JSON.stringify(browserState)).not.toContain(synthetic);
    expect(browserState.databases).toEqual([]);
    expect(page.url()).not.toContain(synthetic);
    // Never invoke a real mail application or send mail from this browser test.
    // Closing before handoff must clear consent, contact and prepared-message state.
    await page.getByRole('button', { name: 'Share my details' }).click();
    await page.getByRole('button', { name: 'Share my details' }).click();
    await expect(page.getByLabel('Full name')).toHaveValue('');
    await expect(page.getByLabel('Phone number')).toHaveValue('');
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    await expect(handoff).toHaveCount(0);
    expect(privateRequests).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('Stage A email-only draft remains user controlled with clipboard denial', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied by synthetic browser policy'); } } }));
  await page.goto('/connect/andisiwe');
  await page.getByRole('button', { name: 'Share my details' }).click();
  await page.getByLabel('Full name').fill('StageAEmailFixture');
  await page.getByLabel('Email address').fill('synthetic@example.invalid');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Prepare email', exact: true }).click();
  await page.getByRole('button', { name: 'Copy email instead' }).click();
  await expect(page.getByLabel('Copy this message manually')).toHaveValue(/synthetic@example\.invalid/);
  await expect(page.getByRole('status', { includeHidden: true })).toBeEmpty();
  await expect(page.getByText('No lead is created by preparing this email.', { exact: false })).toBeVisible();
});
