"use client";

import { useEffect } from "react";

/**
 * Sequenced reveal for `.reveal-group` lists (the patrol story): children with
 * `.reveal` rise in one after another as the group enters view. Opt-in by JS,
 * so without JS, under prefers-reduced-motion and on small phones everything
 * is simply in place. Transform only (no fade, so contrast never drops) and no
 * layout shift.
 */
export default function Reveal() {
  useEffect(() => {
    const allow = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 640px)");
    if (!allow.matches || !("IntersectionObserver" in window)) return;
    const groups = Array.from(document.querySelectorAll<HTMLElement>(".reveal-group"));
    const pending = groups.filter((group) => group.getBoundingClientRect().top > window.innerHeight * 0.9);
    if (!pending.length) return;
    pending.forEach((group) => group.setAttribute("data-reveal", "waiting"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "shown");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    pending.forEach((group) => observer.observe(group));
    return () => observer.disconnect();
  }, []);
  return null;
}
