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
    <section className="overflow-hidden rounded-[2rem] border border-white/9 bg-[#0d141c] shadow-[0_38px_120px_rgba(0,0,0,.28)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/8 bg-[#111923] px-4 py-3 md:px-5">
        <div className="mr-2 hidden gap-1.5 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-white/14" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/8" />
        </div>
        {views.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={
              "rounded-full px-3.5 py-2 text-xs font-semibold transition " +
              (active === item.id
                ? "bg-white/10 text-white"
                : "text-white/44 hover:bg-white/5 hover:text-white/72")
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[.72fr_1.28fr]">
        <div className="flex flex-col justify-between border-b border-white/8 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#75b9d7]">Demo environment</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={view.id}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={reducedMotion ? { duration: 0 } : { duration: .34, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mt-4 text-2xl font-semibold tracking-[-.035em] md:text-3xl">{view.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/56">{view.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-8 text-xs leading-5 text-white/32">
            Product evidence captured from Signal One Guard QA/demo states. Names, sites and records shown are synthetic test data.
          </p>
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[#06090d] md:min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view.image}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: .48, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={view.image}
                alt={view.label + " demo interface with synthetic data"}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority={view.id === "control"}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
