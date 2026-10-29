import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Public capability only; never expose endpoint URLs, tokens or credentials. */
export function GET() {
  return NextResponse.json(
    { onlineSubmissionAvailable: Boolean(process.env.SIGNAL_ONE_INTAKE_URL) },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
