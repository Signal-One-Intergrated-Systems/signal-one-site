"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type MarketingEvent = {
  event: string;
  path: string;
  href?: string;
  label?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

function buildContext(event: string, extra: Partial<MarketingEvent> = {}): MarketingEvent {
  const params = new URLSearchParams(window.location.search);
  return {
    event,
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
    utmContent: params.get("utm_content") || "",
    ...extra,
  };
}

function send(event: MarketingEvent) {
  const body = JSON.stringify(event);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/marketing-event",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }

  fetch("/api/marketing-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

const trackedPaths = new Set([
  "/tour",
  "/pricing",
  "/trust",
  "/contact",
  "/marketplace",
  "/get-started",
  "/insights",
]);

export default function MarketingAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    send(buildContext("page_view"));
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href") || "";
      if (!rawHref.startsWith("/")) return;

      const url = new URL(rawHref, window.location.origin);
      if (
        !trackedPaths.has(url.pathname) &&
        !url.pathname.startsWith("/solutions/security/") &&
        !url.pathname.startsWith("/insights/")
      ) {
        return;
      }

      send(
        buildContext("buyer_click", {
          href: url.pathname + url.search,
          label: (anchor.textContent || "").trim().slice(0, 120),
        }),
      );
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
