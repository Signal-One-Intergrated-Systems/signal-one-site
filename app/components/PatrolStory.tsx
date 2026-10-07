import Image from "next/image";
import { illustrativeCaption, photos } from "../lib/photos";
import { Kicker } from "./ui";

/**
 * Physical action → digital event → control room → proof (brief §7).
 * Real photography for the two physical moments; the two digital moments are
 * described in words, not drawn as a fake interface. Product screens join
 * here once they are captured from the synthetic demo tenant.
 */
const steps = [
  {
    stage: "Physical action",
    title: "The officer scans the checkpoint",
    body: "A QR code or NFC tag at each checkpoint on the route, scanned on the guard's own phone or an authorised Central Device.",
    photo: photos.guardPatrol,
  },
  {
    stage: "Digital event",
    title: "Signal One Guard records it",
    body: "The scan is recorded against the checkpoint and the patrol, with its time and GPS position. Scans taken without signal are saved on the phone and sent when it returns.",
    record: ["Checkpoint", "Patrol", "Time of scan", "GPS position"],
  },
  {
    stage: "Control room",
    title: "Supervisors see what needs action",
    body: "Late patrols and SOS wait for action in the supervisor's list and the control room. An SOS needs a mobile signal to reach the control room.",
    photo: photos.controlRoomTeam,
  },
  {
    stage: "Proof",
    title: "The client sees the proof",
    body: "Each scheduled service is marked proven, partly proven, unresolved or not proven, with the reason. Client users see it for their own sites.",
    record: ["Proven", "Partly proven", "Unresolved", "Not proven"],
  },
] as const;

export default function PatrolStory({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div>
      <ol className="reveal-group m-0 grid list-none gap-6 p-0 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="reveal flex flex-col" style={{ ["--reveal-delay" as string]: index * 120 + "ms" }}>
            <div className="flex items-center gap-3">
              <span className={"t-num text-[1.25rem] " + (dark ? "text-signal-400" : "text-signal-ink")}>{index + 1}</span>
              <span aria-hidden="true" className={"h-px flex-1 " + (dark ? "bg-line-dark" : "bg-line")} />
              <Kicker tone={tone} className="shrink-0">
                {step.stage}
              </Kicker>
            </div>
            <div className={"relative mt-4 aspect-[16/10] overflow-hidden rounded-card " + (dark ? "bg-raised" : "bg-light-2")}>
              {"photo" in step ? (
                <Image
                  src={step.photo.src}
                  alt={step.photo.alt}
                  fill
                  sizes="(min-width: 1280px) 320px, (min-width: 768px) 45vw, 100vw"
                  quality={80}
                  className="object-cover"
                />
              ) : (
                <dl aria-label={step.stage === "Proof" ? "Proof-of-service outcomes" : "What is recorded with each scan"} className="absolute inset-0 m-0 flex flex-col justify-center gap-2 p-5">
                  {step.record.map((field) => (
                    <div key={field} className={"flex items-center gap-3 border-b pb-2 last:border-0 " + (dark ? "border-line-dark" : "border-line")}>
                      <span aria-hidden="true" className={"h-1.5 w-1.5 rounded-full " + (dark ? "bg-signal-400" : "bg-signal-ink")} />
                      <dt className={"t-small font-semibold " + (dark ? "text-text-inv" : "text-text")}>{field}</dt>
                      <dd className="sr-only">{step.stage === "Proof" ? "possible outcome" : "recorded"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <h3 className="t-h4 mt-4">{step.title}</h3>
            <p className={"t-small mt-2 " + (dark ? "text-text-inv-2" : "text-text-2")}>{step.body}</p>
          </li>
        ))}
      </ol>
      <p className={"t-caption mt-6 " + (dark ? "text-text-inv-2" : "text-text-2")}>Photographs: {illustrativeCaption.toLowerCase()}.</p>
    </div>
  );
}
