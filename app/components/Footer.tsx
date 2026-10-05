import Link from "next/link";

const groups = [
  {
    title: "Platform",
    links: [
      ["/#platform", "How Signal One works"],
      ["/guard-marketplace", "Guard Marketplace"],
      ["/radios-equipment", "Radios & Equipment"],
      ["/pricing", "Guard-day pricing"],
    ],
  },
  {
    title: "Get started",
    links: [
      ["/get-started", "Choose your journey"],
      ["/contact", "Talk to Signal One"],
      ["/solutions/security", "Security operations"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0F131A] px-5 py-14 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-[#0EA5E9]/40">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9] shadow-[0_0_18px_rgba(14,165,233,.5)]" />
            </span>
            <p className="text-base font-semibold tracking-[.15em]">
              SIGNAL <span className="text-[#0EA5E9]">ONE</span>
            </p>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/52">
            One platform for security companies to win clients, hire guards, run operations and prove their service.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/get-started" className="s1-primary-action px-5 py-2.5 text-sm font-semibold">
              Get started
            </Link>
            <Link href="/contact" className="s1-secondary-action px-5 py-2.5 text-sm font-semibold">
              Talk to Signal One
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="s1-mono text-[9px] font-semibold text-white/34">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={href + label}>
                    <Link href={href} className="text-sm text-white/58 transition duration-200 hover:text-[#38BDF8]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/34 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Signal One.</span>
        <span>South Africa · Pricing shown excluding VAT where stated.</span>
      </div>
    </footer>
  );
}
