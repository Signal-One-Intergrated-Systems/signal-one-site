// Review frontend only. No receiver/config/credential lookup or submission path.
export function POST() { return Response.json({ code: "CONTACT_INTAKE_DISABLED", message: "Online submission is disabled. Prepare an email instead." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
