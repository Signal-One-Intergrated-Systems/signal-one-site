import { NextResponse } from "next/server";

const ALLOWED_EVENTS = new Set(["page_view", "buyer_click"]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  if (!body || typeof body !== "object") {
    return new NextResponse(null, { status: 204 });
  }

  const payload = body as Record<string, unknown>;
  const event = typeof payload.event === "string" ? payload.event : "";
  if (!ALLOWED_EVENTS.has(event)) {
    return new NextResponse(null, { status: 204 });
  }

  const target = process.env.SIGNAL_ONE_ANALYTICS_URL;
  const token = process.env.SIGNAL_ONE_ANALYTICS_TOKEN;

  if (!target) {
    return new NextResponse(null, { status: 204 });
  }

  const safePayload = {
    event,
    path: typeof payload.path === "string" ? payload.path.slice(0, 500) : "",
    href: typeof payload.href === "string" ? payload.href.slice(0, 500) : "",
    label: typeof payload.label === "string" ? payload.label.slice(0, 120) : "",
    referrer: typeof payload.referrer === "string" ? payload.referrer.slice(0, 500) : "",
    utmSource: typeof payload.utmSource === "string" ? payload.utmSource.slice(0, 160) : "",
    utmMedium: typeof payload.utmMedium === "string" ? payload.utmMedium.slice(0, 160) : "",
    utmCampaign: typeof payload.utmCampaign === "string" ? payload.utmCampaign.slice(0, 160) : "",
    utmTerm: typeof payload.utmTerm === "string" ? payload.utmTerm.slice(0, 160) : "",
    utmContent: typeof payload.utmContent === "string" ? payload.utmContent.slice(0, 160) : "",
    source: "signal-one-site",
    receivedAt: new Date().toISOString(),
  };

  try {
    await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(safePayload),
      cache: "no-store",
    });
  } catch {
    // Analytics must never block or break the buyer experience.
  }

  return new NextResponse(null, { status: 204 });
}
