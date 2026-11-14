# Independent delta review: signal-one-site PR #97, 9b0aa95..8291d1b

Reviewer: independent agent, did not write the change. Date: 2026-11-14. Read-only: nothing committed, pushed or sent to any external host; the authors' worktree `/home/claude/wt-site-audit` was not touched; only port 4790 was used, one server at a time, and only processes I started were stopped.

## Verdict

**APPROVE WITH NON-BLOCKING FINDINGS** for head `8291d1b94b084485da8fdfd5fbf0ee740b27d168`. No blocking defect found.

## SHAs reviewed

| | SHA |
|---|---|
| Base of PR (main) | `e0d28c87964868aa9a305c3b915007990a44037e` |
| Previously approved head | `9b0aa95d8dc72a4dfb9569de349c047104b691a8` |
| Final head (reviewed) | `8291d1b94b084485da8fdfd5fbf0ee740b27d168` |

Delta: 15 commits, 51 files, +1382 / -41. `git diff --name-status 9b0aa95..HEAD` shows only `A` and `M` entries: nothing deleted or renamed.

## Commands run (Node v24.22.1)

```
git -C /home/claude/signal-one-site fetch --depth=120 origin audit/website-full-audit-2026-11-13
git worktree add --detach /home/claude/wt-review-final FETCH_HEAD         # rev-parse = 8291d1b9...
git worktree add --detach /home/claude/wt-review-prev 9b0aa95             # comparison build
git log / diff --stat / diff --name-status / diff 9b0aa95..HEAD (every app, css, test and script hunk read)
git diff --stat 9b0aa95..HEAD -- package.json package-lock.json next.config.ts proxy.ts app/api .github public \
    app/lib/intake.ts app/components/IntakeForm.tsx app/components/journey app/components/EquipmentQuoteForm.tsx \
    app/_connect 'app/(connect)' playwright*.config.* eslint.config.mjs tsconfig.json scripts/check-*.mjs \
    scripts/public-truth-rules.mjs Dockerfile* .dockerignore .env.example          -> empty
npm ci && npm run build   (both worktrees; exit 0, prebuild + postbuild truth checks passed in both)
npm run lint (exit 0) ; npx tsc --noEmit (exit 0)                                   (final head)
bash -n scripts/audit/gate.sh
next start -p 4790 (final, then 9b0aa95, then final again; supervised, never both)
curl -D on /, /privacy, /contact, /api/connect-status, /api/intake -> diffed against the previous report's head/hdr_*.txt
curl: served canonical count on 19 routes; og:image + og:image:alt on /, /service, /equipment-marketplace, /join/sales;
      the three OG PNGs fetched and viewed; LEOS / "Sales OS" counts in 19 routes, .next/static, .next/server/app
curl -H "Accept: image/avif,..." /_next/image?...control-room-team...&w=384      (see "Could not check")
npx playwright test -c <review config, baseURL :4790, chromium-1194, workers=1> phase2-regressions.spec.ts
node scripts (Playwright library, Chromium 1194): canon.cjs, pricing.cjs, home.cjs (prev + final),
      pages.cjs (prev + final), hdr.cjs (CDP listener count, focus, close paths), idle.cjs
python: rendered text and tag diff of .next/server/app/*.html, prev vs final
```

Evidence (scripts, JSON, logs, crops): `/home/claude/audit-out/final/delta-review-evidence/`.

---

## Status of the previous findings

