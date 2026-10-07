import Link from "next/link";
import SignalOneLogo from "./brand/SignalOneLogo";

const groups = [
  {
    title: "Signal One Security",
    links: [
      ["/solutions/security", "Platform"],
      ["/guard-marketplace", "Guard Marketplace"],
      ["/radios-equipment", "Radios & Tracking"],
      ["/guard-patrol-software", "Guard patrol software"],
      ["/guard-attendance-software", "Guard attendance and clock-in"],
      ["/ptt-radio-rental", "PTT radio rental"],
      ["/pricing", "Pricing"],
    ],
  },
  {
    title: "Get started",
    links: [
      ["/#product", "See the product"],
      ["/contact", "Talk to Signal One"],
      ["/get-started", "Start company onboarding"],
    ],
  },
  {
    title: "People",
    links: [
      ["/guards", "For security officers"],
      ["/guards/join", "Create a guard profile"],
      ["/join/sales", "Careers at Signal One"],
    ],
  },
  {
    title: "Trust",
    links: [
      ["/security-trust", "Security & trust"],
      ["/popia", "POPIA & data handling"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="surface-base border-t border-line-dark">
      <div className="wrap grid gap-12 py-14 md:py-16 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <SignalOneLogo size={24} tone="dark" descriptorMin={11} />
          <p className="t-small measure-tight mt-6 text-text-inv-2">
            Signal One Security is the operating system for South African security companies: sites, shifts, patrols,
            control room and client proof of service.
          </p>
          <p className="t-body mt-6">
            <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold">
              sales@signalone.co.za
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="font-sans text-[0.9375rem] font-semibold text-text-inv">{group.title}</h2>
              <ul className="m-0 mt-3 list-none p-0">
                {group.links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex min-h-[44px] items-center text-[0.9375rem] text-text-inv-2 hover:text-text-inv hover:underline hover:underline-offset-4"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-line-dark py-6 text-[0.875rem] text-text-inv-2 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Signal One: Integrated Systems. South Africa.</span>
        <span>Prices exclude VAT unless stated.</span>
      </div>
    </footer>
  );
}
