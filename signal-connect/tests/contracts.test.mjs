import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const read = p => readFileSync(p, 'utf8');
test('canonical brand modules are byte-identical', () => { for (const f of ['SignalOneLogo.tsx','SignalOneMark.tsx']) assert.equal(read(`components/brand/${f}`), read(`../app/components/brand/${f}`)); });
test('canonical tokens match the source stylesheet', () => { const canonical = [...read('../app/globals.css').matchAll(/(--(?:color|radius|ease)-[\w-]+):\s*([^;]+);/g)]; const adapter = read('styles/tokens.css'); for (const [,key,value] of canonical) assert.ok(adapter.includes(`${key}: ${value};`), key); });
test('font uses canonical next/font configuration', () => { assert.match(read('app/layout.tsx'), /Inter\(\{ subsets: \["latin"\], variable: "--font-body", display: "optional" \}\)/); });
test('no overrides or remote CSS media', () => { for (const f of readdirSync('styles')) { const css = read(`styles/${f}`); assert.ok(!css.includes('!important')); assert.doesNotMatch(css, /url\(\s*["']?https?:/); } });
test('correct founder title and approved public contact fields', () => { const source = read('lib/profiles.ts'); assert.match(source, /title: "Founder"/); assert.doesNotMatch(source, /Co-Founder/); assert.match(source, /andisiwe@signalone.co.za/); assert.match(source, /27606335870/); assert.match(source, /27100231810/); });
test('public vCard identity, line endings and route separation', async () => {
  const { getProfile, profilePath } = await import('../lib/profiles.ts');
  const { vcard } = await import('../lib/vcard.ts');
  const profile = getProfile('andisiwe');
  assert.equal(profile.fullName, 'Andisiwe Satshwa');
  assert.equal(getProfile('unknown'), undefined);
  assert.equal(profilePath('andisiwe', 'present'), '/present/andisiwe');
  assert.equal(profilePath('andisiwe', 'connect'), '/connect/andisiwe');
  const card = vcard(profile);
  assert.ok(card.includes('FN:Andisiwe Satshwa\r\nORG:Signal One Integrated Systems\r\nTITLE:Founder'));
  assert.ok(card.includes('EMAIL;TYPE=WORK:andisiwe@signalone.co.za'));
  assert.ok(card.includes('TEL;TYPE=CELL:+27606335870'));
  assert.ok(card.includes('TEL;TYPE=WORK,VOICE:+27100231810'));
  assert.ok(card.endsWith('END:VCARD\r\n'));
});

test('provided founder portrait is optimised transparent WebP', () => {
  const image = readFileSync('public/people/andisiwe-bw.webp');
  assert.equal(image.toString('ascii', 0, 4), 'RIFF');
  assert.equal(image.toString('ascii', 8, 12), 'WEBP');
  assert.ok(image.length < 12000);
});
