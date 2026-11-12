import { NextResponse } from "next/server";

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

const INTENTS: Record<string, ReadonlySet<string>> = {
  client: new Set(["consultation", "company-onboarding", "equipment-rental-quote", "tracking-quote", "bodycam-rental-quote", "marketplace-interest"]),
  guard: new Set(["guard-profile"]),
  sales: new Set(["sales-representative-application"]),
};
const MAX_BODY_BYTES = 64 * 1024;
const MAX_PAYLOAD_CHARS = 20_000;
const MAX_FIELDS = 80;
const MAX_FIELD_CHARS = 6_000;
const FIELD_NAME = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const UPSTREAM_TIMEOUT_MS = 10_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECORD_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{5,79}$/;
const RECORD_TYPE = /^[a-z][a-z0-9_]{2,39}$/;
const EMAIL = "sales@signalone.co.za";

// PROVISIONAL throttle: per process, in memory, lost on restart, not shared between replicas.
// The enforceable limits belong at the edge and in the receiver (SITE_INTEGRATION.md).
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = Math.max(1, Number(process.env.INTAKE_MAX_PER_WINDOW) || 12);
const hits = new Map<string, number[]>();

function throttled(key: string, now: number) {
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
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

/** Browsers always send Origin on a cross-document POST; anything without a matching one is refused. */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function reply(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

type Receipt = { recordId: string; recordType: string; persistedAt: string; duplicate: boolean };

/** Accepts only `{ status: "persisted", receipt: { recordId, recordType, idempotencyKey, persistedAt, duplicate? } }`. */
function readReceipt(body: unknown, idempotencyKey: string): Receipt | null {
  if (!body || typeof body !== "object") return null;
  const { status, receipt } = body as { status?: unknown; receipt?: Record<string, unknown> };
  if (status !== "persisted" || !receipt || typeof receipt !== "object") return null;
  const { recordId, recordType, persistedAt, duplicate } = receipt;
  if (typeof recordId !== "string" || !RECORD_ID.test(recordId)) return null;
  if (typeof recordType !== "string" || !RECORD_TYPE.test(recordType)) return null;
  if (typeof receipt.idempotencyKey !== "string" || receipt.idempotencyKey.toLowerCase() !== idempotencyKey.toLowerCase()) return null;
  if (typeof persistedAt !== "string" || Number.isNaN(Date.parse(persistedAt))) return null;
  return { recordId, recordType, persistedAt, duplicate: duplicate === true };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply("Invalid request.", 403);
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) return reply("Invalid request.", 415);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return reply("Invalid request.", 400);
  }
  if (raw.length > MAX_BODY_BYTES) return reply(`This submission is too long. Please shorten it or email ${EMAIL}.`, 413);

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
  if (typeof kind !== "string" || !INTENTS[kind] || !data || typeof data !== "object" || Array.isArray(data)) {
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
  if (!intent || !INTENTS[kind].has(intent)) return reply("Invalid application.", 400);
  if (JSON.stringify(data).length > MAX_PAYLOAD_CHARS) {
    return reply(`This submission is too long. Please shorten it or email ${EMAIL}.`, 413);
  }
  if (
    !consent ||
    consent.processing !== true ||
    typeof consent.marketing !== "boolean" ||
    typeof consent.noticeVersion !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(consent.noticeVersion)
  ) {
    return reply("Please confirm the consent box before you send.", 400);
  }
  if (typeof idempotencyKey !== "string" || !UUID.test(idempotencyKey)) return reply("Invalid request.", 400);

  if (throttled(clientKey(request), Date.now())) {
    return reply(`Too many submissions from this connection. Please wait a few minutes or email ${EMAIL}.`, 429, { "Retry-After": "600" });
  }

  const target = process.env.SIGNAL_ONE_INTAKE_URL;
  const token = process.env.SIGNAL_ONE_INTAKE_TOKEN;
  if (!target) {
    return reply(`Online forms are not connected yet, so nothing was sent. Please email ${EMAIL} and we will reply directly.`, 503);
  }
  if (!token) {
    // A receiver without service authentication is not an approved configuration.
    return reply(`Online forms are not connected yet, so nothing was sent. Please email ${EMAIL} and we will reply directly.`, 503);
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
      // Receiver validation messages (4xx) may be shown; anything else stays generic.
      const message = (upstreamBody as { message?: unknown } | null)?.message;
      const clientError = upstream.status >= 400 && upstream.status < 500;
      return reply(clientError && typeof message === "string" ? message.slice(0, 300) : "We could not send this application.", clientError ? upstream.status : 502);
    }

    const receipt = readReceipt(upstreamBody, idempotencyKey);
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
