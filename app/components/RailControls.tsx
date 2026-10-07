"use client";

import { useRef, type ReactNode } from "react";

/**
 * Previous / next buttons for a horizontal scroll-snap rail (desktop). The
 * rail stays a native scroller: touch swipes and trackpads work unchanged.
 */
export default function RailControls({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function step(direction: 1 | -1) {
    const rail = ref.current?.querySelector<HTMLElement>(".hardware-rail");
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("li");
    const distance = (card?.offsetWidth ?? 300) + 16;
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    rail.scrollBy({ left: direction * distance, behavior: smooth ? "smooth" : "auto" });
  }

  return (
    <div ref={ref}>
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <button type="button" className="btn btn-ghost-light h-12 w-12 p-0" aria-label={"Previous: " + label} onClick={() => step(-1)}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" className="btn btn-ghost-light h-12 w-12 p-0" aria-label={"Next: " + label} onClick={() => step(1)}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
      {children}
    </div>
  );
}
