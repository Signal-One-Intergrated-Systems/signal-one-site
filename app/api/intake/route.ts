import { NextResponse } from "next/server";
import { PRIVACY_NOTICE_VERSION } from "../../lib/intake";

/**
 * Website intake contract v1 (SITE_INTEGRATION.md).
 *
 * The browser never sees the upstream URL or token. A submission is reported
 * as received ONLY when the receiver returns a persisted-record receipt that
 * names the stored record and echoes this submission's idempotency key. A bare
 * HTTP 2xx is not proof that anything was saved.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A Map, not an object: "constructor" or "__proto__" as a kind must be an ordinary unknown value.
const INTENTS = new Map<string, ReadonlySet<string>>([
  ["client", new Set(["consultation", "company-onboarding", "equipment-rental-quote", "tracking-quote", "bodycam-rental-quote", "marketplace-interest"])],
  ["guard", new Set(["guard-profile"])],
  ["sales", new Set(["sales-representative-application"])],
]);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_PAYLOAD_CHARS = 20_000;
const MAX_FIELDS = 80;
const MAX_FIELD_CHARS = 6_000;
const FIELD_NAME = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const UPSTREAM_TIMEOUT_MS = 10_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECORD_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{5,79}$/;
const RECORD_TYPE = /^[a-z][a-z0-9_]{2,39}$/;
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/;
const EMAIL = "sales@signalone.co.za";

// PROVISIONAL throttle: per process, in memory, lost on restart, not shared between replicas.
// The enforceable limits belong at the edge and in the receiver (SITE_INTEGRATION.md).
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = Math.max(1, Number(process.env.INTAKE_MAX_PER_WINDOW) || 12);
const hits = new Map<string, number[]>();

let sinceSweep = 0;

function throttled(key: string, now: number) {
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  // A refused attempt is not counted, so a blocked visitor is released as the window slides.
  const over = recent.length >= MAX_PER_WINDOW;
  if (!over) recent.push(now);
  hits.set(key, recent);
  if (++sinceSweep >= 500 || hits.size > 20_000) {
    sinceSweep = 0;
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return over;
}

/**
 * Which address the throttle counts against.
 *
 * Never the left-most X-Forwarded-For entry: the visitor writes that one. When
 * INTAKE_CLIENT_IP_HEADER names the header the trusted edge sets (production:
 * cf-connecting-ip), use it. Otherwise use the address the platform proxy saw:
 * x-real-ip, then the right-most X-Forwarded-For entry.
 */
function clientKey(request: Request) {
  const named = (process.env.INTAKE_CLIENT_IP_HEADER || "").toLowerCase();
  const fromNamed = named ? request.headers.get(named)?.trim() : "";
  if (fromNamed) return fromNamed.slice(0, 64);
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const chain = (request.headers.get("x-forwarded-for") || "").split(",").map((part) => part.trim()).filter(Boolean);
  return (chain[chain.length - 1] || "unknown").slice(0, 64);
}

/** Hosts this site is served on: the request's own host, and the canonical site with its www/apex twin. */
function ownHosts(request: Request) {
  const hosts = new Set<string>();
  const add = (value: string | null | undefined) => {
    // A proxy chain may send "a, b"; the first entry is the host the visitor asked for.
    const host = (value || "").split(",")[0].trim().toLowerCase();
    if (host) hosts.add(host);
  };
  add(request.headers.get("x-forwarded-host"));
  add(request.headers.get("host"));
  try {
    const canonical = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za").host.toLowerCase();
    hosts.add(canonical);
    hosts.add(canonical.startsWith("www.") ? canonical.slice(4) : "www." + canonical);
  } catch {
    /* an unparsable site URL adds nothing */
  }
  return hosts;
}

/** Browsers always send Origin on a POST; anything without one that names this site is refused. */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return ownHosts(request).has(new URL(origin).host.toLowerCase());
  } catch {
    return false;
  }
}

