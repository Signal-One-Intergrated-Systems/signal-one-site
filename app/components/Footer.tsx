import Link from "next/link";

const groups = [
  {
    title: "Start",
    links: [
      ["/get-started", "Onboard your company"],
      ["/join/sales", "Join Signal One Sales"],
      ["/guards/join", "Guard onboarding"],
    ],
  },
  {
    title: "Operate",
    links: [
      ["/solutions/security", "Security operations"],
      ["/guards", "For guards"],
      ["/platforms", "Platforms"],
    ],
  },
  {
    title: "Buy & connect",
    links: [
      ["/marketplace", "Marketplace"],
      ["/devices", "Devices"],
      ["/connectivity", "Connectivity"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070b10] px-5 py-14 text-white">
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="text-lg font-semibold tracking-[.16em]">SIGNAL <span className="text-[#39bdf8]">ONE</span></p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
            One Signal One ecosystem for security operations, sales, workforce workflows, devices and connected services.
          </p>
          <Link href="/get-started" className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#071018]">
            Start with Signal One
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[.22em] text-white/35">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/65 transition hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[92rem] flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Signal One Integrated Systems.</span>
        <span>South Africa</span>
      </div>
    </footer>
  );
}
