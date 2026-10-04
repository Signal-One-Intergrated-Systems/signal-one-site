import type { Metadata } from "next";
import OnboardingJourney, {
  type JourneyStep,
  type JourneyWorld,
} from "../components/OnboardingJourney";

export const metadata: Metadata = {
  title: "Onboard your security company",
  description: "Start your Signal One company onboarding journey.",
};

const world: JourneyWorld = {
  kind: "client",
  storageKey: "signal-one-client-onboarding-v2",
  badge: "Company onboarding",
  welcomeTitle: "Build your operation with Signal One.",
  welcomeBody:
    "A guided setup for security companies moving from first conversation to an operational Signal One environment. We will collect only what is needed to understand your company, footprint and priorities.",
  welcomePoints: [
    "Introduce your company and primary contact.",
    "Tell us the scale and shape of your security operation.",
    "Define what Signal One should help you improve first.",
  ],
  image: "/images/industries/security.jpg",
  imageAlt: "Security operations environment",
  accent: "#0EA5E9",
  accentRgb: "14,165,233",
  completionTitle: "Your Signal One onboarding has started.",
  completionBody:
    "Your company profile is now in the Signal One onboarding process. The next step is verification and operational setup.",
  completionHref: "/solutions/security",
  completionCta: "Explore Signal One Guard",
};

const steps: JourneyStep[] = [
  {
    id: "company",
    eyebrow: "01 · Company",
    title: "Tell us who you operate as.",
    body: "Start with the legal and trading identity we should use for your onboarding.",
    fields: [
      { name: "companyName", label: "Company name", required: true, placeholder: "ABC Security (Pty) Ltd" },
      { name: "registrationNumber", label: "Company registration number", placeholder: "Optional at this stage" },
    ],
  },
  {
    id: "contact",
    eyebrow: "02 · Contact",
    title: "Who should Signal One work with?",
    body: "This person becomes our primary onboarding contact.",
    fields: [
      { name: "contactName", label: "Primary contact", required: true, placeholder: "Full name" },
      { name: "email", label: "Business email", type: "email", required: true, placeholder: "name@company.co.za" },
      { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
    ],
  },
  {
    id: "operation",
    eyebrow: "03 · Operation",
    title: "Show us the shape of your operation.",
    body: "A few scale signals help us prepare the right onboarding path.",
    fields: [
      {
        name: "province",
        label: "Primary operating province",
        type: "select",
        required: true,
        options: [
          "Gauteng",
          "Western Cape",
          "KwaZulu-Natal",
          "Eastern Cape",
          "Free State",
          "Limpopo",
          "Mpumalanga",
          "North West",
          "Northern Cape",
          "Multiple provinces",
        ],
      },
      { name: "guardCount", label: "Approximate guard count", type: "number", placeholder: "e.g. 120" },
      { name: "siteCount", label: "Approximate site count", type: "number", placeholder: "e.g. 18" },
    ],
  },
  {
    id: "needs",
    eyebrow: "04 · Priorities",
    title: "What needs to work better first?",
    body: "Focus on the operational outcome, not the technology. We will map the right Signal One capability to it.",
    fields: [
      {
        name: "need",
        label: "Your priority",
        type: "textarea",
        required: true,
        placeholder:
          "For example: stronger control-room visibility, verified patrols, better post coverage, proof of service, devices or communications.",
      },
    ],
  },
  {
    id: "review",
    eyebrow: "05 · Review",
    title: "Confirm your onboarding profile.",
    body: "Check the information before sending it to Signal One.",
    review: true,
  },
];

export default function GetStartedPage() {
  return <OnboardingJourney world={world} steps={steps} />;
}
