import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
async function choose(page:Page,labels=['Signal One Guard — Security operations','DMR & two-way radios']) {
  await page.getByRole('button',{name:/What can Signal One help you with/}).click();
  for(const label of labels)await page.getByRole('checkbox',{name:label,exact:true}).check();
  await page.getByRole('button',{name:/^Done/}).click();
}
async function fill(page:Page,channel='phone') {
  await page.getByLabel('Full name').fill('Synthetic Exchange QA');
  await page.getByLabel(channel==='phone'?'Phone':'Email',{exact:true}).fill(channel==='phone'?'+27110000000':'synthetic@example.invalid');
  await choose(page);await page.getByRole('checkbox',{name:/I acknowledge/}).check();
}
test('identity and form appear together; photo stays compact; grouped interests stay collapsed; consent is unchecked',async({page},info)=>{
  await page.goto('/connect/andisiwe');await page.evaluate(()=>document.fonts.ready);
  await expect(page.getByRole('heading',{name:'Andisiwe Satshwa'})).toBeVisible();await expect(page.getByLabel('Full name')).toBeVisible();
  await expect(page.getByRole('button',{name:'Connect with Andisiwe',exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'Save Contact',exact:true})).toHaveCount(0);
  const photo=await page.getByAltText('Black-and-white portrait of Andisiwe Satshwa').boundingBox();expect(photo!.width).toBeLessThanOrEqual(100);expect(photo!.height).toBeLessThanOrEqual(115);
  await expect(page.getByRole('checkbox',{name:/I acknowledge/})).not.toBeChecked();await expect(page.getByRole('checkbox',{name:/news and offers/})).not.toBeChecked();
  await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByText(/locked|unlock|padlock/i)).toHaveCount(0);
  expect((await new AxeBuilder({page:page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page']}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({path:info.outputPath('synthetic-initial.png'),fullPage:true});
});
test('dropdown searches, supports keyboard multi-selection, removal and optional Other at 320px',async({page},info)=>{
  await page.setViewportSize({width:320,height:800});await page.goto('/connect/andisiwe');
  const trigger=page.getByRole('button',{name:/What can Signal One help you with/});await trigger.focus();await page.keyboard.press('Enter');await expect(page.getByLabel('Search interests')).toBeFocused();
  for(const group of ['Software & operations','Communications & connectivity','Security & smart infrastructure','Equipment & services'])await expect(page.getByRole('group',{name:group,exact:true})).toHaveCount(1);
  await expect(page.getByRole('dialog').getByRole('checkbox')).toHaveCount(20);
  await page.getByLabel('Search interests').fill('DMR');const dmr=page.getByRole('checkbox',{name:'DMR & two-way radios',exact:true});await dmr.focus();await page.keyboard.press('Space');
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(page.getByRole('button',{name:'Remove DMR & two-way radios'})).toBeVisible();
  await trigger.click();await page.getByRole('checkbox',{name:'Other / Not sure yet',exact:true}).check();await page.getByRole('button',{name:/^Done/}).click();
  await expect(page.getByLabel('Anything specific?')).toBeVisible();await page.getByLabel('Anything specific?').fill('Synthetic request');
  await page.getByRole('button',{name:'Remove Other / Not sure yet'}).click();await expect(page.getByLabel('Anything specific?')).toHaveCount(0);
  await trigger.click();await page.getByLabel('Search interests').fill('no matching service');await expect(page.getByText('No matching interests. Try another search.')).toBeVisible();await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page:page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page']}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({path:info.outputPath('synthetic-dropdown-mobile.png'),fullPage:true});
});
test('required name, contact channel, interest and privacy cannot be omitted; marketing is never required',async({page})=>{
  const sent:string[]=[];page.on('request',r=>{if(r.url().endsWith('/api/contact-intake'))sent.push(r.method());});await page.goto('/connect/andisiwe');
  const submit=page.getByRole('button',{name:'Connect with Andisiwe',exact:true});await submit.click();await expect(page.getByLabel('Full name')).toBeFocused();
  await page.getByLabel('Full name').fill('Synthetic Validation');await page.getByRole('checkbox',{name:/I acknowledge/}).check();await submit.click();await expect(page.getByRole('alert').filter({hasText:/\S/})).toContainText('Choose at least one');
  await choose(page);await submit.click();await expect(page.getByRole('alert').filter({hasText:/\S/})).toContainText('email address or phone');
  await page.getByLabel('Email',{exact:true}).fill('invalid-email');await submit.click();expect(sent).toEqual([]);
  await page.getByLabel('Email',{exact:true}).fill('synthetic@example.invalid');await page.getByRole('checkbox',{name:/I acknowledge/}).uncheck();await submit.click();expect(sent).toEqual([]);
});
test('phone-only introduction commits all selected interests and separate marketing false; only then download and reload work',async({page,request},info)=>{
  await page.goto('/connect/andisiwe');await fill(page);await choose(page,['Other / Not sure yet']);await page.getByLabel('Anything specific?').fill('Synthetic service question');
  const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/contact-intake'));await page.getByRole('button',{name:'Connect with Andisiwe',exact:true}).click();const response=await responsePromise;expect(response.status()).toBe(201);const receipt=await response.json();
  const proof=await (await request.get('/__synthetic-proof?submission='+receipt.submissionId)).json();expect(proof.receipts).toBe(1);expect(proof.email).toBe(null);expect(proof.phone).toBe('+27110000000');expect(proof.interests.map((v:{id:string})=>v.id)).toEqual(['guard','dmr','other']);expect(proof.marketingConsent.affirmative).toBe(false);expect(proof.proofInterests).toEqual(proof.interests);expect(proof.otherSpecification).toBe('Synthetic service question');expect(proof.contractVersion).toBe(2);
  await expect(page.getByText('Your introduction has been recorded.')).toBeVisible();const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Save Contact',exact:true}).click()]);expect(download.suggestedFilename()).toBe('andisiwe.vcf');await download.saveAs(info.outputPath('synthetic-andisiwe.vcf'));const card=await readFile(info.outputPath('synthetic-andisiwe.vcf'),'utf8');expect(card).toContain('FN:Andisiwe Satshwa\r\n');expect(card).toContain('EMAIL;TYPE=WORK:andisiwe@signalone.co.za\r\n');expect(card).not.toMatch(/(?<!\r)\n/u);
  await page.reload();await expect(page.getByRole('link',{name:'Save Contact',exact:true})).toBeVisible();expect((await request.get('/contact/andisiwe?persisted=true')).status()).toBe(403);
  await page.screenshot({path:info.outputPath('synthetic-recorded.png'),fullPage:true});
});
test('email-only and all 20 interests persist in one record, with separately chosen marketing true',async({page,request})=>{
  await page.goto('/connect/andisiwe');await page.getByLabel('Full name').fill('Synthetic All Interests');await page.getByLabel('Email',{exact:true}).fill('synthetic@example.invalid');
  await page.getByRole('button',{name:/What can Signal One help you with/}).click();const options=page.getByRole('dialog').getByRole('checkbox');for(let i=0;i<20;i++)await options.nth(i).check();await page.getByRole('button',{name:/^Done/}).click();
  await page.getByRole('checkbox',{name:/I acknowledge/}).check();await page.getByRole('checkbox',{name:/news and offers/}).check();const wait=page.waitForResponse(r=>r.url().endsWith('/api/contact-intake'));await page.getByRole('button',{name:'Connect with Andisiwe',exact:true}).click();const response=await wait;expect(response.status()).toBe(201);
  const receipt=await response.json();const proof=await (await request.get('/__synthetic-proof?submission='+receipt.submissionId)).json();expect(proof.interests).toHaveLength(20);expect(proof.proofInterests).toEqual(proof.interests);expect(proof.marketingConsent.affirmative).toBe(true);expect(proof.proofMarketing).toEqual(proof.marketingConsent);expect(proof.phone).toBe(null);expect(proof.receipts).toBe(1);
});
test('withheld acknowledgement preserves byte-identical retry payload and one committed record; no premature Save Contact',async({page,request})=>{
  const bodies:string[]=[];let dropped=false;await page.route('**/api/contact-intake',async route=>{bodies.push(route.request().postData()!);if(!dropped){dropped=true;await route.continue({headers:{...route.request().headers(),'x-synthetic-drop-ack':'true'}});}else await route.continue();});
  await page.goto('/connect/andisiwe');await fill(page);await page.getByRole('button',{name:'Connect with Andisiwe',exact:true}).click();await expect(page.getByRole('alert').filter({hasText:/\S/})).toContainText('not been confirmed');await expect(page.getByRole('link',{name:'Save Contact',exact:true})).toHaveCount(0);await expect(page.getByLabel('Full name')).toBeDisabled();
  const original=JSON.parse(bodies[0]);const proof=await(await request.get('/__synthetic-proof?submission='+original.submissionId)).json();expect(proof.receipts).toBe(1);
  const wait=page.waitForResponse(r=>r.url().endsWith('/api/contact-intake'));await page.getByRole('button',{name:'Retry introduction',exact:true}).click();const response=await wait;expect(response.status()).toBe(200);expect((await response.json()).status).toBe('existing');expect(bodies).toHaveLength(2);expect(bodies[1]).toBe(bodies[0]);await expect(page.getByRole('link',{name:'Save Contact',exact:true})).toBeVisible();
  expect((await(await request.get('/__synthetic-proof?submission='+original.submissionId)).json()).receipts).toBe(1);
  expect(await page.evaluate(async()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage},databases:await indexedDB.databases()}))).not.toContain('Synthetic Exchange QA');
});
test('a new browser and fabricated cookies cannot retrieve any vCard',async({request,page})=>{
  const cookieCases:Record<string,string>[]=[{},{Cookie:'__Host-s1-exchange=fabricated'}];
  for(const headers of cookieCases){const res=await request.get('/contact/andisiwe',{headers});expect(res.status()).toBe(403);expect(await res.text()).not.toContain('BEGIN:VCARD');}
  await page.goto('/present/andisiwe');await expect(page.locator('a[href="/contact/andisiwe"]')).toHaveCount(0);await expect(page.getByRole('link',{name:'Connect with Andisiwe',exact:true})).toHaveAttribute('href','/connect/andisiwe');
});

test('JavaScript-disabled submission uses POST and cannot leak fields into the URL or imply persistence',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,ignoreHTTPSErrors:true});const page=await context.newPage();
  try {
    await page.goto('https://127.0.0.1:4334/connect/andisiwe');await expect(page.getByLabel('Full name')).toBeVisible();
    await expect(page.locator('form')).toHaveAttribute('method','post');await expect(page.locator('form')).toHaveAttribute('action','/api/contact-intake');
    await page.getByLabel('Full name').fill('Synthetic NoJS');await page.getByLabel('Email',{exact:true}).fill('synthetic@example.invalid');await page.getByRole('checkbox',{name:/I acknowledge/}).check();
    const wait=page.waitForResponse(r=>r.url().endsWith('/api/contact-intake'));await page.getByRole('button',{name:'Connect with Andisiwe',exact:true}).click();const response=await wait;expect(response.status()).toBe(403);expect((await response.request().allHeaders()).origin).toBe('null');expect(response.request().method()).toBe('POST');expect(new URL(response.url()).search).toBe('');expect(await response.text()).not.toContain('persisted');
  }finally{await context.close();}
});
