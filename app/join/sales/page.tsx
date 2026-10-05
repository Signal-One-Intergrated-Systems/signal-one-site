import type { Metadata } from "next";
import OnboardingJourney, {
  type JourneyStep,
  type JourneyWorld,
} from "../../components/OnboardingJourney";
import { premiumImages } from "../../lib/premiumImages";

export const metadata: Metadata = {
  title: "Join Signal One Sales",
  description: "Apply for one of Signal One’s current internal sales representative vacancies.",
  robots: { index: false, follow: true },
};

const world: JourneyWorld = {
  kind: "sales",
  storageKey: "signal-one-sales-onboarding-v2",
  badge: "Signal One careers · 10 current sales vacancies",
  welcomeTitle: "Apply to work as a Signal One sales representative.",
  welcomeBody:
    "These are internal Signal One roles. Our customers provide their own sales teams; this application is only for candidates who want to work for Signal One. We are currently recruiting up to 10 sales representatives.",
  welcomePoints: [
    "Give us your basic contact and location information.",
    "Show us your B2B and security-industry experience.",
    "If shortlisted, continue to CV review and an interview slot when calendar availability is opened.",
  ],
  image: premiumImages.clientReporting,
  imageAlt: "Signal One commercial communications environment",
  accent: "#0EA5E9",
  accentRgb: "14,165,233",
  completionTitle: "Your Signal One Sales application is in.",
  completionBody:
    "If shortlisted, Signal One will move the application into CV review and offer an interview slot when administrator-approved calendar availability is open. Hiring, onboarding, training and Sales OS access follow only after approval.",
  completionHref: "/#platform",
  completionCta: "Explore Signal One",
};

const steps: JourneyStep[] = [
  {
    id: "identity",
    eyebrow: "01 · You",
    title: "Start with who you are.",
    body: "Use the contact details you want Signal One to use during screening.",
    fields: [
      { name: "fullName", label: "Full name", required: true, placeholder: "Your full name" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
    ],
  },
  {
    id: "territory",
    eyebrow: "02 · Territory",
    title: "Where are you building relationships?",
    body: "We use this to understand your practical selling area and current availability.",
    fields: [
      { name: "city", label: "City / area", required: true, placeholder: "Johannesburg" },
      {
        name: "employment",
        label: "Current work status",
        type: "select",
        required: true,
        options: ["Employed", "Self-employed", "Between roles", "Student / graduate", "Other"],
      },
    ],
  },
  {
    id: "experience",
    eyebrow: "03 · Experience",
    title: "Tell us what you have sold before.",
    body: "Formal experience helps, but we also care about discipline, commercial judgement and the ability to build trust.",
    fields: [
      {
        name: "experience",
        label: "B2B sales experience",
        type: "select",
        required: true,
        options: ["No formal experience", "Less than 1 year", "1–3 years", "3–5 years", "5+ years"],
      },
      {
        name: "securityExperience",
        label: "Security industry exposure",
        type: "select",
        options: ["None", "Some exposure", "Worked in security sales", "Worked in security operations"],
      },
    ],
  },
  {
    id: "motivation",
    eyebrow: "04 · Fit",
    title: "Why do you want to work for Signal One?",
    body: "Give us the short version of the experience, relationships and discipline you would bring to an internal Signal One sales role.",
    fields: [
      {
        name: "motivation",
        label: "Your case",
        type: "textarea",
        required: true,
        placeholder: "Tell us why you want the role, what you have sold and the relationships or skills you would bring.",
      },
    ],
  },
  {
    id: "review",
    eyebrow: "05 · Review",
    title: "Confirm your sales application.",
    body: "Check your answers before sending them to Signal One.",
    review: true,
  },
];

export default function JoinSalesPage() {
  return <OnboardingJourney world={world} steps={steps} />;
}
