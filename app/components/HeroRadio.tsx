"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { useRef, useState } from "react";
import { heroRadio, type HeroRadioAsset } from "../lib/heroRadio";

const pct = (part: number, whole: number) => (100 * part) / whole + "%";
/** The press and the signal rings take this long before the link navigates (founder: ~500 ms). */
const PRESS_MS = 520;

/**
 * The homepage hero's interactive radio (founder, 2026-11-27). It is a real link to /radios-equipment:
 * keyboard-focusable, and with JavaScript off it is a plain link. With JS, a click (or Enter, or a tap)
 * plays a short press-in and two or three signal rings from the antenna, then navigates. Under
 * prefers-reduced-motion there is no tilt, no rings and no delay. It is navigation, not a transmission.
 * Only transform and opacity animate; the element never changes size, so nothing shifts.
 */
export default function HeroRadio({ asset = heroRadio, href = "/radios-equipment" }: { asset?: HeroRadioAsset; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [state, setState] = useState<"idle" | "pressed">("idle");
  const { device, ptt, antenna } = asset;
  const canvas = { w: asset.src.width, h: asset.src.height };
  const style = {
    "--radio-aspect": `${device.w} / ${device.h}`,
    // The source canvas, placed so that the device's own bounds fill the link box exactly.
    "--canvas-w": pct(canvas.w, device.w),
    "--canvas-h": pct(canvas.h, device.h),
    "--canvas-x": pct(-device.x, device.w),
    "--canvas-y": pct(-device.y, device.h),
    "--ptt-x": pct(ptt.x - device.x, device.w),
    "--ptt-y": pct(ptt.y - device.y, device.h),
    "--ptt-w": pct(ptt.w, device.w),
    "--ptt-h": pct(ptt.h, device.h),
    "--antenna-x": pct(antenna.x - device.x, device.w),
    "--antenna-y": pct(antenna.y - device.y, device.h),
  } as CSSProperties;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const link = ref.current;
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Second pass (after the press): let the site's route transition and Next's link navigate.
    if (link.dataset.pressFirst === "released") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      link.dataset.pressFirst = "released";
      return;
    }
    event.preventDefault();
    if (state === "pressed") return;
    setState("pressed");
    try {
      navigator.vibrate?.(15);
    } catch {
      /* vibration is optional */
    }
    window.setTimeout(() => {
      link.dataset.pressFirst = "released";
      link.click();
      window.setTimeout(() => {
        link.dataset.pressFirst = "";
        setState("idle");
      }, 50);
    }, PRESS_MS);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      data-press-first=""
      data-state={state}
      data-analytics-event="homepage_equipment_quote"
      data-analytics-label="hero-radio"
      aria-label={`${asset.model} — press to connect: explore radios and connectivity`}
      className="so-radio"
      style={style}
    >
      <span className="so-radio-shadow" aria-hidden="true" />
      <span className="so-radio-device" aria-hidden="true">
        <Image src={asset.src} alt="" sizes="(min-width: 1024px) 240px, 160px" quality={90} className="so-radio-image" draggable={false} />
        <span className="so-radio-ptt" />
        <span className="so-radio-waves">
          <span />
          <span />
          <span />
        </span>
      </span>
      <span className="so-radio-label" aria-hidden="true">
        Press to connect
      </span>
    </Link>
  );
}
