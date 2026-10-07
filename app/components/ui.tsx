import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { SignalOneEvent } from "../lib/analytics";
import { guardStatusKind, guardStatusLabel } from "../lib/guardStatus";

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
  pilot: { light: "bg-signal-tint text-signal-ink ring-1 ring-signal-ink/25", dark: "bg-signal-400/12 text-signal-400 ring-1 ring-signal-400/30" },
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

/** Status of a Guard capability: Pilot or Live, from lib/guardStatus.ts. Server components only. */
export function GuardStatus({ tone = "light", children }: { tone?: Tone; children?: ReactNode }) {
  return (
    <Status kind={guardStatusKind} tone={tone}>
      {children ?? guardStatusLabel}
    </Status>
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
          quality={75}
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

/** Fades the top and bottom edges when a box reaches the photo's native height. */
function verticalFade(native: number): React.CSSProperties {
  const mask = "linear-gradient(to bottom, transparent 0, #000 var(--vfade), #000 calc(100% - var(--vfade)), transparent 100%)";
  return {
    ["--vfade" as string]: "clamp(0px, calc(100% - " + (native - 60) + "px), 80px)",
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
            quality={75}
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
            {kicker ? <div className="glass mb-4 inline-flex rounded-ui px-3 py-2">{kicker}</div> : null}
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
  panel,
}: {
  src: StaticImageData;
  alt: string;
  children: ReactNode;
  /** Which side the photograph is on from lg up. */
  side?: "left" | "right";
  objectPositionMobile?: string;
  objectPosition?: string;
  /** Desktop only: a glass information panel floating over the photograph's lower edge. */
  panel?: ReactNode;
}) {
  const inset = "calc(max(0px, (100vw - var(--wrap-max)) / 2) + var(--wrap-pad) + var(--hero-col) + 40px)";
  const box: React.CSSProperties =
    side === "right"
      ? ({ ["--ph-l" as string]: inset, ["--ph-r" as string]: "0px" } as React.CSSProperties)
      : ({ ["--ph-l" as string]: "0px", ["--ph-r" as string]: inset } as React.CSSProperties);
  return (
    <section className="split-hero relative bg-deep text-text-inv" style={box}>
      <div className="relative h-[56vw] lg:absolute lg:inset-y-0 lg:left-[var(--ph-l)] lg:right-[var(--ph-r)] lg:h-auto">
        {/* Never taller or wider than the source: on a tall hero the photo is centred and fades into the surface. */}
        <div className="relative mx-auto h-full lg:top-1/2 lg:-translate-y-1/2" style={{ maxWidth: src.width, maxHeight: src.height, ...verticalFade(src.height) }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            fetchPriority="high"
            sizes={"(min-width: 1024px) 52vw, 100vw"}
            quality={70}
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
        {panel ? (
          <div className={"absolute bottom-8 hidden w-[min(24rem,calc(100%-4rem))] lg:block " + (side === "right" ? "right-8" : "left-8")}>
            {panel}
          </div>
        ) : null}
      </div>
      <div className={"wrap relative pb-14 pt-10 lg:flex lg:min-h-[clamp(600px,44vw,760px)] lg:items-center lg:pb-24 lg:pt-24 " + (side === "left" ? "lg:justify-end" : "")}>
        <div className="max-w-[38rem] lg:w-[var(--hero-col)] lg:max-w-none">{children}</div>
      </div>
    </section>
  );
}

/**
 * Standard page hero for pages without a hero photograph: text on solid dark
 * on the left, a panel (product frame, status, figure) on the right. Same
 * column widths and scale as SplitHero.
 */
export function PageHero({
  kicker,
  status,
  title,
  lead,
  actions,
  aside,
}: {
  kicker?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="split-hero surface-deep">
      <div className="wrap grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,var(--hero-col))_minmax(0,1fr)] lg:items-center lg:gap-20 lg:py-32">
        <div>
          {kicker || status ? (
            <div className="flex flex-wrap items-center gap-3">
              {kicker ? <Kicker tone="dark">{kicker}</Kicker> : null}
              {status}
            </div>
          ) : null}
          <h1 className="t-hero mt-5">{title}</h1>
          {lead ? <p className="t-lead measure mt-6 text-text-inv-2">{lead}</p> : null}
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
