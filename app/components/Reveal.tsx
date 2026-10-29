"use client";

import { useEffect } from "react";

/** Reversible section-stage motion, enabled only for opt-in reveal groups.
 * Pages remain fully readable without JavaScript or with reduced motion.
 */
export default function Reveal() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 640px)");
    if (!mq.matches || !("IntersectionObserver" in window)) return;
    const groups = Array.from(document.querySelectorAll<HTMLElement>(".reveal-group"));
    if (!groups.length) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const group = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          group.dataset.reveal = "shown";
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.88) {
          // Re-arm below-the-fold scenes when scrolling back up, without
          // fading already-read material above the viewport.
          group.dataset.reveal = "waiting";
        } else if (entry.boundingClientRect.bottom < 0) {
          group.dataset.reveal = "passed";
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    groups.forEach((group) => {
      if (group.getBoundingClientRect().top > window.innerHeight * .9) group.dataset.reveal = "waiting";
      observer.observe(group);
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
