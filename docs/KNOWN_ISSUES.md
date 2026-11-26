# Known issues

## KI-1 Intermittent hydration error (React #418) under load — also present on the code that was live before R0

- **What:** a small share of page loads log `Minified React error #418` (server HTML did not match the client). React recovers by re-rendering on the client; the page still works.
- **Whether R0 changed the rate is not established:** the counts below are too small to tell either way.
- **Measured (same machine, same spec, `visual-mission.spec.ts` four times over, 336 page loads each):** `main` @ `fdbdfa2` (live): 2 failures. R0 branch: 5 failures. Under a lighter stress (360 loads, six concurrent pages) both showed 0.
- **Not the cause:** a second build running beside the server made it far worse (11 in 360) and has been removed from the suite (`tests/e2e/global-setup.ts`), but the error still occurs without it.
- **Lead:** in development the same class of mismatch appeared once in 150 loads as a `useId` difference inside `GuardDayCalculator`, with the differing segment above the page in the Next.js router tree. This points at the framework version (Next.js 16.1.0) rather than a page component.
- **Next step:** reproduce on the latest Next.js 16 patch release in a separate branch; if it clears, ship the upgrade as its own release with the full suite.
- **Test policy:** the check that pages log no errors stays strict. It is not skipped, retried or loosened.

## KI-2 "Existing website Connect live verification" workflow has failed since 30 October 2026

- **What:** the scheduled/dispatch workflow `.github/workflows/connect-live.yml` (`tests/connect/exchange.test.mjs`) reports failure on `main`. It predates R0 and R0.1 and is not part of the release gate ("Release gate (build + full browser suite)"), which is green.
- **Not established:** the cause. It has not been investigated. It may be the Signal Connect service, its credentials, or the test itself.
- **Effect on visitors:** none observed. The public pages, pricing and the form fallback were verified live after R0.1.
- **Next step:** read the failing run's log, classify (service down / credential expired / test stale), then fix or retire the workflow as its own change. Not to be folded into another release.

## KI-3 The `#community` anchor lands 12px lower on a phone than on a desktop

- **Measured live after R0.1 (2026-11-12, `www.signalone.co.za`):** at 1440x900 `#community` settles at 96px under the 88px header, as designed. At 390x844 it settles at 108px. An earlier desktop reading of several hundred pixels was taken while the smooth scroll was still running and was a measurement error, not a defect.
- **Effect:** cosmetic; the section heading is fully visible in both cases.
- **Not established:** why the phone layout settles 12px lower (a late layout shift during the scroll is the likely cause).
- **Next step:** handle inside the UX correction programme (`docs/UX_REQUIRED_CORRECTIONS_2026-11-12.md`), with a phone-viewport anchor assertion added to `tests/e2e/scene-transitions.spec.ts`.
