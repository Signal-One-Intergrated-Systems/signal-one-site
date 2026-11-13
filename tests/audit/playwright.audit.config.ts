import { defineConfig } from "@playwright/test";

/**
 * AUDIT-ONLY configuration (Phase 1 website audit, 2026-11-13). Not part of the release gate.
 *
 * Runs against the LOCAL production build only (`next start`):
 *   3200  site with no intake upstream  -> forms must show the honest "not sent" state
 *   3201  site pointed at the repo's own mock intake (tests/e2e/mock-intake.mjs on 4010)
 * Nothing here talks to production or to any real intake endpoint.
 *
 *   npx playwright test -c tests/audit/playwright.audit.config.ts
 */
export default defineConfig({
  testDir: ".",
  testMatch: "*.audit.ts",
  timeout: 15 * 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: Number(process.env.AUDIT_WORKERS || 2),
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3200", trace: "off", serviceWorkers: "block" },
  webServer: [
    { command: "node tests/e2e/mock-intake.mjs", cwd: "../..", port: 4010, reuseExistingServer: true },
    { command: "npx next start -p 3200", cwd: "../..", port: 3200, reuseExistingServer: true, timeout: 90_000 },
    {
      command: "npx next start -p 3201",
      cwd: "../..",
      port: 3201,
      reuseExistingServer: true,
      timeout: 90_000,
      env: { SIGNAL_ONE_INTAKE_URL: "http://localhost:4010/intake", SIGNAL_ONE_INTAKE_TOKEN: "qa-token", INTAKE_MAX_PER_WINDOW: "100000" },
    },
  ],
});
