import type { StaticImageData } from "next/image";
import controlRoom from "../../public/images/1guard/1guard-control-room.webp";
import myOperation from "../../public/images/1guard/1guard-my-operation.webp";
import clientServiceToday from "../../public/images/1guard/1guard-client-service-today.webp";

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

/** Captured 2026-11-27 from the 1GUARD web app (branch claude/capture-ready-display), run locally on a curated
 * synthetic tenant per docs/PHOTOGRAPHY_BRIEF.md; provenance in docs/ASSET_PROVENANCE.md. Unedited apart from
 * cropping out the navigation tabs and scaling. */
export const guardScreens: GuardScreen[] = [
  {
    src: controlRoom,
    alt: "1GUARD control room: four sites, nine guards on duty, nine patrols active, and a queue with a guard's report of suspicious activity, an acknowledged incident, a post short one guard and a maintenance report",
    slot: "home-guard",
    caption: "1GUARD control room · real app, synthetic demo data",
  },
  {
    src: myOperation,
    alt: "1GUARD My operation: each site's posts covered, guards on duty and open items, beside today's roster of guards on site",
    slot: "guard-platform",
    caption: "1GUARD My operation · real app, synthetic demo data",
  },
  {
    src: clientServiceToday,
    alt: "1GUARD client portal, service today: checkpoints verified 14 of 14, patrols completed, the incident reported, and why today's services are not yet fully proven",
    slot: "guard-platform",
    caption: "1GUARD client portal · real app, synthetic demo data",
  },
];
