/**
 * Real Signal One Guard screens, captured from the controlled demo
 * environment. All names, sites and records are synthetic test data.
 * Crops exclude navigation chrome and were checked for real names and
 * phone numbers. Regions were chosen to avoid test-data labels ("Smoke …",
 * raw enum codes); nothing inside a screenshot is edited. The "My operation"
 * and proof-detail views are not shown because no region of them is clean:
 * see "Product capture" in docs/PHOTOGRAPHY_BRIEF.md. Source captures live in
 * git history (pre-6173d28).
 */
import controlRoomDesktop from "../../public/images/product-proof/crops/control-room-desktop.webp";
import controlRoomMobile from "../../public/images/product-proof/crops/control-room-mobile.webp";
import peopleDesktop from "../../public/images/product-proof/crops/people-access-desktop.webp";
import peopleMobile from "../../public/images/product-proof/crops/people-access-mobile.webp";
import proofRecordDesktop from "../../public/images/product-proof/crops/proof-record-desktop.webp";
import proofRecordMobile from "../../public/images/product-proof/crops/proof-record-mobile.webp";
import type { StaticImageData } from "next/image";

export type ProofShot = {
  desktop: StaticImageData;
  mobile: StaticImageData;
  alt: string;
};

export type ProofView = {
  id: string;
  tab: string;
  screen: string;
  title: string;
  body: string;
  shots: ProofShot[];
};

export const proofViews: ProofView[] = [
  {
    id: "control",
    tab: "Control room",
    screen: "Control room",
    title: "Every SOS with acknowledge, navigate and resolve.",
    body: "The control room acknowledges, navigates to and resolves each SOS, and every step is recorded.",
    shots: [
      {
        desktop: controlRoomDesktop,
        mobile: controlRoomMobile,
        alt: "Signal One Guard Control room: a live Emergency alert from a guard at a demo site with Navigate, Acknowledge and Resolve buttons",
      },
    ],
  },
  {
    id: "proof",
    tab: "Proof of service",
    screen: "Proof of service",
    title: "What was scheduled, what happened, and what can be proven.",
    body: "Each scheduled service is marked proven, partly proven, unresolved or not proven, with the reason. Generate a report for the period your client asks about.",
    shots: [
      {
        desktop: proofRecordDesktop,
        mobile: proofRecordMobile,
        alt: "Signal One Guard Proof of service record marked Proven, with the attendance and checkpoint line, the reason attendance was verified, and an Evidence button",
      },
    ],
  },
  {
    id: "people",
    tab: "People & access",
    screen: "People and access",
    title: "Decide who sees what, and switch people off without losing history.",
    body: "Company admins invite supervisors and limit each one to the sites ticked for them. Deactivating someone ends their access within seconds; nothing they did is deleted.",
    shots: [
      {
        desktop: peopleDesktop,
        mobile: peopleMobile,
        alt: "Signal One Guard People and access screen listing a demo company administrator and supervisors, each with Sites and Deactivate buttons",
      },
    ],
  },
];
