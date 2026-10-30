"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";

const capabilities = [
  { label: "Customers", x: 20, y: 19 },
  { label: "People", x: 51, y: 10 },
  { label: "Scheduling", x: 81, y: 24 },
  { label: "Operations", x: 85, y: 57 },
  { label: "Proof", x: 70, y: 83 },
  { label: "Billing", x: 42, y: 87 },
  { label: "Equipment", x: 14, y: 69 },
  { label: "Growth", x: 17, y: 44 },
] as const;

const systems = [
  {
    name: "GUARD",
    label: "Security Business OS",
    intro: "From the first client request to the people, sites and work that deliver security.",
    modules: ["People & assignments", "Sites & coverage", "Patrols & incidents", "Evidence & oversight"],
    path: "/solutions/security",
    action: "Explore 1GUARD",
    type: "guard",
  },
  {
    name: "Service",
    label: "Service Business OS",
    intro: "Connect teams and everyday service delivery across restaurants and other service businesses.",
    modules: ["Team & recruitment", "Shifts & scheduling", "Tasks & service", "Business oversight"],
    path: "/service",
    action: "Explore 1Service",
    type: "service",
  },
] as const;

/**
 * Public, conceptual OS core. Unlike the previous rotatable cube / modal,
 * this is a square of linked dots floating OUTSIDE the original intro glass
 * card. Clicking it unfolds inline into two continuous product surfaces.
 * Never references confidential internal technology.
 */
export default function LivingOperatingSquare() {
  const [open, setOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [activePane, setActivePane] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const coreRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("keydown", onEscape);
      coreRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const move = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - 0.5) * -7,
      y: ((event.clientX - rect.left) / rect.width - 0.5) * 7,
    });
  };

  const choosePane = (index: number) => {
    setActivePane(index);
    const pane = panesRef.current?.children[index] as HTMLElement | undefined;
    pane?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest", inline: "nearest" });
  };

  const onPaneKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      choosePane(event.key === "ArrowRight" ? 1 : 0);
    }
  };

  return (
    <div className={`so-living-os ${open ? "is-open" : ""}`} data-open={open}>
      <div className="so-living-os-closed">
        <span className="so-living-os-caption">ONE CONNECTED BUSINESS SYSTEM</span>
        <button type="button" className="so-living-os-core" ref={coreRef}
          aria-label="Unfold the operating systems: 1GUARD and 1Service"
          aria-expanded={open} aria-controls="so-operating-systems-panes"
          onClick={() => setOpen(true)} onPointerMove={move}
          onPointerLeave={() => { setTilt({ x: 0, y: 0 }); setSelectedNode(null); }}
          style={{ "--living-tilt-x": tilt.x + "deg", "--living-tilt-y": tilt.y + "deg" } as React.CSSProperties}>
          <span className="so-living-grid" aria-hidden="true"/>
          <svg className="so-living-paths" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <path className="so-living-path" d="M20 19L51 10 81 24 85 57 70 83 42 87 14 69 17 44 20 19 M20 19L50 49 81 24 M50 49L85 57 M50 49L70 83 M50 49L14 69 M50 49L42 87"/>
            <path className="so-living-pulse-path" d="M20 19L51 10 81 24 85 57 70 83 42 87 14 69 17 44 20 19"/>
          </svg>
          <span className="so-living-centre" aria-hidden="true"><strong>ONE</strong><small>OS</small></span>
          {capabilities.map((item, i) => (
            <span key={item.label} className="so-living-node" data-active={selectedNode === i}
              style={{ left:item.x+"%", top:item.y+"%", "--node-index":i } as React.CSSProperties}
              onMouseEnter={() => setSelectedNode(i)}
              aria-hidden="true">
              <i/>
              <em>{item.label}</em>
            </span>
          ))}
          <span className="so-living-core-border" aria-hidden="true" />
        </button>
        <span className="so-living-hint">Hover to awaken · Select to unfold</span>
      </div>
      <div id="so-operating-systems-panes" className="so-living-open" aria-hidden={!open}>
        <div className="so-living-open-top">
          <div><span className="so-living-overline">ONE ECOSYSTEM · TWO OPERATING SYSTEMS</span><strong>One connected way to operate.</strong></div>
          <button type="button" className="so-living-close" ref={closeRef}
            tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} aria-label="Fold operating systems back into square">
            <span aria-hidden="true">×</span><span>Close</span>
          </button>
        </div>
        <div className="so-living-panes" ref={panesRef} onKeyDown={onPaneKey} role="group" aria-label="Operating system panels">
          {systems.map((system, i) => (
            <article key={system.name} className={`so-living-pane so-living-pane--${system.type}`} data-active={activePane === i}>
              <div className="so-living-pane-header">
                <span className="so-living-product"><b>1</b>{system.name}</span>
                <span className="so-living-system-label">{system.label}</span>
              </div>
              <div className="so-living-operational-visual" aria-hidden="true">
                <div className="so-living-visual-route"><span/><span/><span/><span/></div>
                <div className="so-living-visual-detail">
                  <span>PEOPLE</span><span>WORK</span><span>OVERSIGHT</span>
                </div>
                <div className="so-living-visual-bar"><i/><i/><i/></div>
              </div>
              <p>{system.intro}</p>
              <div className="so-living-modules">
                {system.modules.map((module,j)=>(
                  <div key={module}><span className="so-living-module-index">{String(j+1).padStart(2,"0")}</span><span>{module}</span><span className="so-living-module-arrow" aria-hidden="true">↗</span></div>
                ))}
              </div>
              <Link href={system.path} tabIndex={open ? 0 : -1} className="so-living-pane-link">{system.action} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
        <p className="so-living-disclosure">Illustrative operating-system vision. Individual capabilities are introduced in stages.</p>
      </div>
    </div>
  );
}
