import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { CatalogueProduct } from "../lib/catalogue";

export default function EquipmentFeature({
  product,
  index = 0,
  total = 3,
  controls,
}: {
  product: CatalogueProduct & { categoryId: string };
  index?: number;
  total?: number;
  controls?: ReactNode;
}) {
  return (
    <div className="equipment-feature">
      <div className="equipment-display">
        <p className="equipment-maker">
          {product.manufacturer}
          <span>{product.type}</span>
        </p>
        <span aria-hidden="true" className="equipment-model-backdrop">
          {product.model.replace("Hytera ", "")}
        </span>
        <div key={product.model} className="equipment-cutout">
          <Image
            src={product.image!.src}
            alt={product.image!.alt}
            fill
            sizes={
              product.categoryId === "radios"
                ? "(min-width: 1024px) 180px, 140px"
                : "(min-width: 1024px) 560px, 80vw"
            }
            quality={90}
            className="object-contain"
          />
        </div>
        <div className="equipment-display-bottom">
          <span>Manufacturer product image</span>
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="equipment-detail">
        <p className="t-kicker text-signal-ink">For the field · by quote</p>
        <h3 key={product.model}>{product.model}</h3>
        <p className="t-lead text-text-2">{product.role}</p>
        <p className="t-body text-text-2 mt-5">{product.detail}</p>
        <dl>
          <div>
            <dt>Deployment</dt>
            <dd>Specified for your sites</dd>
          </div>
          <div>
            <dt>Commercial terms</dt>
            <dd>
              {product.categoryId === "radios"
                ? "12, 24 or 36-month rental"
                : "Confirmed in your quote"}
            </dd>
          </div>
          <div>
            <dt>GUARD integration</dt>
            <dd>Device activation and tracking coming soon</dd>
          </div>
        </dl>
        <Link
          prefetch={false}
          data-route-intent=""
          href={
            "/radios-equipment?model=" +
            encodeURIComponent(product.model) +
            "#quote"
          }
          className="btn btn-primary"
        >
          Enquire about this model <span aria-hidden="true">→</span>
        </Link>
        {controls}
      </div>
    </div>
  );
}
