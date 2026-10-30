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
    const signatures = await page.locator(".s1-product-signature").evaluateAll(nodes => nodes.map(node => {
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
        gapEm: parseFloat(parent.columnGap) / parseFloat(parent.fontSize),
        baseline: parent.alignItems,
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
      expect(signature.baseline).toBe("baseline");
      expect(signature.gapEm).toBeGreaterThan(0.059);
      expect(signature.gapEm).toBeLessThan(0.061);
    }
  });
}
