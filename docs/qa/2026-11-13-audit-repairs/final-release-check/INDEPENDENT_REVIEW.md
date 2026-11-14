# Independent release review: signal-one-site PR #97

Reviewer: independent agent, did not write the change. Review date: 2026-11-14.

## Verdict

**APPROVE WITH NON-BLOCKING FINDINGS** for head `9b0aa95` only. No blocking defect was found. Commits added to the branch after `9b0aa95` are not covered and need the delta review.

## SHAs reviewed

| | SHA |
|---|---|
| Base (production today, `main`) | `e0d28c87964868aa9a305c3b915007990a44037e` |
| Head (`audit/website-full-audit-2026-11-13`) | `9b0aa95d8dc72a4dfb9569de349c047104b691a8` |
| Merge base | `e0d28c8` (head is a straight line of 28 commits on top of base) |

Diff size: 100 files, +3801 / -138. 38 files under `app/`, 6 existing test files modified, 1 new e2e spec, 13 audit files under `tests/audit/`, 8 under `scripts/audit/`, 35 under `docs/qa/`.

## How this was reviewed

Workspace: `/home/claude/wt-review` (head) and `/home/claude/wt-review-base` (base), both detached worktrees of `/home/claude/signal-one-site`. Nothing was committed, pushed, or sent to any external host. The authors' worktree was not touched. Only port 4790 was used, one build at a time.

Commands run (Node v24.22.1):

```
git fetch --depth=80 origin audit/website-full-audit-2026-11-13
git worktree add --detach /home/claude/wt-review FETCH_HEAD          # rev-parse = 9b0aa95...
git worktree add --detach /home/claude/wt-review-base e0d28c8
git diff / git diff --stat / git diff --name-status e0d28c8..HEAD     # every app, test and css hunk read
npm ci && npm run build        (both worktrees; prebuild + postbuild truth checks passed in both)
npm run lint ; npx tsc --noEmit                     (both worktrees)
node --test --test-isolation=none tests/connect/*.test.mjs            (both worktrees)
next start -p 4790             (head, then base, then head again; never both)
curl -D against /, /privacy, /contact, /api/connect-status, /api/intake, a 404, /connect/x, /sitemap.xml, /robots.txt
POST /api/intake and /api/contact-intake on localhost:4790 (valid, no consent, bad key, cross-origin)
npx playwright test -c <review config, baseURL :4790, workers=1> phase2-regressions.spec.ts   (head, then base)
node scripts (Playwright library, Chromium 1194, one page at a time): meta.mjs, text.mjs, browser.cjs
  (contrast / scene / header / images), hydr.cjs, hero.cjs + pngdiff.cjs, canon.cjs, nf.cjs, axe.cjs,
  focus.cjs, menu.cjs, overflow.cjs
```

Scripts, raw JSON, logs and four hero screenshots are in `/home/claude/audit-out/final/independent-review-evidence/` (`tools/`, `head/`, `base/`, `images-compare.txt`).

Interference during the review, stated because it affects repeatability: the container restarted once, and my server on port 4790 was killed four more times by something outside my session (see R-04). Affected runs were repeated under a restart loop; every result quoted below comes from a run that completed without a refused connection.

---

## BLOCKING

None.

---

## NON-BLOCKING (should fix, safe to release)

### R-01 Homepage panel photographs now download a larger variant than they display (about +200 KB on 1x desktops)

