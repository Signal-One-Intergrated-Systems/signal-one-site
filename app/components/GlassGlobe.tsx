"use client";
import { useEffect, useRef, useState } from "react";
import { runGlobe } from "./globeRenderer";

const transferred = new WeakSet<HTMLCanvasElement>();
const dprNow = () => Math.min(devicePixelRatio || 1, 2);

/**
 * The hero globe. Drawing runs in a Web Worker on an OffscreenCanvas when the browser supports it, so the
 * animation never delays a tap (DR-026, INP). Otherwise, or if the worker fails, the same renderer runs on
 * the main thread, exactly as before.
 */
export default function GlassGlobe() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mainThread, setMainThread] = useState(false);
  // A canvas hands its control to a worker only once. When the effect runs again on the same element (React
  // re-running effects in development, or a fast refresh), mount a fresh canvas instead of throwing.
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const geoUrl = new URL("/data/world.geojson", location.href).href;
    const canOffscreen = !mainThread && typeof Worker !== "undefined" && typeof el.transferControlToOffscreen === "function";

    if (canOffscreen) {
      if (transferred.has(el)) {
        setGeneration(g => g + 1);
        return;
      }
      let worker: Worker;
      try {
        worker = new Worker(new URL("./globe.worker.ts", import.meta.url), { type: "module" });
      } catch {
        setMainThread(true);
        return;
      }
      // A worker that fails to load leaves the transferred canvas blank: remount a fresh canvas on the main thread.
      worker.onerror = () => { worker.terminate(); setMainThread(true); };
      const offscreen = el.transferControlToOffscreen();
      transferred.add(el);
      const sendSize = () => {
        const rect = el.getBoundingClientRect();
        worker.postMessage({ type: "size", size: { width: rect.width, height: rect.height, dpr: dprNow() } });
      };
      worker.postMessage({ type: "init", canvas: offscreen, geoUrl, reduced: motion.matches }, [offscreen]);
      sendSize();
      const io = new IntersectionObserver(entries => worker.postMessage({ type: "visible", visible: entries[0]?.isIntersecting ?? true }), { threshold: 0.02 });
      io.observe(el);
      const ro = new ResizeObserver(sendSize);
      ro.observe(el);
      const changed = () => worker.postMessage({ type: "reduced", reduced: motion.matches });
      motion.addEventListener("change", changed);
      return () => { io.disconnect(); ro.disconnect(); motion.removeEventListener("change", changed); worker.postMessage({ type: "stop" }); worker.terminate(); };
    }

    const controller = runGlobe(el, {
      size: () => { const rect = el.getBoundingClientRect(); return { width: rect.width, height: rect.height, dpr: dprNow() }; },
      geoUrl,
      reduced: motion.matches,
    });
    if (!controller) return;
    const io = new IntersectionObserver(entries => controller.setVisible(entries[0]?.isIntersecting ?? true), { threshold: 0.02 });
    io.observe(el);
    const ro = new ResizeObserver(controller.request);
    ro.observe(el);
    const changed = () => controller.setReduced(motion.matches);
    motion.addEventListener("change", changed);
    return () => { controller.stop(); io.disconnect(); ro.disconnect(); motion.removeEventListener("change", changed); };
  }, [mainThread, generation]);
  return <canvas key={mainThread ? "main" : "worker-" + generation} ref={canvas} className="s1-hero-globe-canvas" role="img" aria-label="Glass globe showing light paths from Johannesburg to ten international cities" />;
}
