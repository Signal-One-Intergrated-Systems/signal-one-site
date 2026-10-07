import { expect, test } from "@playwright/test";
import { routes } from "./routes";

// Brief §5 / A6: no raster may render larger than its native resolution.
// For every visible <img>, the displayed scale of the SOURCE file (not the
// srcset candidate) must be at most 1 at device-pixel-ratio 1.
for (const width of [1440, 1920, 2560]) {
  test.describe(`images at ${width}px are never upscaled`, () => {
    test.use({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
    for (const route of routes) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 30));
          }
          window.scrollTo(0, 0);
        });
        const problems = await page.evaluate(async () => {
          const out: string[] = [];
          for (const img of Array.from(document.images)) {
            const box = img.getBoundingClientRect();
            if (box.width < 2 || box.height < 2 || getComputedStyle(img).visibility === "hidden") continue;
            let raw = img.currentSrc;
            if (!raw && img.parentElement?.tagName === "PICTURE") {
              const match = Array.from(img.parentElement.querySelectorAll("source")).find((el) => !el.media || matchMedia(el.media).matches);
              raw = match?.srcset.split(",")[0].trim().split(" ")[0] ?? "";
            }
            raw = raw || img.src;
            if (!raw || raw.endsWith(".svg")) continue;
            const param = new URL(raw, location.href).searchParams.get("url");
            const source = param ? new URL(param, location.href).href : raw;
            const probe = new Image();
            probe.src = source;
            await probe.decode().catch(() => undefined);
            if (!probe.naturalWidth) continue;
            const fit = getComputedStyle(img).objectFit;
            const sx = box.width / probe.naturalWidth;
            const sy = box.height / probe.naturalHeight;
            const scale = fit === "cover" ? Math.max(sx, sy) : fit === "contain" ? Math.min(sx, sy) : sx;
            if (scale > 1.02) out.push(`${source.split("/").pop()} ${Math.round(box.width)}x${Math.round(box.height)} from ${probe.naturalWidth}x${probe.naturalHeight} (${scale.toFixed(2)}x)`);
          }
          return out;
        });
        expect(problems).toEqual([]);
      });
    }
  });
}
