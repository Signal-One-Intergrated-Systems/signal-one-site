# Independent website audit AUDW-1

- Subject: `claude/peaceful-johnson-azma60` @ `94a1a4f` (22 commits ahead of `origin/main` @ `8e89d24`). Diff `origin/main...HEAD`.
- Auditor: independent reviewer subagent, 2026-11-25. Not committed. Nothing merged, pushed or submitted to production.
- Method: both trees built clean in separate worktrees (`/home/user/site-aud-main`, `/home/user/site-aud-head`, build + branding/design checks RC=0). Served locally: main :3400 (no receiver), HEAD :3402 (no receiver), HEAD :3401 (receiver = copy of `tests/e2e/mock-intake.mjs` on :4011, token `qa-token`, `SIGNAL_ONE_INTAKE_KINDS` unset = production default). Playwright/Chromium screenshots at 1440/1280/1024/390, dsf 1, reduced motion, 16 routes x 2 trees; axe (wcag2a/2aa/21aa) at 1440 and 390; overflow, heading, alt, broken-image metrics; keyboard sweeps; intake reproduced with curl and real-browser form runs against the mock only. The only request to signalone.co.za was a read-only `GET /api/intake/status` (answer: `onlineSubmissionAvailable:false`).
- Evidence directory (scratch, not committed): `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/coord/AUDW/` (below: `AUDW/`). `pairs/<route>__<width>__pN.jpg` = main left, HEAD right. Metrics: `metrics-main.json`, `metrics-head.json`.

## Verdict

**Ready with conditions.** No finding lets the site show success without a persisted receipt, and nothing invented was found. Three S2 defects need fixing or a decision before the release. Two of them only take effect once the LEOS receiver is connected.

Conditions:
1. AUDW-03: fix it before merge. It is a visible regression on all three journeys.
2. AUDW-01: update the privacy notice and bump `PRIVACY_NOTICE_VERSION` before the receiver is connected or `NEXT_PUBLIC_GOOGLE_ADS_*` is set. The alternative is to stop sending `attribution` until then.
3. AUDW-02: fix it before the receiver is connected with the default `SIGNAL_ONE_INTAKE_KINDS`.
4. AUDW-11: the founder confirms that the WhatsApp number may be published. DR-007 already sets this as a pre-merge condition and it is still open.

## Findings

### AUDW-01 · S2 · Confirmed: new personal-data processing not in the privacy notice, consent version not bumped
- Where: `app/lib/attribution.ts` (new), `app/lib/intake.ts:122`, `app/api/intake/route.ts:233-236`, `app/lib/analytics.ts:47-58` (`trackLeadConversion`), `app/components/Analytics.tsx:61-63`, `app/(marketing)/privacy/page.tsx` (unchanged since 2026-10-29), `app/lib/intake.ts:8` (`PRIVACY_NOTICE_VERSION = "2026-11-12"`, unchanged).
- What: the branch starts collecting campaign attribution: UTM tags, Google click IDs (gclid/gbraid/wbraid), landing path, referrer host and capture time. It sends them with every enquiry to the receiver. The receiver stores them, per LEOS `website_intake_contract.ts` §attribution and migration 0192. When `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION` / GA is configured, the branch also sends the receiver's record reference to Google as `transaction_id`. The privacy notice says only that information "you choose to submit" is collected. It does not mention analytics, Google Ads, click identifiers or campaign data. `/popia` is the same. `intake.ts:7` says the version must be bumped when the notice changes materially. Here the processing changed and neither the notice nor the version did, so every consent record will cite a notice that does not describe what was collected (POPIA s18 notification).
- Evidence: real-browser run (`audw-tools/forms.js`). A visit to `/ptt-radio-rental?utm_source=google&utm_medium=cpc&utm_campaign=audw&gclid=AUDW-TEST-123` followed by a radio quote delivered `attribution: {utm_source, utm_medium, utm_campaign, gclid:"AUDW-TEST-123", landingPath:"/ptt-radio-rental", capturedAt}` to the mock receiver, recorded as `QA-WEBSITE-ENQUIRY-1003`.
- Mitigating: nothing is sent while the receiver is unconnected, which is the production state today. The Ads conversion is dormant without env. Consent-mode defaults are all "denied".
- Fix: add a "Campaign and analytics information" section to `/privacy`: what is kept, why, where, and that the record reference goes to Google when Ads is on. Bump `PRIVACY_NOTICE_VERSION`. The founder or legal owner approves the text.