| ID | Status | Evidence |
|---|---|---|
| R-01 panel photo `sizes` | **Resolved** | `app/(marketing)/page.tsx:41` now `(min-width: 1024px) 340px, (min-width: 1024px) 34vw, 90vw`. Rendered srcset starts `256w 384w 640w ...`. At DPR 1 all 15 panel photos switch 640 -> 384 at 1920, 1440, 1280, 1024 and 390; largest box is 366 px, so nothing is upscaled (384 >= box). 820 unchanged (750). Candidate set is a superset of before, so DPR 2/3 choices cannot get worse. (`home-*.json`, `imgs`) |
| R-02 social cards | **Resolved** | `/service`, `/equipment-marketplace`, `/join/sales` og:image all HTTP 200 `image/png`, 34,825 / 37,004 / 38,248 bytes, all different from the site card (33,597). Viewed: "1Service / Run your service business. As one.", "Signal One / The right equipment. Ready for the field.", "Signal One / Sell the operating systems SMEs run on." Each matches the page's h1. og:image:alt and twitter:image:alt match. "LEOS": 0 in all 19 routes, `.next/static`, `.next/server/app`, the PNGs. "Sales OS": 8 on `/join/sales`, 0 elsewhere, 0 in client chunks. (`shots/og_*.png`) |
| R-03 menu sheet | **Resolved** (one residual, RD-03) | Crossing 1280 px with the sheet open closes it, `aria-expanded=false`, body overflow released, keydown listener count back to 0. Tab/Shift+Tab stay in the header and wrap. Fix used a focus wrap rather than `inert`; acceptable. (`header-probe-final.txt`, D-021/R-03 tests pass) |
| R-04 gate.sh | **Resolved** | `scripts/audit/gate.sh:20-29` replaces every `pkill -f next-server` / `mock-intake` with `stop_ports` limited to 3100, 3101, 3102, 4010, 4334 (fuser, lsof fallback; both installed; output format checked). It still stops anything on those ports regardless of owner, which is what the previous fix proposed. Not wired into package.json or CI. Syntax OK. |
| R-05 hero fill | n.a. (not in this delta's scope; founder sign-off still not determinable from the repo) | No rule touching `.so-hero-media` changed in the delta. |
| R-06 pricing | **Resolved** | `app/(marketing)/pricing/page.tsx:128-175`. Rendered order: h2 "Priced separately" -> "Guard days cover the platform. Equipment is optional and is never bundled into the R2,50 rate." -> radios row "By quote"; then a separate `<section>` h2 "Future capabilities, not available today" -> "not available yet, cannot be purchased and are not included in the R2,50 guard-day rate" -> h3 Accounting / h3 Payroll, "Not available yet", "Coming soon", no price. Heading order H1 > H2 > H3 with no skips. R2,50 per guard per day excl. VAT intact; worked example 10 x 30 = 300 = R750 intact. The only text change on any prerendered page is that one pricing sentence. (`pricing-final.txt`) |

---

## BLOCKING

None.

## NON-BLOCKING

### RD-01 The homepage "Pilot" pill lost its fill (homepage changed outside the stated scope)

- Where: `app/components/ui.tsx:27` (`pilot.dark` now `bg-[var(--site-control)]`); used on the homepage at `app/(marketing)/page.tsx:117` (`<GuardStatus tone="dark" />`). `--site-control` is defined only on `main:not(.s1-brand-home)` (`app/marketing-system.css:3-6`); the homepage `main` is `.s1-brand-home`.
- What: on `/` the variable is undefined, so the label's background goes from a 12% sky tint to transparent. Elsewhere (`/solutions/security`) it becomes solid `rgb(12,41,67)` as intended.
- Evidence: computed `background-color` of the homepage "Pilot" span: 9b0aa95 `oklab(0.7535 -0.0843 -0.1105 / 0.12)`, 8291d1b `rgba(0, 0, 0, 0)`, at every width tested (1023 to 1440, 390). Side-by-side crop `delta-review-evidence/shots/home-pilot-1440-prev-over-final.png`. Text colour and ring unchanged; the label is still readable. No test covers it (D-026 skips `/`).
- Why it matters: the delta claims the homepage changes only in the three notes, and the founder's rule is that the approved homepage does not change.
- Smallest fix: give the variable a fallback equal to the old tint (e.g. `bg-[var(--site-control,rgb(56_189_248/0.12))]`), or leave `bg-signal-400/12` in `ui.tsx` and set the solid fill in `marketing-system.css` under `main:not(.s1-brand-home)`.

### RD-02 Homepage hero note pill is clipped by 1 px on phones and sits across the glass panel's edge

- Where: `app/home-conversion.css:1192` (`margin:-9px -14px`) combined with the existing `right:13px!important` for `max-width:670px` (`app/home-conversion.css:584-587`).
- What: the box right edge is viewport + 1 px (390 px viewport: box x 267, width 124). The pill's right border is cut off, and its lower half crosses the top border of the hero glass panel.
- Evidence: `home-final.json` `390-reduce` `.so-hero-photo-note box [267,305,124,37]`; crop `shots/note_so-hero-photo-note-390-prev-over-final.png`. Text position is identical to before. No horizontal scroll (scrollWidth 390).
- Smallest fix: under `max-width:670px` use `margin:-9px -13px -9px -14px` (or `right:14px`) so the pill ends inside the viewport; check it with the founder, because it is a change inside the hero.

### RD-03 After the sheet is closed by widening past 1280 px, keyboard focus is dropped

- Where: `app/components/Header.tsx:139-142`.
- What: the sheet unmounts with focus inside it and the toggle is now hidden, so focus falls to `body`; the next Tab lands on the first input in the pricing calculator inside `main`, skipping the header.
- Evidence: `header-probe-final.txt`: `after widen: sheet 0 focus body`, `Tab after widen -> behind:INPUT`.
- Smallest fix: in `onWide`, focus the first link of `nav[aria-label="Primary"]` (or the header home link) before `setOpen(false)`.

---

## NOTE

- **ND-01 `sizes` relies on a Next.js implementation detail.** The second `(min-width: 1024px) 34vw` clause is never selected by a browser. It exists only because next/image builds the candidate list from the smallest `vw` in `sizes` (`page.tsx:38-41` comment says so). A Next upgrade that changes that heuristic would silently remove 384w again. D-009 is still one-sided (previous N-05), so no test would catch it.
- **ND-02 Disclosure line wrapper grows 9 px.** `.so-editorial-disclosure`'s `-9px` bottom margin collapses through its `.wrap` parent: the wrap measures 9 px taller at every width (e.g. 1440: 753 -> 762), but the page height is identical at all six widths (9619 / 9304 / 8669 / 8577 / 10921 / 13802) and no other element moved. Text of all three notes is at the identical position on both builds.
- **ND-03 SplitHero 1024 to 1185 px makes some heroes taller.** Intended effect of the narrower text column: `/solutions/security` hero 816 -> 843 px at 1024, `/join/sales` 708 -> 774 px at 1024 and 710 -> 776 at 1100. 1185 px: 1 px change (608 -> 607). 1023 and 1186 to 1440: no change on any route. `/pricing` (split-hero without `s1-person-first-split`): no change.
- **ND-04 Only the open-sheet focus wrap is used, `main`/`footer` are not `inert`.** Screen-reader virtual cursor can still read the covered page. Same as before; not a regression.
- **ND-05 The previous review's report is committed** as `docs/qa/2026-11-13-audit-repairs/final-release-check/INDEPENDENT_REVIEW.md`. Under `docs/qa` only (in `.dockerignore`).
- **ND-06 New audit tooling (`tests/audit/12,14,15`, `playwright.smoke.config.ts`) uses ports 3200/3201/4010** and is outside the release gate (`playwright.config.ts:15` testDir is `tests/e2e`). It only addresses localhost.

---

## Checked and found sound

1. **Protected paths.** `package.json`, `package-lock.json`, `next.config.ts`, `proxy.ts`, `app/api/**`, intake and consent code (`app/lib/intake.ts`, `IntakeForm.tsx`, `journey/**`, `EquipmentQuoteForm.tsx`, `app/_connect/**`, `app/(connect)/**`), `.github/**`, `public/**`, all Playwright configs, eslint/tsconfig, `scripts/check-*.mjs`, Docker files, `.env.example`: no diff in the delta. No file deleted. Docs commit `8291d1b` touches only `docs/qa/`.
2. **Security headers.** `/`, `/privacy`, `/contact`, `/api/connect-status`, `/api/intake`: identical to the previous report's recorded head headers after removing Date, ETag, Content-Length, Connection and Keep-Alive.
3. **Canonicals.** All 19 marketing routes serve exactly one `<link rel="canonical">` equal to their own URL (served HTML and hydrated DOM), one og:url, one h1, one JSON-LD block; `/join/sales` still `noindex, follow`, the rest `index, follow`. A client-side navigation updates canonical. (`canon-final.txt`)
4. **Homepage hero and content (a4a2018).** On reduced motion at 1920, 1440, 1280, 1024, 820 and 390: computed width/height/object-fit/object-position/transform/animation/opacity/filter/background/position of `.so-hero`, `.so-hero-media`, `.so-hero-photo`, hero `canvas` (globe), `.so-hero-copy`, `.so-hero-bar`, `.so-hero-wash`, `header` identical between 9b0aa95 and 8291d1b. Same 16 `@keyframes` (name and text length), same `document.getAnimations()`. All 292 elements in `main` other than the three notes have identical boxes (except the 9 px wrapper in ND-02). Rendered text of `/` is identical; tag structure differs only in the panel `sizes`/`srcset` and the Pilot class (RD-01). The new selectors are all prefixed `.so-home`, used only on `/`.
5. **Kickers and labels (a4a2018).** `main.s1-scene-page .split-hero p.text-signal-400` turns hero kickers to `#f2f9ff` on scene pages only; related links on landing pages and the equipment caption change colour only. Labels measured on all 18 non-home routes at 10 widths; changes limited to those elements. D-025 and D-026 tests pass (each sample at least 4.5:1).
6. **SplitHero (b50ae23, f4ca383).** Media query `1024-1279`, selector `.split-hero.s1-person-first-split` (SplitHero only, `app/components/ui.tsx:335`). Measured no change at 1023 or 1186 to 1440 px on any route. The test change in f4ca383 broadens the "headline clear of photo" check to handle the left-hand photo on `/guards` and adds a left-edge check; no assertion removed.
7. **Header (fbdb0b0, 8d213be).** `window` and `matchMedia` are used only inside `useEffect` (no render-time access; no hydration error in the console). The effect returns early when closed, so no trap or listener exists while closed: CDP shows 0 keydown listeners closed, 1 open, 0 after 10 open/close cycles, after a sheet-link navigation, after widening past 1280. Tab with the sheet closed walks into `main` normally. Escape closes and returns focus to the toggle. Body overflow is restored on toggle, Escape, sheet link, widening, and browser Back (all probed with and without reduced motion). Trapping inside an open modal sheet is intended; Escape is always available. The skip link is outside the header and unreachable only while the sheet is open.
8. **Tests.** `phase2-regressions.spec.ts` on the final build: 50 tests, 49 passed on the first run, the 50th (D-026 at 820 px) timed out waiting for network idle (see "Could not check"), then passed on rerun after a server restart. New tests are real assertions (contrast samples, geometry, focus zones, image bytes and content-type, section structure). The only existing-code change in the spec is `textContrast` refactored to the same median of the same three samples. No `.skip`, `.only`, `fixme`, `force: true` or retry was added; the only `retries` line is `retries: 0` in the new audit-only smoke config. No other test, helper or config changed.
9. **Build quality.** `npm run build` exit 0 with the repo's truth and codename gates; `npm run lint` exit 0; `tsc --noEmit` exit 0.

## Could not check, and why

- **Full Playwright release gate at 8291d1b.** Not permitted (single spec files only). Verified: build, lint, tsc, the 50-test phase2 spec. The rest of the e2e and the Connect suites rest on the authors' gate run.
- **D-026 at 820 px first-run timeout.** The browser's request for `control-room-team...&w=384` as AVIF never completed on my server process (curl with `Accept: image/avif` also hung 25-30 s; webp and other widths fine). After restarting my own server it returned 200 in 0.77 s, and the test passed. `next.config.ts` and that image are unchanged by the delta, so I treat this as a transient image-optimizer stall on a shared, loaded machine. I could not determine its root cause or whether it happens in production.
- **Firefox and WebKit.** Chromium only. The authors' cross-engine smoke file was read, not run (it needs ports 3200/3201/4010).
- **Real devices, production edge (Cloudflare/Railway), `GUARD_STATUS=live` build.** Not built or contacted.
- **Founder approval of the hero-adjacent changes** (note pills over the hero photo, RD-02; earlier R-05). Not determinable from the repository.

## One-line verdict

APPROVE WITH NON-BLOCKING FINDINGS (head `8291d1b`): RD-01 homepage Pilot fill lost, RD-02 hero note pill clipped 1 px on phones, RD-03 focus dropped when the sheet closes on widening.