- Where: `app/(marketing)/page.tsx:38`
- What: the `sizes` hint changed from `(min-width: 1024px) 340px, (min-width: 680px) 45vw, 90vw` to `(min-width: 1024px) 340px, 90vw`. Next.js builds the `srcset` from the smallest `vw` value in the hint; with 45vw gone, the 384w candidate is no longer emitted, so a 340 px slot is served the 640w file.
- Evidence (built site, 1440x900, DPR 1):
  - base srcset starts `384w, 640w, 750w ...`; head srcset starts `640w, 750w ...` (rendered HTML of `/`).
  - 15 panel photos move from the 384w to the 640w file and roughly double, e.g. `security-site-planning.webp` 20,135 -> 37,116 bytes for a 288x102 box; `guard-site-operations.webp` 18,759 -> 38,502. Together +184,479 bytes.
  - total image bytes on `/` after a full scroll: 1,909,759 -> 2,117,819 (+208,060, +11%); the 15 panel photos are 184,479 of that, the 8 thumbnails (64w -> 96w, needed for their 41 px tall box) 5,915, the 1Service photo 17,666. At 1024 px: +196,600 (+11%), same 184,479 from the panel photos.
  - DPR 2 desktop and DPR 3 mobile pick the same file as before for these photos.
- Smallest fix: keep a mid clause that is at most 60vw so 384w stays in the set, e.g. `(min-width: 1024px) 340px, (min-width: 680px) 60vw, 90vw`, and re-run D-009 at 820 px.

### R-02 The 1Service, equipment and careers pages are shared with a card that says "1GUARD"

- Where: new files `app/(marketing)/service/opengraph-image.tsx:2`, `app/(marketing)/equipment-marketplace/opengraph-image.tsx:2`, `app/(marketing)/join/sales/opengraph-image.tsx:2`, all re-exporting `app/(marketing)/opengraph-image.tsx:8` (`renderOg("Run every site. Prove the service.", "1GUARD")`).
- What: these three pages now have their own `og:title` and `og:url`, but their image is the guard card: kicker "1GUARD", headline "Run every site. Prove the service.", `og:image:alt` the same. On `/service` that sits beside the title "1Service | Restaurant-First Business Operating System".
- Evidence: fetched the `og:image` of `/service`, `/equipment-marketplace`, `/join/sales` from the head build: all 200, identical 33,597-byte PNG, rendered image saved as `independent-review-evidence/head/og-service.png`. On base the same pages showed the same card with the kicker "Signal One Security", so the mismatch is older; this PR renamed the kicker to a single product and added files that lock it onto non-guard pages.
- Smallest fix: `renderOg("<page headline>", "1Service")` in `service/opengraph-image.tsx` (and a neutral kicker such as "Signal One" for the site card, equipment and careers).

### R-03 Menu sheet: scroll stays locked if the viewport crosses 1280 px while the menu is open, and focus is not contained

- Where: `app/components/Header.tsx:102-118` (scroll lock effect), `:178` and `:193` (`xl:hidden`).
- What: the breakpoint fix is correct (sheet and toggle now agree). Two older weaknesses remain and are now reachable in the 1024 to 1279 range that this PR brings to life:
  1. Open the menu at 1100 px, widen to 1300 px (or rotate a 1024x1366 tablet): toggle and sheet are both hidden by CSS, `open` stays true, `body.style.overflow` stays `hidden`. The page cannot be scrolled and no visible control closes it; only Escape does.
  2. With the sheet open, Tab leaves it and lands on links in `<main>` behind the sheet.
- Evidence (head, `browser.cjs header`, `menu.cjs`):
  - `resized_1300_open {"toggleDisplay":"none","expanded":"true","sheetDisplay":"none","bodyOverflow":"hidden"}`, mouse wheel 600 px -> `scrollY 0`; after Escape -> `scrollY 600`.
  - 14 Tab presses with the sheet open at 1100 px: focus in `main` from the 9th press on `/`, from the 6th on `/guards`, from the 5th on `/join/sales`.
  - Base behaves identically for item 1 (`resized_1300_*` SAME on both builds), so this is not a regression.
- Smallest fix: in the `open` effect add `const mq = matchMedia("(min-width: 1280px)"); mq.addEventListener("change", e => e.matches && setOpen(false))`; mark `main` and `footer` `inert` while open.

### R-04 `scripts/audit/gate.sh` kills every Next.js server on the machine

