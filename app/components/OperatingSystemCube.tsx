"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";

type JourneyStep = {
  label: string;
  name: string;
  purpose: string;
  receives: string;
  does: string;
  handsOff: string;
};

const journey: JourneyStep[] = [
  {
    label: "Lead", name: "Understand the customer's need",
    purpose: "A new enquiry becomes a clear requirement instead of an isolated message.",
    receives: "Customer request", does: "Capture the opportunity and scope", handsOff: "A job ready for the right people",
  },
  {
    label: "People", name: "Bring the right team together",
    purpose: "Roles, eligibility and availability inform who should deliver the work.",
    receives: "Confirmed requirement", does: "Find and assign suitable people", handsOff: "A staffed assignment",
  },
  {
    label: "Schedule", name: "Make the work actionable",
    purpose: "The plan connects people, place, time and the equipment needed.",
    receives: "People and requirements", does: "Plan shifts and coordinate resources", handsOff: "An actionable schedule",
  },
  {
    label: "Work", name: "Deliver the service",
    purpose: "Activity is coordinated as it happens and exceptions can reach the right manager.",
    receives: "Approved work plan", does: "Deliver, monitor and respond", handsOff: "Recorded operational activity",
  },
  {
    label: "Proof", name: "Know what was completed",
    purpose: "Evidence makes the service accountable and supports oversight.",
    receives: "Service activity", does: "Capture completion and exceptions", handsOff: "Documented service records",
  },
  {
    label: "Billing", name: "Connect work to the commercial outcome",
    purpose: "Delivered services can support accurate review, invoicing and follow-up.",
    receives: "Approved service records", does: "Review charges and prepare billing", handsOff: "A clear commercial record",
  },
  {
    label: "Growth", name: "Learn and improve",
    purpose: "The next decision can build on what the business actually delivered.",
    receives: "Operational and commercial insight", does: "Identify improvements and new opportunities", handsOff: "The next customer decision",
  },
];

