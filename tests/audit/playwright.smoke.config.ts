import { defineConfig, devices } from "@playwright/test";

/**
 * AUDIT-ONLY cross-engine smoke pass (final release check, 2026-11-14). Not part of the release gate.
 * Engine EMULATION against the local production build, not real devices:
 *   WebKit: desktop 1440x900, iPhone 14 and iPad descriptors; Firefox: desktop 1440x900; Chromium: Pixel 7 descriptor.
 * 3200 = site with no intake upstream, 3201 = site pointed at the repo's own mock intake (:4010).
 *
 *   npx playwright install webkit firefox
 *   npx playwright test -c tests/audit/playwright.smoke.config.ts
 */
export default defineConfig({
  testDir: ".",
  testMatch: "*.smoke.ts",
  timeout: 10 * 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: Number(process.env.AUDIT_WORKERS || 2),
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3200", trace: "off", serviceWorkers: "block", locale: "en-ZA" },
  projects: [
    { name: "webkit-desktop-1440", use: { browserName: "webkit", viewport: { width: 1440, height: 900 } } },
    { name: "webkit-iphone-14", use: { ...devices["iPhone 14"] } },
    { name: "webkit-ipad", use: { ...devices["iPad (gen 7)"] } },
    { name: "firefox-desktop-1440", use: { browserName: "firefox", viewport: { width: 1440, height: 900 } } },
    { name: "chromium-pixel-7", use: { ...devices["Pixel 7"] } },
  ],
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
