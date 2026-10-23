import SignalOneMark, { type BrandTone } from "./SignalOneMark";

/**
 * The Signal One lockup: mark left, wordmark and descriptor right, 12px gap.
 * `size` is the wordmark type size in px; the mark is 1.6x that. The
 * descriptor is 0.4x, but never below `descriptorMin` px (10 in the header,
 * 11 in the footer), and the lockup grows to fit. Canonical definition:
 * docs/BRAND.md.
 */
export default function SignalOneLogo({
  size = 18,
  tone = "light",
  pulse = false,
  descriptorMin = 10,
  className = "",
}: {
  size?: number;
  tone?: BrandTone;
  pulse?: boolean;
  /** Minimum descriptor size in px; overrides the 0.4x ratio. */
  descriptorMin?: number;
  className?: string;
}) {
  const descriptor = Math.max(size * 0.4, descriptorMin);
  const dark = tone === "dark";
  return (
    <span className={"inline-flex items-center " + className} style={{ gap: 12 }}>
      <SignalOneMark size={Math.round(size * 1.6)} tone={tone} pulse={pulse} />
      <span className="flex flex-col" style={{ lineHeight: 1 }}>
        <span
          className="font-display"
          style={{ fontSize: size, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1, color: dark ? "#F1F5F9" : "#0B1B2B", whiteSpace: "nowrap" }}
        >
          SIGNAL <span style={{ color: dark ? "#38BDF8" : "#0EA5E9" }}>ONE</span>
        </span>
        <span
          style={{
            marginTop: Math.max(4, Math.round(size * 0.25)),
            fontSize: descriptor,
            fontWeight: 600,
            letterSpacing: "0.42em",
            lineHeight: 1,
            color: dark ? "#94A3B8" : "#5A7184",
            whiteSpace: "nowrap",
          }}
        >
          INTEGRATED SYSTEMS
        </span>
      </span>
    </span>
  );
}
