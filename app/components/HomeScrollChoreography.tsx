"use client";

import { useEffect } from "react";

/**
 * Homepage-only section choreography.
 * Each panel carries a deliberate direction, so motion feels varied without
 * randomising between visits or altering the Signal One glass design.
 *
 * Progressive enhancement: SSR renders everything. Only below-fold elements
 * become pending after the observer is connected; users with reduced-motion,
 * no JavaScript or unsupported browsers always see every section immediately.
 */
export default function HomeScrollChoreography() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".so-home[data-motion-scope]");
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supported = typeof IntersectionObserver !== "undefined";
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-motion-from]"));
    let observer: IntersectionObserver | null = null;

    function clear() {
      observer?.disconnect();
      observer = null;
      root?.classList.remove("so-motion-enabled");
      elements.forEach((element) => {
        element.removeAttribute("data-motion-state");
      });
    }

    function start() {
      clear();
      if (preference.matches || !supported || !root) return;

      // State is set only after we know it is below the visible viewport.
      // This prevents hiding first-view content and eliminates hydration flash.
      root.classList.add("so-motion-enabled");
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        element.dataset.motionState =
          rect.top > window.innerHeight * 0.90 ? "pending" : "shown";
      }

      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.motionState = "shown";
          observer?.unobserve(element); // Reveal once, no repeated distracting loops.
        }
      }, { rootMargin: "0px 0px -9% 0px", threshold: 0.06 });

      elements.filter(element => element.dataset.motionState === "pending")
        .forEach(element => observer?.observe(element));
    }

    start();
    preference.addEventListener?.("change", start);
    return () => {
      preference.removeEventListener?.("change", start);
      clear();
    };
  }, []);

  return null;
}
