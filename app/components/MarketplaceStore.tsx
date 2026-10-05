"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  marketplaceProducts,
  type MarketplaceMode,
  type MarketplaceProduct,
} from "../data/marketplace";

type CartLine = {
  productId: string;
  mode: MarketplaceMode;
  quantity: number;
};

const categories = ["All", "Radios", "Connectivity", "Sensors", "Platforms"] as const;

function offerFor(product: MarketplaceProduct, mode: MarketplaceMode) {
  return product.offers.find((offer) => offer.mode === mode) || product.offers[0];
}

export default function MarketplaceStore() {
  const reducedMotion = useReducedMotion();
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [modeByProduct, setModeByProduct] = useState<Record<string, MarketplaceMode>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!cartOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartOpen]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return marketplaceProducts.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const queryMatch =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  function selectedMode(product: MarketplaceProduct) {
    return modeByProduct[product.id] || product.offers[0].mode;
  }

  function add(product: MarketplaceProduct) {
    const mode = selectedMode(product);
    setCart((current) => {
      const existing = current.find(
        (line) => line.productId === product.id && line.mode === mode,
      );
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { productId: product.id, mode, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function adjust(line: CartLine, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === line.productId && item.mode === line.mode
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const motionTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[18px] border border-white/9 bg-white/[.03] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={
                  "rounded-[10px] border px-4 py-2 text-xs font-semibold transition " +
                  (category === item
                    ? "border-[#0EA5E9]/40 bg-[#0EA5E9]/12 text-[#7DD3FC]"
                    : "border-white/9 bg-white/[.025] text-white/48 hover:border-white/18 hover:text-white/78")
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <label className="min-w-0 flex-1 md:w-72">
              <span className="sr-only">Search marketplace</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Signal One…"
                className="h-11 w-full rounded-full border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-[#0EA5E9]/45"
              />
            </label>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-haspopup="dialog"
              aria-controls="signal-one-quote-basket"
              aria-expanded={cartOpen}
              className="relative h-11 rounded-[10px] border border-white/12 bg-white/[.04] px-5 text-sm font-semibold text-white/75 transition hover:bg-white/[.08] hover:text-white"
            >
              Cart
              {cartCount > 0 ? (
                <span className="ml-2 rounded-[8px] bg-[#0EA5E9] px-2 py-0.5 text-[10px] text-[#061019]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[18px] border border-white/9 bg-white/[.025] p-10 text-center text-sm text-white/45">
            No Signal One products match that search.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, index) => {
              const mode = selectedMode(product);
              const offer = offerFor(product, mode);
              return (
                <motion.article
                  key={product.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...motionTransition,
                    delay: reducedMotion ? 0 : Math.min(index * 0.045, 0.24),
                  }}
                  whileHover={reducedMotion ? undefined : { y: -5 }}
                  className="group overflow-hidden rounded-[18px] border border-white/9 bg-[#0A0D12] shadow-[0_24px_70px_rgba(0,0,0,.28)]"
                >
                  <div className="relative h-64 overflow-hidden bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,.08),transparent_48%),#0a1017]">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      className="object-contain p-8 transition duration-700 ease-out group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                      <span className="rounded-[10px] border border-white/10 bg-[#0A0D12]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-white/52 backdrop-blur-lg">
                        {product.category}
                      </span>
                      {product.badge ? (
                        <span className="rounded-[10px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-[#7DD3FC] backdrop-blur-lg">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold tracking-[-.02em]">{product.name}</h2>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-white/47">
                      {product.description}
                    </p>

                    {product.offers.length > 1 ? (
                      <div className="mt-5 flex rounded-[12px] border border-white/9 bg-black/20 p-1">
                        {product.offers.map((item) => (
                          <button
                            key={item.mode}
                            type="button"
                            onClick={() =>
                              setModeByProduct((current) => ({
                                ...current,
                                [product.id]: item.mode,
                              }))
                            }
                            aria-pressed={mode === item.mode}
                            className={
                              "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition " +
                              (mode === item.mode
                                ? "bg-white/10 text-white"
                                : "text-white/40 hover:text-white/70")
                            }
                          >
                            {item.mode}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 text-xs font-semibold uppercase tracking-[.14em] text-white/34">
                        {offer.mode}
                      </div>
                    )}

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[.15em] text-white/30">Price</p>
                        <p className="mt-1 font-semibold text-white/82">{offer.priceLabel}</p>
                      </div>
                      {product.action === "cart" ? (
                        <button
                          type="button"
                          onClick={() => add(product)}
                          className="rounded-[10px] bg-[#0EA5E9] px-5 py-2.5 text-xs font-semibold text-[#061019] transition hover:bg-[#7dd3fc] active:scale-[.98]"
                        >
                          Add to quote
                        </button>
                      ) : (
                        <Link
                          href="/contact"
                          className="rounded-[10px] border border-white/12 px-5 py-2.5 text-xs font-semibold text-white/76 transition hover:bg-white/6 hover:text-white"
                        >
                          Request quote
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cartOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close quote basket"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={motionTransition}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              id="signal-one-quote-basket"
              role="dialog"
              aria-modal="true"
              aria-labelledby="signal-one-quote-basket-title"
              initial={reducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reducedMotion ? undefined : { x: "100%" }}
              transition={motionTransition}
              className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-white/10 bg-[#0A0D12]/96 p-5 shadow-[-30px_0_100px_rgba(0,0,0,.45)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/9 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#7dd3fc]">Signal One Marketplace</p>
                  <h2 id="signal-one-quote-basket-title" className="mt-2 text-2xl font-semibold">Your quote basket</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close quote basket"
                  className="grid h-10 w-10 place-items-center rounded-[10px] border border-white/10 text-lg text-white/60 hover:bg-white/5 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto py-5">
                {cart.length === 0 ? (
                  <div className="rounded-[14px] border border-white/9 bg-white/[.025] p-6 text-sm leading-6 text-white/45">
                    Your quote basket is empty. Choose a product, then select Buy, Rent or Subscription where available.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((line) => {
                      const product = marketplaceProducts.find((item) => item.id === line.productId);
                      if (!product) return null;
                      const offer = offerFor(product, line.mode);
                      return (
                        <div key={line.productId + line.mode} className="rounded-[14px] border border-white/9 bg-white/[.03] p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="mt-1 text-xs text-white/38">{line.mode} · {offer.priceLabel}</p>
                            </div>
                            <div className="flex items-center gap-2 rounded-[10px] border border-white/9 px-2 py-1">
                              <button type="button" onClick={() => adjust(line, -1)} className="grid h-7 w-7 place-items-center text-white/60">−</button>
                              <span className="min-w-5 text-center text-xs tabular-nums">{line.quantity}</span>
                              <button type="button" onClick={() => adjust(line, 1)} className="grid h-7 w-7 place-items-center text-white/60">+</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-white/9 pt-5">
                <p className="text-xs leading-5 text-white/34">
                  Final pricing, rental terms, subscriptions, stock and delivery are confirmed by Signal One after the configured quote request is reviewed.
                </p>
                <Link
                  href={cart.length ? "/contact" : "/marketplace"}
                  onClick={() => setCartOpen(false)}
                  className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-[#061019]"
                >
                  {cart.length ? "Request configured quote" : "Continue shopping"}
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
