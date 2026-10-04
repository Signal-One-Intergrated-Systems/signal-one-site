"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/#platform", label: "Platform" },
  { href: "/guards", label: "Guard Marketplace" },
  { href: "/solutions/security", label: "Security" },
  { href: "/devices", label: "Devices" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div className="mx-auto mt-3 flex max-w-[92rem] items-center justify-between rounded-2xl border border-white/15 bg-[#0b1017]/80 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-2xl md:mt-5 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-[#39bdf8]/40">
            <span className="absolute inset-1 rounded-full border border-[#39bdf8]/20" />
            <span className="h-3 w-3 rounded-full bg-[#39bdf8] shadow-[0_0_24px_rgba(56,189,248,.95)]" />
          </span>
          <span>
            <span className="block text-base font-semibold tracking-[.14em] text-white md:text-lg">
              SIGNAL <span className="text-[#39bdf8]">ONE</span>
            </span>
            <span className="block text-[9px] uppercase tracking-[.28em] text-white/50">
              Security Operations
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link href="/join/sales" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/5">
            Join Sales
          </Link>
          <Link href="/get-started" className="rounded-full bg-[#39bdf8] px-5 py-2.5 text-sm font-semibold text-[#061019] shadow-[0_0_30px_rgba(56,189,248,.25)] transition hover:bg-[#7dd3fc]">
            Get started
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
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-2 max-w-[92rem] rounded-2xl border border-white/15 bg-[#0b1017]/95 p-3 shadow-2xl backdrop-blur-2xl xl:hidden"
          >
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-white/5 hover:text-white">
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <Link href="/join/sales" onClick={() => setOpen(false)} className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm text-white">
                  Join Sales
                </Link>
                <Link href="/get-started" onClick={() => setOpen(false)} className="rounded-xl bg-[#39bdf8] px-4 py-3 text-center text-sm font-semibold text-[#061019]">
                  Get started
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
