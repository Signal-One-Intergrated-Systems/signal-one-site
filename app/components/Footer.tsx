import Link from "next/link";

const groups = [
  {
    title: "For security companies",
    links: [
      ["/contact", "Book operational review"],
      ["/get-started", "Company onboarding"],
      ["/solutions/security", "Security operations"],
      ["/#proof", "See product proof"],
    ],
  },
  {
    title: "Equip & connect",
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
      ["/guards/join", "Guard onboarding"],
      ["/join/sales", "Join Signal One Sales"],
      ["/contact", "Contact"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[.07] bg-[#070b10] px-5 py-14 text-white">
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[1.15fr_2fr]">
        <div>
          <p className="text-lg font-semibold tracking-[.16em]">SIGNAL <span className="text-[#8bc0d7]">ONE</span></p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/48">
            Operational control, field evidence and client service for private security companies.
          </p>
          <Link href="/contact" className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#071018]">
            Book operational review
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[.18em] text-white/30">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/58 transition hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[92rem] flex-col gap-3 border-t border-white/[.07] pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Signal One Integrated Systems.</span>
        <span>South Africa</span>
      </div>
    </footer>
  );
}
