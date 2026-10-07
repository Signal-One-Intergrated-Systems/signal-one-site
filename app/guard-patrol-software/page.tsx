import type { Metadata } from "next";
import LandingPage from "../components/LandingPage";
import PatrolStory from "../components/PatrolStory";
import { ButtonLink, FactPanel } from "../components/ui";
import { guardDayPricePhrase } from "../lib/pricing";

export const metadata: Metadata = {
  title: "Guard Patrol Software for Security Companies",
  description:
    "QR and NFC checkpoint patrols, with scans saved on the phone when signal drops, and missed and late checkpoints in proof of service. Signal One Guard is " + guardDayPricePhrase + ", excl. VAT.",
  alternates: { canonical: "/guard-patrol-software" },
};

export default function GuardPatrolSoftwarePage() {
  return (
    <LandingPage
      kicker="Guard patrol software"
      title="Prove the patrol was walked."
      lead="Signal One Guard turns each patrol into a record: QR or NFC checkpoints on the route, scanned on the guard's own phone or an authorised Central Device. Scans taken without signal are saved on the phone and sent when it returns."
      actions={
        <>
          <ButtonLink href="/contact" size="lg">
            Talk to Signal One
          </ButtonLink>
          <ButtonLink href="/solutions/security" variant="ghost-dark" size="lg">
            See the whole platform
          </ButtonLink>
        </>
      }
      aside={
        <FactPanel
          title="Signal One Guard · patrols"
          facts={[
            ["QR or NFC checkpoints", "Set per site; scanned on the route."],
            ["Time and GPS on every scan", "Recorded with the checkpoint and the patrol."],
            ["Missed and late checkpoints", "Shown in proof of service, with the reason."],
            ["Proof for the client", "Client users see the record for their own sites."],
          ]}
        />
      }
      story={
        <section className="surface-white section">
          <div className="wrap">
            <h2 className="t-h2 max-w-3xl">From the checkpoint to the client&apos;s report.</h2>
            <div className="mt-10">
              <PatrolStory />
            </div>
          </div>
        </section>
      }
      capabilitiesTitle="What a patrol gives you"
      capabilities={[
        ["QR or NFC checkpoints", "Set up the checkpoints for each site. Guards scan each one on the route."],
        ["Works offline", "Scans, clock events, incidents and occurrence entries are saved on the phone and sent when signal returns. SOS needs a mobile signal to reach the control room."],
        ["Missed and late checkpoints", "They show up in proof of service, with the reason."],
        ["Incidents as they happen", "Log an incident from the patrol into the occurrence book instead of writing it up afterwards."],
        ["SOS from the route", "One press sends an alert to the control room with the guard's position when the phone has a fix. It needs a mobile signal."],
        ["Evidence your client can see", "Client users see patrol and checkpoint evidence for their own sites and can generate proof-of-service reports themselves."],
      ]}
      stepsTitle="From route to proof"
      steps={[
        ["Set up the route", "Add the site's checkpoints, QR or NFC."],
        ["The guard walks it", "Scans each checkpoint on their own phone or an authorised Central Device."],
        ["Scans survive a dropped signal", "Checkpoint scans are saved on the phone and sent when signal returns."],
        ["Supervisors see what needs action", "Late patrols and SOS wait for action in the supervisor's list and the control room."],
        ["The proof is generated", "Each scheduled service is marked proven, partly proven, unresolved or not proven, with the reason."],
      ]}
      limits={[
        "Live patrol progress, a live map and clock-in status for client users are coming soon. Today clients see patrol and checkpoint evidence and proof-of-service reports.",
        "Signal One records the scans it receives. It does not replace a site's procedures or a supervisor's judgement.",
      ]}
      closing="Patrols that leave a record."
      related={[
        ["/guard-attendance-software", "Guard attendance and clock-in"],
        ["/solutions/security", "The Signal One Security platform"],
        ["/pricing", "Pricing: " + guardDayPricePhrase],
      ]}
    />
  );
}