- Where: `scripts/audit/gate.sh:19`, `:25`, `:30` (`pkill -f next-server`, `pkill -f mock-intake`).
- What: the pattern is not limited to servers the script started. It is not wired into `package.json` or CI, so production builds are unaffected, but anyone running it on a shared box stops unrelated servers.
- Evidence: read from the file. Observed alongside it: my review server on port 4790 (cwd `/home/claude/wt-review`, a different checkout) died four times with no reboot (`uptime` continuous); at the first of these the authors' own server on port 3200 had gone at the same moment and a fresh `next build` was running in their worktree. I did not see the script being invoked, so the link to this script is an inference from its content.
- Smallest fix: record the PIDs the script starts and kill those, or match on the port (`pkill -f "next start -p 4334"` only).

### R-05 The hero looks different at wide and at 1024 px widths; confirm the founder has seen it

- Where: `app/home-conversion.css:719` (`.so-hero-media` background `#b8d0b7` -> `#081a2c`).
- What: the photograph, globe canvas, glass panel, business-area bar, wash, object-fit and object-position rules are untouched, and the keyframe set is identical. But the photograph is `object-fit: contain`, so the fill is what shows around it, and the change is large on screen.
- Evidence (`hero.cjs`, `pngdiff.cjs`, first viewport, reduced motion):
  - computed geometry of `.so-hero`, `.so-hero-media .so-hero-photo`, `.so-hero canvas`, `.so-hero-copy`, `.so-hero-bar`, `.so-hero-wash`, `header` identical base vs head at 1920, 1440, 1024, 820, 390, with and without reduced motion; only `.so-hero-media` `background-color` differs.
  - 16 `@keyframes` rules on both builds, none added, removed or altered; `document.getAnimations()` lists equal.
  - pixels changed in the first viewport: 1920x1080 19.0% (124 px bands left and right of the photo, full height, plus the strip above it), 1024x768 24.5% (a 137 px block under the photo), 1440x900 9.7%, 820 14.0%, 390 8.1%.
  - screenshots: `independent-review-evidence/{base,head}/hero-1920.png`, `hero-1024.png`.
- Why it is listed: the standing rule is that the approved hero is not changed. The change is declared in the PR and I found nothing technically wrong with it; it only needs an explicit yes on the 1920 and 1024 renderings. If it has not been given, reverting is one line.

### R-06 Accounting and Payroll still sit under the heading "Priced separately"

- Where: `app/(marketing)/pricing/page.tsx:129-131` (h2 "Priced separately", intro "Guard days cover the platform. These are optional and are never bundled into the R2,50 rate.") and `:149-164` (the new block).
- What: the new sub-heading and rows are correct on their own ("Future capabilities, not available today", "cannot be purchased", "not included in the R2,50 guard-day rate", "Coming soon", no price). They are still children of a section whose heading and intro describe optional paid extras, so a reader skimming headings can take Accounting and Payroll for separately priced options.
- Evidence: rendered text of `/pricing` on head, lines "Priced separately" -> "These are optional and are never bundled" -> "Radios ..." -> "Future capabilities, not available today" -> "Accounting" / "Payroll".
- Smallest fix: close the "Priced separately" section after the radios row and give the future block its own section, or change the intro to "Equipment is optional and is never bundled ...".

---

## NOTE (no action needed for this release)

