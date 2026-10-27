import {defineConfig,devices} from '@playwright/test';
if(process.env.RECIPROCAL_DISPOSABLE_RUN!=='true')throw Error('Synthetic disposable harness required');
export default defineConfig({testDir:'./tests/reciprocal',outputDir:'test-results/reciprocal',workers:1,retries:0,timeout:30000,
  use:{baseURL:'https://127.0.0.1:4334',ignoreHTTPSErrors:true,trace:'retain-on-failure',launchOptions:process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{}},
  projects:[{name:'desktop',use:devices['Desktop Chrome']},{name:'tablet',use:{...devices['Desktop Chrome'],viewport:{width:768,height:1024}}},{name:'mobile',use:devices['Pixel 7']}],reporter:[['list'],['json',{outputFile:'test-results/reciprocal/results.json'}]]});
