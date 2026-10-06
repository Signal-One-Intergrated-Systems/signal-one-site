"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { isSignalOneEvent, trackEvent } from "../lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_ID;

function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || !window.gtag) return;
    const query = searchParams.toString();
    window.gtag("config", measurementId, {
      page_path: query ? pathname + "?" + query : pathname,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-analytics-event]")
        : null;
      if (!target) return;
      const name = target.dataset.analyticsEvent;
      if (!isSignalOneEvent(name)) return;
      trackEvent(name, {
        label: target.dataset.analyticsLabel,
        href: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

export default function Analytics() {
  if (!measurementId) {
    return (
      <Suspense fallback={null}>
        <RouteAnalytics />
      </Suspense>
    );
  }

  return (
    <>
      <Script
        src={"https://www.googletagmanager.com/gtag/js?id=" + measurementId}
        strategy="afterInteractive"
      />
      <Script id="signal-one-ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}
      </Script>
      <Suspense fallback={null}>
        <RouteAnalytics />
      </Suspense>
    </>
  );
}
