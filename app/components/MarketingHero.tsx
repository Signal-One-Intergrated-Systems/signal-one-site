import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function MarketingHero({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  primary,
  secondary,
  meta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  meta?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] shadow-[var(--s1-shadow-panel)]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="-z-20 object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,13,18,.98)_0%,rgba(10,13,18,.94)_47%,rgba(10,13,18,.58)_78%,rgba(10,13,18,.30)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(14,165,233,.18),transparent_30%)]" />

      <div className="flex min-h-[520px] max-w-4xl flex-col justify-end p-7 md:min-h-[600px] md:p-12 lg:p-14">
        <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[.98] tracking-[-.04em] text-white sm:text-5xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/64 md:text-lg md:leading-8">
          {body}
        </p>

        {primary || secondary ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {primary ? (
              <Link href={primary.href} className="s1-primary-action px-6 py-3 text-sm font-semibold">
                {primary.label}
              </Link>
            ) : null}
            {secondary ? (
              <Link href={secondary.href} className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                {secondary.label}
              </Link>
            ) : null}
          </div>
        ) : null}

        {meta ? <div className="mt-8 border-t border-white/10 pt-5">{meta}</div> : null}
      </div>
    </section>
  );
}
