import { availabilityLabel } from "../lib/catalogue";
import Image from "next/image";
import Link from "next/link";
import type { CatalogueProduct } from "../lib/catalogue";
import { Status } from "./ui";

/** Exact manufacturer images, shared by equipment and rental introductions. */
export function HardwareShowcase({ products }: { products: ReadonlyArray<CatalogueProduct> }) {
  return (
    <div className="s1-hardware-showcase" role="group" aria-label="Manufacturer radio photographs">
      {products.filter((product) => product.image).map((product) => (
        <figure key={product.model} className="s1-hardware-showcase-item">
          <div className="s1-product-well well">
            <Image src={product.image!.src} alt={product.image!.alt}
              fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 40vw, 43vw"
              className="object-contain p-5" quality={90}
              style={{ ["--bounds" as string]: product.image!.bounds }} />
          </div>
          <figcaption>{product.model}<span>{product.type}</span></figcaption>
        </figure>
      ))}
      <p className="s1-hardware-showcase-note">Original manufacturer images. Availability and specification confirmed by quotation.</p>
    </div>
  );
}

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
  const category = product.model === "SC780" ? "bodycam" : /FM[BC]920/.test(product.model) ? "tracking" : "radio";
  const selectedProduct = product.type === "Service" ? "PTT platform + SIM only (I have radios)" : product.quoteOption ?? product.model;
  const quoteHref = `/radios-equipment?${new URLSearchParams({ category, product: selectedProduct })}#quote`;
  return (
    <article className="hardware-card card relative flex h-full flex-col overflow-hidden">
      {product.image ? <div className="relative aspect-[4/3] s1-product-well well">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 85vw"
            quality={90}
            className="object-contain p-6 sm:p-8"
            style={{ ["--bounds" as string]: product.image.bounds }}
          />
        <span className="glass-light absolute left-3 top-3 rounded-full px-3 py-1">
          <Status kind={product.availability === "coming_soon" ? "soon" : "quote"}>{availabilityLabel[product.availability ?? "by_quote"]}</Status>
        </span>
      </div> : compact ? (
        <div className="px-5 pt-5">
          <Status kind={product.availability === "coming_soon" ? "soon" : "quote"}>{availabilityLabel[product.availability ?? "by_quote"]}</Status>
        </div>
      ) : (
        // No verified manufacturer image yet: a typographic well of the same proportions, never a stand-in
        // photograph of a different device (DR-006), so the card keeps its shape beside its neighbours (SW-02).
        <div className="relative aspect-[4/3] s1-product-well well hardware-well-typographic flex flex-col items-center justify-center p-6 text-center">
          <span className="glass-light absolute left-3 top-3 rounded-full px-3 py-1">
            <Status kind={product.availability === "coming_soon" ? "soon" : "quote"}>{availabilityLabel[product.availability ?? "by_quote"]}</Status>
          </span>
          <span className="t-h3 text-ink">{product.manufacturer ? product.manufacturer + " " : ""}{product.model}</span>
          <span className="t-small mt-2 text-ink-2">
            {product.type === "Service" ? "A monthly service, set up on your radios" : "The exact variant and its photograph are confirmed in your quote"}
          </span>
        </div>
      )}
      <div className={"flex flex-1 flex-col " + (compact ? "p-5" : "p-6 sm:p-7")}>
        <p className="t-small font-semibold text-accent">
          {product.manufacturer ? product.manufacturer + " · " : ""}
          {product.type}
        </p>
        <Heading className="t-h3 mt-2">
          {product.model}
        </Heading>
        <p className="t-small mt-3 text-ink">{product.role}</p>
        <p className="t-small mt-1 text-ink-2">{product.detail}</p>
        {product.specs && !compact ? (
          <div className="hardware-specs mt-4">
            <dl className="m-0 grid gap-1 t-small">
              {product.specs.items.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-2">
                  <dt className="text-ink-2">{label}</dt>
                  <dd className="m-0 text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="t-caption mt-2 text-ink-2">
              Manufacturer specification: {product.specs.sourceUrl ? <a href={product.specs.sourceUrl} rel="noopener" className="link-inline">{product.specs.source}</a> : product.specs.source}.{product.availability === "coming_soon" ? " Confirmed again before it can be supplied." : " Your quote confirms the supplied variant."}
            </p>
          </div>
        ) : null}
        <Link href={quoteHref} className="link-arrow mt-auto pt-5 text-accent">
          {product.availability === "coming_soon" ? "Register interest" : "Request a quote"}<span className="sr-only"> for {product.model}</span> <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/**
 * Horizontal hardware rail: native scroll-snap, so it swipes naturally on
 * touch and scrolls with a trackpad; no scroll hijacking.
 */
export function HardwareRail({ products }: { products: ReadonlyArray<CatalogueProduct> }) {
  return (
    <ul
      aria-label="Rental hardware"
      className="hardware-rail relative m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pb-4"
    >
      {products.map((product) => (
        <li key={product.model} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-3rem)/4.35)]">
          <HardwareCard product={product} compact />
        </li>
      ))}
    </ul>
  );
}
