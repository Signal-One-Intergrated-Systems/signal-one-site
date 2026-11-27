import type { StaticImageData } from "next/image";

/**
 * Genuine 1GUARD screenshots (real app, synthetic demo data), supplied by the founder. Until they arrive
 * this list is EMPTY and every slot renders nothing: no dashboards, mock-ups or generated interfaces are
 * ever shown in their place (founder, 2026-11-27). Add entries here; components/GuardScreens.tsx renders them.
 */
export type GuardScreen = {
  src: StaticImageData;
  /** What the screen shows, for the alt text. */
  alt: string;
  /** Where it may appear. */
  slot: "home-hero" | "home-guard" | "guard-platform";
  /** Shown under the frame, e.g. "1GUARD supervisor view · synthetic demo data". */
  caption: string;
};

export const guardScreens: GuardScreen[] = [];
