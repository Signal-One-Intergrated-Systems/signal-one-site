import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  prepareContactIntake,
  isConfirmedIntakeReceipt,
  INTAKE_NOTICE_VERSION,
} from "../lib/intake-contract.ts";

const uuid = "249351c0-3a65-4cd0-8117-508b7167324a";
const recordId = "f8234364-f1a8-4620-8b60-74c9cf28762b";
const base = {
  name: "Nomsa Dube",
  email: "",
  phone: "+27 82 123 4567",
  company: "",
  interest: "Security operations and Guard",
  message: "Please call about guarding.",
  consent: true,
};

test("04B preserves phone-only lead as phone-only without creating a fake email or company", () => {
  const payload = prepareContactIntake(base, uuid);
  assert.ok(payload);
  assert.deepEqual(payload.contact, {
    name: "Nomsa Dube", email: null,
    phone: "+27 82 123 4567", company: null,
  });
  assert.equal(payload.version, 1);
  assert.equal(payload.source, "signal_connect");
  assert.equal(payload.presenterId, "andisiwe");
  assert.deepEqual(payload.consent, {
    purpose: "respond_to_introduction",
    noticeVersion: INTAKE_NOTICE_VERSION,
    affirmative: true,
  });
  assert.ok(!("tenantId" in payload));
  assert.ok(!("receivedAt" in payload));
  assert.ok(!("ownerId" in payload));
});

test("04B preserves email-only contact without inventing phone or company", () => {
  const payload = prepareContactIntake({ ...base, phone: "", email: "person@example.test" }, uuid);
  assert.ok(payload);
  assert.equal(payload.contact.email, "person@example.test");
  assert.equal(payload.contact.phone, null);
  assert.equal(payload.contact.company, null);
});

test("no affirmative consent, missing contact, invalid interest or invalid key blocks creation", () => {
  for (const details of [
    { ...base, consent: false },
    { ...base, phone: "" },
    { ...base, email: "wrong@", phone: "" },
    { ...base, interest: "secret" },
    { ...base, message: "x".repeat(241) },
  ]) assert.equal(prepareContactIntake(details, uuid), null);
  for (const key of ["", "123", "a".repeat(36), "00000000-0000-0000-0000-000000000000"]) {
    assert.equal(prepareContactIntake(base, key), null);
  }
});

test("a generic 2xx, missing storage receipt or wrong idempotency key never means stored", () => {
  const good = {
    status: "created", source: "signal_connect", persisted: true,
    recordId, submissionId: uuid,
  };
  assert.equal(isConfirmedIntakeReceipt(good, uuid), true);
  assert.equal(isConfirmedIntakeReceipt({ ...good, status: "existing" }, uuid), true);
  assert.equal(isConfirmedIntakeReceipt({ ...good, persisted: false }, uuid), false);
  assert.equal(isConfirmedIntakeReceipt({ ...good, status: "accepted" }, uuid), false);
  assert.equal(isConfirmedIntakeReceipt({ ...good, source: "crm" }, uuid), false);
  assert.equal(isConfirmedIntakeReceipt({ ...good, recordId: "unverified" }, uuid), false);
  assert.equal(isConfirmedIntakeReceipt({ ...good, submissionId: recordId }, uuid), false);
  assert.equal(isConfirmedIntakeReceipt(null, uuid), false);
  assert.equal(isConfirmedIntakeReceipt({ success: true }, uuid), false);
});

test("04B contract is inert: no direct browser CRM credentials, API calls or persistence", () => {
  const source = readFileSync("lib/intake-contract.ts", "utf8");
  const visitor = readFileSync("components/VisitorIdentity.tsx", "utf8");
  const exchange = readFileSync("components/ExchangeDetails.tsx", "utf8");
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|process\.env|Bearer |api\/v1/);
  assert.doesNotMatch(visitor + exchange, /intake-contract|\/api\/intake|createLead\(|submitLead\(/);
  assert.match(exchange, /createExchangeEmail/);
  assert.match(visitor, /Save Contact/);
});
