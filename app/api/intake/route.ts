import { NextResponse } from "next/server";

const ALLOWED_KINDS = new Set(["client", "sales", "guard"]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const { kind, data } = body as { kind?: string; data?: unknown };
  if (!kind || !ALLOWED_KINDS.has(kind) || !data || typeof data !== "object") {
    return NextResponse.json({ message: "Invalid application." }, { status: 400 });
  }

  const target = process.env.SIGNAL_ONE_INTAKE_URL;
  const token = process.env.SIGNAL_ONE_INTAKE_TOKEN;
  if (!target) {
    return NextResponse.json(
      { message: "Online applications are being connected to Signal One operations. Please use the Contact page while onboarding is being activated." },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ kind, data, source: "signal-one-site" }),
      cache: "no-store",
    });

    const upstreamBody = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        { message: typeof upstreamBody?.message === "string" ? upstreamBody.message : "We could not send this application." },
        { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 }
      );
    }

    return NextResponse.json({
      message:
        typeof upstreamBody?.message === "string"
          ? upstreamBody.message
          : "Your application has been received. Signal One will continue the onboarding process with you.",
    });
  } catch {
    return NextResponse.json({ message: "The onboarding service is temporarily unavailable." }, { status: 502 });
  }
}
