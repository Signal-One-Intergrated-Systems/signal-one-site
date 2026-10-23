import test from "node:test";
import assert from "node:assert/strict";
import { resolveVisitorLink } from "../lib/links.ts";

const preview = "https://signal-connect-v3-source-preview.vercel.app";
const expected = preview + "/connect/andisiwe";

test("visitor URL is canonical, attributable and explicitly preview-only", () => {
  assert.deepEqual(resolveVisitorLink("andisiwe", preview), {
    url: expected,
    profileId: "andisiwe",
    distribution: "preview-only",
  });
  assert.equal(resolveVisitorLink("andisiwe", preview + "/")?.url, expected);
  assert.equal(resolveVisitorLink("andisiwe", preview)?.url.includes("/present/"), false);
});

test("missing origin or unregistered founder fails closed", () => {
  for (const origin of [undefined, "", " ", preview]) {
    assert.equal(resolveVisitorLink("other-person", origin), null);
  }
  assert.equal(resolveVisitorLink("andisiwe", undefined), null);
});

test("origin rejects spoofed, insecure, altered and unverified hosts", () => {
  const rejected = [
    "http://signal-connect-v3-source-preview.vercel.app",
    "https://localhost:4173",
    "https://evil.example",
    "https://signalone.co.za",
    "https://connect.signalone.co.za",
    "https://signal-connect-v3-source-preview.vercel.app.evil.example",
    "https://user@signal-connect-v3-source-preview.vercel.app",
    "https://signal-connect-v3-source-preview.vercel.app:444",
    "https://signal-connect-v3-source-preview.vercel.app/path",
    "https://signal-connect-v3-source-preview.vercel.app/?track=1",
    "https://signal-connect-v3-source-preview.vercel.app/#fragment",
    " https://signal-connect-v3-source-preview.vercel.app",
    "javascript:alert(1)",
    "//signal-connect-v3-source-preview.vercel.app",
  ];
  for (const origin of rejected) {
    assert.equal(resolveVisitorLink("andisiwe", origin), null, origin);
  }
});

test("resolver does not accept presenter paths or arbitrary QR text", () => {
  assert.equal(resolveVisitorLink("/present/andisiwe", preview), null);
  assert.equal(resolveVisitorLink("andisiwe?presenter=1", preview), null);
  assert.equal(resolveVisitorLink("../other", preview), null);
});
