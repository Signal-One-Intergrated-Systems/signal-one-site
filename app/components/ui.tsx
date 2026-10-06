import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { SignalOneEvent } from "../lib/analytics";

type Tone = "light" | "dark";

/** Sentence-case kicker above a heading. Not uppercase, not mono. */
export function Kicker({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p className={"t-kicker " + (tone === "dark" ? "text-signal-bright" : "text-signal") + " " + className}>
      {children}
    </p>
  );
}

const statusStyles = {
  live: { light: "bg-live-tint text-live", dark: "bg-white/8 text-live-inv" },
  beta: { light: "bg-beta-tint text-beta", dark: "bg-white/8 text-beta-inv" },
  mvp: { light: "bg-beta-tint text-beta", dark: "bg-white/8 text-beta-inv" },
  soon: { light: "bg-soon-tint text-soon", dark: "bg-white/8 text-soon-inv" },
  quote: { light: "bg-signal-tint text-signal", dark: "bg-white/8 text-signal-bright" },
} as const;

/**
 * Product status label. Use only where it changes what a buyer should expect.
 */
export function Status({
  kind,
  children,
  tone = "light",
}: {
  kind: keyof typeof statusStyles;
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-[0.875rem] font-semibold leading-tight " +
        statusStyles[kind][tone]
      }
    >
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size,
  event,
  eventLabel,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost-light" | "ghost-dark" | "field" | "brass";
  size?: "lg";
  event?: SignalOneEvent;
  eventLabel?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-analytics-event={event}
      data-analytics-label={eventLabel}
      className={"btn btn-" + variant + (size ? " btn-" + size : "") + " " + className}
    >
      {children}
    </Link>
  );
}

export function Arrow() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={"shrink-0 " + className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** A photograph with an honest caption. AI-generated environments only — never the product. */
export function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  imgClassName = "object-cover",
  caption,
  captionTone = "light",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  caption?: string;
  captionTone?: Tone;
}) {
  return (
    <figure className={"m-0 " + className}>
      <div className="photo h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          quality={80}
          className={imgClassName}
        />
      </div>
      {caption ? (
        <figcaption className={"photo-caption mt-2 " + (captionTone === "dark" ? "text-text-inv-2" : "")}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Numbered steps rendered as an ordered list with rules, not cards. */
export function Steps({
  items,
  tone = "light",
  accentClass = "text-signal",
}: {
  items: ReadonlyArray<readonly [string, string]>;
  tone?: Tone;
  accentClass?: string;
}) {
  return (
    <ol className="m-0 grid list-none gap-0 p-0">
      {items.map(([title, body], index) => (
        <li
          key={title}
          className={
            "grid grid-cols-[2.5rem_1fr] gap-4 border-t py-5 " +
            (tone === "dark" ? "border-line-dark" : "border-line")
          }
        >
          <span className={"t-num pt-0.5 text-[1.5rem] " + accentClass}>{index + 1}</span>
          <div>
            <h3 className="t-h4">{title}</h3>
            <p className={"t-small mt-1 " + (tone === "dark" ? "text-text-inv-2" : "text-text-2")}>{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
