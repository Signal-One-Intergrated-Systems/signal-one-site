"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignalOneLogo from "./brand/SignalOneLogo";

type World = "buyer" | "guard" | "careers";

type NavItem = { href: string; label: string };

const worlds: Record<
  World,
  {
    identity: string;
    homeHref: string;
    primary: NavItem[];
    secondary: NavItem[];
    cta: NavItem;
    shell: string;
    link: string;
    cta_class: string;
    sheet: string;
  }
> = {
  buyer: {
    identity: "Integrated Systems",
    homeHref: "/",
    primary: [
      { href: "/solutions/security", label: "Platform" },
      { href: "/guard-marketplace", label: "Marketplace" },
      { href: "/radios-equipment", label: "Radios & Tracking" },
      { href: "/pricing", label: "Pricing" },
    ],
    secondary: [
      { href: "/guards", label: "For guards" },
      { href: "/join/sales", label: "Careers" },
    ],
    cta: { href: "/#product", label: "See Signal One in action" },
    shell: "bg-base text-text-inv border-b border-line-dark",
    link: "text-text-inv hover:bg-white/8",
    cta_class: "btn btn-primary",
    sheet: "bg-base text-text-inv",
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
    shell: "bg-base text-text-inv border-b border-line-dark",
    link: "text-text-inv hover:bg-white/8",
    cta_class: "btn btn-primary",
    sheet: "bg-base text-text-inv",
  },
  careers: {
    identity: "Careers",
    homeHref: "/join/sales",
    primary: [
      { href: "/join/sales#role", label: "The role" },
      { href: "/join/sales#process", label: "Process" },
    ],
    secondary: [{ href: "/", label: "About Signal One" }],
    cta: { href: "/join/sales#apply", label: "Apply" },
    shell: "bg-base text-text-inv border-b border-line-dark",
    link: "text-text-inv hover:bg-white/8",
    cta_class: "btn btn-primary",
    sheet: "bg-base text-text-inv",
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
  const dark = true; // the header is always dark: the lockup's light-surface colours are for light backgrounds only
  const [open, setOpen] = useState(false);
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
    };
    window.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => !href.includes("#") && href !== "/" && pathname.startsWith(href);

  return (
    <header className={"sticky top-0 z-50 " + config.shell}>
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link
          href={config.homeHref}
          className="flex min-h-[44px] min-w-0 items-center gap-3"
          aria-label={"Signal One " + config.identity + " home"}
        >
          <SignalOneLogo size={22} tone={dark ? "dark" : "light"} pulse descriptorMin={10} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {config.primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={
                "flex min-h-[44px] items-center rounded-ui px-3.5 text-[1rem] font-medium transition-colors aria-[current=page]:underline aria-[current=page]:underline-offset-8 " +
                config.link
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          {config.secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex min-h-[44px] items-center rounded-ui px-3 text-[0.9375rem] " +
                (dark ? "text-text-inv-2 hover:text-text-inv" : "text-text-2 hover:text-text")
              }
            >
              {item.label}
            </Link>
          ))}
          <Link href={config.cta.href} className={config.cta_class + " ml-3"}>
            {config.cta.label}
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={
            "flex min-h-[44px] items-center gap-2 rounded-ui border px-3.5 text-[1rem] font-semibold lg:hidden " +
            (dark ? "border-white/30" : "border-line-strong")
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
          className={"fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto lg:hidden " + config.sheet}
        >
          <nav className="wrap flex min-h-full flex-col pb-8 pt-4" aria-label="Mobile">
            <ul className="m-0 list-none p-0">
              {config.primary.map((item) => (
                <li key={item.href} className={"border-b " + (dark ? "border-line-dark" : "border-line")}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[60px] items-center justify-between font-display text-[1.5rem] font-semibold"
                  >
                    {item.label}
                    <span aria-hidden="true" className={dark ? "text-text-inv-2" : "text-text-2"}>→</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3">
              <Link href={config.cta.href} onClick={() => setOpen(false)} className={config.cta_class + " btn-lg w-full"}>
                {config.cta.label}
              </Link>
              {world === "buyer" ? (
                <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-ghost-dark btn-lg w-full">
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
                    className={"flex min-h-[44px] items-center text-[1.0625rem] underline underline-offset-4 " + (dark ? "text-text-inv-2" : "text-text-2")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className={"t-small mt-auto pt-10 " + (dark ? "text-text-inv-2" : "text-text-2")}>
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
