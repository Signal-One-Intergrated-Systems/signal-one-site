/**
 * Real Signal One Guard screens, captured from the controlled demo
 * environment. All names, sites and records are synthetic test data.
 * Crops exclude navigation chrome and were checked for real names and
 * phone numbers. Source captures live in git history (pre-6173d28).
 */
import controlRoomDesktop from "../../public/images/product-proof/crops/control-room-desktop.webp";
import controlRoomMobile from "../../public/images/product-proof/crops/control-room-mobile.webp";
import operationDesktop from "../../public/images/product-proof/crops/operation-desktop.webp";
import operationMobile from "../../public/images/product-proof/crops/operation-mobile.webp";
import peopleDesktop from "../../public/images/product-proof/crops/people-access-desktop.webp";
import peopleMobile from "../../public/images/product-proof/crops/people-access-mobile.webp";
import proofDetailDesktop from "../../public/images/product-proof/crops/proof-detail-desktop.webp";
import proofDetailMobile from "../../public/images/product-proof/crops/proof-detail-mobile.webp";
import proofSummaryDesktop from "../../public/images/product-proof/crops/proof-summary-desktop.webp";
import proofSummaryMobile from "../../public/images/product-proof/crops/proof-summary-mobile.webp";
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
    id: "operation",
    tab: "My operation",
    screen: "My operation",
    title: "Which posts are short, who is on duty, what needs you now.",
    body: "The supervisor's day in one screen: your sites, the roster against each post, shortfalls, and every SOS or late patrol waiting for action.",
    shots: [
      {
        desktop: operationDesktop,
        mobile: operationMobile,
        alt: "Signal One Guard My operation screen showing a site summary, a roster with posts short by one guard, and a Needs you list of unresolved SOS alerts",
      },
    ],
  },
  {
    id: "control",
    tab: "Control room",
    screen: "Control room",
    title: "Every SOS in a queue, with acknowledge, navigate and resolve.",
    body: "Live SOS first, then late SOS, incidents and anything else that needs action. Positions show on the map with their age.",
    shots: [
      {
        desktop: controlRoomDesktop,
        mobile: controlRoomMobile,
        alt: "Signal One Guard Control room queue listing live emergency alerts from a guard at a demo site, each with Navigate, Acknowledge and Resolve buttons, beside a map of last-known positions",
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
        desktop: proofSummaryDesktop,
        mobile: proofSummaryMobile,
        alt: "Signal One Guard Proof of service summary with a Generate report button and counts of services, proven, partly proven, unresolved and not proven",
      },
      {
        desktop: proofDetailDesktop,
        mobile: proofDetailMobile,
        alt: "Scheduled services listed with Proven, Not proven, Unresolved and Partly proven statuses and the reason for each, such as attendance verified at both ends",
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
