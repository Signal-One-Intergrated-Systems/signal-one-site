"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Cta = { kicker: string; title: string; body: string; href: string; label: string };

/**
 * The footer's closing band appears only on pages that have no closing action of their own.
 * Every product, equipment, guard, careers and form page already ends with its own call to action
 * (and the 404 page with its recovery links); a second primary band directly beneath it competed
 * with it and out-ranked the page (DR-004, VA-04). An allow-list, so new or unknown routes
 * (including 404) never get a stacked band by default.
 */
const pagesWithoutClosingAction = new Set(["/about", "/security-trust", "/popia", "/privacy", "/terms"]);

const conversation: Cta = {
  kicker: "Signal One · Integrated Systems",
  title: "Run your business. As one.",
  body: "Radios, connectivity and 1GUARD for South African businesses with people in the field.",
  href: "/contact",
  label: "Talk to Signal One",
};

export function ctaFor(pathname: string): Cta | null {
  return pagesWithoutClosingAction.has(pathname) ? conversation : null;
}

export default function FooterCta() {
  const cta = ctaFor(usePathname() || "/");
  if (!cta) return null;
  return (
    <div className="s1-premium-footer-intro">
      <div>
        <p className="t-kicker text-signal-300">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <p>{cta.body}</p>
      </div>
      <Link className="s1-footer-main-cta btn btn-primary btn-lg shrink-0" href={cta.href}>
        {cta.label} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
