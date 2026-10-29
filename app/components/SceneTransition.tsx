"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Shared public-site scene motion. Never blocks modified, external, hash or download links. */
export default function SceneTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const pending = useRef<number | null>(null);
  const target = useRef<string | null>(null);

  useEffect(() => {
    setExiting(false);
    target.current = null;
    if (pending.current !== null) window.clearTimeout(pending.current);
    pending.current = null;
  }, [pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const dest = new URL(anchor.href, window.location.href);
      if (dest.origin !== window.location.origin || dest.pathname === window.location.pathname && dest.search === window.location.search) return;
      if (!dest.pathname.startsWith("/")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (pending.current !== null) window.clearTimeout(pending.current);
      target.current = dest.pathname + dest.search + dest.hash;
      setExiting(true);
      pending.current = window.setTimeout(() => {
        if (target.current) router.push(target.current);
        pending.current = null;
      }, 185);
    };
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("click", click, true);
      if (pending.current !== null) window.clearTimeout(pending.current);
    };
  }, [router]);

  return <div data-scene-route={pathname} data-scene-exit={exiting ? "" : undefined} className="s1-scene-route" onAnimationEnd={() => {}}>
    {children}
  </div>;
}
