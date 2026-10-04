"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  { href: "/#problem", label: "Why Signal One" },
  { href: "/#platform", label: "Platform" },
  { href: "/solutions/security", label: "Security operations" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div className="s1-glass mx-auto mt-3 flex h-[72px] max-w-[90rem] items-center justify-between rounded-[18px] px-4 md:mt-5 md:px-5">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)} aria-label="Signal One home">
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-[#0EA5E9]/45">
            <span className="absolute inset-[5px] rounded-full border border-[#38BDF8]/20 transition duration-300 group-hover:scale-110" />
            <span className="absolute h-2.5 w-2.5 rounded-full bg-[#0EA5E9] shadow-[0_0_26px_rgba(14,165,233,.75)]" />
            <span className="absolute h-6 w-6 animate-ping rounded-full border border-[#0EA5E9]/25 [animation-duration:2.8s]" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold tracking-[.16em] text-[#F1F5F9] md:text-base">
              SIGNAL <span className="text-[#0EA5E9]">ONE</span>
            </span>
            <span className="s1-mono mt-0.5 block text-[8px] text-white/42">
              Security Operations
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[10px] px-4 py-2.5 text-sm font-medium text-white/62 transition duration-200 hover:bg-white/[.055] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            href="/get-started"
            className="s1-secondary-action px-4 py-2.5 text-sm font-semibold"
          >
            Company onboarding
          </Link>
          <Link
            href="/contact"
            className="s1-primary-action px-5 py-2.5 text-sm font-semibold"
          >
            Book review
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[.035] text-white xl:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="signal-one-mobile-nav"
        >
          <span className="text-xl leading-none">{open ? "×" : "≡"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.985 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            id="signal-one-mobile-nav"
            className="s1-glass mx-auto mt-2 max-w-[90rem] rounded-[18px] p-3 xl:hidden"
          >
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-white/72 transition hover:bg-white/[.055] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <Link
                  href="/get-started"
                  onClick={() => setOpen(false)}
                  className="s1-secondary-action px-4 py-3 text-center text-sm font-semibold"
                >
                  Company onboarding
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="s1-primary-action px-4 py-3 text-center text-sm font-semibold"
                >
                  Book review
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
