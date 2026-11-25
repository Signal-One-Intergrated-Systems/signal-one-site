"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Cta = { kicker: string; title: string; body: string; href: string; label: string };

const trial: Cta = {
  kicker: "SIGNAL ONE · INTEGRATED SYSTEMS",
  title: "Run your business. As one.",
  body: "Security Business OS. Service Business OS. Mission-critical technology.",
  href: "/get-started",
  label: "Get 14 Day Free Trial",
};

/**
 * The closing call to action follows the visitor's journey. A radio buyer, a
 * security officer or a job applicant is never sent to the 1GUARD trial.
 * Returns null where the page itself is the conversion point.
 */
export function ctaFor(pathname: string): Cta | null {
  if (pathname === "/contact" || pathname === "/get-started") return null;
  if (["/radios-equipment", "/ptt-radio-rental", "/equipment-marketplace"].includes(pathname)) {
    const rental = pathname === "/ptt-radio-rental";
    return {
      kicker: "SIGNAL ONE · RADIOS & EQUIPMENT",
      title: "Radios for the job, by written quote.",
      body: "Buy or rent push-to-talk radios, tracking and body cameras. Tell us the quantity and sites; we confirm fit, term and price in writing.",
      // A distinct accessible name from the page's own "Request a quote" buttons, so links are never ambiguous.
      href: rental ? "/radios-equipment?quoteType=Rent%20radios#quote" : pathname === "/radios-equipment" ? "#quote" : "/radios-equipment#quote",
      label: rental ? "Request a radio rental quote" : "Request an equipment quote",
    };
  }
  if (pathname === "/guards" || pathname.startsWith("/guards/")) {
    return {
      kicker: "SIGNAL ONE · FOR SECURITY OFFICERS",
      title: "Your work, on record.",
      body: "Create your profile once. You decide on every hire request.",
      href: "/guards/join",
      label: "Create your profile",
    };
  }
  if (pathname.startsWith("/join/")) {
    return {
      kicker: "SIGNAL ONE · CAREERS",
      title: "Sell the operating systems SMEs run on.",
      body: "Seven short steps. Your answers are saved in this browser as you go.",
      href: "/join/sales#apply",
      label: "Apply",
    };
  }
  return trial;
}

export default function FooterCta() {
  const cta = ctaFor(usePathname() || "/");
  if (!cta) return null;
  return (
    <div className="s1-premium-footer-intro">
      <div>
        <p className="s1-footer-kicker">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <p>{cta.body}</p>
      </div>
      <Link className="s1-footer-main-cta" href={cta.href}>
        {cta.label} <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
