#!/usr/bin/env node
/**
 * Static check: every form in contracts/form-manifest.v1.json is accepted by the VENDORED LEOS contract
 * (contracts/website-intake.contract.v1.json). No browser, no network: runs in `npm run contract:check`.
 *
 * For each form: its kind owns its intent; every field it sends is in the contract's list for that
 * intent; every field the contract requires for the kind is among the fields the form sends.
 * Exit 1 with one line per problem. The browser half (what the forms really send) is forms.spec.ts,
 * which fails when a form sends a field the committed manifest does not list.
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL(`../contracts/${p}`, import.meta.url), "utf8"));
const contract = read("website-intake.contract.v1.json");
const manifest = read("form-manifest.v1.json");
const problems = [];
if (contract.contract !== "website-intake/v1") problems.push(`vendored contract is ${contract.contract}; this site speaks website-intake/v1`);
for (const form of manifest.forms) {
  const kind = contract.kinds[form.kind];
  const intent = contract.intents[form.intent];
  if (!kind || !kind.intents.includes(form.intent)) { problems.push(`${form.id}: kind ${form.kind} does not own intent ${form.intent}`); continue; }
  for (const f of form.fields) if (!intent.fields.includes(f)) problems.push(`${form.id}: field "${f}" would be refused (422 field_not_allowed)`);
  for (const r of kind.requiredFields) if (!form.fields.includes(r)) problems.push(`${form.id}: never sends required field "${r}"`);
}
const published = Object.values(contract.kinds).flatMap((k) => k.intents).sort();
const sent = [...new Set(manifest.forms.map((f) => f.intent))].sort();
for (const i of published) if (!sent.includes(i)) problems.push(`no form sends intent ${i} (the contract publishes it)`);
if (problems.length) {
  console.error(`website-intake contract check FAILED (contract ${contract.contractVersion}, manifest v${manifest.version}):`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log(`website-intake contract ${contract.contractVersion} accepts all ${manifest.forms.length} forms in the manifest.`);
