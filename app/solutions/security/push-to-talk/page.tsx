import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Push-to-Talk for Security Companies South Africa",
  description:
    "Signal One Critical Connect and compatible PoC radios support push-to-talk communications, dispatch, location and emergency workflows for distributed security teams.",
};

export default function SecurityPushToTalkPage() {
  return (
    <SecurityIntentPage
      eyebrow="Push-to-talk for security companies · South Africa"
      title="Connect distributed security teams without separating communications from operations."
      body="Signal One Critical Connect supports push-to-talk over cellular for distributed teams, with dispatch, location and emergency communication workflows and compatible Signal One PoC devices."
      image="/images/What-we-deliver/communications.jpg"
      imageAlt="Signal One push-to-talk communications devices"
      outcomeTitle="Treat field communications as part of the operating stack."
      outcomeBody="Security communications matter most when the device, dispatch workflow and wider operating environment fit together. Signal One can combine software, compatible PoC radios and managed connectivity as part of a connected-operations deployment."
      features={[
        { title: "Push-to-talk communications", body: "Support instant voice communication across compatible cellular-connected field devices." },
        { title: "Dispatch workflow", body: "Use a dispatch environment to coordinate distributed field teams rather than relying only on one-to-one calls." },
        { title: "Location & emergency context", body: "The Critical Connect public product includes location services and emergency-alarm workflows." },
        { title: "Compatible field devices", body: "Signal One offers PoC device options and managed connectivity alongside the platform." },
      ]}
      proofTitle="Communications can sit alongside the Guard operating layer."
      proofBody="Signal One's differentiation is the ability to evaluate communications, devices, connectivity and Guard operations as one field stack when that is useful for the deployment."
      proofImage="/images/platform/dispatch.jpg"
      proofImageAlt="Signal One dispatch platform for push-to-talk communications"
      faqs={[
        { question: "What is PoC push-to-talk?", answer: "Push-to-talk over cellular uses supported cellular connectivity and compatible devices to provide radio-style group communication through a managed platform." },
        { question: "Does Signal One offer radios as well as the platform?", answer: "Yes. The public catalogue includes compatible PoC device models and connectivity options alongside Critical Connect." },
        { question: "Can Signal One bridge traditional radio networks?", answer: "The public Critical Connect page describes RoIP gateway integration for existing DMR, TETRA or analogue radio networks. The exact integration scope should be confirmed for the deployment." },
        { question: "Is Critical Connect included in every Guard deployment?", answer: "No. Connected communications can be evaluated as an additional layer when the security operation requires it." },
      ]}
    />
  );
}
