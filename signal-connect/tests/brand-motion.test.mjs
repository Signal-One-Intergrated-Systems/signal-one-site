import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const globals = readFileSync("styles/global.css", "utf8");
const visitor = readFileSync("components/VisitorIdentity.module.css", "utf8");
const header = readFileSync("components/ConnectHeader.tsx", "utf8");
const mark = readFileSync("components/brand/SignalOneMark.tsx", "utf8");
const brand = readFileSync("../docs/BRAND.md", "utf8");

test("only canonical header mark receives perpetual 2.8s Signal One pulse", () => {
  assert.match(header, /SignalOneLogo size=\{22\} tone="dark" pulse/);
  assert.match(mark, /pulse \? "s1-pulse /);
  assert.match(brand, /2\.8s ease-out, infinite|2\.8s ease-out infinite/);
  assert.match(globals, /\.s1-pulse::after \{ animation: signal-pulse 2\.8s ease-out infinite; \}/);
  assert.equal((globals.match(/infinite\s*;/g) ?? []).length, 1);
  assert.doesNotMatch(visitor, /infinite|signal-pulse/);
});

test("generic global page fade is removed in favour of component-owned, single arrival", () => {
  assert.doesNotMatch(globals, /\bmain\s*\{\s*animation:/);
  assert.match(globals, /@keyframes signal-arrival/);
  assert.match(globals, /\.presenter \{ animation: signal-arrival 320ms/);
  for (const name of [".businessCard", ".connect", ".discovery"]) {
    assert.ok(visitor.includes(`${name} { animation: signal-arrival 320ms`), name);
  }
  assert.doesNotMatch(visitor, /!important|box-shadow|backdrop-filter|linear-gradient|radial-gradient/);
});

test("reduced motion disables the pulse and all page entrance effects", () => {
  assert.match(globals, /prefers-reduced-motion: reduce/);
  assert.match(globals, /\.s1-pulse::after, \.presenter \{ animation: none; \}/);
  assert.match(visitor, /\.businessCard, \.connect, \.discovery \{ animation: none; \}/);
  assert.match(globals, /scroll-behavior: auto/);
});

test("branded arrival keeps the contact card accessible without adding a splash or delay gate", () => {
  const page = readFileSync("components/VisitorIdentity.tsx", "utf8");
  assert.match(page, /<main id="main"/);
  assert.match(page, /<ContactExchange profile=\{profile\}/);
  assert.match(page, /businessCard/);
  assert.doesNotMatch(page, /setTimeout|loadingScreen|splash|blockingOverlay/);
});
