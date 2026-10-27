import { defineConfig, devices } from '@playwright/test';
const offline = /QR remains available after offline reload once cached on an installed shell/;
export default defineConfig({
  testDir: './tests/connect', outputDir: 'connect-test-results', testMatch: '**/*.spec.ts', grepInvert: offline,
  workers: 1, timeout: 30000,
  use: { baseURL: process.env.CONNECT_TEST_BASE || 'http://127.0.0.1:4334', trace: 'retain-on-failure', launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {} },
  projects: [{name:'desktop', use: devices['Desktop Chrome']}, {name:'tablet', use:{...devices['Desktop Chrome'],viewport:{width:1024,height:768}}}, {name:'mobile',use:devices['Pixel 7']}],
  reporter: [['list']],
});