- **N-01 Residual low contrast on glass over photographs.** Three accent elements measure under 3:1 on head at 1440 px: the step numeral "3" on `/join/sales` (2.38:1, `app/(marketing)/join/sales/page.tsx:117`), the numeral "3" in the patrol story on `/guard-patrol-software` (2.70:1), one check icon on `/guard-attendance-software` (2.39:1). All are `#38bdf8` on a translucent panel where a bright part of the photo shows through. They were worse on base (the same elements were `#0270A8`, around 1.1 to 1.5:1). Across 554 measured elements: under 4.5:1 went 351 -> 54, under 3:1 went 318 -> 3, and no element got worse.
- **N-02 The 404 page after hydration.** Served HTML is right on head (title "Page not found | Signal One", no canonical, no og:url, noindex). After hydration in a browser the tab title becomes the layout default "Signal One Integrated Systems | 1GUARD & 1Service" and a `robots` meta `index, follow` appears beside `noindex`. Identical on base, HTTP status is 404, so no indexing risk. D-036 is fixed for canonical and og:url, not for title.
- **N-03 SceneTransition, older behaviour that this PR neither fixes nor worsens.** A link to the same path with a different query string closes the shutters and waits for the 3.5 s recovery timer (page covered for about 4.8 s); no such link exists in `app/`. After an interrupted transition the hidden overlay keeps the previous destination label until the next navigation. Both identical on base.
- **N-04 SplitHero hint on small 1x desktops.** `app/components/ui.tsx:328` hints the source width from 1024 px up. At 1024x768 DPR 1 `/guards` now loads the 1920w candidate (87,497 bytes) where 1080w would cover the 784 px tall box; base loaded 640w (31,007 bytes) and upscaled it. Hero image cost on SplitHero pages at DPR 1: +39 to +56 KB (`/solutions/security`, `/guards`, `/join/sales`). No change at DPR 2. Accepted as the price of not upscaling.
- **N-05 D-009 is a one-sided test.** `tests/e2e/phase2-regressions.spec.ts:353` fails only when an image is drawn larger than its decoded variant. Nothing fails when a hint is too large, which is how R-01 passed.
- **N-06 D-008 reads the first canonical only** (`phase2-regressions.spec.ts:169`, `.first()`). Exactly-one is still enforced by the existing `tests/e2e/routes.spec.ts:10` (strict locator), and I counted one canonical per route in the hydrated DOM.
- **N-07 One of the 30 new tests does not fail on base:** D-009 at 390 px. The other 29 fail on base for the stated reason.
- **N-08 `/security-trust` still says capabilities are labelled "Pilot, Live, Beta, MVP in development or Coming soon"** (`app/(marketing)/security-trust/page.tsx:20`). After this PR no capability on the site carries the Beta label. Not false, slightly stale.
- **N-09 Machine paths in committed tooling.** `/home/claude/audit-out` is the default output path in `tests/audit/lib.ts:5`, `tests/audit/08-hydration-chunk-delay.audit.ts:31`, `tests/audit/09-contrast-recheck.audit.ts:24` and four `scripts/audit/*.mjs` files.
- **N-10 Repository weight.** `docs/qa/2026-11-13-audit-repairs/before-after/` adds 8.0 MiB in 35 files (largest `home-full-390.jpg`, 2.3 MB). `docs/qa` is in `.dockerignore`; nothing under `public/` changed.

---

## Checked and found sound

