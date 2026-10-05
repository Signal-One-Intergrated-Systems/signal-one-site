"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stages = [
  { label: "Win", y: 7 },
  { label: "Hire", y: 24 },
  { label: "Run", y: 42 },
  { label: "Equip", y: 59 },
  { label: "Prove", y: 76 },
  { label: "Grow", y: 93 },
] as const;

export default function FlywheelThread() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.25"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[min(12vw,150px)] -translate-x-1/2 xl:block" aria-hidden="true">
      <svg viewBox="0 0 120 1000" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="signal-thread-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity=".18" />
            <stop offset="15%" stopColor="#38BDF8" stopOpacity=".72" />
            <stop offset="82%" stopColor="#0EA5E9" stopOpacity=".78" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity=".18" />
          </linearGradient>
          <filter id="signal-thread-glow" x="-120%" y="-20%" width="340%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M60 0 C18 85 20 145 60 188 C100 232 100 304 60 349 C20 394 20 466 60 511 C100 556 100 628 60 673 C20 718 20 790 60 835 C100 880 94 950 60 1000"
          fill="none"
          stroke="rgba(255,255,255,.065)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d="M60 0 C18 85 20 145 60 188 C100 232 100 304 60 349 C20 394 20 466 60 511 C100 556 100 628 60 673 C20 718 20 790 60 835 C100 880 94 950 60 1000"
          fill="none"
          stroke="url(#signal-thread-gradient)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          filter="url(#signal-thread-glow)"
          style={reducedMotion ? undefined : { pathLength }}
          initial={reducedMotion ? { pathLength: 1 } : false}
        />

        {stages.map((stage) => (
          <g key={stage.label} transform={`translate(60 ${stage.y * 10})`}>
            <circle r="7" fill="#0F131A" stroke="rgba(14,165,233,.42)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <circle r="2.2" fill="#38BDF8" />
          </g>
        ))}
      </svg>
    </div>
  );
}
