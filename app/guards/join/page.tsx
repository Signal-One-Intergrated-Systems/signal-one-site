import type { Metadata } from "next";
import OnboardingJourney, {
  type JourneyStep,
  type JourneyWorld,
} from "../../components/OnboardingJourney";

export const metadata: Metadata = {
  title: "Guard onboarding",
  description: "Apply to join Signal One as a security officer.",
};

const world: JourneyWorld = {
  kind: "guard",
  storageKey: "signal-one-guard-onboarding-v2",
  badge: "Guard onboarding",
  welcomeTitle: "Be ready for the shift before you arrive on site.",
  welcomeBody:
    "Signal One Guard is built around real field work: assigned shifts, clock-in, patrols, QR or NFC checkpoint verification, incidents, SOS and operational history. Your onboarding starts with identity, registration and work readiness.",
  welcomePoints: [
    "Create your professional guard profile.",
    "Record your PSIRA registration and security experience.",
    "Tell us where and how you are ready to work.",
  ],
  image: "/images/security.jpg",
  imageAlt: "Security officer operating on site",
  accent: "#0EA5E9",
  accentRgb: "14,165,233",
  completionTitle: "Your guard application is ready for review.",
  completionBody:
    "Signal One will review your onboarding information before any operational access or assignment is created.",
  completionHref: "/guards",
  completionCta: "See Signal One for guards",
};

const steps: JourneyStep[] = [
  {
    id: "identity",
    eyebrow: "01 · Identity",
    title: "Tell us who you are.",
    body: "These are your onboarding contact details, not a public profile.",
    fields: [
      { name: "fullName", label: "Full name", required: true, placeholder: "Your full name" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
    ],
  },
  {
    id: "registration",
    eyebrow: "02 · Registration",
    title: "Record your PSIRA details.",
    body: "Signal One Guard uses registration status when determining operational eligibility.",
    fields: [
      { name: "psiraNumber", label: "PSIRA number", required: true, placeholder: "Registration number" },
      {
        name: "grade",
        label: "PSIRA grade",
        type: "select",
        required: true,
        options: ["Grade A", "Grade B", "Grade C", "Grade D", "Grade E", "Other / pending"],
      },
    ],
  },
  {
    id: "experience",
    eyebrow: "03 · Experience",
    title: "What work have you done?",
    body: "Focus on security environments, responsibilities and operational skills.",
    fields: [
      { name: "experienceYears", label: "Years of security experience", type: "number", placeholder: "e.g. 4" },
      {
        name: "skills",
        label: "Skills and experience",
        type: "textarea",
        required: true,
        placeholder: "Access control, patrol, CCTV, control room, armed response, retail, estates…",
      },
    ],
  },
  {
    id: "availability",
    eyebrow: "04 · Work readiness",
    title: "Where are you ready to work?",
    body: "Give us the area and your current availability so the right onboarding route can follow.",
    fields: [
      { name: "areas", label: "Preferred work areas", required: true, placeholder: "Randburg, Sandton, Midrand…" },
      {
        name: "availability",
        label: "Availability",
        type: "select",
        required: true,
        options: ["Available immediately", "Available within 2 weeks", "Available within 1 month", "Currently employed / exploring"],
      },
    ],
  },
  {
    id: "review",
    eyebrow: "05 · Review",
    title: "Confirm your guard application.",
    body: "Check your information before sending it to Signal One.",
    review: true,
  },
];

export default function GuardJoinPage() {
  return <OnboardingJourney world={world} steps={steps} />;
}
