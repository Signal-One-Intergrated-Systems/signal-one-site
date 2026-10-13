"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

/**
 * Editorial, interactive explanation of REAL Guard capabilities.
 *
 * This intentionally does not imitate the Guard dashboard or show fabricated
 * operational records. Product captures can only be added after the curated
 * staging tenant and public-image checks pass.
 */
const scenes = [
  {
    short: "Scan",
    label: "A checkpoint is scanned",
    category: "FIELD ACTION",
    title: "A physical action becomes a digital record.",
    explanation:
      "An officer scans a QR or NFC checkpoint with Signal One Guard. The scan is associated with its patrol, checkpoint, time and GPS position.",
    from: "QR / NFC checkpoint",
    to: "Patrol scan record",
    detail: "Offline scans are retained on the device and sent when mobile signal returns.",
    bottom: "On the guard's own phone or an authorised Central Device",
  },
  {
    short: "Record",
    label: "The patrol is recorded",
    category: "OPERATIONAL RECORD",
    title: "The patrol has evidence, not a paper trail.",
    explanation:
      "Each checkpoint record contributes to the patrol's history. Late or missed checkpoints can be surfaced as exceptions for review.",
    from: "Checkpoint evidence",
    to: "Patrol history",
    detail: "An exception is a reason to review the record, not a claim that every scan creates an alarm.",
    bottom: "Time and GPS evidence attached to the patrol",
  },
  {
    short: "Respond",
    label: "The control room acts",
    category: "SUPERVISION",
    title: "When attention is needed, there is a clear next action.",
    explanation:
      "Supervisors work from operational records. When an SOS is sent with a mobile signal, the control room can acknowledge, navigate to and resolve it.",
    from: "SOS / operational exception",
    to: "Control-room action",
    detail: "SOS delivery requires a mobile signal; offline scan storage does not make SOS work offline.",
    bottom: "An auditable response rather than a separate WhatsApp thread",
  },
  {
    short: "Prove",
    label: "The client sees proof",
    category: "SERVICE EVIDENCE",
    title: "Close the loop with proof the client can access.",
    explanation:
      "Scheduled service is assessed as proven, partly proven, unresolved or not proven, with a reason. Clients see authorised sites and their proof-of-service reports.",
    from: "Recorded service",
    to: "Client proof of service",
    detail: "Client access is scoped to their own sites. A live client map is not available yet.",
    bottom: "From on-site activity to a client-facing record",
  },
] as const;

const loopMs = 6200;

function useMotionPreference() {
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduceMotion;
}

function useOnScreen<T extends HTMLElement>() {
  const target = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!target.current || !("IntersectionObserver" in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);
  return { target, visible };
}

/** The desktop photographic hero's small glass layer; not a pretend dashboard. */
export function FieldSignalPanel() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);
  const reduceMotion = useMotionPreference();
  const { target, visible } = useOnScreen<HTMLDivElement>();
  const scene = scenes[active];

  useEffect(() => {
    if (reduceMotion || !visible || !running) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % scenes.length), loopMs);
    return () => window.clearInterval(timer);
  }, [reduceMotion, visible, running]);

  return (
    <div ref={target} className="glass s1-field-panel rounded-card p-5 text-text-inv">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.9375rem] font-semibold">From field action to proof</p>
        <span className="s1-panel-signal" aria-hidden="true" />
      </div>
      <p className="t-caption mt-1 text-text-inv-2">Illustrative workflow · Signal One Guard</p>

      <div className="s1-panel-route mt-5" aria-label="Four operational steps">
        {scenes.map((item, i) => (
          <button
            key={item.short}
            type="button"
            className="s1-panel-node"
            aria-label={"Show step " + (i + 1) + ": " + item.label}
            aria-pressed={i === active}
            onClick={() => { setActive(i); setRunning(false); }}
          >
            <span className="s1-panel-node-dot" aria-hidden="true" />
            <span>{item.short}</span>
          </button>
        ))}
      </div>

      <div key={active} className="s1-panel-copy mt-5">
        <p className="t-small font-semibold text-text-inv">{scene.label}</p>
        <p className="t-caption mt-1 text-text-inv-2">{scene.bottom}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
        <p className="t-caption text-text-inv-2">0{active + 1} / 04 — select any stage</p>
        <button
          type="button"
          className="s1-panel-play"
          aria-label={running && !reduceMotion ? "Pause workflow animation" : "Play workflow animation"}
          onClick={() => setRunning((value) => !value)}
          disabled={reduceMotion}
        >
          {running && !reduceMotion ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}

