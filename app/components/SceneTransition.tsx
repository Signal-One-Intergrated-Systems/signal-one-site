"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SignalOneMark from "./brand/SignalOneMark";

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

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (timeout.current !== null) window.clearTimeout(timeout.current);
    timeout.current = null;
    if (target.current !== null) {
      setPhase("opening");
      target.current = null;
      timeout.current = window.setTimeout(() => { setPhase("idle"); timeout.current = null; }, 650);
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
        if (target.current) router.push(target.current);
        timeout.current = window.setTimeout(() => {
          // Navigation failure recovery: never trap the user behind glass.
          if (target.current) { setPhase("idle"); target.current = null; }
          timeout.current = null;
        }, 3500);
      }, 540);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timeout.current !== null) clearTimeout(timeout.current);
    };
  }, [router]);

  const active = phase !== "idle";
  return <>
    <div key={pathname} data-scene-route={pathname} className="s1-scene-route">{children}</div>
    <div className="s1-glass-curtain" data-phase={phase} aria-hidden="true">
      <div className="s1-glass-door s1-glass-door-left" />
      <div className="s1-glass-door s1-glass-door-right" />
      <div className="s1-transition-identity">
        <div className="s1-transition-pulse"><SignalOneMark size={66} tone="dark" pulse={active} /></div>
        <div className="s1-transition-wordmark">{identity(destination)}</div>
      </div>
    </div>
  </>;
}
