"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const views = [
  {
    id: "control",
    label: "Control Room",
    title: "See the operational picture while it is still actionable.",
    body: "Live SOS, exceptions and site activity are surfaced in one place so the control room can acknowledge, respond and escalate without waiting for a manual report.",
    image: "/images/product-proof/control-room-demo.jpg",
  },
  {
    id: "operation",
    label: "My operation",
    title: "Know which sites are covered and what needs attention.",
    body: "Supervisors can see sites, roster or map, post shortfalls, guards on duty and the items that need intervention now.",
    image: "/images/product-proof/my-operation-demo.jpg",
  },
  {
    id: "people",
    label: "People & access",
    title: "Control who can see and operate each part of the company.",
    body: "Company administrators manage people, invitations, access and supervisor site scope without deleting the operational record.",
    image: "/images/product-proof/people-access-demo.jpg",
  },
  {
    id: "proof",
    label: "Proof of service",
    title: "Turn operational activity into evidence a client can understand.",
    body: "Scheduled services, verified attendance, patrol evidence and unresolved exceptions are brought together into a service-proof view.",
    image: "/images/product-proof/proof-of-service-demo.jpg",
  },
] as const;

export default function PlatformProof() {
  const [active, setActive] = useState<(typeof views)[number]["id"]>("control");
  const reducedMotion = useReducedMotion();
  const view = views.find((item) => item.id === active) || views[0];

  return (
    <section className="overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] shadow-[var(--s1-shadow-panel)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[.035] px-4 py-3 md:px-5">
        <div className="mr-3 hidden gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/65" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/65" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/65" />
        </div>

        {views.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={
              "rounded-[10px] px-3.5 py-2 text-xs font-semibold transition duration-200 " +
              (active === item.id
                ? "bg-[#0EA5E9] text-white shadow-[0_0_22px_rgba(14,165,233,.25)]"
                : "text-white/48 hover:bg-white/[.055] hover:text-white/78")
            }
          >
            {item.label}
          </button>
        ))}

        <span className="s1-mono ml-auto hidden text-[11px] text-white/62 lg:block">
          Controlled QA / demo environment
        </span>
      </div>

      <div className="grid lg:grid-cols-[.64fr_1.36fr]">
        <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/10 p-6 lg:border-b-0 lg:border-r lg:p-8 xl:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,.13),transparent_38%)]" />
          <div className="relative">
            <p className="s1-mono text-[11px] font-semibold text-[#38BDF8]">Product proof</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={view.id}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={reducedMotion ? { duration: 0 } : { duration: .38, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mt-4 text-2xl font-semibold tracking-[-.035em] text-white md:text-3xl">
                  {view.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60">{view.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mt-10 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,.45)]" />
              <span className="text-xs font-semibold text-white/66">Synthetic demo data only</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/64">
              Product evidence captured from Signal One Guard controlled QA/demo states. Names, sites and records shown are synthetic test data.
            </p>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[#06090D] md:min-h-[520px]">
          <div className="absolute inset-x-5 top-5 z-20 flex items-center justify-between rounded-xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl">
            <div>
              <p className="s1-mono text-[11px] text-white/64">Signal One Guard</p>
              <p className="mt-1 text-xs font-semibold text-white/78">{view.label}</p>
            </div>
            <span className="rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3 py-1.5 text-[11px] font-semibold text-[#7DD3FC]">
              Demo
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view.image}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.018 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: .52, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={view.image}
                alt={view.label + " Signal One Guard demo interface with synthetic data"}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 62vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.06),transparent_26%,rgba(0,0,0,.10))]" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
