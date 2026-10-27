import { defineConfig, devices } from '@playwright/test';
const origin = 'https://www.signalone.co.za';
const target = process.env.CONNECT_LIVE_TEST_BASE ?? origin;
if (target !== origin && target !== 'http://127.0.0.1:4334') throw new Error('Only production or explicit loopback instrument test allowed');
export default defineConfig({
  testDir: './tests/live', workers: 1, retries: 0, timeout: 45000,
  outputDir: 'test-results/live',
  use: { baseURL: target, ignoreHTTPSErrors: false, trace: 'retain-on-failure', launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {} },
  projects: [{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'tablet',use:{...devices['Desktop Chrome'],viewport:{width:1024,height:768}}},{name:'mobile',use:devices['Pixel 7']}],
  reporter:[['list'],['json',{outputFile:'test-results/live/results.json'}]],
});
