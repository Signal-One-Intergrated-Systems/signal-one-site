import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveVisitorLink, CONNECT_REVIEW_ORIGIN } from '../../app/_connect/lib/links.ts';
import { getProfile } from '../../app/_connect/lib/profiles.ts';
import { vcard } from '../../app/_connect/lib/vcard.ts';
test('only registered profile and exact founder-authorized review host can produce a visitor link',()=>{
 const good=resolveVisitorLink('andisiwe'); assert.equal(good.url,'https://www.signalone.co.za/connect/andisiwe');assert.equal(good.distribution,'review-only');
 for(const host of ['http://www.signalone.co.za','https://evil.invalid',CONNECT_REVIEW_ORIGIN+'/',CONNECT_REVIEW_ORIGIN+'?tenant=foreign','https://user:pass@www.signalone.co.za'])assert.equal(resolveVisitorLink('andisiwe',host),null);
 assert.equal(resolveVisitorLink('unknown'),null);
});
test('public business vCard remains complete CRLF and founder contact, separate from manual sales recipient',()=>{
 const p=getProfile('andisiwe');assert.equal(p.introductionEmail,'sales@signalone.co.za');const text=vcard(p);
 assert.ok(text.startsWith('BEGIN:VCARD\r\n'));assert.ok(text.endsWith('END:VCARD\r\n'));assert.match(text,/EMAIL;TYPE=WORK:andisiwe@signalone.co.za\r\n/);assert.doesNotMatch(text,/(?<!\r)\n/);
});
test('review app has no transactional receiver or automatic service-worker path',()=>{
 const layout=readFileSync('app/(connect)/layout.tsx','utf8');assert.doesNotMatch(layout,/OfflineShell|serviceWorker|Analytics/);
 const route=readFileSync('app/api/contact-intake/route.ts','utf8');assert.match(route,/status: 503/);assert.doesNotMatch(route,/fetch\(|process\.env|database|Authorization/);
 const robot=readFileSync('app/robots.ts','utf8');for(const path of ['/connect/','/present/','/contact/andisiwe','/qr/'])assert.ok(robot.includes(path));
 const sitemap=readFileSync('app/sitemap.ts','utf8');assert.doesNotMatch(sitemap,/\/connect\/|\/present\/|\/qr\//);
});
