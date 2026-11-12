import { test, expect } from "@playwright/test";

/** Release gate: 1GUARD, 1Service and 1Community are one product family.
 * The typographic numeral is Signal blue at every surface, and shares
 * the following capital's font scale, weight, line box and baseline.
 * The gap is one consistent 0.06em token, not a per-product margin.
 */
for (const route of ["/", "/solutions/security", "/service", "/pricing"]) {
  test(`product family signature remains optically consistent on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    // Only wordmarks that are actually laid out: a hidden one (closed mobile menu, idle transition
    // overlay) has no rendered geometry to measure.
    const signatures = await page.locator(".s1-product-signature").evaluateAll(nodes => nodes.filter(node => node.getBoundingClientRect().width > 0).map(node => {
      const one = node.querySelector(".s1-product-signature__one");
      const name = node.querySelector(".s1-product-signature__name");
      if (!(one instanceof HTMLElement) || !(name instanceof HTMLElement)) return { invalid: true };
      const a = getComputedStyle(one);
      const b = getComputedStyle(name);
      const parent = getComputedStyle(node);
      return {
        invalid: false,
        oneText: one.textContent,
        colour: a.color,
        name: name.textContent,
        fontSizeEqual: a.fontSize === b.fontSize,
        weightEqual: a.fontWeight === b.fontWeight,
        familyEqual: a.fontFamily === b.fontFamily,
        lineHeightEqual: a.lineHeight === b.lineHeight,
        lineBoxEqual: Math.abs(one.getBoundingClientRect().height - name.getBoundingClientRect().height) < 1,
        // Rendered separation between the numeral and the capital, in em of the wordmark.
        gapEm: (name.getBoundingClientRect().left - one.getBoundingClientRect().right) / parseFloat(parent.fontSize),
        // Same baseline: identical type metrics, so the two boxes share a bottom edge.
        baselineDelta: Math.abs(one.getBoundingClientRect().bottom - name.getBoundingClientRect().bottom),
        // One word to assistive technology, search and copy-paste.
        text: (node as HTMLElement).innerText,
      };
    }));
    expect(signatures.length).toBeGreaterThan(0);
    for (const signature of signatures) {
      expect(signature.invalid).toBe(false);
      if (signature.invalid) continue;
      expect(signature.oneText).toBe("1");
      expect(["GUARD", "Service", "Community"]).toContain(signature.name);
      expect(signature.colour).toBe("rgb(14, 165, 233)");
      expect(signature.fontSizeEqual).toBe(true);
      expect(signature.weightEqual).toBe(true);
      expect(signature.familyEqual).toBe(true);
      expect(signature.lineHeightEqual).toBe(true);
      expect(signature.lineBoxEqual).toBe(true);
      expect(signature.baselineDelta).toBeLessThan(0.5);
      expect(["1GUARD", "1Service", "1Community"]).toContain(signature.text);
      expect(signature.gapEm).toBeGreaterThan(0.055);
      expect(signature.gapEm).toBeLessThan(0.065);
    }
  });
}