### AUDW-02 · S2 · Confirmed: the "handled by email" warning is not shown for guard or sales applications that will be refused
- Where: `app/api/intake/status/route.ts:7-10` reports `onlineSubmissionAvailable = Boolean(SIGNAL_ONE_INTAKE_URL)`. The new gate at `app/api/intake/route.ts:191-194` returns 503 for every kind not in `SIGNAL_ONE_INTAKE_KINDS`, and the default is `client`.
- What: with the receiver connected on the default configuration, `/guards/join` (and `/join/sales`, which has no availability banner at all) tells the visitor nothing in advance. A guard completes all 9 steps and only learns at the end that "Online applications are not connected yet, so nothing was sent". The mailto fallback means nothing is lost. But `IntakeAvailability` exists to "tell prospects the truth before they enter", and for applications it now does not. The status route also ignores a missing token, where the intake route answers 503.
- Evidence: on :3401, `GET /api/intake/status` → `{"onlineSubmissionAvailable":true}`, and `POST /api/intake` kind `guard` → 503 with the text above. Browser run `audw-tools/guard.js` (seeded draft, review step, consent, send) showed the 503 text and the email fallback after the full journey, and no banner on load (`[role=status]` = null).
- Why the suite missed it: `playwright.config.ts:38` runs every e2e server with `SIGNAL_ONE_INTAKE_KINDS: "client,guard,sales"`, so the production default is never exercised in the browser. Only `r0-release-gate.spec.ts:320` covers it, at API level.
- Fix: have the status route answer per kind, for example `?kind=guard`, or return `{client:true, guard:false, sales:false}`, and also require the token. Pass the kind from `/guards/join` and `/join/sales`, and add the banner to `/join/sales`. Add one e2e server on the default kinds.

### AUDW-03 · S2 · Confirmed regression: the new `Stepper` has no styles, so the visual progress indicator disappeared from all three journeys
- Where: `app/components/ui.tsx:168-186` renders `.stepper` and `.stepper-track`. No CSS rule for either exists in source or in the built CSS (`grep stepper` over `.next/static/chunks/*.css` = 0). Used by `ClientOnboarding.tsx` (`/get-started`), `GuardJoin.tsx` (`/guards/join`) and `SalesApplication.tsx` (`/join/sales`).
- What: main showed a 9-segment progress bar on `/guards/join`, a numbered step list on `/get-started` (lg) and an inline step list on `/join/sales`. HEAD replaced all three with `Stepper`, whose `<ol>` renders at 0 px height at 1440 and at 390 (measured: `audw-tools/st.js`). Only the "Step n of N · label" text remains. Screen-reader output is intact through sr-only items. Sighted users lose the at-a-glance length of a 9-step form, which matters most on the phone flow for guards.
- Evidence: `AUDW/evidence_stepper_guards_join_390.jpg` (main left shows the bar, HEAD right shows none), `AUDW/zoom_stepper_head_1024.png`, `pairs/get-started__1024__p0.jpg`, `pairs/join_sales__1440__p0.jpg`.
- Fix: add the `.stepper-track` styles: flex row of segments, `[data-state=done|current|todo]` fills using the existing tokens.

### AUDW-04 · S2 · Confirmed (not a regression): the multi-step journeys still use native-tooltip validation, but VA-06 is recorded as Fixed
- Where: `validateBeforeSubmit` is called only by `IntakeForm.tsx:71` and `EquipmentQuoteForm.tsx:179`. `ClientOnboarding`, `GuardJoin` and `SalesApplication` still rely on the browser's one-off tooltip: no `aria-invalid`, no persistent message, no summary. `BRAND_AUDIT.md:172` raised VA-06 as S1 ("Forms have no visible error state"), and `:496` marks it "Fixed".
- Evidence: `/guards/join` "About you" with "Continue" on empty fields gives `aria-invalid` count 0 and no `.field-error`. Only Chromium's transient bubble appears (`AUDW/head__form_guard_emptycontinue_390.jpg`). Main behaves the same.
- Fix: run `validateBeforeSubmit(form)` at the top of each journey's `onContinue`, set `noValidate`, and keep the existing multi-select messages. Or record VA-06 as partially fixed.

### AUDW-05 · S3 · Confirmed: generated error messages are ungrammatical and lower-case acronyms
- Where: `app/lib/formValidation.ts:36-41` builds `"Choose " + label.toLowerCase() + "."`, and the labels are questions or acronyms.
- Evidence: empty radio-quote submit at 390 produced "Choose buy or rent?.", "Enter how many radios?.", "Choose sim, data and ptt.", "Enter where will they be used?." (`AUDW/head__form_quote_empty_390.jpg`).
- Fix: an optional `data-error` per field, or strip a trailing "?" and do not lower-case all-caps words.

