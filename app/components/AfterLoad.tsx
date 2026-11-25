"use client";

import { useEffect } from "react";

/**
 * Marks <html data-after-load> once the page has loaded and the browser is idle. Below-the-fold
 * decoration (section photographs, the hero globe's geography) waits for it, so on a slow phone
 * connection the hero photograph — the Largest Contentful Paint — is not competing for bandwidth
 * with images nobody can see yet (DR-003). Nothing visible in the first viewport depends on it.
 */
export function onAfterLoad(callback: () => void): () => void {
  let cancelled = false;
  const run = () => {
    if (cancelled) return;
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (idle) idle(() => !cancelled && callback(), { timeout: 2000 });
    else window.setTimeout(() => !cancelled && callback(), 200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
  };
}

export default function AfterLoad() {
  useEffect(() => onAfterLoad(() => document.documentElement.setAttribute("data-after-load", "")), []);
  return null;
}
