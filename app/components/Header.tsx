"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div className="mx-auto mt-3 flex max-w-[92rem] items-center justify-between rounded-2xl border border-white/12 bg-[#0d141c]/82 px-4 py-3 shadow-[0_20px_70px_rgba(0,0,0,.32)] backdrop-blur-2xl md:mt-5 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-[#5f9fbd]/42">
            <span className="absolute inset-1 rounded-full border border-[#5f9fbd]/18" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#75b9d7] shadow-[0_0_20px_rgba(117,185,215,.55)]" />
          </span>
          <span>
            <span className="block text-base font-semibold tracking-[.14em] text-white md:text-lg">
              SIGNAL <span className="text-[#8bc0d7]">ONE</span>
            </span>
            <span className="block text-[9px] uppercase tracking-[.26em] text-white/42">
              Security Operations
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-white/62 transition hover:bg-white/5 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link href="/get-started" className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/22 hover:bg-white/5 hover:text-white">
            Company onboarding
          </Link>
          <Link href="/contact" className="rounded-full bg-[#75b9d7] px-5 py-2.5 text-sm font-semibold text-[#071018] shadow-[0_12px_32px_rgba(95,159,189,.18)] transition hover:bg-[#9bcddd]">
            Book review
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white xl:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "×" : "≡"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.985 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-[92rem] rounded-2xl border border-white/12 bg-[#0d141c]/96 p-3 shadow-2xl backdrop-blur-2xl xl:hidden"
          >
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white">
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/8 pt-3">
                <Link href="/get-started" onClick={() => setOpen(false)} className="rounded-xl border border-white/12 px-4 py-3 text-center text-sm text-white/78">
                  Company onboarding
                </Link>
                <Link href="/contact" onClick={() => setOpen(false)} className="rounded-xl bg-[#75b9d7] px-4 py-3 text-center text-sm font-semibold text-[#071018]">
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
