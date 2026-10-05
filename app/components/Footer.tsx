import Link from "next/link";

const groups = [
  {
    title: "Evaluate Signal One",
    links: [
      ["/tour", "Product tour"],
      ["/solutions/security", "Security operations"],
      ["/pricing", "Packages & pricing"],
      ["/trust", "Trust & deployment"],
      ["/insights", "Insights"],
    ],
  },
  {
    title: "Security workflows",
    links: [
      ["/solutions/security/guard-management", "Guard management"],
      ["/solutions/security/patrol-verification", "Patrol verification"],
      ["/solutions/security/control-room", "Control room"],
      ["/solutions/security/client-proof", "Client proof"],
    ],
  },
  {
    title: "Connected operations",
    links: [
      ["/marketplace", "Marketplace"],
      ["/devices", "Devices"],
      ["/connectivity", "Connectivity"],
      ["/platforms", "Platforms"],
    ],
  },
  {
    title: "Work with Signal One",
    links: [
      ["/guards", "For guards"],
      ["/guards/join", "Guard opportunities"],
      ["/join/sales", "Join Signal One Sales"],
      ["/contact", "Contact"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--s1-deep)] px-5 py-14 text-white">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.9fr_2.1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-[#0EA5E9]/40">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9] shadow-[0_0_20px_rgba(14,165,233,.65)]" />
            </span>
            <p className="text-base font-semibold tracking-[.16em]">
              SIGNAL <span className="text-[#0EA5E9]">ONE</span>
            </p>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/52">
            Security operations software for South African guarding companies, with connected communications, devices and connectivity when the operation needs them.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tour" className="s1-primary-action inline-flex px-5 py-2.5 text-sm font-semibold">
              Take product tour
            </Link>
            <Link href="/contact?intent=demo" className="s1-secondary-action inline-flex px-5 py-2.5 text-sm font-semibold">
              Book demo
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="s1-mono text-[10px] font-semibold text-white/34">{group.title}</h3>
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

      <div className="mx-auto mt-12 flex max-w-[90rem] flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/34 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Signal One Integrated Systems.</span>
        <span className="s1-mono text-[9px]">South Africa</span>
      </div>
    </footer>
  );
}
