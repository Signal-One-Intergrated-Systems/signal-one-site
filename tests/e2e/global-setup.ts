import { execFileSync } from "node:child_process";

/**
 * Builds the second, test-only copy of the site (GUARD_STATUS=live, in .next-live) BEFORE any test runs.
 *
 * It used to be built inside guard-status.spec.ts while the other tests were loading pages. A build
 * running in the same directory as a serving `next start` made pages fail hydration (React error #418):
 * measured on one tree, 0 errors in 360 page loads with no build running, 11 in 360 with one running.
 * Production never builds beside a running server, so that was the harness disturbing its own subject.
 *
 * The values below are test fixtures only; they are never used in a deployed environment.
 */
export const liveBuildEnv = {
  GUARD_STATUS: "live",
  NEXT_DIST_DIR: ".next-live",
  GUARD_APP_ANDROID_URL: "https://play.google.com/store/apps/details?id=example.guard",
  GUARD_APP_IOS_URL: "https://apps.apple.com/app/id0000000000",
  SALES_OS_URL: "https://sales.example.org/sign-in",
} as const;

export default function globalSetup() {
  try {
    execFileSync("npx", ["next", "build"], { env: { ...process.env, ...liveBuildEnv }, stdio: "pipe", maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    const out = error as { stdout?: Buffer; stderr?: Buffer };
    throw new Error("live build failed:\n" + String(out.stderr ?? "").slice(-4000) + String(out.stdout ?? "").slice(-4000));
  }
}