### AUDW-06 · S3 · Confirmed: the required consent box is outside the error summary, so validation takes two rounds
- Where: `app/components/ConsentFields.tsx:27` uses `aria-required` without `required`, so `validateBeforeSubmit` skips it. `IntakeForm.tsx:74` and `EquipmentQuoteForm.tsx:182` then report it separately.
- Evidence: the empty submit listed 9 problems and not consent. After those were fixed, a second submit gave "Please tick the consent box…" in the live region, with no `aria-invalid` on the box.
- Fix: add `required` to the processing checkbox. `messageFor` already has "Tick this box to continue."

### AUDW-07 · S3 · Confirmed: `/pricing` at 1024 crushes the "What is a guard day?" chips
- Evidence: `AUDW/evidence_pricing_guardday_1024.jpg` ("al- / loc- / ated / guard", one word per line). Main overflowed horizontally at this width (scrollWidth 1070). HEAD fixed the overflow with `hyphens-auto` and narrow columns, and the result is hard to read. Fine at 1280/1440/390.
- Fix: stack the equation under the price below ~1180 px, or give the chips a min-width.

### AUDW-08 · S3 · Confirmed: the server-side attribution sanitiser does not enforce the receiver's rules
- Where: `app/lib/attribution.ts:84-104`. `capturedAt` is forwarded without an ISO check, and an object with no campaign key at all is accepted.
- What: the code comment (L2-08) says a value that does not fit the receiver is dropped on its own so that it does not sink the enquiry. LEOS `validateAttribution` refuses the whole enquiry (422 `attribution_invalid`) when `capturedAt` is not ISO. The site forwards `capturedAt:"whatever"`. Reproduced on :3401: the body `attribution:{landingPath:"/x",capturedAt:"whatever",evil:"1"}` was forwarded as `{"landingPath":"/x","capturedAt":"whatever"}`. Only a tampered `sessionStorage` or a crafted request can trigger it, so the impact is low. Forwarding attribution with no campaign key also contradicts the "campaign visits only" rule.
- Fix: in `fitsReceiver`, drop `capturedAt` unless it is ISO, and in `sanitizeAttribution`, require at least one `ATTRIBUTION_KEYS` member.

### AUDW-09 · S3 · Plausible: campaign attribution is attached to job applications too
- Where: `app/lib/intake.ts:122` sends `readAttribution()` for every kind, and `route.ts:236` forwards it for every kind.
- What: a guard or sales applicant's ad-click identifiers would be stored on a recruitment record once `SIGNAL_ONE_INTAKE_KINDS` includes those kinds. That is purpose creep: the notice purpose is to assess the application. It is dormant today because of the kinds gate.
- Fix: send attribution only for `kind === "client"`.

### AUDW-10 · S3 · Confirmed (better than main): homepage panel photographs need JavaScript
- Where: `app/home-conversion.css:251` sets `html:not([data-after-load]) .so-panel-photo-image {display:none}`, and only `AfterLoad.tsx` (a client effect) sets the attribute.
- What: with JS disabled, or if hydration or a chunk fails (KI-1 is a known hydration issue), the four framed photo panels render as empty boxes. The defect register treats empty placeholder boxes as defects. Main without JS was worse: whole content cards were hidden. So this is not a regression, but it is a new dependency.
- Evidence: `AUDW/nojs_pair_home_1440.jpg`.
- Fix: add a `<noscript>` style override, or a timeout fallback, or keep `loading=lazy` with `fetchpriority=low` instead of `display:none`.

### AUDW-11 · S3 · Open condition (truthfulness)
- WhatsApp `+27 60 633 5870` and "Lancesat Suppliers (Pty) Ltd" (`app/lib/site.ts:12-18`) are not invented. Both appear in the internal record (`lancesat-enterprise-platform/docs/context/PROGRAMMES.md:208`, `PLATFORM_CHARTER.md:60`). But `DEFECT_REGISTER.md` DR-007 itself says "Founder to confirm the WhatsApp number may be published before merge", and I found no confirmation. The number is the founder's personal WhatsApp Business phone-app channel.
- `/about` marks "Vehicle tracking and body cameras" as **Available**, while every other surface labels equipment **By quote** and says "availability … confirmed by quotation". It is not a stock claim, but the two labels are inconsistent. Founder to confirm which label applies.
- `/about` claims "Every capability on this site is marked available, pilot, in development or planned". The site also uses "Coming soon" (1Community, Payroll), "Beta" (Accounting) and "By quote". Reword the claim to match.

### AUDW-12 · S3 · Confirmed: documentation and test gap for `SIGNAL_ONE_INTAKE_KINDS`
- The variable is not documented in `SITE_INTEGRATION.md`'s environment section. It appears only in `RELEASE_GATE.md`. The browser suite always overrides it (see AUDW-02).

