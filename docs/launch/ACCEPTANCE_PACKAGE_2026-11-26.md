# Acceptance package — bright website, commercial review, offer architecture

2026-11-26. Website staging: **https://web-staging-review-production.up.railway.app** (search-hidden; forms use the truthful email route). Website candidate: branch `claude/peaceful-johnson-azma60` (draft PR #102). **No website change is in production.**

## Status by stage

| Workstream | Implemented | Visually verified | Functionally verified | Commercially integrated | Independently reviewed | Production deployed |
|---|---|---|---|---|---|---|
| Light-first design + bright asset package | Yes | Yes: before/after at 1440/1280/1024/390 for all 21 routes (`evidence/light/`); light share of non-photo area 1.0% → 74.8% at 1440 | Yes: full e2e (below) | n/a | Yes: staging walkthrough (`STAGING_WALKTHROUGH_2026-11-26.md`); its S1 and S2 issues are fixed | **No** (needs PR #102 merge approval) |
| Independent review findings (contact, trial, homepage, SEO, rental wording, privacy, analytics) | Yes | Yes | Yes: `commercial-review.spec.ts` | Analytics dormant (no IDs, no consent decision) | Reconciled finding by finding (`COMMERCIAL_REVIEW_RECONCILIATION.md`) | No |
| Communications offer (four journeys, components, industries, FAQ) | Yes (presentation only) | Yes | Yes: journeys preselect the quote form | No: LEOS fulfilment gaps (`LEOS_COMMERCIAL_CAPABILITY.md`) | Walkthrough | No |
| Founder decisions of 2026-11-26 (rules, contacts, E600, P30G Pro) | Yes | Yes | Yes | n/a | Walkthrough | No |
| LEOS security hotfix #755 (+ test fix #757) | Yes | n/a | Gate GREEN on main `151936f4` | n/a | AUDL1 → AUDL2 PASS | **Yes**: API and worker run `151936f4` (17:29 and 17:33 UTC) |
| LEOS launch candidate r2 #756 (receiver, outbox, privacy, Sales OS queue) | Yes | Sales OS queue page 12/12 at 1440 and 390 | Gate GREEN; browser 26/26, 16/16, 3/3, 7/7 (local, synthetic) | **No**: not merged, receiver credential not issued | AUD1, AUD2 + re-check, AUD-R2: PASS WITH CONDITIONS, no blockers | No |

## Website test evidence (final candidate)

- **Build:** `npm run build` RC=0. Design contract 29/29; public-truth checks pass on the source and on the rendered output.
- **Full e2e:**
  - On the merged light-first candidate `9f92d61`: 453 passed, 0 failed, 84 skipped (opt-in evidence capture).
  - On the final candidate with the walkthrough fixes: 452 passed and 2 failed, both tests expecting wording changed on purpose (email subject SW-11, status vocabulary SW-05). After updating them, `forms` passed 19/19 and `forms` + `audw-fixes` passed 38/38 with the remaining failure fixed.
- **Targeted runs after each change:** 144/144, 59/59, 35/35.
- **Staging walkthrough** (independent reviewer, fresh browser, 9 personas, 4 widths, 22 routes): "Ready with fixes": 1 S1, 7 S2, 22 S3.
  - Fixed: S1 SW-01; S2 SW-02, -03, -04, -05, -06, -07, -08; S3 SW-10, -11, -12, -13, -14, -22, -28, -29 (iOS claim removed; `/join/sales` stays out of the sitemap on purpose, because it is noindex).
  - Open S3 (polish, not blocking):
    - SW-09: the trial journey is framed as onboarding;
    - SW-15: dark hero bands at 1024 and 390;
    - SW-16 and SW-17: section balance;
    - SW-18: repeated images;
    - SW-19: `/equipment-marketplace` overlaps `/radios-equipment`;
    - SW-20: early-access contact topic;
    - SW-23: email field labels;
    - SW-24: mobile-number validation and skip-link focus;
    - SW-25: brand punctuation;
    - SW-26 and SW-27: underline and footer icon;
    - SW-30: procurement details "on request", which is your stance.
  - SW-21 (one-business-day reply) is your decision, now applied.

## Remaining dependencies

1. **Website release:** your visual acceptance on staging, then merge approval for PR #102. The `www` redirect takes effect only on release; staging stays as it is.
2. **Online enquiries (instead of email):**
   - merge approval for LEOS #756;
   - Architect confirmation of migration numbers 0190–0194 and 0197–0203;
   - a check of the receiver's `transaction_timeout` on Postgres 18;
   - a receiver credential issued through the approved mechanism;
   - then the website's receiver variables set, and one labelled production smoke enquiry.
3. **Selling radios end to end in LEOS:** fix TEN-1, PAY-1/2, ALLOC-1/2, TERM-1 and EXP-1 (all audit-class), then sell "Buy & Connect" as an outright sale plus a once-off connectivity line until LEOS can invoice hybrid deals.
4. **Your SQL:** session revoke, then the magic-link count, expiry and reissue.
5. **Assets and facts:**
   - P30G Pro exact variant, datasheet and photograph;
   - Teltonika tracker datasheets;
   - optional 2560 px backdrops (the Pexels candidates still need licence checks);
   - product screenshots from an authorised demo tenant.
6. **Compliance:**
   - legal review of the privacy, POPIA and terms pages, which keep the "Under legal review" label;
   - ECT Act s43 disclosure advice (whether the registered entity must appear, and where);
   - responsible-party details.
7. **Search Console:** a property for `sc-domain:signalone.co.za`. Steps are in the reconciliation document.

## Production release readiness

- **Website:** ready for your acceptance and merge, with the email route unchanged.
- **Commercial integration:** not operational until #756 is released and the receiver is qualified in production.
- **Advertising:** not ready. No conversion IDs and no consent decision yet, and no spend is authorised.
