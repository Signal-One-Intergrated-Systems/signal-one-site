import { expect, test, type Page } from "@playwright/test";

/**
 * RD-04: keyboard focus after the open mobile menu is closed by the viewport crossing 1280 px.
 *
 * From 1280 px the Menu/Close toggle and the sheet are `display: none`, and the header closes the sheet. Focus
 * must then rest on a visible control inside the header, so the next Tab continues from the header instead of
 * restarting from the top of the page. Measured with this file on the tree before the repair (Chrome, production
 * build, 40 widenings per test):
 *   - focus on the Close toggle: lost 40 times in 40 (the toggle is hidden and the browser blurs it);
 *   - focus already on <body>: left there 40 times in 40;
 *   - focus on a link in the sheet: lost 7 to 12 times in 40. The browser hides the sheet and blurs its link
 *     BEFORE it delivers the media-query `change` event, so the header found <body> focused and did nothing.
 *
 * The last one is a race, so each test widens ITERATIONS times and fails if ANY widening loses focus. A defect
 * that drops focus one time in five passes all 40 by chance with probability 0.8^40 = 0.00013 (about 1 in 7,500);
 * at the lowest rate measured (7 in 40) it is 0.825^40 = 0.00046. Nothing here retries: one lost focus in 40 is
 * a failure.
 *
 * The focus indicator is checked too, because parking focus must not change what a pointer user sees: after a
 * keyboard journey the parked link shows its focus ring (:focus-visible), after a pointer journey it does not.
 */
const ROUTES = ["/join/sales", "/pricing"] as const;
const ITERATIONS = 40;
const NARROW = { width: 1100, height: 800 };
const WIDE = { width: 1300, height: 800 };

const toggleOf = (page: Page) => page.locator('header button[aria-controls="mobile-nav"]');
const sheetOf = (page: Page) => page.locator("#mobile-nav");

async function openWithKeyboard(page: Page) {
  await toggleOf(page).focus();
  await page.keyboard.press("Enter");
  await expect(sheetOf(page)).toBeVisible();
  // the header moves focus to the sheet's first link when it opens
  await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest("#mobile-nav"))).toBe(true);
}

type Case = {
  name: string;
  /** How the visitor got here: a keyboard user must SEE the parked focus, a pointer user must not see a ring appear. */
  modality: "keyboard" | "pointer";
  arrange: (page: Page) => Promise<void>;
};

const CASES: Case[] = [
  {
    name: "focus on a link inside the sheet",
    modality: "keyboard",
    arrange: openWithKeyboard,
  },
  {
    name: "focus on the Close toggle",
    modality: "keyboard",
    arrange: async (page) => {
      await openWithKeyboard(page);
      await page.keyboard.press("Shift+Tab"); // back from the sheet's first link to the toggle
      await expect(toggleOf(page)).toBeFocused();
    },
  },
  {
    name: "after Escape and reopening",
    modality: "keyboard",
    arrange: async (page) => {
      await openWithKeyboard(page);
      await page.keyboard.press("Escape");
      await expect(sheetOf(page)).toHaveCount(0);
      await expect(toggleOf(page)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(sheetOf(page)).toBeVisible();
      await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest("#mobile-nav"))).toBe(true);
    },
  },
  {
    name: "immediately after opening, with no wait",
    modality: "pointer",
    // the widening is issued as soon as the click returns: nothing waits for the sheet or for its focus move
    arrange: async (page) => {
      await toggleOf(page).click();
    },
  },
  {
    name: "focus already on the page body",
    modality: "pointer",
    arrange: async (page) => {
      await toggleOf(page).click();
      await expect(sheetOf(page)).toBeVisible();
      // a click on a non-interactive part of the sheet (the padding above its last paragraph) moves focus to <body>
      await sheetOf(page).locator("p").last().click({ position: { x: 4, y: 4 } });
      await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true);
    },
  },
];

/** Where focus is once the widening has settled: two frames and a beat, so a late blur of a hidden control is seen. */
async function focusAfterSettling(page: Page) {
  return page.evaluate(
    () =>
      new Promise<{ what: string; inHeader: boolean; visible: boolean; isToggle: boolean; ring: boolean }>((resolve) => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            setTimeout(() => {
              const el = document.activeElement as HTMLElement | null;
              const onBody = !el || el === document.body;
              const name = onBody ? "" : (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40);
              resolve({
                what: onBody ? "<body>" : `<${el.tagName.toLowerCase()}> "${name}"`,
                inHeader: !onBody && !!el.closest("header"),
                visible: !onBody && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden",
                isToggle: !onBody && el.matches('button[aria-controls="mobile-nav"]'),
                ring: !onBody && el.matches(":focus-visible"),
              });
            }, 50),
          ),
        );
      }),
  );
}

for (const route of ROUTES) {
  for (const { name, modality, arrange } of CASES) {
    test(`RD-04 ${route}: widening past 1280px with the menu open keeps focus in the header (${name})`, async ({ page }) => {
      // 40 open-and-widen journeys in one test: 15 to 25 s on a quiet machine, 54 s measured on a heavily loaded
      // one. The suite's 90 s budget is sized for one journey, so this loop gets its own.
      test.setTimeout(240_000);
      await page.setViewportSize(NARROW);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const toggle = toggleOf(page);
      const sheet = sheetOf(page);

      const lost: string[] = [];
      const wrongRing: string[] = [];
      for (let i = 1; i <= ITERATIONS; i++) {
        await page.setViewportSize(NARROW);
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await arrange(page);

        await page.setViewportSize(WIDE);
        await expect(sheet).toHaveCount(0);
        await expect(toggle).toBeHidden();
        const focus = await focusAfterSettling(page);

        if (!focus.inHeader) lost.push(`widening ${i}: focus is on ${focus.what}, outside the header`);
        else if (focus.isToggle) lost.push(`widening ${i}: focus is on the hidden toggle`);
        else if (!focus.visible) lost.push(`widening ${i}: focus is on ${focus.what}, which is not visible`);
        else if (modality === "keyboard" && !focus.ring) wrongRing.push(`widening ${i}: ${focus.what} has focus but no visible focus indicator`);
        else if (modality === "pointer" && focus.ring) wrongRing.push(`widening ${i}: a focus ring appeared on ${focus.what} for a pointer user`);
      }
      expect(lost, `focus was lost in ${lost.length} of ${ITERATIONS} widenings`).toEqual([]);
      expect(wrongRing, `focus indicator was wrong in ${wrongRing.length} of ${ITERATIONS} widenings`).toEqual([]);

      // and the next Tab carries on from there: forward inside the header, not from the top of the page
      const order = await page.evaluate(() => {
        const header = document.querySelector("header");
        const first = header?.querySelector("a[href]");
        return { parkedOnFirstLink: document.activeElement === first };
      });
      expect(order.parkedOnFirstLink, "focus is parked on the header's first link").toBe(true);
      await page.keyboard.press("Tab");
      const next = await page.evaluate(() => {
        const el = document.activeElement;
        return { inHeader: !!el?.closest("header"), movedOn: el !== document.querySelector("header a[href]") };
      });
      expect(next, "Tab moves on to the next header control").toEqual({ inHeader: true, movedOn: true });
    });
  }
}
