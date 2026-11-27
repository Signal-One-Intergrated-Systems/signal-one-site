"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignalOneLogo from "./brand/SignalOneLogo";
import SignalOneMark from "./brand/SignalOneMark";
import ProductSignature from "./brand/ProductSignature";

type World = "buyer" | "guard" | "careers";

type NavItem = { href: string; label: string; note?: string };
/** A grouped menu (founder, 2026-11-27: grouped navigation inside the single-row glass header). */
type NavGroup = { label: string; items: NavItem[] };
type NavEntry = NavItem | NavGroup;
const isGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

const worlds: Record<
  World,
  {
    identity: string;
    homeHref: string;
    primary: NavEntry[];
    secondary: NavItem[];
    /** The world's own call to action. The buyer header has none (founder, 2026-11-27): the 14-day trial
     *  lives inside the 1GUARD journeys, and radios lead the homepage. */
    cta: NavItem | null;
    shell: string;
    link: string;
    cta_class: string;
    sheet: string;
  }
> = {
  buyer: {
    identity: "Integrated Systems",
    homeHref: "/",
    // Products stay one click away; the communications offer and the partner programmes are grouped menus.
    primary: [
      { href: "/solutions/security", label: "1GUARD" },
      { href: "/service", label: "1Service" },
      {
        label: "Communications",
        items: [
          // Radios are sold and rented today: the catalogue and quote form are one click away (DR-002).
          { href: "/radios-equipment", label: "Radios and push-to-talk", note: "Catalogue, journeys and quotes" },
          { href: "/radios-equipment#ways-to-buy", label: "Ways to buy", note: "Buy the radio, subscribe to the service" },
          { href: "/ptt-radio-rental", label: "Radio rental", note: "Push-to-talk fleets on a fixed term" },
          { href: "/equipment-marketplace", label: "Tracking and body cameras", note: "Other connected equipment" },
        ],
      },
      {
        label: "Partners",
        items: [
          { href: "/partners/reseller", label: "Become a reseller", note: "Sell radios and communications" },
          { href: "/partners/sales", label: "Become a sales partner", note: "Introduce customers, independently" },
          { href: "/partners#technology", label: "Technology partnerships", note: "Integration and distribution" },
          { href: "/join/sales", label: "Careers", note: "Work at Signal One" },
        ],
      },
      { href: "/pricing", label: "Pricing" },
    ],
    secondary: [
      { href: "/guard-marketplace", label: "Hire guards" },
      { href: "/guards", label: "For guards" },
    ],
    cta: null,
    shell: "glass-nav text-ink",
    link: "text-ink hover:bg-surface-2",
    cta_class: "btn btn-primary",
    sheet: "bg-surface text-ink",
  },
  guard: {
    identity: "For security officers",
    homeHref: "/guards",
    primary: [
      { href: "/guards#how-it-works", label: "How it works" },
      { href: "/guards#psira", label: "PSiRA" },
      { href: "/guards#your-information", label: "Your information" },
    ],
    secondary: [{ href: "/", label: "For security companies" }],
    cta: { href: "/guards/join", label: "Create your profile" },
    shell: "glass-nav text-ink",
    link: "text-ink hover:bg-surface-2",
    cta_class: "btn btn-primary",
    sheet: "bg-surface text-ink",
  },
  careers: {
    identity: "Careers",
    homeHref: "/join/sales",
    primary: [
      { href: "/join/sales#role", label: "The role" },
      { href: "/join/sales#process", label: "Process" },
    ],
    secondary: [{ href: "/about", label: "About Signal One" }],
    cta: { href: "/join/sales#apply", label: "Apply" },
    shell: "glass-nav text-ink",
    link: "text-ink hover:bg-surface-2",
    cta_class: "btn btn-primary",
    sheet: "bg-surface text-ink",
  },
};

function worldFor(pathname: string): World {
  if (pathname === "/guards" || pathname.startsWith("/guards/")) return "guard";
  if (pathname.startsWith("/join/sales")) return "careers";
  return "buyer";
}

