import { expect, test } from "@playwright/test";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { routes } from "./routes";

// Status pills are rendered at build time from GUARD_STATUS (app/lib/guardStatus.ts).
const livePill = /<span[^>]*rounded-full[^>]*>\s*(Client portal · )?Live\s*<\/span>/;
const pilotPill = /<span[^>]*rounded-full[^>]*>\s*(Client portal · )?Pilot\s*<\/span>/;
const onboarding = "Signal One Guard is onboarding its first pilot security companies.";

async function pages(base: string, request: import("@playwright/test").APIRequestContext) {
  const out: Record<string, string> = {};
  for (const route of routes) out[route] = await (await request.get(base + route)).text();
  return out;
}

test("GUARD_STATUS unset: Guard capabilities are Pilot, never Live", async ({ request, baseURL }) => {
  const html = await pages(baseURL!, request);
  for (const [route, body] of Object.entries(html)) {
    expect(body, `${route} live pill`).not.toMatch(livePill);
    expect(body, `${route} Already live`).not.toMatch(/Already live(?![a-z])/i);
  }
  expect(html["/"]).toMatch(pilotPill);
  expect(html["/solutions/security"]).toMatch(pilotPill);
  for (const route of ["/", "/solutions/security", "/pricing"]) expect(html[route], route).toContain(onboarding);
});

test.describe("GUARD_STATUS=live", () => {
  test.setTimeout(420_000);
  let server: ChildProcess | undefined;
  const port = 3103;

  test.beforeAll(async () => {
    const env = { ...process.env, GUARD_STATUS: "live", NEXT_DIST_DIR: ".next-live" };
    execFileSync("npx", ["next", "build"], { env, stdio: "ignore" });
    server = spawn("npx", ["next", "start", "-p", String(port)], { env, stdio: "ignore", detached: true });
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch(`http://localhost:${port}/`)).ok) return;
      } catch {
        /* not up yet */
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error("live server did not start");
  });

  test.afterAll(() => {
    if (server?.pid) {
      try {
        process.kill(-server.pid);
      } catch {
        /* already gone */
      }
    }
  });

  test("renders Live pills and Already live, without the pilot line", async ({ request }) => {
    const html = await pages(`http://localhost:${port}`, request);
    expect(html["/"]).toMatch(livePill);
    expect(html["/"]).toMatch(/Already live/i);
    expect(html["/solutions/security"]).toMatch(livePill);
    expect(html["/guard-marketplace"]).toMatch(/Already live in Signal One Guard/);
    for (const [route, body] of Object.entries(html)) {
      expect(body, `${route} pilot pill`).not.toMatch(pilotPill);
      expect(body, `${route} onboarding line`).not.toContain(onboarding);
    }
  });
});
