import type { StaticImageData } from "next/image";
import p30Lite from "../../public/images/hardware/hytera-p30-lite.png";

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

/** Measured on public/images/hardware/hytera-p30-lite.png (600 × 600, RGBA): alpha bbox and the orange PTT rim. */
export const heroRadio: HeroRadioAsset = {
  src: p30Lite,
  model: "Hytera P30 Lite",
  device: { x: 190, y: 41, w: 204, h: 520 },
  ptt: { x: 189, y: 204, w: 17, h: 122 },
  antenna: { x: 340, y: 46 },
};
