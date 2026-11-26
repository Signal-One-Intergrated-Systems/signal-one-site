# Website release readiness — visual acceptance, separate from commercial integration

2026-11-26. **Nothing is merged or deployed to production.** Production `signalone.co.za` still runs site `main` `8e89d24`.

## Click through it yourself

**Staging: https://web-staging-review-production.up.railway.app**

- Built from the candidate branch `claude/peaceful-johnson-azma60`, the same head as draft PR #102. It redeploys automatically on every push to that branch.
- It is a separate Railway service, `web-staging-review`, in the existing `signal-one-site` project. The production `web` service, its domains and its settings are untouched.
- Search engines are told not to index it (`SITE_NOINDEX=1`, set only on this service): `noindex` header and a `robots.txt` that disallows everything.
- **Forms are safe to try.** Like production today, staging has no enquiry receiver configured. Every form says up front that requests are handled by email, and at the end prepares an email for you to send yourself. Nothing is submitted anywhere, and no form claims a request was received.
- To remove staging after acceptance, delete the `web-staging-review` service in Railway. Nothing else depends on it.

## 1. W1 and W2 are in the candidate

| Workstream | Branch @ head | In the candidate |
|---|---|---|
| W1 visual system: one token layer, `!important` 586 → 4 outside the locked hero, layout and spacing fixes | `wip/w1-visual` @ `65bf27aa` | Yes (merge `c03f27c`) |
| W2 performance: font subset, deferred below-fold media, KI-1 root cause, hero q75 | `wip/w2-perf` @ `9ee308c1` | Yes (merge `35fa09c`) |
| AUDW1 audit fixes (FIX-W) | `wip/audw-fixes` @ `1d6846b6` | Yes (merge `6be8cbd`) |
| L1 contract checks | `l1/contract-check` @ `eb3eba24` | Yes; its worktree's uncommitted files are byte-identical to the candidate's |
| DR-026 globe (new today) | `dc8dab3` | Yes |

Checked with `git merge-base --is-ancestor` against the candidate head.

## 2. Visual, brand, photography, spacing and layout defects: final status

**Fixed on the candidate:**
- **Shared root cause (VA-01–03, 05, 07–14, 20, 22–27).** Three CSS override layers were consolidated into one token layer.
- **Footer band and closing actions (VA-04).**
- **Form error states (VA-06).** Every form shows all problems at once, with a focused summary.
- **Page photography:**
  - VA-15: `/guards` and `/guard-attendance-software` no longer reuse photos.
  - VA-16: `/guards`, `/guard-attendance-software` and `/join/sales` have truthful photos.
  - VA-17: scene backdrops are toned to graphite.
- **Signal-blue accents (VA-21)** on text links, kickers, headings and labels.
- **Homepage:**
  - DR-017: radios sit above 1Service.
  - DR-022: no empty column above photos at 1440.
- **Marketplace links (DR-018).** Category links are consistent.
- **Content and brand:**
  - DR-008: 1GUARD naming everywhere.
  - DR-011 / DR-012: About and Support pages.
  - DR-002, 004, 005, 009, 010, 013, 014, 015: earlier fixes.
- **AUDW-01 to 12 (website audit).** All fixed; AUDW-10 is fixed for visitors without JavaScript.
- **DR-003 (homepage LCP).** Median 4.29 s → about 2.9 s in the lab with q75. Still above the 2.5 s target, so not a pass; production must be re-measured after deploy.
- **DR-026, the globe's mobile tap delay. Fixed today** (founder authorised).
  - **Change:** the globe now draws in a background worker, with the same geometry, colours and drawing order.
  - **Result:** on a throttled phone profile, tap response went from a median of 344–424 ms to 48–56 ms, and the page from 10 to 60 fps.
  - **Appearance:** only anti-aliasing differs, on 0.4% of pixels.
  - **Evidence:** `evidence/dr026-globe-before-after.png`.

## 3. Unresolved visual items

All of these need a founder decision or an asset; engineering cannot close them.

| ID | What you will see | Why open | Owner |
|---|---|---|---|
| VA-15 (part) | Equipment page heroes share one product photo pair | Needs rental-stock photography | Founder (photos) |
| VA-16 (part) | `/service` vision cards and the homepage devices card use generic imagery | Needs suitable photographs | Founder (photos) |
| VA-17 (part) | Hospitality foreground photos are warmer than the graphite system | Needs a designer colour re-grade | Founder / designer |
| VA-18 | Scene backdrops are below 2560 px for very wide screens | 2560 px masters, or drop the backdrops | Founder |
| VA-19 | At 390 px the hero caption touches the glass card's top edge | Moving it changes the locked hero | Founder (hero lock) |
| VA-21 (part) | Signal-blue filled buttons show the plain "1GUARD" name, not the blue numeral | A blue numeral is invisible on blue | Founder |
| DR-006 | Radio catalogue shows model and one line, with no specifications; the E600 has no photo | Needs verified datasheets and photos | Founder |
| DR-019 | Truth labels ("in development", "planned") are prominent on the homepage | Copy emphasis decision; labels must stay accurate | Founder |
| DR-020 / AUDW-10 (part) | If the page's scripts fail entirely, some homepage photos stay hidden | S3; no-JS visitors are already covered | Engineering, after release |
| DR-023 | The 404 page carries a canonical link to `/` | S3 SEO hygiene | Engineering, after release |
| DR-024 | 1GUARD / 1Service wordmark links are 81×20 px at 390 | S3; likely met by the WCAG spacing exception | Engineering, after release |

## 4. Two separate acceptances

| | Website visual acceptance | Commercial integration acceptance |
|---|---|---|
| What | The public site: brand, layout, photography, copy, performance, forms that are truthful in email mode | LEOS receiver, notifications, privacy, Sales OS queue, radio transaction |
| Where | Staging above; PR #102 | LEOS draft PRs #755 (security, ready), #756 (r2), #750; `RELEASE_APPROVAL_PACKAGE.md` |
| Depends on the other | **No.** With no receiver configured, the site uses the email route, exactly as production does today | Yes: the receiver goes live only by setting the website's receiver variables after LEOS is deployed |
| Status | Qualified locally (build, design checks, e2e); ready for your click-through | In progress; see the approval package |

## 5. What blocks releasing the website on its own

No engineering blocker. Enquiry handling stays truthful because the receiver is off: same email route as production. These founder decisions are needed first:

1. **WhatsApp number publication (DR-007 / AUDW-11).** `/about`, `/support` and `/contact` show **+27 60 633 5870**. Confirm it may be public, or the number is removed before release.
2. **Privacy page "Campaign information" text (AUDW-01).** Approve it; the page still says "Under legal review".
3. **"By quote" for radios on About.** Confirm.
4. **Your visual acceptance on staging**, including the items in §3 you accept as they are.
5. **Merge approval for PR #102** (merging site `main` deploys production).

Not blocking, but do before merging: trim `docs/launch/evidence/w1` (21 MB of screenshots) out of the merge. It does not affect the site.

After merge, analytics stays dormant until GA4/Ads IDs and a consent decision exist. No paid advertising.