### Informational: pre-existing, not in this diff
- The `sameOrigin` check in `route.ts` trusts `X-Forwarded-Host`. `curl` with `Origin: https://evil.example` and `X-Forwarded-Host: evil.example` was accepted (`QA-WEBSITE-ENQUIRY-1002`). This is not a CSRF hole, because browsers cannot set that header, but the Origin check gives no protection against scripted clients. Only the edge and receiver limits do.
- The throttle key trusts `x-real-ip` unless `INTAKE_CLIENT_IP_HEADER` is set. Production must set it, for example to `cf-connecting-ip`, or the throttle is trivially rotated.
- The radio *purchase* quote is sent as intent `consultation` (`EquipmentQuoteForm.tsx:192`). This is deliberate but loses the "equipment" signal in the CRM.

## Checked and found sound
- **Success only on a persisted receipt.** Verified against the mock: a receipt with a missing record, wrong idempotency key, bad time, or a `crm_lead` returned for an application gives 502 "treat it as not received". Upstream 401 gives a generic 502 with the email route and no receiver text. Upstream 422 passes the visitor-fixable message through, truncated to 300 characters. The client additionally requires `receipt.idempotencyKey === key` (`intake.ts:126`). A valid receipt shows the reference (`AUDW/head__form_quote_success_390.jpg`). The kinds gate returns an honest 503 with the email route. A cross-origin POST is refused with 403.
- **Attribution capture.** Only URLs with UTM or click parameters are recorded, in `sessionStorage` only (no cookie). A non-campaign visit never overwrites a stored record. Values are printable ASCII without markup, at most 200 characters, and only known keys are kept. Nothing is sent without the processing-consent tick, and the key is omitted when empty, so a v1 receiver is not broken.
- **Google tags.** The CSP adds the Ads hosts only when `NEXT_PUBLIC_GOOGLE_ADS_ID` is set. GA consent-mode defaults are all `denied`. The lead conversion fires only for client kinds and never on a duplicate.
- **Truth.** No invented prices, stock, specifications, testimonials, certifications or logos were found in added copy. The 12/24/36-month terms, model names and SC780 rental were all on main already. Status labels for 1GUARD (Pilot from `guardStatus.ts`), 1Service (In development), Guard Marketplace (In development) and 1Community (Coming soon) agree with `docs/PRODUCT_BRAND_ARCHITECTURE.md`. The rename to 1GUARD is consistent and `check:branding` passes. Support copy defers hours and response times to the customer agreement instead of inventing them.
- **Layout.** HEAD has no horizontal overflow on 16 routes at 390, 1024, 1280 or 1440. It fixes main's `/pricing` overflow at 1024. Visual review found no broken images and no layout breaks beyond AUDW-03 and AUDW-07.
- **Accessibility.** axe (wcag2a/aa) found 0 violations on all 16 HEAD routes at 1440 and 390. Every route has exactly one visible `h1`, no heading-level skips and alt text on every image. Every focus stop in the keyboard sweeps had a visible indicator (`/`, `/radios-equipment`, `/support` at 1440; `/about` at 390). The mobile menu keeps focus inside while open, Escape closes it and focus returns to "Menu". The quote and contact forms' error summary takes focus, has `role=alert`, links to each field, and sets `aria-invalid` and `aria-describedby`. Their submit errors sit in an `aria-live` region.
- **Founder-locked hero.** The source image, `object-fit` and `object-position`, the image and `h1` geometry at 1440, 1280 and 1024, and the copy are identical. The changes are the encoding (q90 → q75, per the founder ruling in DEFECT_REGISTER §78), the fill below the photograph (green wash → navy) and the header glass tint. Those fall within "fix around it". At 390 the image sits 4 px lower because the header is taller (`AUDW/hero_pair_1024.jpg`, `hero_main_*.png`, `hero_head_*.png`).
- **Checks.** `npm run contract:check` passes (contract 1.2.0 accepts all 10 manifest forms). Both builds passed the branding and design pre/post checks.

## Auditor's limits
- I did not build with `NEXT_PUBLIC_GA_ID` or the Ads IDs set, so the gtag runtime behaviour and the CSP with Ads were reviewed from code only.
- The receiver was the repository's mock, not LEOS #704/#748. Receiver behaviour cited in AUDW-08 comes from reading `/home/user/leos-intake` (`website_intake_contract.ts`), not from running it.
- Screenshots used reduced motion, so the animated states were not judged. axe cannot judge text contrast over photographs. I used no screen reader.
- The full multi-step journeys were not walked step by step in the UI. The guard journey was entered at the review step from a seeded draft. Onboarding and sales were checked at step 1 and through code.
- All 390 sheets and the key 1440/1024 sheets were inspected by eye. The 1280 sheets were checked by metrics and spot-checked only.
