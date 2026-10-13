import Link from "next/link";
import { catalogue } from "../lib/catalogue";
import EquipmentFeature from "./EquipmentFeature";
import DeferredEquipmentGallery from "./DeferredEquipmentGallery";

const products = catalogue.flatMap((group) =>
  group.products
    .filter((product) => product.image)
    .map((product) => ({ ...product, categoryId: group.id })),
);

/** The first exact-model presentation is real HTML even without JavaScript. */
export default function EquipmentShowcase({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <DeferredEquipmentGallery compact={compact}>
      <div className="equipment-gallery">
        {!compact && (
          <div className="equipment-filters">
            <a href="#quote">Discuss your equipment needs</a>
          </div>
        )}
        <EquipmentFeature
          product={products[0]}
          controls={
            <div className="equipment-arrows">
              <Link
                prefetch={false}
                data-route-intent=""
                href="/radios-equipment#quote"
              >
                Explore all models →
              </Link>
            </div>
          }
        />
        <div className="equipment-selector" aria-label="Equipment enquiries">
          {products.map((product) => (
            <Link
              prefetch={false}
              data-route-intent=""
              key={product.model}
              href={
                "/radios-equipment?model=" +
                encodeURIComponent(product.model) +
                "#quote"
              }
            >
              <span>{product.manufacturer}</span>
              {product.model}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        {!compact && (
          <p className="t-caption text-text-2 mt-5">
            P30 Lite PoC, E600 PoC LTE and SC780 are also quoted below. Exact
            approved photographs are unavailable; no substitute models are
            shown.
          </p>
        )}
      </div>
    </DeferredEquipmentGallery>
  );
}
