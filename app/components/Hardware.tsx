import Image from "next/image";
import Link from "next/link";
import type { CatalogueProduct } from "../lib/catalogue";
import { Status } from "./ui";

/**
 * One rental product. A first-party manufacturer cut-out when we have one
 * (docs/ASSET_PROVENANCE.md); otherwise a typographic tile. Never a stand-in
 * image of a different device.
 */
export function HardwareCard({
  product,
  compact = false,
  headingLevel = 3,
}: {
  product: CatalogueProduct;
  compact?: boolean;
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return (
    <article className="hardware-card card relative flex h-full flex-col overflow-hidden">
      {product.image ? (
        <div className="relative aspect-[4/3] bg-gradient-to-b from-light-2 to-white">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 85vw"
            quality={90}
            className="object-contain p-6 sm:p-8"
          />
          <span className="glass-light absolute left-3 top-3 rounded-full">
            <Status kind="quote">By quote</Status>
          </span>
        </div>
      ) : (
        <div className="hardware-spec-heading surface-raised">
          <p>Specification & enquiry</p>
          <Status kind="quote" tone="dark">
            By quote
          </Status>
        </div>
      )}
      <div
        className={"flex flex-1 flex-col " + (compact ? "p-5" : "p-6 sm:p-7")}
      >
        <p className="t-small font-semibold text-signal-ink">
          {product.manufacturer ? product.manufacturer + " · " : ""}
          {product.type}
        </p>
        <Heading
          className={
            "mt-2 font-display font-bold leading-[1.05] tracking-[-0.02em] " +
            (compact ? "text-[1.5rem]" : "text-[1.75rem] sm:text-[2rem]")
          }
        >
          {product.model}
        </Heading>
        <p className="t-small mt-3 text-text">{product.role}</p>
        <p className="t-small mt-1 text-text-2">{product.detail}</p>
        <Link
          href="/radios-equipment#quote"
          className="link-arrow mt-auto pt-5 text-signal-ink"
        >
          Request a quote<span className="sr-only"> for {product.model}</span>{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/**
 * Horizontal hardware rail: native scroll-snap, so it swipes naturally on
 * touch and scrolls with a trackpad; no scroll hijacking.
 */
export function HardwareRail({
  products,
}: {
  products: ReadonlyArray<CatalogueProduct>;
}) {
  return (
    <ul
      aria-label="Rental hardware"
      className="hardware-rail relative m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pb-4"
    >
      {products.map((product) => (
        <li
          key={product.model}
          className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-3rem)/4.35)]"
        >
          <HardwareCard product={product} compact />
        </li>
      ))}
    </ul>
  );
}
