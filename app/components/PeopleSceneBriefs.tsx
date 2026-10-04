const briefs = [
  {
    label: "Executive operations",
    title: "Security company owner or operations director reviewing live operations",
    brief:
      "Subject: South African security-company owner or operations director. Setting: modern security operations office with large monitor showing abstract operational status. Mood: calm, serious, in control. Framing: cinematic 16:9, three-quarter profile, no looking at camera. Wardrobe: executive/business-casual appropriate to private security. No visible real brands, names or client data.",
  },
  {
    label: "Control room",
    title: "Operator working an active control desk",
    brief:
      "Subject: diverse professional control-room operator. Setting: realistic South African private-security control room, multiple screens with abstract maps and alerts. Mood: focused and composed, not dramatic. Framing: over-the-shoulder medium-wide shot, operator and screens both readable as context. No recognisable real people or real client information.",
  },
  {
    label: "Field supervision",
    title: "Supervisor checking coverage on site",
    brief:
      "Subject: security supervisor or site manager using a tablet. Setting: commercial or industrial property in South Africa. Mood: purposeful, routine, professional. Framing: environmental portrait with site context and device visible. Avoid posed handshakes, pointing at camera or exaggerated tactical styling.",
  },
] as const;

export default function PeopleSceneBriefs() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {briefs.map((item) => (
        <article
          key={item.label}
          className="relative min-h-[330px] overflow-hidden rounded-[1.8rem] border border-dashed border-white/14 bg-[linear-gradient(145deg,#121b24,#0b1118)] p-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(117,185,215,.11),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#75b9d7]">
                Image production brief
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-[-.025em]">{item.title}</h3>
            </div>
            <div className="mt-16 rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="text-xs leading-6 text-white/46">{item.brief}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
