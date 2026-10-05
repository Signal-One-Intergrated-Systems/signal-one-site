"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  { href: "/#platform", label: "Platform" },
  { href: "/guard-marketplace", label: "Guard Marketplace" },
  { href: "/radios-equipment", label: "Radios & Tracking" },
  { href: "/pricing", label: "Pricing" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0F131A]/88 backdrop-blur-[20px]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-5 lg:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-3"
          aria-label="Signal One home"
        >
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#0EA5E9]/40">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0EA5E9] shadow-[0_0_18px_rgba(14,165,233,.55)]" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold tracking-[.15em] text-[#F1F5F9]">
              SIGNAL <span className="text-[#0EA5E9]">ONE</span>
            </span>
            <span className="s1-mono mt-0.5 block truncate text-[11px] text-white/68">
              Security company operating platform
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[8px] px-3.5 py-2.5 text-sm font-medium text-white/72 transition duration-200 hover:bg-white/[.04] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/get-started" className="s1-primary-action px-5 py-2.5 text-sm font-semibold">
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="signal-one-mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid h-10 w-10 place-items-center rounded-[10px] border border-white/12 bg-white/[.035] text-white lg:hidden"
        >
          <span aria-hidden="true" className="text-xl leading-none">{open ? "×" : "≡"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="signal-one-mobile-nav"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 bg-[#0F131A]/96 px-4 pb-5 pt-3 backdrop-blur-[20px] lg:hidden"
          >
            <nav className="mx-auto grid max-w-[1440px] gap-1" aria-label="Mobile navigation">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[10px] px-3 py-3 text-sm font-medium text-white/76 transition hover:bg-white/[.05] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
                className="s1-primary-action mt-2 px-5 py-3 text-center text-sm font-semibold"
              >
                Get started
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
