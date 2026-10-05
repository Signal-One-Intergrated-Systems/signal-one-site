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
    title: "Next steps",
    links: [
      ["/#proof", "See Signal One in action"],
      ["/get-started", "Company onboarding"],
      ["/contact", "Request a consultation"],
      ["/join/sales", "Sales careers"],
    ],
  },
  {
    title: "Legal & data",
    links: [
      ["/privacy", "Privacy"],
      ["/popia", "POPIA"],
      ["/data-handling", "Data handling"],
      ["/terms", "Terms"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0F131A] px-5 py-10 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-8 xl:grid-cols-[1.05fr_1.45fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-[#0EA5E9]/40">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9] shadow-[0_0_18px_rgba(14,165,233,.5)]" />
            </span>
            <p className="text-base font-semibold tracking-[.15em]">SIGNAL <span className="text-[#0EA5E9]">ONE</span></p>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
            Guard operations, client proof and field equipment for growing South African security companies.
          </p>

          <div className="mt-6 grid gap-2 text-sm">
            <a href="tel:+27100231810" className="text-white/68 transition hover:text-[#7DD3FC]">Call · +27 10 023 1810</a>
            <a href="https://wa.me/27606335870" className="text-white/68 transition hover:text-[#7DD3FC]">WhatsApp · +27 60 633 5870</a>
            <a href="mailto:sales@signalone.co.za" className="text-white/68 transition hover:text-[#7DD3FC]">Email · sales@signalone.co.za</a>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/#proof" className="s1-primary-action px-5 py-2.5 text-sm font-semibold">See Signal One in action</Link>
            <Link href="/contact" className="s1-secondary-action px-5 py-2.5 text-sm font-semibold">Request consultation</Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="s1-mono font-semibold text-white/55">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={href + label}>
                    <Link href={href} className="text-sm text-white/64 transition duration-200 hover:text-[#38BDF8]">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1440px] gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-white/58 lg:grid-cols-[1.4fr_.6fr]">
        <span>
          Signal One is the trading brand of Lancesat Suppliers (Pty) Ltd · Reg 2019/543402/07 · VAT 4490314061 ·
          340 Pretoria Avenue, Ferndale, Randburg, Gauteng, 2194, South Africa.
        </span>
        <span className="lg:text-right">© {new Date().getFullYear()} Signal One · Prices shown excluding VAT where stated.</span>
      </div>
    </footer>
  );
}
