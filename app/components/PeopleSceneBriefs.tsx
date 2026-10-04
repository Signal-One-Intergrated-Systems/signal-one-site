import Image from "next/image";

const scenes = [
  {
    label: "Executive operations",
    title: "See the operation without living in the control room.",
    body:
      "Management needs a current operating picture across sites, people, incidents and service delivery — not another end-of-shift reconstruction.",
    image: "/images/industries/logistics.jpg",
    alt: "Operations leaders reviewing a tablet at a logistics site",
    position: "object-center",
  },
  {
    label: "Control room",
    title: "Work the exceptions while they are still actionable.",
    body:
      "Control-room teams need patrol, incident and site activity in the same working context so response does not depend on fragmented messages.",
    image: "/images/industries/security.jpg",
    alt: "Security control-room operator working across monitoring screens",
    position: "object-center",
  },
  {
    label: "Field supervision",
    title: "Keep supervisors connected to the site reality.",
    body:
      "Field leaders can verify coverage, coordinate people and act on exceptions while staying close to the work happening on site.",
    image: "/images/logistics.jpg",
    alt: "Field supervisor using a radio inside an operational warehouse",
    position: "object-center",
  },
] as const;

export default function PeopleSceneBriefs() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {scenes.map((item) => (
        <article
          key={item.label}
          className="group relative min-h-[430px] overflow-hidden rounded-[18px] border border-white/12 bg-[#0A0D12] shadow-[0_24px_70px_rgba(0,0,0,.35)]"
        >
          <Image
            src={item.image}
            alt={item.alt}
            fill
            className={"object-cover transition duration-700 [transition-timing-function:var(--s1-ease)] group-hover:scale-[1.035] " + item.position}
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.06)_18%,rgba(10,13,18,.20)_45%,rgba(10,13,18,.94)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{item.label}</p>
            <h3 className="mt-3 max-w-md text-xl font-semibold tracking-[-.025em] text-white">{item.title}</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/62">{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
