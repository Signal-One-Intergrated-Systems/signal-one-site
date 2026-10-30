"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import SignalOneLogo from "./brand/SignalOneLogo";
import ProductSignature from "./brand/ProductSignature";


type Phase = "idle" | "closing" | "covered" | "opening";
function identity(path: string): string {
  if (path.startsWith("/solutions/security") || path.startsWith("/guard-")) return "1GUARD";
  if (path.startsWith("/service")) return "1Service";
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
  const closingTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);
  const openingTimer = useRef<number | null>(null);
  const recoveryTimer = useRef<number | null>(null);
  const target = useRef<string | null>(null);
  const previous = useRef(pathname);

  const clearScheduled = () => {
    for (const timer of [closingTimer, holdTimer, openingTimer, recoveryTimer]) {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  /** While a route changes, there must be NO native smooth-scroll animation.
   * The shutters seal first; the new route is positioned instantly while fully
   * concealed, and only then is it allowed to be revealed.
   */
  useEffect(() => {
    const active = phase !== "idle";
    document.documentElement.classList.toggle("s1-route-navigation", active);
    if (!active) return;
    // Blocking pointer input alone does not suppress wheel scrolling.
    const preventWheel = (event: WheelEvent) => event.preventDefault();
    const preventTouch = (event: TouchEvent) => event.preventDefault();
    window.addEventListener("wheel", preventWheel, { passive: false });
    window.addEventListener("touchmove", preventTouch, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventWheel);
      window.removeEventListener("touchmove", preventTouch);
    };
  }, [phase]);

  // Commit happens inside a persistent marketing layout. useLayoutEffect is
  // deliberately used to finish positioning before the new page is painted.
  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const requested = target.current;
    if (requested === null) {
      clearScheduled();
      setDestination(pathname);
      setPhase("idle");
      return;
    }

    clearScheduled();
    // Next's native auto-scrolling would visibly travel through transparent
    // optical glass; scroll:false and an immediate landing avoid that entirely.
    const land = () => {
      document.documentElement.style.scrollBehavior = "auto";
      const hash = new URL(requested, window.location.origin).hash;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (hash) {
        let id = hash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* invalid fragment */ }
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      }
      document.documentElement.style.removeProperty("scroll-behavior");
    };
    land();
    // Keep the glass fully sealed while the destination layout and its header
    // settle. Repeat the instant landing in case initial hydration moves focus.
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      requestAnimationFrame(() => {
        land();
        requestAnimationFrame(() => {
          land();
          target.current = null;
          setPhase("opening");
          openingTimer.current = window.setTimeout(() => {
            setPhase("idle");
            openingTimer.current = null;
          }, 1230);
        });
      });
    }, 380);
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
      const url = new URL(link.href, window.location.href);
      // Fragment and query navigation within the same route is not a page
      // transition; let Next/browser handle it normally.
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (target.current) return;

      clearScheduled();
      target.current = url.pathname + url.search + url.hash;
      setDestination(url.pathname);
      // Prevent smooth root scroll from applying even before React's effect.
      document.documentElement.classList.add("s1-route-navigation");
      setPhase("closing");
      closingTimer.current = window.setTimeout(() => {
        closingTimer.current = null;
        setPhase("covered");
        // No route change until both glass shutters have finished closing.
        holdTimer.current = window.setTimeout(() => {
          holdTimer.current = null;
          if (!target.current) return;
          router.push(target.current, { scroll: false });
          // If route fetch fails, never strand the visitor behind glass.
          recoveryTimer.current = window.setTimeout(() => {
            if (target.current) {
              target.current = null;
              setPhase("idle");
            }
            recoveryTimer.current = null;
          }, 8500);
        }, 360);
      }, 1338);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => () => {
    clearScheduled();
    document.documentElement.classList.remove("s1-route-navigation");
  }, []);

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
        {isMaster ? <span className="sg-entry-wordmark sg-entry-master-logo"><SignalOneLogo tone="dark" size={42} descriptorMin={14} /></span> : <span className="sg-entry-wordmark">{destination.startsWith("/solutions/security") || destination.startsWith("/guard-") ? <ProductSignature name="GUARD" tone="dark" /> : destination.startsWith("/service") ? <ProductSignature name="Service" tone="dark" /> : identity(destination)}</span>}
        <span className="sg-entry-caption">{isEquipment ? "EQUIPMENT" : isMaster ? "" : destination.startsWith("/solutions/security") || destination.startsWith("/guard-") ? "SECURITY OPERATIONS" : destination.startsWith("/service") ? "SERVICE OPERATIONS" : "INTEGRATED SYSTEMS"}</span>
      </div>
    </div>
  </>;
}
