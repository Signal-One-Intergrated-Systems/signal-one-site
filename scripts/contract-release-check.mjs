#!/usr/bin/env node
/**
 * Release check: are the two vendored copies the same as the other repository's originals at a ref?
 *
 *   node scripts/contract-release-check.mjs --leos <path to a lancesat-enterprise-platform clone> --ref <sha|branch>
 *   node scripts/contract-release-check.mjs --github Signal-One-Intergrated-Systems/lancesat-enterprise-platform --ref <sha|branch>
 *
 * Compares (as parsed JSON, key order ignored):
 *   site contracts/website-intake.contract.v1.json  ==  LEOS apps/api/contracts/website-intake.contract.v1.json @ ref
 *   site contracts/form-manifest.v1.json            ==  LEOS apps/api/contracts/vendored/signal-one-site.form-manifest.v1.json @ ref
 * Exit 0 = both match; 1 = a copy differs (prints which and the contract versions); 2 = could not read.
 * Run it on the release candidate pair before either side deploys: the LEOS ref that will be live
 * and this site commit. Release order for a MINOR contract change: LEOS first, then the site.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";

const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const ref = arg("--ref"), leos = arg("--leos"), github = arg("--github");
if (!ref || (!leos && !github)) { console.error("usage: --ref <ref> (--leos <clone> | --github <owner/repo>)"); process.exit(2); }
const PAIRS = [
  ["contracts/website-intake.contract.v1.json", "apps/api/contracts/website-intake.contract.v1.json"],
  ["contracts/form-manifest.v1.json", "apps/api/contracts/vendored/signal-one-site.form-manifest.v1.json"],
];
function remote(path) {
  if (leos) return execFileSync("git", ["-C", leos, "show", `${ref}:${path}`], { encoding: "utf8" });
  const b64 = execFileSync("gh", ["api", `repos/${github}/contents/${path}?ref=${encodeURIComponent(ref)}`, "--jq", ".content"], { encoding: "utf8" });
  return Buffer.from(b64, "base64").toString("utf8");
}
let differs = 0;
for (const [local, other] of PAIRS) {
  let a, b;
  try { a = JSON.parse(readFileSync(new URL(`../${local}`, import.meta.url), "utf8")); b = JSON.parse(remote(other)); }
  catch (e) { console.error(`cannot read ${local} / ${other}@${ref}: ${e.message}`); process.exit(2); }
  const same = isDeepStrictEqual(a, b);
  differs += !same;
  const v = (x) => x.contractVersion ?? x.siteRef ?? "";
  console.log(`${same ? "SAME   " : "DIFFERS"} ${local}  vs  ${other}@${ref}  (${v(a)} / ${v(b)})`);
}
process.exit(differs ? 1 : 0);
