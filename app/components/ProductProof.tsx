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
  } = getImageProps({ ...common, src: shot.desktop, sizes: "(min-width: 1280px) 1200px, 100vw" });
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

/**
 * Product frame: a browser frame from md up, a phone frame below.
 *
 * Width follows the capture: full container width (about 1200px) once real
 * 2x captures exist, and never more than a crop's native width. TODO(recapture): the current crops are the
 * largest clean regions of the test-tenant captures; replace them with
 * scripts/capture-product.mjs output once the demo tenant is on staging.
 */
export function ProductWindow({
  screen,
  shot,
  priority = false,
  className = "",
  flatOnMobile = false,
}: {
  screen: string;
  shot: ProofShot;
  priority?: boolean;
  className?: string;
  /** Below md: no phone frame, a plain header bar and the record at full width. */
  flatOnMobile?: boolean;
}) {
  // Never wider than the capture itself: no upscaling (brief §5, A6).
  const frameWidth = Math.min(1200, shot.desktop.width);
  const phoneWidth = Math.min(340, shot.mobile.width + 20);
  return (
    <figure className={"m-0 " + className} style={{ ["--frame-w" as string]: frameWidth + "px", ["--phone-w" as string]: phoneWidth + "px" }}>
      {/* Browser frame, md and up */}
      <div className="product-window mx-auto hidden w-full max-w-[var(--frame-w)] md:block">
        <div className="product-window-bar">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="block h-2.5 w-2.5 rounded-full bg-line-dark" />
            <i className="block h-2.5 w-2.5 rounded-full bg-line-dark" />
            <i className="block h-2.5 w-2.5 rounded-full bg-line-dark" />
          </span>
          <span className="font-semibold text-text-inv">Signal One Guard · {screen}</span>
          <span>Synthetic demo data</span>
        </div>
        <ProofImage shot={shot} priority={priority} />
      </div>
      {/* Below md: a flat record with a header bar, or the phone frame */}
      {flatOnMobile ? (
        <div className="md:hidden">
          <div className="product-window">
            <div className="product-window-bar">
              <span className="text-[0.75rem] font-semibold text-text-inv">Signal One Guard · {screen} · Synthetic demo data</span>
            </div>
            <ProofImage shot={shot} priority={priority} />
          </div>
        </div>
      ) : (
      <div className="md:hidden">
        <div className="phone-frame mx-auto w-full max-w-[var(--phone-w)]">
          <div className="phone-screen">
            <p className="flex justify-between px-3 pb-2 pt-3 text-[0.875rem] text-text-inv-3">
              <span className="font-semibold text-text-inv">{screen}</span>
              <span>Synthetic demo data</span>
            </p>
            <ProofImage shot={shot} priority={priority} />
          </div>
        </div>
      </div>
      )}
    </figure>
  );
}

export default function ProductProof({ initial = "control" }: { initial?: string }) {
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
                  ? "border-base bg-base text-text-inv"
                  : "border-line-strong bg-transparent text-text hover:bg-light-2")
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
        className="animate-enter mt-10"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-end lg:gap-16">
          <h3 className="t-h3 lg:text-[1.75rem]">{view.title}</h3>
          <div>
            <p className="t-body text-text-2">{view.body}</p>
            <p className="t-caption mt-3 text-text-2">
              Real Signal One Guard screen from our demo environment. Every name, site and record shown is synthetic.
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <ProductWindow screen={view.screen} shot={view.shots[0]} />
        </div>
      </div>
    </div>
  );
}
