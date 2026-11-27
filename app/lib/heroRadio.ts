import type { StaticImageData } from "next/image";
import p30Lite from "../../public/images/hardware/hytera-p30-lite-1200.png";

/**
 * The interactive radio in the homepage hero (founder, 2026-11-27): a genuine manufacturer cut-out.
 * To swap in a higher-resolution official cut-out, change `src` and re-measure the three boxes below on
 * the new file (source pixels): the device's bounding box, the physical PTT key and the antenna tip.
 * `scripts/measure-scene-floor.py` is not involved; these are read by components/HeroRadio.tsx only.
 */
export type HeroRadioAsset = {
  src: StaticImageData;
  model: string;
  /** Opaque device bounds inside the source canvas. */
  device: { x: number; y: number; w: number; h: number };
  /** The physical push-to-talk key as visible on this view (left side key, orange rim). */
  ptt: { x: number; y: number; w: number; h: number };
  /** Where the signal rings start (antenna tip). */
  antenna: { x: number; y: number };
};

/**
 * Official Hytera P30 Lite front view at 1200 × 1200 (RGBA), from the image set served on Hytera's
 * product page (hytera.co.za/products/p30-lite via hytera.ae), the same view as the 600 px catalogue
 * cut-out at exactly 2×. Boxes are the 600 px measurements doubled (alpha bbox and the orange PTT rim).
 */
export const heroRadio: HeroRadioAsset = {
  src: p30Lite,
  model: "Hytera P30 Lite",
  device: { x: 380, y: 82, w: 408, h: 1040 },
  ptt: { x: 378, y: 408, w: 34, h: 244 },
  antenna: { x: 680, y: 92 },
};
