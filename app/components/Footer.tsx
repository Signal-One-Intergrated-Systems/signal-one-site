import Link from "next/link";

const groups = [
  {
    title: "Platform",
    links: [
      ["/#platform", "How Signal One works"],
      ["/guard-marketplace", "Guard Marketplace"],
      ["/radios-equipment", "Radios & Tracking"],
      ["/pricing", "Guard-day pricing"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/get-started", "Start onboarding"],
      ["/contact", "Talk to Signal One"],
      ["/solutions/security", "Security operations"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
      ["/popia", "POPIA & data handling"],
      ["/security-trust", "Security & trust"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0F131A] px-5 py-10 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-[#0EA5E9]/40">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9] shadow-[0_0_18px_rgba(14,165,233,.5)]" />
            </span>
            <div>
              <p className="text-base font-semibold tracking-[.15em]">
                SIGNAL <span className="text-[#0EA5E9]">ONE</span>
              </p>
              <p className="s1-mono mt-1 text-[11px] text-white/68">Integrated Systems</p>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
            Signal One: Integrated Systems builds connected operating systems for real-world industries. This site is focused on security companies: Guard, hiring, radios, tracking and proof of service.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/#proof" data-analytics-event="footer_product_proof" data-analytics-label="Footer proof CTA" className="s1-primary-action px-5 py-2.5 text-sm font-semibold">
              See Signal One in action
            </Link>
            <Link href="/contact" data-analytics-event="contact_begin" data-analytics-label="Footer contact CTA" className="s1-secondary-action px-5 py-2.5 text-sm font-semibold">
              Talk to Signal One
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/70">
            Sales email: <a href="mailto:sales@signalone.co.za" className="font-semibold text-[#7DD3FC] hover:text-white">sales@signalone.co.za</a>
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="s1-mono text-[11px] font-semibold text-white/68">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={href + label}>
                    <Link href={href} className="text-sm text-white/72 transition duration-200 hover:text-[#38BDF8]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1440px] flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/66 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Signal One: Integrated Systems.</span>
        <span>South Africa · Pricing shown excluding VAT where stated.</span>
      </div>
    </footer>
  );
}
