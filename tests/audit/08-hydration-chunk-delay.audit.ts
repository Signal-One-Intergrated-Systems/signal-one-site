import { test } from "@playwright/test";
import fs from "node:fs";
// env: AUDIT_BASE, AUDIT_LABEL, AUDIT_OUT. Delays the route error-boundary chunk and counts #418.
test("diag: delay the error-boundary chunk", async ({ browser }) => {
  test.setTimeout(20 * 60_000);
  const base = process.env.AUDIT_BASE || "http://localhost:3200";
  const out: Record<string, unknown> = {};
  for (const route of ["/privacy", "/pricing", "/", "/guards/join"]) {
    const html = await (await fetch(base + route)).text();
    const rsc = html;
    // the chunk that only the route error boundary needs: listed in errorScripts
    const m = rsc.match(/errorScripts\\":\[\[\\"\$\\",\\"script\\",\\"script-0\\",\{\\"src\\":\\"(\/_next\/static\/chunks\/[a-z0-9]+\.js)/);
    const chunk = m ? m[1] : null;
    for (const delay of [0, 300, 1500]) {
      let hits = 0; const runs = 12;
      for (let i = 0; i < runs; i++) {
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();
        if (chunk && delay) await page.route("**" + chunk, async (r) => { await new Promise((res) => setTimeout(res, delay)); await r.continue(); });
        let failed = false;
        page.on("pageerror", (e) => { if (/#418/.test(e.message)) failed = true; });
        await page.goto(base + route, { waitUntil: "load" }).catch(() => undefined);
        await page.waitForTimeout(600);
        if (failed) hits++;
        await context.close();
      }
      out[`${route} delay=${delay}`] = `${hits}/${runs}`;
      console.log(route, "chunk", chunk, "delay", delay, hits + "/" + runs);
    }
  }
  fs.writeFileSync(`${process.env.AUDIT_OUT || "/home/claude/audit-out"}/data/hydration-diag-error-chunk-delay-${process.env.AUDIT_LABEL || "before"}.json`, JSON.stringify(out, null, 1));
});