export default function Header() {
  const pathname = usePathname() || "/";
  const world = worldFor(pathname);
  const config = worlds[world];
  const dark = false; // light-first (2026-11-26): the header is light glass, so it carries the light-surface lockup (docs/BRAND.md)
  const [open, setOpen] = useState(false);
  // Solid at the top of the page; glass once content scrolls underneath it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const targets = [toggleRef.current, ...Array.from(sheetRef.current?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])") || [])].filter((node): node is HTMLElement => Boolean(node));
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // The equipment journey spans three routes; all of them mark "Radios & equipment" as current.
  const equipmentRoutes = ["/radios-equipment", "/ptt-radio-rental", "/equipment-marketplace"];
  const isCurrent = (href: string) =>
    !href.includes("#") && href !== "/" &&
    (pathname.startsWith(href) || (href === "/radios-equipment" && equipmentRoutes.some((route) => pathname.startsWith(route))));

  return (
    <header data-home={pathname === "/" ? "" : undefined} data-scrolled={scrolled ? "" : undefined} className={"sticky top-0 z-50 " + config.shell}>
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link
          href={config.homeHref}
          className="flex min-h-[44px] min-w-0 items-center gap-3"
          aria-label={"Signal One " + config.identity + " home"}
        >
          {/* The canonical desktop lockup is 22px; reduce only where screen width requires it. */}
          <span className="s1-nav-logo-wide"><SignalOneLogo size={22} tone="light" pulse descriptorMin={10} /></span>
          <span className="s1-nav-logo-medium"><SignalOneLogo size={19} tone="light" pulse descriptorMin={10} /></span>
          <span className="s1-nav-logo-small"><SignalOneMark size={34} tone="light" pulse /></span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {config.primary.map((item) =>
            isGroup(item) ? (
              <NavMenu key={item.label} group={item} current={item.items.some((child) => isCurrent(child.href))} linkClass={config.link} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                aria-label={item.label}
                className={
                  "flex min-h-[44px] items-center rounded-ui font-medium transition-colors aria-[current=page]:underline aria-[current=page]:underline-offset-8 " +
                  config.link
                }
              >
                {item.label === "1GUARD" ? <ProductSignature name="GUARD" /> : item.label === "1Service" ? <ProductSignature name="Service" /> : item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-1 xl:flex">
          {config.secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "s1-nav-secondary flex min-h-[44px] items-center rounded-ui text-[0.9375rem] " +
                "text-ink-2 hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
          {config.cta ? (
            <Link href={config.cta.href} className={config.cta_class + " s1-nav-cta"}>
              {config.cta.label}
            </Link>
          ) : null}
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={
            "flex min-h-[44px] items-center gap-2 rounded-ui border px-3.5 text-[1rem] font-semibold xl:hidden " +
            (dark ? "border-line-strong" : "border-line-strong")
          }
        >
          <span>{open ? "Close" : "Menu"}</span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          ref={sheetRef}
          className={"fixed inset-x-0 bottom-0 top-[80px] z-50 overflow-y-auto xl:hidden " + config.sheet}
        >
          <nav className="wrap flex min-h-full flex-col pb-8 pt-4" aria-label="Mobile">
            <ul className="m-0 list-none p-0">
              {config.primary.map((item) =>
                isGroup(item) ? (
                  <li key={item.label} className="border-b border-hairline py-3">
                    <p className="t-small m-0 pt-2 font-semibold text-ink-2">{item.label}</p>
                    <ul className="m-0 mt-1 list-none p-0">
                      {item.items.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="flex min-h-[52px] items-center justify-between font-display text-[1.25rem] font-semibold"
                          >
                            {child.label}
                            <span aria-hidden="true" className="text-ink-2">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href} className={"border-b " + "border-hairline"}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-label={item.label}
                      className="flex min-h-[60px] items-center justify-between font-display text-[1.5rem] font-semibold"
                    >
                      {item.label === "1GUARD" ? <ProductSignature name="GUARD" /> : item.label === "1Service" ? <ProductSignature name="Service" /> : item.label}
                      <span aria-hidden="true" className={dark ? "text-ink-2" : "text-ink-2"}>→</span>
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-8 grid gap-3">
              {config.cta ? (
                <Link href={config.cta.href} onClick={() => setOpen(false)} className={config.cta_class + " btn-lg w-full"}>
                  {config.cta.label}
                </Link>
              ) : null}
              {world === "buyer" ? (
                <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary btn-lg w-full">
                  Talk to Signal One
                </Link>
              ) : null}
            </div>

            <ul className="m-0 mt-8 flex list-none flex-wrap gap-x-6 gap-y-1 p-0">
              {config.secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={"flex min-h-[44px] items-center text-[1.0625rem] underline underline-offset-4 " + "text-ink-2"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className={"t-small mt-auto pt-10 " + "text-ink-2"}>
              Signal One: Integrated Systems · South Africa ·{" "}
              <a href="mailto:sales@signalone.co.za" className="link-inline">
                sales@signalone.co.za
              </a>
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/**
 * A grouped menu in the desktop header: a disclosure button and a panel of links (WAI-ARIA disclosure
 * navigation pattern, not an application menu). Opens on click, Enter or Space; closes on Escape (focus
 * returns to the button), on a click outside, when focus leaves it, and on navigation.
 */
function NavMenu({ group, current, linkClass }: { group: NavGroup; current: boolean; linkClass: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = "nav-menu-" + group.label.toLowerCase().replace(/[^a-z]+/g, "-");
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div
      ref={rootRef}
      className="s1-nav-menu relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-current={current ? "" : undefined}
        onClick={() => setOpen((value) => !value)}
        className={"flex min-h-[44px] items-center gap-1.5 rounded-ui font-medium transition-colors data-[current]:underline data-[current]:underline-offset-8 " + linkClass}
      >
        {group.label}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={"transition-transform " + (open ? "rotate-180" : "")}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div id={panelId} hidden={!open} className="s1-nav-menu-panel">
        <ul className="m-0 grid list-none gap-1 p-0">
          {group.items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined} className="s1-nav-menu-link">
                <span className="block font-semibold text-ink">{item.label}</span>
                {item.note ? <span className="block text-[0.875rem] text-ink-2">{item.note}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