function reply(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

type Receipt = { recordId: string; recordType: string; persistedAt: string; duplicate: boolean };

/** Accepts only `{ status: "persisted", receipt: { recordId, recordType, idempotencyKey, persistedAt, duplicate? } }`. */
const RECORD_TYPE_FOR: Record<string, string> = Object.assign(Object.create(null), {
  client: "website_enquiry",
  guard: "guard_application",
  sales: "recruitment_application",
});

function readReceipt(body: unknown, idempotencyKey: string, kind: string): Receipt | null {
  if (!body || typeof body !== "object") return null;
  const { status, receipt } = body as { status?: unknown; receipt?: Record<string, unknown> };
  if (status !== "persisted" || !receipt || typeof receipt !== "object") return null;
  const { recordId, recordType, persistedAt, duplicate } = receipt;
  if (typeof recordId !== "string" || !RECORD_ID.test(recordId)) return null;
  if (typeof recordType !== "string" || !RECORD_TYPE.test(recordType)) return null;
  if (typeof receipt.idempotencyKey !== "string" || receipt.idempotencyKey.toLowerCase() !== idempotencyKey.toLowerCase()) return null;
  if (typeof persistedAt !== "string" || !ISO_TIME.test(persistedAt) || Number.isNaN(Date.parse(persistedAt))) return null;
  // Each kind has exactly one record type. It never varies with what the receiver did internally, so the
  // reply cannot tell anyone whether a company or person was already known; and an application is never
  // acknowledged as a sales lead. Anything else is not a receipt we recognise.
  if (recordType !== RECORD_TYPE_FOR[kind]) return null;
  return { recordId, recordType, persistedAt, duplicate: duplicate === true };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply("Invalid request.", 403);
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) return reply("Invalid request.", 415);

  const tooLong = () => reply(`This submission is too long. Please shorten it or email ${EMAIL}.`, 413);
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return tooLong();
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return reply("Invalid request.", 400);
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return tooLong();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply("Invalid request.", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply("Invalid request.", 400);

  const { kind, data, consent, idempotencyKey } = body as {
    kind?: unknown;
    data?: unknown;
    consent?: { processing?: unknown; marketing?: unknown; noticeVersion?: unknown; capturedAt?: unknown };
    idempotencyKey?: unknown;
  };
  const intents = typeof kind === "string" ? INTENTS.get(kind) : undefined;
  if (typeof kind !== "string" || !intents || !data || typeof data !== "object" || Array.isArray(data)) {
    return reply("Invalid application.", 400);
  }
  const entries = Object.entries(data as Record<string, unknown>);
  if (
    entries.length === 0 ||
    entries.length > MAX_FIELDS ||
    entries.some(([name, value]) => !FIELD_NAME.test(name) || typeof value !== "string" || value.length > MAX_FIELD_CHARS)
  ) {
    return reply("Invalid application.", 400);
  }
  const intent = (data as Record<string, string>).intent;
  if (!intent || !intents.has(intent)) return reply("Invalid application.", 400);
  if (JSON.stringify(data).length > MAX_PAYLOAD_CHARS) {
    return reply(`This submission is too long. Please shorten it or email ${EMAIL}.`, 413);
  }
  if (
    !consent ||
    consent.processing !== true ||
    typeof consent.marketing !== "boolean" ||
    typeof consent.noticeVersion !== "string"
  ) {
    return reply("Please confirm the consent box before you send.", 400);
  }
  // Consent is to the notice that is published now, not to whatever date a client asserts.
  if (consent.noticeVersion !== PRIVACY_NOTICE_VERSION) {
    return reply("Our privacy notice has been updated. Please reload this page and send again.", 400);
  }
  if (typeof idempotencyKey !== "string" || !UUID.test(idempotencyKey)) return reply("Invalid request.", 400);

  const target = process.env.SIGNAL_ONE_INTAKE_URL;
  const token = process.env.SIGNAL_ONE_INTAKE_TOKEN;
  if (!target) {
    return reply(`Online forms are not connected yet, so nothing was sent. Please email ${EMAIL} and we will reply directly.`, 503);
  }
  if (!token) {
    // A receiver without service authentication is not an approved configuration.
    return reply(`Online forms are not connected yet, so nothing was sent. Please email ${EMAIL} and we will reply directly.`, 503);
  }

  // The throttle protects the receiver, so it sits after the honest "not connected" answer:
  // while nothing is connected, every visitor always gets the 503 and the email route.
  if (throttled(clientKey(request), Date.now())) {
    return reply(`Too many submissions from this connection. Please wait a few minutes or email ${EMAIL}.`, 429, { "Retry-After": "600" });
  }


  const unconfirmed = `We could not confirm that this was saved, so please treat it as not received. Try again, or email ${EMAIL}.`;
  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Idempotency-Key": idempotencyKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contract: "website-intake/v1",
        kind,
        data,
        consent: {
          processing: true,
          marketing: consent.marketing,
          noticeVersion: consent.noticeVersion,
          // Server time is the record; the browser clock is kept only as a hint.
          recordedAt: new Date().toISOString(),
          clientCapturedAt: typeof consent.capturedAt === "string" ? consent.capturedAt.slice(0, 40) : null,
        },
        idempotencyKey,
        source: "signal-one-site",
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const upstreamBody: unknown = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      // Only the receiver's validation answers (400, 422) are the visitor's to fix and may be shown.
      // A credential, routing or rate problem upstream is ours: generic message, 502, email route.
      const message = (upstreamBody as { message?: unknown } | null)?.message;
      if ((upstream.status === 400 || upstream.status === 422) && typeof message === "string") return reply(message.slice(0, 300), upstream.status);
      return reply(`We could not send this, so please treat it as not received. Try again, or email ${EMAIL}.`, 502);
    }

    const receipt = readReceipt(upstreamBody, idempotencyKey, kind);
    if (!receipt) return reply(unconfirmed, 502);

    return NextResponse.json(
      {
        message: receipt.duplicate ? "We already have this request on record." : "Your request has been received and recorded.",
        receipt: { reference: receipt.recordId, recordType: receipt.recordType, persistedAt: receipt.persistedAt, duplicate: receipt.duplicate, idempotencyKey },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return reply(timedOut ? unconfirmed : `Our form service is temporarily unavailable. Please try again, or email ${EMAIL}.`, timedOut ? 504 : 502);
  }
}
