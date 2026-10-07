import { expect, test } from "@playwright/test";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { routes } from "./routes";

// Status pills are rendered at build time from GUARD_STATUS (app/lib/guardStatus.ts).
const livePill = /<span[^>]*rounded-full[^>]*>\s*(Client portal · )?Live\s*<\/span>/;
const pilotPill = /<span[^>]*rounded-full[^>]*>\s*(Client portal · )?Pilot\s*<\/span>/;
const onboarding = "Signal One Guard is onboarding its first pilot security companies.";
// Used only inside the second, test-only build; never in a deployed environment.
const storeUrls = { android: "https://play.google.com/store/apps/details?id=example.guard", ios: "https://apps.apple.com/app/id0000000000" };
const salesOsUrl = "https://sales.example.org/sign-in";

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

test("acquisition links stay hidden until their URLs are configured", async ({ request, baseURL }) => {
  const html = await pages(baseURL!, request);
  for (const [route, body] of Object.entries(html)) {
    expect(body, `${route} download`).not.toContain("Download Signal One Guard");
    expect(body, `${route} store link`).not.toMatch(/play\.google\.com|apps\.apple\.com/);
    expect(body, `${route} Sales OS link`).not.toContain(">Open Sales OS<");
  }
  expect(html["/guards"]).toContain("Create your profile");
});

test.describe("GUARD_STATUS=live", () => {
  // One shared live build: its tests must run in one worker, in order.
  test.describe.configure({ mode: "serial" });
  test.setTimeout(420_000);
  let server: ChildProcess | undefined;
  const port = 3103;

  test.beforeAll(async () => {
    const env = {
      ...process.env,
      GUARD_STATUS: "live",
      NEXT_DIST_DIR: ".next-live",
      GUARD_APP_ANDROID_URL: storeUrls.android,
      GUARD_APP_IOS_URL: storeUrls.ios,
      SALES_OS_URL: salesOsUrl,
    };
    try {
      execFileSync("npx", ["next", "build"], { env, stdio: "pipe", maxBuffer: 64 * 1024 * 1024 });
    } catch (error) {
      const out = error as { stdout?: Buffer; stderr?: Buffer };
      throw new Error("live build failed:\n" + String(out.stderr ?? "").slice(-4000) + String(out.stdout ?? "").slice(-4000));
    }
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

  test("configured store and Sales OS URLs render as links", async ({ request }) => {
    const guards = await (await request.get(`http://localhost:${port}/guards`)).text();
    expect(guards).toContain(`href="${storeUrls.android.replace(/&/g, "&amp;")}"`);
    expect(guards).toContain(`href="${storeUrls.ios}"`);
    expect(guards).toContain("Download Signal One Guard");
    const sales = await (await request.get(`http://localhost:${port}/join/sales`)).text();
    expect(sales).toContain(`href="${salesOsUrl}"`);
    expect(sales).toContain("Open Sales OS");
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
