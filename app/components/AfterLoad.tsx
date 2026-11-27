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

// Without JavaScript the attribute is never set, so the deferred section photographs would stay hidden
// as empty frames (AUDW-10). Same selector as home-conversion.css, later in the document, so it wins.
const NO_SCRIPT_CSS = "html:not([data-after-load]) .so-home .so-panel-photo-image{display:block}";

export default function AfterLoad() {
  useEffect(() => onAfterLoad(() => document.documentElement.setAttribute("data-after-load", "")), []);
  return <noscript dangerouslySetInnerHTML={{ __html: "<style>" + NO_SCRIPT_CSS + "</style>" }} />;
}
