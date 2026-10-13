"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { catalogue } from "../lib/catalogue";

const available = catalogue.flatMap((group) =>
  group.products
    .filter((product) => product.image)
    .map((product) => ({
      ...product,
      category: group.category,
      categoryId: group.id,
    })),
);

/** Native buttons and touch-safe controls; only exact approved model imagery. */
export default function EquipmentGallery({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [category, setCategory] = useState("all");
  const [model, setModel] = useState(available[0].model);
  const products =
    category === "all"
      ? available
      : available.filter((item) => item.categoryId === category);
  const index = Math.max(
    0,
    products.findIndex((item) => item.model === model),
  );
  const product = products[index];
  function move(delta: number) {
    setModel(
      products[(index + delta + products.length) % products.length].model,
    );
  }
  return (
    <div className="equipment-gallery">
      {!compact && (
        <div
          className="equipment-filters"
          aria-label="Filter photographed equipment"
        >
          {[
            ["all", "All equipment"],
            ["radios", "Radios & PTT"],
            ["tracking", "Tracking"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              onClick={() => {
                setCategory(id);
                setModel(
                  (id === "all"
                    ? available
                    : available.filter((item) => item.categoryId === id))[0]
                    .model,
                );
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
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
              sizes="(min-width: 1024px) 600px, 90vw"
              quality={90}
              className="object-contain"
            />
          </div>
          <div className="equipment-display-bottom">
            <span>Manufacturer product image</span>
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(products.length).padStart(2, "0")}
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
            href={
              "/radios-equipment?model=" +
              encodeURIComponent(product.model) +
              "#quote"
            }
            className="btn btn-primary"
          >
            Enquire about this model <span aria-hidden="true">→</span>
          </Link>
          <div className="equipment-arrows">
            <button
              type="button"
              aria-label="Previous equipment model"
              onClick={() => move(-1)}
              disabled={products.length < 2}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next equipment model"
              onClick={() => move(1)}
              disabled={products.length < 2}
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div className="equipment-selector" aria-label="Choose equipment model">
        {products.map((item) => (
          <button
            key={item.model}
            type="button"
            aria-pressed={item.model === product.model}
            onClick={() => setModel(item.model)}
          >
            <span>{item.manufacturer}</span>
            {item.model}
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      {!compact && (
        <p className="t-caption text-text-2 mt-5">
          P30 Lite PoC, E600 PoC LTE and SC780 are also quoted below. Exact
          approved photographs are unavailable; no substitute models are shown.
        </p>
      )}
    </div>
  );
}
