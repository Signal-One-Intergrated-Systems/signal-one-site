import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  emptyExchange, createExchangeEmail, validateExchange,
} from "../lib/exchange.ts";

const valid = {
  ...emptyExchange,
  name: "Lerato Molefe",
  email: "lerato@example.org",
  company: "Site Security",
  interest: "Security operations and Guard",
  message: "I'd like to discuss site coverage.",
  consent: true,
};

test("valid introduction prepares a locally encoded mailto, never an HTTP lead write", () => {
  assert.deepEqual(validateExchange(valid), {});
  const handoff = createExchangeEmail("sales@signalone.co.za", valid);
  assert.ok(handoff);
  assert.match(handoff.href, /^mailto:sales@signalone\.co\.za\?/);
  assert.equal(new URL(handoff.href).searchParams.get("body"), handoff.body);
  assert.match(handoff.body, /Lerato Molefe/);
  assert.match(handoff.body, /Security operations and Guard/);
  assert.match(handoff.subject, /Andisiwe Satshwa/);
  assert.doesNotMatch(handoff.href, /^https?:/);
});

test("name, reachable contact method and explicit consent are mandatory", () => {
  const errors = validateExchange(emptyExchange);
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.consent);
  assert.equal(createExchangeEmail("sales@signalone.co.za", emptyExchange), null);
});

test("phone-only introductions are allowed; non-phone and non-email inputs rejected", () => {
  const phoneOnly = { ...valid, email: "", phone: "+27 82 123 4567" };
  assert.deepEqual(validateExchange(phoneOnly), {});
  assert.match(createExchangeEmail("sales@signalone.co.za", phoneOnly)?.body ?? "", /Phone: \+27/);
  assert.ok(validateExchange({ ...valid, email: "not-an-email" }).email);
  assert.ok(validateExchange({ ...valid, phone: "call me" }).phone);
  assert.ok(validateExchange({ ...valid, phone: "1" }).phone);
  assert.ok(validateExchange({ ...valid, phone: "1".repeat(30) }).phone);
});

test("consent, interest allowlist and bounded fields fail closed", () => {
  assert.ok(validateExchange({ ...valid, consent: false }).consent);
  assert.ok(validateExchange({ ...valid, interest: "Unlisted option" }).interest);
  assert.ok(validateExchange({ ...valid, message: "x".repeat(241) }).message);
  assert.ok(validateExchange({ ...valid, name: "x".repeat(81) }).name);
  assert.ok(validateExchange({ ...valid, name: "Anita\nBcc: example@example.org" }).name);
  assert.ok(validateExchange({ ...valid, company: "x".repeat(81) }).company);
  assert.equal(createExchangeEmail("bad?query@example.org", valid), null);
});

test("URI encoding protects message characters and no personal values appear in subject", () => {
  const handoff = createExchangeEmail("sales@signalone.co.za", {
    ...valid, name: "Ana & Tom", message: "Service needs: shifts & reports? 100% coverage.",
  });
  assert.ok(handoff);
  assert.equal(new URL(handoff.href).searchParams.get("body"), handoff.body);
  assert.match(handoff.href, /%26/);
  assert.doesNotMatch(handoff.subject, /Ana/);
});

test("manual email exchange has no persistence or network APIs", () => {
  const source = [
    "components/ExchangeDetails.tsx",
    "lib/exchange.ts",
  ].map(file => requireSource(file)).join("\n");
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|sendBeacon|navigator\.contacts/);
});

function requireSource(path) { return readFileSync(path, "utf8"); }
