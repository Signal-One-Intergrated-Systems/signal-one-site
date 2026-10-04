import type { Metadata } from "next";
import OnboardingJourney, {
  type JourneyStep,
  type JourneyWorld,
} from "../../components/OnboardingJourney";

export const metadata: Metadata = {
  title: "Join Signal One Sales",
  description: "Apply to join Signal One Sales and work from Signal One Sales OS.",
};

const world: JourneyWorld = {
  kind: "sales",
  storageKey: "signal-one-sales-onboarding-v2",
  badge: "Sales representative onboarding",
  welcomeTitle: "Your next sales environment is a cockpit, not a spreadsheet.",
  welcomeBody:
    "Signal One Sales brings customer conversations, leads, pipeline, quoting, performance, training and sales packs into one working environment. This journey tells us whether the role is a fit.",
  welcomePoints: [
    "Introduce yourself and where you want to sell.",
    "Show us your B2B and security-industry experience.",
    "Tell us what you can bring to the Signal One sales network.",
  ],
  image: "/images/What-we-deliver/communications.jpg",
  imageAlt: "Signal One commercial communications environment",
  accent: "#A78BFA",
  accentRgb: "167,139,250",
  completionTitle: "Your Signal One Sales application is in.",
  completionBody:
    "If approved, the next stages are workforce setup, training, sales packs, commission setup and activation into Signal One Sales OS.",
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
    title: "Why Signal One?",
    body: "Give us the short version of the network, skills and ambition you would bring.",
    fields: [
      {
        name: "motivation",
        label: "Your case",
        type: "textarea",
        required: true,
        placeholder: "Tell us about your experience, network and what you want to build.",
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
