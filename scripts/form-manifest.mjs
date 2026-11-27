#!/usr/bin/env node
/**
 * The form manifest: what each public form SENDS, as observed by tests/e2e/forms.spec.ts in a real
 * browser (each successful journey writes test-results/form-manifest/<case>.json).
 *
 *   node scripts/form-manifest.mjs --write   # merge the observations into contracts/form-manifest.v1.json
 *   node scripts/form-manifest.mjs --check   # exit 1 if an observation is not in the committed manifest
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const OBS = new URL("../test-results/form-manifest/", import.meta.url);
const FILE = new URL("../contracts/form-manifest.v1.json", import.meta.url);
const forms = {};
for (const f of readdirSync(OBS)) {
  const o = JSON.parse(readFileSync(new URL(f, OBS), "utf8"));
  const id = `${o.path}#${o.intent}`;
  const e = (forms[id] ||= { id, path: o.path, kind: o.kind, intent: o.intent, fields: new Set(), journeys: [] });
  o.fields.forEach((x) => e.fields.add(x));
  e.journeys.push(o.journey);
}
const observed = Object.keys(forms).sort().map((id) => ({ ...forms[id], fields: [...forms[id].fields].sort(), journeys: forms[id].journeys.sort() }));
if (process.argv[2] === "--write") {
  const siteRef = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
  writeFileSync(FILE, JSON.stringify({ manifest: "signal-one-site/form-manifest", version: 1, generatedBy: "real Chromium through every public form: npx playwright test tests/e2e/forms.spec.ts, then node scripts/form-manifest.mjs --write", siteRef, forms: observed }, null, 2) + "\n");
  console.log(`wrote ${observed.length} forms @ ${siteRef}`);
} else {
  const committed = JSON.parse(readFileSync(FILE, "utf8"));
  const known = new Map(committed.forms.map((f) => [f.id, new Set(f.fields)]));
  const missing = observed.flatMap((o) => o.fields.filter((x) => !known.get(o.id)?.has(x)).map((x) => `${o.id}: ${x}`));
  if (missing.length) { console.error("forms send what the manifest does not list (run --write, then the contract check):\n  " + missing.join("\n  ")); process.exit(1); }
  console.log(`manifest covers all ${observed.length} observed forms`);
}
