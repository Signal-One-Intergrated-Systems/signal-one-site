import {exchangeConfig,exchangeReady} from "../../_connect/lib/server/exchange-gate";
export const dynamic = "force-dynamic";
export function GET() { return Response.json({ release: process.env.RAILWAY_GIT_COMMIT_SHA ?? "local", mode: "review-only", backendIntake: exchangeReady(exchangeConfig()) ? "enabled" : "disabled", automaticSubmission: exchangeReady(exchangeConfig()), offlineShell: "disabled" }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } }); }
