"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      setPlaying(false);
      return;
    }

    video.play().catch(() => setPlaying(false));
  }, [reducedMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
  };

  return (
    <div className="group relative overflow-hidden rounded-[18px] border border-white/15 bg-[var(--s1-black)] shadow-[var(--s1-shadow-card)]">
      <div
        className={
          "absolute inset-0 z-10 bg-[#0a0d12] transition-opacity duration-500 " +
          (ready ? "pointer-events-none opacity-0" : "opacity-100")
        }
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        autoPlay={!reducedMotion}
        loop
        muted={muted}
        playsInline
        preload={reducedMotion ? "none" : "metadata"}
        poster="/images/industries/security.jpg"
        onCanPlay={() => setReady(true)}
        onLoadedData={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/11] xl:aspect-[4/3]"
        aria-label="Signal One field operations video"
      >
        <source src="/videos/hero-panel.mp4" type="video/mp4" />
        Your browser does not support HTML video.
      </video>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.02)_35%,rgba(10,13,18,.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(14,165,233,.08)]" />

      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#0a0d12]/64 px-3 py-2 backdrop-blur-xl">
        <span className="relative h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_14px_rgba(34,197,94,.55)]" />
        <span className="s1-mono text-[9px] text-white/72">Signal One field operations</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <div className="max-w-sm">
          <p className="text-sm font-semibold text-white">Operational visibility, from site to control room.</p>
          <p className="mt-1 hidden text-xs leading-5 text-white/58 sm:block">
            Field activity, control-room visibility and service evidence in one operating context.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={togglePlayback}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/45 text-white backdrop-blur-xl transition duration-200 hover:border-[#38BDF8]/55 hover:bg-black/65"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 5.7v12.6c0 .8.9 1.3 1.6.8l9.2-6.3c.6-.4.6-1.3 0-1.7L9.6 4.9A1 1 0 0 0 8 5.7Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/45 text-white backdrop-blur-xl transition duration-200 hover:border-[#38BDF8]/55 hover:bg-black/65"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 9v6h4l5 4V5L9 9H5Z" />
                <path d="m18 9 4 4m0-4-4 4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 9v6h4l5 4V5L9 9H5Z" />
                <path d="M17 9.5c1.3 1.4 1.3 3.6 0 5" />
                <path d="M19.5 7c2.7 2.8 2.7 7.2 0 10" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
