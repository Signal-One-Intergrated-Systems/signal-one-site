import { defineConfig } from "@playwright/test";
import fs from "node:fs";

/**
 * Ports: 3100 is the site with no intake upstream (503 path), 3101 is the
 * site pointed at a local mock intake (success path), 3102 has the canonical
 * host redirect switched on, 4010 is the mock.
 * Browser: set PW_CHROMIUM to use a specific Chromium binary; otherwise the
 * Playwright-managed browser (as in Dockerfile.qa) is used.
 */
const candidate = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const executablePath = fs.existsSync(candidate) ? candidate : undefined;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    launchOptions: executablePath ? { executablePath } : {},
    trace: "off",
  },
  webServer: [
    { command: "node tests/e2e/mock-intake.mjs", port: 4010, reuseExistingServer: true },
    { command: "npx next start -p 3100", port: 3100, reuseExistingServer: true, timeout: 60_000 },
    {
      command: "npx next start -p 3101",
      port: 3101,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { SIGNAL_ONE_INTAKE_URL: "http://localhost:4010/intake", SIGNAL_ONE_INTAKE_TOKEN: "qa-token" },
    },
    {
      command: "npx next start -p 3102",
      port: 3102,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { CANONICAL_REDIRECT: "1" },
    },
  ],
});