/** A flagship, keyboard-accessible four-stage product narrative. */
export default function OperationalJourney() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);
  const reduceMotion = useMotionPreference();
  const { target, visible } = useOnScreen<HTMLElement>();
  const stage = scenes[active];

  useEffect(() => {
    if (reduceMotion || !visible || !running) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % scenes.length), loopMs);
    return () => window.clearInterval(timer);
  }, [reduceMotion, visible, running]);

  function choose(index: number) {
    setActive(index);
    setRunning(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    if ((event.target as HTMLElement).tagName !== "BUTTON") return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? scenes.length - 1
        : (active + (event.key === "ArrowLeft" ? -1 : 1) + scenes.length) % scenes.length;
    choose(next);
    (event.currentTarget.querySelectorAll(".s1-journey-step")[next] as HTMLButtonElement | undefined)?.focus();
  }

  return (
    <section ref={target} className="s1-journey-section surface-base" aria-labelledby="s1-journey-heading">
      <div className="wrap py-20 md:py-24 xl:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:gap-20">
          <div>
            <p className="t-kicker text-signal-400">Experience the Signal One advantage</p>
            <h2 id="s1-journey-heading" className="t-h2 mt-4 max-w-[16ch]">
              Every action. One connected record.
            </h2>
          </div>
          <div>
            <p className="t-lead text-text-inv-2">
              See how an on-site action becomes evidence, supervision and proof of service.
            </p>
            <p className="t-caption mt-4 text-text-inv-3">
              Interactive explanation of implemented GUARD capabilities, not a live system or fabricated dashboard.
            </p>
          </div>
        </div>

        <div className="s1-journey-shell mt-12 lg:mt-16">
          <div className="s1-journey-navigation" onKeyDown={onKeyDown} aria-label="Choose a workflow stage">
            {scenes.map((item, i) => (
              <button
                type="button"
                key={item.short}
                aria-pressed={active === i}
                className="s1-journey-step"
                onClick={() => choose(i)}
              >
                <span className="s1-journey-index">0{i + 1}</span>
                <span className="s1-journey-name">{item.label}</span>
                <span className="s1-journey-step-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
            <div className="s1-journey-player">
              <span className="t-caption text-text-inv-3">Explore each stage</span>
              <button
                type="button"
                className="s1-journey-toggle"
                onClick={() => setRunning((value) => !value)}
                disabled={reduceMotion}
                aria-label={running && !reduceMotion ? "Pause the guided journey" : "Play the guided journey"}
              >
                {running && !reduceMotion ? "Pause motion" : "Play journey"}
              </button>
            </div>
          </div>

          <div className="s1-journey-stage">
            <div className="s1-journey-stage-top">
              <span className="t-kicker text-signal-400">{stage.category}</span>
              <span className="t-caption text-text-inv-3">0{active + 1} / 04</span>
            </div>

            <div key={active} className="s1-journey-act" aria-live="off">
              <p className="s1-journey-display-number" aria-hidden="true">0{active + 1}</p>
              <div className="s1-journey-diagram" role="img" aria-label={stage.from + " leads to " + stage.to}>
                <div className="s1-diagram-endpoint">
                  <span className="s1-diagram-caption">SOURCE</span>
                  <strong>{stage.from}</strong>
                </div>
                <div className="s1-diagram-bridge" aria-hidden="true">
                  <span className="s1-diagram-bridge-line" />
                  <span className="s1-diagram-packet" />
                  <span className="s1-diagram-arrow">→</span>
                </div>
                <div className="s1-diagram-endpoint s1-diagram-destination">
                  <span className="s1-diagram-caption">RESULT</span>
                  <strong>{stage.to}</strong>
                </div>
              </div>
              <h3 className="s1-journey-title">{stage.title}</h3>
              <p className="t-body mt-4 max-w-[52ch] text-text-inv-2">{stage.explanation}</p>
              <p className="s1-journey-detail mt-6">{stage.detail}</p>
            </div>
            <div className="s1-journey-stage-footer">
              <span className="t-caption text-text-inv-3">{stage.bottom}</span>
              <Link href="/solutions/security" className="link-arrow text-signal-400">
                Explore GUARD <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
