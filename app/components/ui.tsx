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
    <p className={"t-kicker text-signal-300 " + className} data-tone={tone}>
      {children}
    </p>
  );
}

const statusKinds = ["pilot", "live", "beta", "mvp", "soon", "quote"] as const;

/**
 * Product status label: a coloured dot and sentence-case text (DESIGN_SYSTEM §Status). One look on
 * every page; never pill-shaped, so it cannot be mistaken for a button. Hues are fixed per state:
 * live green, pilot and quote blue, beta/MVP amber, soon grey. `tone="light"` is only for labels
 * sitting on a light product well (the `.well` ancestor supplies the light hues).
 */
export function Status({
  kind,
  children,
}: {
  kind: (typeof statusKinds)[number];
  children: ReactNode;
  tone?: Tone;
}) {
  return <span className={"badge badge-" + kind}>{children}</span>;
}

/** Status of a Guard capability: Pilot or Live, from lib/guardStatus.ts. Server components only. */
export function GuardStatus({ tone = "dark", children }: { tone?: Tone; children?: ReactNode }) {
  return (
    <Status kind={guardStatusKind} tone={tone}>
      {children ?? guardStatusLabel}
    </Status>
  );
}

/** A short definition list on a raised dark panel: plain facts, no mock interface. */
export function FactPanel({ title, facts, tone = "dark" }: { title?: ReactNode; facts: ReadonlyArray<readonly [string, string]>; tone?: Tone }) {
  const dark = tone === "dark";
  return (
    <div className={"overflow-hidden rounded-card border " + "border-line-dark bg-raised text-text-inv"}>
      {title ? <div className={"border-b px-5 py-4 font-semibold sm:px-6 " + "border-line-dark"}>{title}</div> : null}
      <dl className="m-0">
        {facts.map(([term, detail]) => (
          <div key={term} className={"border-b px-5 py-4 last:border-0 sm:px-6 " + "border-line-dark"}>
            <dt className="t-h4">{term}</dt>
            <dd className={"t-small m-0 mt-1 " + "text-text-inv-2"}>{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
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
      <div className={"photo media-frame w-full " + (aspect || "h-full")}>
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

/**
 * Form progress: the one stepper used by every multi-step form (VA-25). A segmented track with the
 * current step named in text; finished, current and remaining steps are told apart by fill, not
 * by colour alone (the label carries the position).
 */
export function Stepper({ steps, index, label }: { steps: ReadonlyArray<string>; index: number; label: string }) {
  return (
    <div className="stepper">
      <p className="t-small font-semibold">
        Step {index + 1} of {steps.length} · {steps[index]}
      </p>
      <ol className="stepper-track" aria-label={label}>
        {steps.map((step, i) => (
          <li key={step} aria-current={i === index ? "step" : undefined} data-state={i < index ? "done" : i === index ? "current" : "todo"}>
            <span className="sr-only">
              {step}
              {i < index ? " (done)" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Numbered steps rendered as an ordered list with rules, not cards. */
export function Steps({
  items,
  tone = "light",
  accentClass = "text-signal-300",
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
            "border-line-dark"
          }
        >
          <span className={"t-num pt-0.5 text-[1.5rem] " + accentClass}>{index + 1}</span>
          <div>
            <h3 className="t-h4">{title}</h3>
            <p className={"t-small mt-1 " + "text-text-inv-2"}>{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Split hero for pages led by a photograph of people. Same geometry as PageHero: the copy column
 * (--hero-col) beside the photograph from lg up; copy FIRST on smaller screens, so the headline and
 * the primary action land in the first viewport on every buyer, guard and careers page (VA-24).
 * The photograph sits in the shared framed-media component at its natural 16:9 proportion: shown
 * complete, never cropped to a face, never enlarged past its source (`maxWidth` = source width).
 */
export function SplitHero({
  src,
  alt,
  children,
  side = "right",
  objectPosition = "50% 40%",
}: {
  src: StaticImageData;
  alt: string;
  children: ReactNode;
  /** Which side the photograph is on from lg up. */
  side?: "left" | "right";
  objectPosition?: string;
  /** Retained for call-site compatibility; the photograph is shown complete at every width. */
  objectPositionMobile?: string;
}) {
  return (
    <section className="split-hero s1-person-first-split">
      <div className="wrap grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,var(--hero-col))_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-24">
        <div className={side === "left" ? "lg:order-2" : ""}>{children}</div>
        <figure className={"m-0 " + (side === "left" ? "lg:order-1" : "")}>
          <div className="s1-glass-people-photo aspect-video w-full" style={{ maxWidth: src.width }}>
            <Image
              src={src}
              alt={alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 46vw, 100vw"
              quality={70}
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition }}
            />
          </div>
        </figure>
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
      {/* Copy is top-aligned, not centred against the aside: a tall product column must never push
          the headline and primary action below the first viewport (DR-005). It stays in view while the aside scrolls. */}
      <div className="wrap grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,var(--hero-col))_minmax(0,1fr)] lg:items-start lg:gap-20 lg:py-28">
        <div className="lg:sticky lg:top-28">
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
