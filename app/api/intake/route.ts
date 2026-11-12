import { NextResponse } from "next/server";

/**
 * Website intake contract v1 (see SITE_INTEGRATION.md).
 *
 * The browser never sees the upstream URL or token. Nothing here reports
 * success unless the upstream receiver answered 2xx.
 */
const ALLOWED_KINDS = new Set(["client", "sales", "guard"]);
const MAX_PAYLOAD_CHARS = 20_000;
const UPSTREAM_TIMEOUT_MS = 10_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Best-effort per-instance throttle. The receiver and the edge enforce the real limits.
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

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients send no Origin; they still need a valid body
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return bad("Invalid request.", 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }
  if (!body || typeof body !== "object") return bad("Invalid request.");

  const { kind, data, consent, idempotencyKey } = body as {
    kind?: string;
    data?: unknown;
    consent?: { processing?: unknown; marketing?: unknown; noticeVersion?: unknown; capturedAt?: unknown };
    idempotencyKey?: unknown;
  };
  if (!kind || !ALLOWED_KINDS.has(kind) || !data || typeof data !== "object" || Array.isArray(data)) {
    return bad("Invalid application.");
  }
  if (Object.values(data as Record<string, unknown>).some((value) => typeof value !== "string")) {
    return bad("Invalid application.");
  }
  if (JSON.stringify(data).length > MAX_PAYLOAD_CHARS) {
    return bad("This submission is too long. Please shorten it or email sales@signalone.co.za.", 413);
  }
  if (!consent || consent.processing !== true || typeof consent.marketing !== "boolean" || typeof consent.noticeVersion !== "string") {
    return bad("Please confirm the consent box before you send.");
  }
  if (typeof idempotencyKey !== "string" || !UUID.test(idempotencyKey)) return bad("Invalid request.");

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (throttled(ip, Date.now())) {
    return NextResponse.json(
      { message: "Too many submissions from this connection. Please wait a few minutes or email sales@signalone.co.za." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const target = process.env.SIGNAL_ONE_INTAKE_URL;
  const token = process.env.SIGNAL_ONE_INTAKE_TOKEN;
  if (!target) {
    return bad("Online forms are not connected yet, so nothing was sent. Please email sales@signalone.co.za and we will reply directly.", 503);
  }

  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const upstreamBody = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        { message: typeof upstreamBody?.message === "string" ? upstreamBody.message : "We could not send this application." },
        { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
      );
    }

    return NextResponse.json({
      message:
        typeof upstreamBody?.message === "string"
          ? upstreamBody.message
          : "Your application has been received. Signal One will continue the onboarding process with you.",
    });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return bad(
      timedOut
        ? "Our form service took too long to answer, so we cannot confirm this was received. Please try again, or email sales@signalone.co.za."
        : "Our form service is temporarily unavailable. Please try again, or email sales@signalone.co.za.",
      timedOut ? 504 : 502,
    );
  }
}