**1. Security headers and CSP**
- `next.config.ts` and `proxy.ts` are byte-identical to base.
- Response headers compared base vs head on the built sites for `/`, `/privacy`, `/contact`, `/api/connect-status`, `/api/intake`, a 404, `/connect/x`, `/sitemap.xml`, `/robots.txt`: identical after removing Date, ETag and Content-Length. HSTS `max-age=31536000`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`, Referrer-Policy and Permissions-Policy all present on both.
- There are no CSP nonces in this codebase on either side (the policy uses `'unsafe-inline'`, documented in `next.config.ts:35-38`), so there was nothing for the layout or SceneTransition changes to break.
- Connect routes keep their stricter header set and do not load the marketing stylesheets.

**2. Intake contract and honesty**
- `app/api/**`, `app/lib/intake.ts`, `app/components/IntakeForm.tsx`, `app/components/journey/**`, `app/components/EquipmentQuoteForm.tsx`, `app/_connect/**`, `app/(connect)/**`: no diff.
- `brand.product` (renamed) is used only in JSON-LD, not in any payload.
- Local probes return the same on both builds: valid submission with no upstream -> 503 "Online forms are not connected yet, so nothing was sent..."; consent false -> 400; bad idempotency key -> 400; cross-origin -> 403; `/api/connect-status` -> `backendIntake: disabled`; `/api/contact-intake` -> 503 `CONTACT_EXCHANGE_UNAVAILABLE`.

**3. Exposure**
- No new route handler, env var, rewrite or redirect. New public URLs are three static OG image routes only.
- "LEOS": 0 occurrences in the rendered HTML of all 20 routes, in `.next/static`, and in `.next/server/app`; the repo's own prebuild and postbuild codename checks passed.
- "Sales OS": 8 occurrences on `/join/sales`, 0 on every other route and 0 in client chunks.
- No internal hostname, token or key pattern in `.next/static`; no `process.env` reference added under `app/`.

**4. Deployment behaviour**
- `package.json`, `package-lock.json`, `next.config.ts`, `proxy.ts`, `Dockerfile.qa`, `.github/**`, `eslint.config.mjs`, `tsconfig.json`, all four Playwright configs, `scripts/check-*.mjs`, `scripts/public-truth-rules.mjs`, `.env.example`, `.dockerignore`: no diff.
- `npm run build` exits 0 on head including prebuild and postbuild gates. `sitemap.xml` and `robots.txt` bodies identical to base.
- Lint: base 6 errors, 2 warnings (exit 1); head clean (exit 0). `tsc --noEmit`: base 1 error (exit 2); head clean. No `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `any` cast, `.skip`, `.only`, `fixme` or retry setting was added anywhere outside `tests/audit`.

**5. Test integrity**

| File | Change | Judgement |
|---|---|---|
| `tests/e2e/helpers.ts` | `click({force:true})` -> `click()` in `tick` and `fillVisible` | Stricter. A real click must pass Playwright's hit-target check. No assertion or retry count changed. |
| `tests/e2e/guard-status.spec.ts` | 4 string literals follow the rename | Justified; negative assertion still names the string the page would render. |
| `tests/e2e/seo.spec.ts` | JSON-LD `app.name` "Signal One Guard" -> "1GUARD" | Justified; follows `brand.product`. |
| `tests/connect/exchange.test.mjs` | fixture interest -> "1GUARD Security Business OS" | Justified; the allowlist in `app/_connect/lib/exchange.ts:23` already had this value on base, where the suite fails 3 of 18. Head: 18 of 18. |
| `tests/e2e/visual-mission.spec.ts` | type cast on the Axe constructor argument | Type-only; runtime call and assertion unchanged. |

- `tests/e2e/phase2-regressions.spec.ts`: 30 tests, all real assertions. Head 30 passed; base 29 failed, 1 passed, each failure for its stated cause (legal copy 1.94 to 3.01:1, sheet hidden at 1024 to 1279, literal `\n`, shared og fields, doubled title suffix, 404 canonical, marketplace labels 1.22 to 1.52:1, green fill `rgb(184,208,183)`, missing future-capabilities block, 16 and 19 upscaled images).
- No existing test, fixture or public asset was deleted (tests tree 33 -> 47 files).

**6. Risky code**
- `SceneTransition.tsx`: the render-phase update terminates after one extra render (`syncedPath` is set to `pathname` in the same pass). `awaitingCommit` is set and cleared at exactly the points where `target.current` is. Nine scenarios driven in a browser gave the same end state on base and head: normal click, back while idle, forward during closing, rapid second click, back during opening, same-path query link, cross-page hash link (anchor lands 96 px below the top), reduced-motion click, reduced-motion back. Every one ended with `data-guard-entry="idle"`, `html` overflow restored and the destination `h1` present; the page was never left covered.
- React #418: with the route error-boundary chunk delayed 1.5 s, base failed hydration 13 of 40 loads (`/privacy` 3/8, `/pricing` 4/8, `/` 2/8, `/guards/join` 1/8, `/get-started` 3/8); head 0 of 40.
- `Header.tsx`: at 1100 px the sheet now opens, is on top, takes focus, closes on Escape and returns focus to the toggle; on base it stayed `display:none` while locking scroll.
- Metadata: all 19 routes on head serve exactly one canonical equal to their own URL, one og:url equal to it, own og/twitter title and description, an og:image, one h1 and one JSON-LD block; robots `index, follow` on 18 and `noindex, follow` on `/join/sales`, as on base. Hydrated DOM counts match the served HTML, and a client-side navigation updates canonical and og:url. No 200 route ships without a canonical. JSON-LD parses; the only changed fields are `name`, `alternateName` and the pilot sentence; price `2.50` ZAR, minimum 10, VAT excluded unchanged.
- CSS: `app/globals.css` untouched. The new `main:is(.surface-...)` rules match only `LegalPage` (every other `surface-light` main is a scene page and is excluded). No homepage rule other than the hero fill and section `padding-block` changed; the hero section is not in the padding selector (its padding is 239/135 px on both builds). No content overflow and no horizontal scroll on `/` at 1920, 1440, 1280, 1024, 820, 390, with and without reduced motion. `/get-started`, `/contact`, `/guards/join` measured with no element worse than base.
- Images: the homepage hero is unchanged (`sizes="100vw"`, `priority`, `fetchPriority="high"`, same file chosen, same preload tag). SplitHero pages keep their preload with the new hint.
- Copy: rendered text of all 20 routes diffed base vs head. Only the intended renames, the three title fixes, the `\n` removal and the pricing block changed. No broken sentence, aria-label or alt text. Legal pages changed in one sentence (`/terms` pricing line). Price reads R2,50 per guard per day excl. VAT everywhere it appears; `/pricing` shows 300 guard days = R750. Accounting and Payroll appear only on `/pricing` as "Coming soon / Not available yet" with no price, and on `/guard-attendance-software` as "Payroll is coming soon".
- `GlassGlobe.tsx`: type annotations and one unused binding only; no runtime change.

**7. Deleted or unwanted additions**
- Nothing deleted. `public/` tree identical. No `console.*` or `debugger` added under `app/`. No app file imports from `tests/` or `scripts/`. No added file over 60 KB outside `docs/qa`.

**8. Accessibility**
- Focus ring on the recoloured links and buttons is still 3 px solid `#38bdf8` with 3 px offset.
- axe (wcag2a, 2aa, 21aa, 22aa) on 12 routes at 1440, 1100 (menu open on `/pricing`) and 390: no violations on either build. axe cannot judge contrast over gradients and photographs, so the pixel measurements above are the contrast evidence.
- Reduced motion: no shutter runs, navigation is immediate, overlay stays `idle`.

---

## Could not check, and why

- **The full Playwright release gate at head.** Running it was outside my permissions while the authors' suites were using the machine. Verified instead: build, lint, tsc, the 30-test phase2 spec, 18 Connect node tests. Whether the rest of the e2e suite passes at `9b0aa95` rests on the authors' run and CI.
- **Commits after `9b0aa95`.** Not reviewed.
- **The `GUARD_STATUS=live` build and builds with `GUARD_APP_*_URL` / `SALES_OS_URL` set.** Not built; "Download 1GUARD", "Already live in 1GUARD" and the Sales OS link were reviewed in source only.
- **Intake success path against a receiver.** The mock intake needs port 4010; only 4790 was allowed. The route code is byte-identical to base.
- **Production edge behaviour** (Cloudflare, Railway, live headers, live HSTS, real devices). Nothing was sent to signalone.co.za.
- **Image OCR truth gate** (`npm run check:images`). Not run; no image under `public/` changed.
- **Journey steps beyond the first screen** for contrast. Later form steps were not walked; their surfaces use the same `.choice`, `.rounded-card` and `.field-input` rules that are forced dark with `!important` and were unchanged.
- **Firefox and Safari.** Chromium only.
- **Whether the founder approved the hero fill change (R-05).** Not determinable from the repository.

## One-line verdict

APPROVE WITH NON-BLOCKING FINDINGS (head `9b0aa95`; delta review still owed for later commits).
