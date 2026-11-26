import { NextResponse } from "next/server";
import { INTAKE_KINDS, isIntakeKind, onlineSubmissionAvailable } from "../../../lib/intakeConfig";

export const dynamic = "force-dynamic";

/**
 * Public capability only; never expose endpoint URLs, tokens or credentials.
 *
 * Answers what POST /api/intake will actually do (AUDW-02): a kind is available only when the
 * receiver URL AND token are set AND the kind is in SIGNAL_ONE_INTAKE_KINDS (default `client`).
 *   GET /api/intake/status            → { onlineSubmissionAvailable, kinds: { client, guard, sales } }
 *   GET /api/intake/status?kind=guard → { onlineSubmissionAvailable, kind: "guard", kinds: {…} }
 * Without `kind`, `onlineSubmissionAvailable` describes client enquiries (the earlier meaning).
 */
export function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("kind");
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (requested !== null && !isIntakeKind(requested)) {
    return NextResponse.json({ message: "Unknown kind." }, { status: 400, headers });
  }
  const kind = requested ?? "client";
  const kinds = Object.fromEntries(INTAKE_KINDS.map((k) => [k, onlineSubmissionAvailable(k)]));
  return NextResponse.json(
    { onlineSubmissionAvailable: onlineSubmissionAvailable(kind), ...(requested ? { kind } : {}), kinds },
    { headers },
  );
}