const faces = [
  { side: "front", title: "ONE OS", subtitle: "Connected operations" },
  { side: "right", title: "PEOPLE", subtitle: "Teams & assignments" },
  { side: "back", title: "WORK", subtitle: "Service delivery" },
  { side: "left", title: "PROOF", subtitle: "Recorded outcomes" },
  { side: "top", title: "CUSTOMERS", subtitle: "From first contact" },
  { side: "bottom", title: "GROWTH", subtitle: "The next opportunity" },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Interactive visualisation of the public Signal One business-operating-system
 * vision. It is a conceptual journey, NOT a live dashboard or a representation
 * that all capabilities are currently available. No internal platform details.
 */
export default function OperatingSystemCube() {
  const [rotation, setRotation] = useState({ x: -19, y: -29 });
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const pointer = useRef<{ x: number; y: number; moved: boolean; down: boolean } | null>(null);
  const dragWasUsed = useRef(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reduceMotionRef.current = preference.matches; };
    sync();
    preference.addEventListener?.("change", sync);
    return () => preference.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setExpanded(false);
      }
      if (event.key === "Tab" && dialogRef.current) {
        const controls = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex='0']")];
        if (!controls.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded || !playing || reduceMotionRef.current) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % journey.length), 5300);
    return () => window.clearInterval(timer);
  }, [expanded, playing]);

  useEffect(() => {
    if (!expanded) return;
    const button = trackRef.current?.querySelector<HTMLElement>("[data-current='true']");
    button?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotionRef.current ? "instant" : "smooth" });
  }, [active, expanded]);

  const enter = () => {
    setActive(0);
    setPlaying(!reduceMotionRef.current);
    setExpanded(true);
  };
  const select = (index: number) => { setActive(index); setPlaying(false); };
  const step = (delta: number) => { setPlaying(false); setActive(index => (index + delta + journey.length) % journey.length); };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    pointer.current = { x: event.clientX, y: event.clientY, moved: false, down: true };
    dragWasUsed.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = pointer.current;
    if (!current?.down) return;
    const dx = event.clientX - current.x, dy = event.clientY - current.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      current.moved = true;
      dragWasUsed.current = true;
    }
    current.x = event.clientX; current.y = event.clientY;
    setRotation(previous => ({
      x: clamp(previous.x - dy * 0.40, -72, 72),
      y: previous.y + dx * 0.46,
    }));
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointer.current) pointer.current.down = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onCubeClick = () => {
    if (dragWasUsed.current) { dragWasUsed.current = false; return; }
    enter();
  };
  const onCubeKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const arrow: Record<string, [number, number]> = {
      ArrowLeft: [0, -23], ArrowRight: [0, 23],
      ArrowUp: [-18, 0], ArrowDown: [18, 0],
    };
    if (arrow[event.key]) {
      event.preventDefault();
      const [x, y] = arrow[event.key];
      setRotation(previous => ({ x: clamp(previous.x + x, -72, 72), y: previous.y + y }));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); enter();
    }
  };

  const activeStep = journey[active];

  return (
    <>
      <div className="so-os-experience" aria-label="Explore the connected business operating system">
        <div className="so-os-experience-visual">
          <div className="so-os-cube-aura" aria-hidden="true" />
          <div className="so-os-cube-trigger" ref={triggerRef} role="button" tabIndex={0}
            aria-label="Rotate the operating-system cube using arrow keys, then press Enter to explore the operating system"
            aria-haspopup="dialog" aria-expanded={expanded}
            data-dragging={dragging}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
            onClick={onCubeClick} onKeyDown={onCubeKeyDown}>
            <div className="so-os-cube-perspective">
              <div className="so-os-cube-3d" style={{ "--so-cube-rx": rotation.x + "deg", "--so-cube-ry": rotation.y + "deg" } as CSSProperties}>
                {faces.map((face) => (
                  <div key={face.side} className={"so-os-cube-face so-os-cube-face--" + face.side} aria-hidden="true">
                    <span className="so-os-face-topline">SIGNAL <b>ONE</b> · OPERATING SYSTEMS</span>
                    <strong>{face.title}</strong>
                    <span className="so-os-face-line" />
                    <small>{face.subtitle}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="so-os-cube-shadow" aria-hidden="true" />
        </div>
        <div className="so-os-experience-info">
          <span className="so-os-eyebrow">EXPLORE THE BUSINESS OS</span>
          <h3>One business.<br /><span>Every handoff connected.</span></h3>
          <p>Move the cube to explore its dimensions. Enter to see how a customer request becomes staffed, scheduled, delivered, verified and commercially useful work.</p>
          <div className="so-os-mini-chain" aria-hidden="true">
            {["Lead","People","Schedule","Work","Proof","Billing","Growth"].map((label, index) => (
              <span key={label} className="so-os-mini-item">
                <i>{String(index + 1).padStart(2, "0")}</i>{label}
              </span>
            ))}
          </div>
          <div className="so-os-experience-actions">
            <button type="button" className="so-os-enter" onClick={enter}>
              Enter the operating system <span aria-hidden="true">↗</span>
            </button>
            <span className="so-os-hint">Drag · Swipe · Arrow keys</span>
          </div>
          <p className="so-os-concept-note">Interactive concept of the connected business journey. Capabilities are delivered in stages.</p>
        </div>
      </div>

      {expanded && typeof document !== "undefined" && createPortal(
        <div className="so-os-overlay" role="presentation" onPointerDown={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}>
          <div className="so-os-interior" role="dialog" aria-modal="true" aria-labelledby="so-os-interior-heading"
            ref={dialogRef} tabIndex={-1}>
            <div className="so-os-interior-header">
              <div>
                <span className="so-os-eyebrow">SIGNAL ONE · CONNECTED BUSINESS JOURNEY</span>
                <h2 id="so-os-interior-heading">Inside the operating system</h2>
                <p>Explore how each stage carries the work into the next.</p>
              </div>
              <button type="button" className="so-os-close" aria-label="Close operating system experience"
                onClick={() => setExpanded(false)}>×</button>
            </div>
            <div className="so-os-journey-track" ref={trackRef} role="group" aria-label="Operating system stages">
              {journey.map((item, index) => (
                <button key={item.label} type="button" className="so-os-journey-step"
                  data-current={index === active} aria-pressed={index === active}
                  onClick={() => select(index)}>
                  <span className="so-os-step-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="so-os-step-label">{item.label}</span>
                </button>
              ))}
              <span className="so-os-flow-line" aria-hidden="true" />
            </div>
            <div className="so-os-interior-body" key={active}>
              <div className="so-os-stage-view" aria-hidden="true">
                <div className="so-os-stage-core">
                  <span>STAGE {String(active + 1).padStart(2, "0")}</span>
                  <strong>{activeStep.label}</strong>
                  <small>Business OS</small>
                </div>
                <div className="so-os-stage-link so-os-stage-link--in">IN</div>
                <div className="so-os-stage-link so-os-stage-link--out">OUT</div>
              </div>
              <div className="so-os-stage-description">
                <span className="so-os-eyebrow">STEP {active + 1} OF {journey.length}</span>
                <h3>{activeStep.name}</h3>
                <p>{activeStep.purpose}</p>
                <dl className="so-os-handoff-list">
                  <div><dt>Receives</dt><dd>{activeStep.receives}</dd></div>
                  <div><dt>Action</dt><dd>{activeStep.does}</dd></div>
                  <div><dt>Hands off</dt><dd>{activeStep.handsOff}</dd></div>
                </dl>
              </div>
            </div>
            <div className="so-os-interior-footer">
              <p>Conceptual end-to-end vision, not a live customer dashboard. Individual features are introduced in stages.</p>
              <div className="so-os-interior-controls">
                <button type="button" onClick={() => setPlaying(current => !current)}
                  aria-label={playing ? "Pause the operating system journey" : "Play the operating system journey"}>
                  {playing ? "Pause flow" : "Play flow"}
                </button>
                <button type="button" aria-label="Previous stage" onClick={() => step(-1)}>←</button>
                <button type="button" aria-label="Next stage" onClick={() => step(1)}>→</button>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </>
  );
}
