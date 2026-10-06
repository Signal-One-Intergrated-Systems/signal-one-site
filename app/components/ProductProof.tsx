"use client";

import { getImageProps } from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { proofViews, type ProofShot } from "../lib/productProof";

function ratio(width: number, height: number) {
  return width + " / " + height;
}

/** Art-directed screenshot: a deliberate mobile crop below 768px, the wide crop above. */
export function ProofImage({ shot, priority = false }: { shot: ProofShot; priority?: boolean }) {
  const common = { alt: shot.alt, quality: 90, priority };
  const {
    props: { srcSet: desktopSrcSet, sizes: desktopSizes },
  } = getImageProps({ ...common, src: shot.desktop, sizes: "(min-width: 1280px) 1240px, 100vw" });
  const {
    props: mobileProps,
  } = getImageProps({ ...common, src: shot.mobile, sizes: "100vw" });
  const { srcSet: mobileSrcSet, style, ...img } = mobileProps;
  void style;

  return (
    <picture
      className="block"
      style={
        {
          "--ar-m": ratio(shot.mobile.width, shot.mobile.height),
          "--ar-d": ratio(shot.desktop.width, shot.desktop.height),
        } as React.CSSProperties
      }
    >
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={desktopSizes} />
      <img
        {...img}
        srcSet={mobileSrcSet}
        alt={shot.alt}
        className="block h-auto w-full aspect-[var(--ar-m)] md:aspect-[var(--ar-d)]"
      />
    </picture>
  );
}

export function ProductWindow({
  screen,
  children,
  className = "",
}: {
  screen: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={"m-0 " + className}>
      <div className="product-window">
        <div className="product-window-bar">
          <span className="font-semibold text-[#e7eaee]">Signal One Guard · {screen}</span>
          <span>Synthetic demo data</span>
        </div>
        {children}
      </div>
    </figure>
  );
}

export default function ProductProof({ initial = "operation" }: { initial?: string }) {
  const [active, setActive] = useState(initial);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, proofViews.findIndex((view) => view.id === active));
  const view = proofViews[index];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % proofViews.length;
    if (event.key === "ArrowLeft") next = (index - 1 + proofViews.length) % proofViews.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = proofViews.length - 1;
    setActive(proofViews[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Signal One Guard screens"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
      >
        {proofViews.map((item, i) => {
          const selected = item.id === view.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              id={"proof-tab-" + item.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={"proof-panel-" + item.id}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={
                "min-h-[48px] rounded-ui border px-4 text-[1rem] font-semibold transition-colors " +
                (selected
                  ? "border-ink bg-ink text-text-inv"
                  : "border-[#b9b2a6] bg-transparent text-text hover:bg-paper-2")
              }
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      <div
        key={view.id}
        id={"proof-panel-" + view.id}
        role="tabpanel"
        aria-labelledby={"proof-tab-" + view.id}
        className="animate-enter mt-8 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12"
      >
        <div className="lg:pt-2">
          <h3 className="t-h3">{view.title}</h3>
          <p className="t-body mt-4 text-text-2">{view.body}</p>
          <p className="t-caption mt-6 border-t border-line pt-4 text-text-2">
            Real Signal One Guard screen from our demo environment. Every name, site and record shown is synthetic.
          </p>
        </div>

        <ProductWindow screen={view.screen}>
          {view.shots.map((shot, i) => (
            <div key={i} className={i > 0 ? "border-t border-dashed border-[#3a414b]" : ""}>
              {i > 0 ? (
                <p className="bg-[#141619] px-4 py-2 text-[0.875rem] text-[#c6ccd4]">Further down the same screen</p>
              ) : null}
              <ProofImage shot={shot} />
            </div>
          ))}
        </ProductWindow>
      </div>
    </div>
  );
}
