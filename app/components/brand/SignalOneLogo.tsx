import SignalOneMark, { type BrandTone } from "./SignalOneMark";

/**
 * The Signal One lockup: mark left, wordmark and descriptor right, 12px gap.
 * `size` is the wordmark type size in px; the mark is 1.6x that, the
 * descriptor 0.4x. Canonical definition: docs/BRAND.md.
 */
export default function SignalOneLogo({
  size = 18,
  tone = "light",
  pulse = false,
  className = "",
}: {
  size?: number;
  tone?: BrandTone;
  pulse?: boolean;
  className?: string;
}) {
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
            marginTop: Math.round(size * 0.25),
            fontSize: size * 0.4,
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
