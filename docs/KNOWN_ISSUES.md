# Known issues

## KI-1 Intermittent hydration error (React #418) under load — also present on the code that was live before R0

- **What:** a small share of page loads log `Minified React error #418` (server HTML did not match the client). React recovers by re-rendering on the client; the page still works.
- **Whether R0 changed the rate is not established:** the counts below are too small to tell either way.
- **Measured (same machine, same spec, `visual-mission.spec.ts` four times over, 336 page loads each):** `main` @ `fdbdfa2` (live): 2 failures. R0 branch: 5 failures. Under a lighter stress (360 loads, six concurrent pages) both showed 0.
- **Not the cause:** a second build running beside the server made it far worse (11 in 360) and has been removed from the suite (`tests/e2e/global-setup.ts`), but the error still occurs without it.
- **Lead:** in development the same class of mismatch appeared once in 150 loads as a `useId` difference inside `GuardDayCalculator`, with the differing segment above the page in the Next.js router tree. This points at the framework version (Next.js 16.1.0) rather than a page component.
- **Next step:** reproduce on the latest Next.js 16 patch release in a separate branch; if it clears, ship the upgrade as its own release with the full suite.
- **Test policy:** the check that pages log no errors stays strict. It is not skipped, retried or loosened.
