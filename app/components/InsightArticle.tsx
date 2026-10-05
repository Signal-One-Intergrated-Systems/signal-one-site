import Link from "next/link";
import type { ReactNode } from "react";

export default function InsightArticle({
  eyebrow,
  title,
  dek,
  published,
  children,
  related,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  published: string;
  children: ReactNode;
  related: Array<{ href: string; label: string }>;
}) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: dek,
    datePublished: published,
    dateModified: published,
    author: {
      "@type": "Organization",
      name: "Signal One",
    },
    publisher: {
      "@type": "Organization",
      name: "Signal One",
    },
  };

  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <article className="mx-auto max-w-5xl">
        <header className="border-b border-white/10 pb-12">
          <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-.04em] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">{dek}</p>
          <p className="mt-6 text-xs text-white/32">Signal One point of view · {published}</p>
        </header>

        <div className="prose prose-invert max-w-none py-12 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-[-.03em] [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-base [&_p]:leading-8 [&_p]:text-white/58 [&_ul]:space-y-3 [&_li]:text-white/58 [&_strong]:text-white/86">
          {children}
        </div>

        <section className="mt-6 border-t border-white/10 pt-10">
          <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Related Signal One pages</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {related.map((item) => (
              <Link key={item.href} href={item.href} className="s1-secondary-action px-4 py-2.5 text-sm font-semibold">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[24px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/[.06] p-7 md:p-10">
          <p className="s1-mono text-[9px] font-semibold text-[#7DD3FC]">See the operating system</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em]">Move from the point of view to the product.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
            Take the self-guided Signal One Guard product tour, then use a live demo to test the workflow against your own sites, control room and client requirements.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tour" className="s1-primary-action px-6 py-3 text-sm font-semibold">Take product tour</Link>
            <Link href="/contact?intent=demo" className="s1-secondary-action px-6 py-3 text-sm font-semibold">Book demo</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
