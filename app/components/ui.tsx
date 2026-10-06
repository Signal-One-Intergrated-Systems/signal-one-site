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
    <p className={"t-kicker " + (tone === "dark" ? "text-signal-400" : "text-signal-ink") + " " + className}>
      {children}
    </p>
  );
}

const statusStyles = {
  live: { light: "bg-live-tint text-live", dark: "bg-white/8 text-live-inv" },
  beta: { light: "bg-beta-tint text-beta", dark: "bg-white/8 text-beta-inv" },
  mvp: { light: "bg-beta-tint text-beta", dark: "bg-white/8 text-beta-inv" },
  soon: { light: "bg-soon-tint text-soon", dark: "bg-white/8 text-soon-inv" },
  quote: { light: "bg-signal-tint text-signal-ink", dark: "bg-white/8 text-signal-400" },
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
  aspect,
  imgClassName = "object-cover",
  caption,
  captionTone = "light",
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Aspect-ratio classes for the picture itself (not the figure, so the caption never counts toward it). */
  aspect?: string;
  imgClassName?: string;
  caption?: string;
  captionTone?: Tone;
}) {
  return (
    <figure className={"m-0 " + className}>
      <div className={"photo w-full " + (aspect || "h-full")}>
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
  accentClass = "text-signal-ink",
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

/**
 * CSS for a photograph that never stretches past its native width: on a
 * viewport wider than `native` px the image is centred and its edges fade
 * into the section colour instead of upscaling.
 */
function edgeFade(native: number): React.CSSProperties {
  const mask = "linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%)";
  return {
    ["--fade" as string]: "clamp(0px, calc(100vw - " + native + "px), 200px)",
    maskImage: mask,
    WebkitMaskImage: mask,
  };
}

/**
 * Full-bleed photographic band with a one-line headline over it.
 * Height is capped so very wide screens get a wider surround, not a taller crop.
 */
export function PhotoBand({
  src,
  alt,
  headline,
  kicker,
  objectPosition = "50% 50%",
  textSide = "left",
  caption,
  sizes,
}: {
  src: StaticImageData;
  alt: string;
  headline: ReactNode;
  kicker?: ReactNode;
  objectPosition?: string;
  textSide?: "left" | "right";
  caption?: string;
  sizes?: string;
}) {
  return (
    <section className="surface-base relative">
      <div className="relative mx-auto" style={{ maxWidth: src.width }}>
        <div className="relative h-[max(300px,72vw)] overflow-hidden md:h-[clamp(420px,40vw,680px)]" style={edgeFade(src.width)}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes || "(min-width: " + src.width + "px) " + src.width + "px, 100vw"}
            quality={82}
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-base from-0% via-base/85 via-30% to-transparent to-80%" />
          <div
            aria-hidden="true"
            className={
              "absolute inset-0 hidden md:block " +
              (textSide === "left"
                ? "bg-gradient-to-r from-base/70 via-transparent via-45% to-transparent"
                : "bg-gradient-to-l from-base/70 via-transparent via-45% to-transparent")
            }
          />
        </div>
      </div>
      <div className="absolute inset-0 flex items-end">
        <div className={"wrap pb-8 md:pb-14 " + (textSide === "right" ? "md:flex md:justify-end" : "")}>
          <div className="max-w-[40rem]">
            {kicker ? <div className="mb-4 inline-flex rounded-ui bg-base px-3 py-2">{kicker}</div> : null}
            <h2 className="t-h2 text-text-inv">{headline}</h2>
            {caption ? <p className="t-caption mt-4 text-text-inv-2">{caption}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Split hero. From lg up the text sits on solid dark on one side and the
 * photograph fills the other side full height, so no text can overlap a face
 * or figure. The photo box starts one text column plus gutters in from the
 * container edge, so the split holds at every width. Below lg the photo goes
 * full width on top, 56vw tall.
 */
export function SplitHero({
  src,
  alt,
  children,
  side = "right",
  objectPositionMobile = "50% 40%",
  objectPosition = "50% 40%",
}: {
  src: StaticImageData;
  alt: string;
  children: ReactNode;
  /** Which side the photograph is on from lg up. */
  side?: "left" | "right";
  objectPositionMobile?: string;
  objectPosition?: string;
}) {
  const inset = "calc(max(0px, (100vw - 1320px) / 2) + 40px + 38rem + 40px)";
  const box: React.CSSProperties =
    side === "right"
      ? ({ ["--ph-l" as string]: inset, ["--ph-r" as string]: "0px" } as React.CSSProperties)
      : ({ ["--ph-l" as string]: "0px", ["--ph-r" as string]: inset } as React.CSSProperties);
  return (
    <section className="relative bg-deep text-text-inv" style={box}>
      <div className="relative h-[56vw] lg:absolute lg:inset-y-0 lg:left-[var(--ph-l)] lg:right-[var(--ph-r)] lg:h-auto">
        <div className="relative mx-auto h-full" style={{ maxWidth: src.width }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes={"(min-width: 1024px) 52vw, 100vw"}
            quality={85}
            placeholder="blur"
            className="object-cover [object-position:var(--pos-m)] lg:[object-position:var(--pos-d)]"
            style={{ ["--pos-m" as string]: objectPositionMobile, ["--pos-d" as string]: objectPosition }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent via-40% lg:hidden" />
          <div
            aria-hidden="true"
            className={
              "absolute inset-0 hidden lg:block " +
              (side === "right"
                ? "bg-gradient-to-r from-deep from-0% via-deep/60 via-6% to-transparent to-16%"
                : "bg-gradient-to-l from-deep from-0% via-deep/60 via-6% to-transparent to-16%")
            }
          />
        </div>
      </div>
      <div className={"wrap relative pb-14 pt-10 lg:flex lg:min-h-[clamp(600px,44vw,760px)] lg:items-center lg:pb-24 lg:pt-24 " + (side === "left" ? "lg:justify-end" : "")}>
        <div className="max-w-[38rem] lg:w-[38rem]">{children}</div>
      </div>
    </section>
  );
}
