import { randomBytes } from "node:crypto";
// Local stand-in for the LEOS intake receiver (website-intake/v1).
// Records payloads at GET /received and answers with a persisted-record receipt,
// de-duplicating on the idempotency key. `data.qaReceipt` selects a faulty reply
// so the site's refusal of unproven saves can be tested.
import http from "node:http";

const received = [];
const records = new Map();
let seq = 1000;
http
  .createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    if (req.method === "GET" && req.url === "/received") return res.end(JSON.stringify(received));
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: "bad json" }));
      }
      if (req.headers.authorization !== "Bearer qa-token") {
        res.statusCode = 401;
        return res.end(JSON.stringify({ message: "unauthorised" }));
      }
      received.push({ auth: req.headers.authorization, headers: req.headers, body: parsed });
      const key = parsed.idempotencyKey;
      const mode = parsed.data?.qaReceipt;
      if (mode === "upstream-401") { res.statusCode = 401; return res.end(JSON.stringify({ message: "internal: credential rejected by receiver" })); }
      if (mode === "upstream-422") { res.statusCode = 422; return res.end(JSON.stringify({ message: "Please give a company email address." })); }
      if (mode === "bad-time") return res.end(JSON.stringify({ status: "persisted", receipt: { recordId: "LEAD-123456", recordType: "website_enquiry", idempotencyKey: key, persistedAt: "1" } }));
      if (mode === "lead-for-application") return res.end(JSON.stringify({ status: "persisted", receipt: { recordId: "LEAD-123457", recordType: "crm_lead", idempotencyKey: key, persistedAt: new Date().toISOString() } }));
      if (mode === "internal-type-for-client") return res.end(JSON.stringify({ status: "persisted", receipt: { recordId: "LEAD-123458", recordType: "crm_lead", idempotencyKey: key, persistedAt: new Date().toISOString() } }));
      if (mode === "none") return res.end(JSON.stringify({ message: "Mock upstream: received." }));
      if (mode === "wrong-key") {
        return res.end(JSON.stringify({ status: "persisted", receipt: { recordId: "LEAD-999999", recordType: "website_enquiry", idempotencyKey: "00000000-0000-4000-8000-000000000000", persistedAt: new Date().toISOString() } }));
      }
      if (mode === "no-id") return res.end(JSON.stringify({ status: "persisted", receipt: { recordType: "website_enquiry", idempotencyKey: key, persistedAt: new Date().toISOString() } }));
      const duplicate = records.has(key);
      if (!duplicate) {
        // The receiver's contract: one record type per kind, and an opaque, random submission reference
        // that is not any stored row's id.
        const recordType = parsed.kind === "guard" ? "guard_application" : parsed.kind === "sales" ? "recruitment_application" : "website_enquiry";
        const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
        const reference = "SO-" + Array.from(randomBytes(12), (b) => alphabet[b % 32]).join("");
        records.set(key, { recordId: reference, recordType, persistedAt: new Date().toISOString() });
      }
      res.end(JSON.stringify({ status: "persisted", receipt: { ...records.get(key), idempotencyKey: key, duplicate } }));
    });
  })
  .listen(4010);
