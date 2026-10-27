export const dynamic = "force-dynamic";
export function GET() { return Response.json({ release: process.env.RAILWAY_GIT_COMMIT_SHA ?? "local", mode: "review-only", backendIntake: "disabled", automaticSubmission: false, offlineShell: "disabled" }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } }); }
