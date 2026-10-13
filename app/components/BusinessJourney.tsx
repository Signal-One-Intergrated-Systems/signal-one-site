"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { illustrativeCaption, photos } from "../lib/photos";

const chapters = [
  {
    name: "Win",
    question: "What does the next contract need?",
    title: "Start with the operation you want to build.",
    body: "Work with Signal One’s team to scope your sites, software and equipment. Get a clear consultation and a written quote before you commit.",
    status: "Consultation & quotations",
    photo: photos.hero,
    href: "/contact",
    cta: "Discuss your next contract",
  },
  {
    name: "Hire",
    question: "How will I staff the new posts?",
    title: "A hiring journey connected to your operation.",
    body: "Guard Marketplace is an MVP in development. The planned workflow will help you find nearby guards, shortlist profiles and send requests that guards can accept or decline.",
    status: "MVP in development",
    photo: photos.warehouse,
    href: "/guard-marketplace",
    cta: "Explore the planned Marketplace",
  },
  {
    name: "Run",
    question: "Who is working, and what happened?",
    title: "Give every site a shared operational record.",
    body: "Sites, posts, shifts, attendance and occurrence records in GUARD. Supervisors work within assigned sites; guards use their own phone or an authorised Central Device.",
    status: "GUARD · pilot",
    photo: photos.siteOperations,
    href: "/solutions/security",
    cta: "Explore GUARD",
  },
  {
    name: "Equip",
    question: "What does the contract need in the field?",
    title: "The right equipment. A clear rental quote.",
    body: "PoC radios, tracking and body cameras, specified for your deployment. Equipment is available alongside GUARD; device activation and tracking inside GUARD are coming soon.",
    status: "Equipment · by quote",
    photo: photos.teamBriefing,
    href: "/radios-equipment",
    cta: "Explore equipment",
  },
  {
    name: "Prove",
    question: "What can I show my client?",
    title: "Make the conversation about service evidence.",
    body: "Authorised clients see evidence and proof-of-service reports for their own sites. Every assessment has a reason, including when the service is only partly proven or unresolved.",
    status: "GUARD · pilot",
    photo: photos.controlRoomTeam,
    href: "/solutions/security#proof",
    cta: "Explore client proof",
  },
] as const;

export default function BusinessJourney({
  guardLabel = "Pilot",
}: {
  guardLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const chapter = chapters[active];
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 4
          : (active + (event.key === "ArrowRight" ? 1 : -1) + 5) % 5;
    setActive(next);
    refs.current[next]?.focus();
  }
  return (
    <div className="business-journey">
      <div
        className="business-tabs"
        role="tablist"
        aria-label="Your business journey"
        onKeyDown={keys}
      >
        {chapters.map((item, i) => (
          <button
            ref={(node) => {
              refs.current[i] = node;
            }}
            role="tab"
            type="button"
            id={"business-tab-" + i}
            aria-controls="business-panel"
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            key={item.name}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {item.name}
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      <div
        className="business-panel"
        id="business-panel"
        role="tabpanel"
        aria-labelledby={"business-tab-" + active}
      >
        <div key={chapter.name} className="business-photo">
          <Image
            src={chapter.photo.src}
            alt={chapter.photo.alt}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            quality={90}
            className="object-cover"
          />
          <p>{illustrativeCaption}</p>
        </div>
        <div key={active} className="business-copy">
          <span className="business-status">
            {active === 2 || active === 4
              ? "GUARD · " + guardLabel
              : chapter.status}
          </span>
          <p className="t-small text-text-2 mt-5">{chapter.question}</p>
          <h3>{chapter.title}</h3>
          <p className="t-body mt-5 text-text-2">{chapter.body}</p>
          <Link href={chapter.href} className="link-arrow text-signal-ink mt-7">
            {chapter.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
