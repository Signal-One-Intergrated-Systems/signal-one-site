import type { Metadata } from "next";
import LandingPage from "../components/LandingPage";
import { ProductWindow } from "../components/ProductProof";
import { ButtonLink } from "../components/ui";
import { proofViews } from "../lib/productProof";

export const metadata: Metadata = {
  title: "Guard Patrol Software for Security Companies",
  description:
    "QR and NFC checkpoint patrols that keep recording offline, with missed and late checkpoints in proof of service. Signal One Guard is R2 per guard per day, excl. VAT.",
  alternates: { canonical: "/guard-patrol-software" },
};

const proof = proofViews.find((view) => view.id === "proof")!;

export default function GuardPatrolSoftwarePage() {
  return (
    <LandingPage
      kicker="Guard patrol software"
      title="Prove the patrol was walked."
      lead="Signal One Guard turns each patrol into a record: QR or NFC checkpoints on the route, scanned on the guard's own phone or an authorised Central Device. If signal drops, the patrol keeps recording and syncs when it is back."
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
      aside={<ProductWindow screen={proof.screen} shot={proof.shots[0]} />}
      capabilitiesTitle="What a patrol gives you"
      capabilities={[
        ["QR or NFC checkpoints", "Set up the checkpoints for each site. Guards scan each one on the route."],
        ["Works offline", "Scans, clock events, SOS, incidents and occurrence entries queue on the phone and sync when signal returns."],
        ["Missed and late checkpoints", "They show up in proof of service, with the reason."],
        ["Incidents as they happen", "Log an incident from the patrol into the occurrence book instead of writing it up afterwards."],
        ["SOS from the route", "One press sends an alert to the control-room queue, with the guard's last known position."],
        ["Evidence your client can see", "Client users see patrol and checkpoint evidence for their own sites and can generate proof-of-service reports themselves."],
      ]}
      stepsTitle="From route to proof"
      steps={[
        ["Set up the route", "Add the site's checkpoints, QR or NFC."],
        ["The guard walks it", "Scans each checkpoint on their own phone or an authorised Central Device."],
        ["Signal drops, nothing is lost", "The patrol keeps recording and syncs when signal is back."],
        ["Supervisors see what needs action", "Late patrols and SOS wait for action in the supervisor's list and the control room."],
        ["The proof is generated", "Each scheduled service is marked proven, partly proven, unresolved or not proven, with the reason. The screenshot above is a real record from our demo environment; the data is synthetic."],
      ]}
      limits={[
        "Live patrol progress, a live map and clock-in status for client users are coming soon. Today clients see patrol and checkpoint evidence and proof-of-service reports.",
        "Signal One records the scans it receives. It does not replace a site's procedures or a supervisor's judgement.",
      ]}
      closing="Patrols that leave a record."
      related={[
        ["/guard-attendance-software", "Guard attendance and clock-in"],
        ["/solutions/security", "The Signal One Security platform"],
        ["/pricing", "Pricing: R2 per guard per day"],
      ]}
    />
  );
}
