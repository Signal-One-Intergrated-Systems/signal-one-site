"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SignalOneLogo from "./brand/SignalOneLogo";


type Phase = "idle" | "closing" | "covered" | "opening";
function identity(path: string): string {
  if (path.startsWith("/solutions/security") || path.startsWith("/guard-")) return "1GUARD";
  if (path.startsWith("/workforce")) return "1Workforce";
  if (path.startsWith("/equipment") || path.startsWith("/radios") || path.startsWith("/ptt-radio")) return "EQUIPMENT";
  if (path.startsWith("/guards")) return "FOR GUARDS";
  if (path.startsWith("/get-started")) return "14-DAY TRIAL";
  if (path.startsWith("/contact")) return "CONTACT";
  if (path.startsWith("/join")) return "CAREERS";
  return "SIGNAL ONE";
}

/** Persistent glass doors, pulse and identity; the overlay must survive the route commit. */
export default function SceneTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [destination, setDestination] = useState(pathname);
  const timeout = useRef<number | null>(null);
  const target = useRef<string | null>(null);
  const previous = useRef(pathname);
  const hold = useRef<number | null>(null);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (timeout.current !== null) window.clearTimeout(timeout.current);
    if (hold.current !== null) window.clearTimeout(hold.current);
    timeout.current = null;
    if (target.current !== null) {
      target.current = null;
      // Let the destination identity remain visible over fully closed glass.
      hold.current = window.setTimeout(() => {
        setPhase("opening");
        hold.current = null;
        timeout.current = window.setTimeout(() => { setPhase("idle"); timeout.current = null; }, 1338);
      }, 460);
    } else {
      setDestination(pathname);
      setPhase("idle");
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const element = event.target;
      if (!(element instanceof Element)) return;
      const link = element.closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("#")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (timeout.current !== null) clearTimeout(timeout.current);
      target.current = url.pathname + url.search + url.hash;
      setDestination(url.pathname);
      setPhase("closing");
      timeout.current = window.setTimeout(() => {
        setPhase("covered");
        // Keep the branded seal visible before switching underlying content.
        hold.current = window.setTimeout(() => {
          if (target.current) router.push(target.current);
          hold.current = null;
        }, 420);
        timeout.current = window.setTimeout(() => {
          // Navigation failure recovery: never trap the user behind glass.
          if (target.current) { setPhase("idle"); target.current = null; }
          timeout.current = null;
        }, 3500);
      }, 1338);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timeout.current !== null) clearTimeout(timeout.current);
      if (hold.current !== null) clearTimeout(hold.current);
    };
  }, [router]);

  const isMaster = destination === "/" || destination.startsWith("/equipment") || destination.startsWith("/radios") || destination.startsWith("/ptt-radio");
  const isEquipment = destination.startsWith("/equipment") || destination.startsWith("/radios") || destination.startsWith("/ptt-radio");
  return <>
    <div key={pathname} data-scene-route={pathname} className="s1-scene-route">{children}</div>
    <div className="sg-entry-overlay" data-guard-entry={phase === "covered" ? "sealed" : phase} aria-hidden="true" data-exact-guard-transition>
      <div className="sg-glass-panel sg-entry-shutter sg-entry-shutter-left" />
      <div className="sg-glass-panel sg-entry-shutter sg-entry-shutter-right" />
      <div className="sg-entry-seam" />
      <div className="sg-entry-emblem">
        <span className="sg-entry-pulse" aria-hidden="true">
          <svg viewBox="0 0 88 88" width="88" height="88" fill="none">
            <circle cx="44" cy="44" r="35" stroke="#38BDF8" strokeWidth="1" opacity=".42" />
            <circle cx="44" cy="44" r="22" stroke="#38BDF8" strokeWidth="1.8" opacity=".88" />
            <circle cx="44" cy="44" r="10" fill="#0EA5E9" />
          </svg>
        </span>
        {isMaster ? <span className="sg-entry-wordmark sg-entry-master-logo"><SignalOneLogo tone="dark" size={42} descriptorMin={14} /></span> : <span className="sg-entry-wordmark">{destination.startsWith("/solutions/security") || destination.startsWith("/guard-") ? <><span className="sg-entry-one">1</span>GUARD</> : destination.startsWith("/workforce") ? <><span className="sg-entry-one">1</span>Workforce</> : identity(destination)}</span>}
        <span className="sg-entry-caption">{isEquipment ? "EQUIPMENT" : isMaster ? "" : destination.startsWith("/solutions/security") || destination.startsWith("/guard-") ? "SECURITY OPERATIONS" : destination.startsWith("/workforce") ? "WORKFORCE OPERATIONS" : "INTEGRATED SYSTEMS"}</span>
      </div>
    </div>
  </>;
}
