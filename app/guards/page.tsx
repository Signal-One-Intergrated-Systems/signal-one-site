import type { Metadata } from "next";
import Link from "next/link";
import MarketplacePreview from "../components/MarketplacePreview";

export const metadata: Metadata = {
  title: "Guard Marketplace",
  description: "Discover verified security personnel through the Signal One Guard Marketplace.",
};

export default function GuardsPage() {
  return (
    <main className="min-h-screen bg-[#080d13] px-5 pb-24 pt-36 text-white md:pt-44">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-10 border-b border-white/10 pb-14 xl:grid-cols-[1fr_.65fr] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Guard Marketplace</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-.04em] md:text-6xl">Find security personnel connected to the operation.</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/55">
              The public marketplace is a safe discovery layer. The deeper staffing workflow lives inside Guard Admin, where companies can match personnel to real sites, posts and requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Link href="/get-started" className="rounded-full bg-[#39bdf8] px-5 py-3 text-sm font-semibold text-[#061019]">I need guards</Link>
            <Link href="/guards/join" className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/75">Join marketplace</Link>
          </div>
        </div>

        <section className="py-12">
          <MarketplacePreview limit={18} />
        </section>

        <section className="grid gap-4 border-t border-white/10 pt-12 lg:grid-cols-3">
          {[
            ["One marketplace", "The website and Guard Admin consume the same marketplace source rather than maintaining separate guard lists."],
            ["Privacy bounded", "The public site receives a deliberately sanitised projection, not Guard personnel records."],
            ["Operational matching", "Guard Admin can evolve from browse-and-shortlist to matching against actual posts, grades, location and availability."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[.025] p-6">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
