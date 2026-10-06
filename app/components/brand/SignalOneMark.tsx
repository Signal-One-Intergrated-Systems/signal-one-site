/**
 * The Signal One mark. Canonical definition: docs/BRAND.md. Never alter it.
 * Three concentric circles, no fill: outer ring, middle ring, solid dot.
 * Ring strokes may use #38BDF8 on dark surfaces; the dot is always #0EA5E9.
 */
export type BrandTone = "light" | "dark";

const DOT = "#0EA5E9";

export default function SignalOneMark({
  size = 34,
  tone = "light",
  pulse = false,
  className = "",
  title,
}: {
  size?: number;
  tone?: BrandTone;
  /** Radiating ring. Header mark only; static everywhere else. */
  pulse?: boolean;
  className?: string;
  title?: string;
}) {
  const ring = tone === "dark" ? "#38BDF8" : DOT;
  return (
    <span
      className={"s1-mark " + (pulse ? "s1-pulse " : "") + className}
      style={{ width: size, height: size }}
      aria-hidden={title ? undefined : true}
    >
      <svg width={size} height={size} viewBox="0 0 34 34" fill="none" role={title ? "img" : undefined} aria-label={title}>
        <circle cx="17" cy="17" r="15" stroke={ring} strokeWidth="1" opacity="0.35" />
        <circle cx="17" cy="17" r="9.5" stroke={ring} strokeWidth="1.4" opacity="0.7" />
        <circle cx="17" cy="17" r="4" fill={DOT} />
      </svg>
    </span>
  );
}
