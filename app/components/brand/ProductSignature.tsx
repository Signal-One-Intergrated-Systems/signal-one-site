/**
 * Canonical product-family wordmark. This is the EXISTING typographic "1",
 * not a new emblem, icon or replacement for the Signal One corporate mark.
 *
 * Geometry contract: the numeral and the following capital use the same
 * typeface, font size, font weight, line height and baseline. Their only
 * separation is --s1-product-signature-gap (one shared em-based token).
 * Do not introduce per-product margins or scale/translate the numeral.
 */
export type ProductSignatureName = "GUARD" | "Service" | "Community";

export default function ProductSignature({
  name,
  tone = "light",
  className = "",
}: {
  name: ProductSignatureName;
  /** Dark/photo/glass surfaces use the existing #38BDF8, light surfaces #0EA5E9. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span className={`s1-product-signature s1-product-signature--${tone} ${className}`.trim()}>
      <span className="s1-product-signature__one">1</span>
      <span className="s1-product-signature__name">{name}</span>
    </span>
  );
}
