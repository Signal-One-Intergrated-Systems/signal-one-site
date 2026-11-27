import type { IntakeField } from "../components/IntakeForm";

/**
 * Partner programmes (founder directive and response, 2026-11-27): the single public source for the reseller
 * (dealer) programme, the independent sales partner programme and technology partnerships.
 *
 * Truth rules:
 * - Nothing here is a commercial commitment. Every application is reviewed; nothing is approved automatically.
 * - No wholesale prices, discounts, credit, commission rates or earnings are published.
 * - Capabilities that are not yet operational carry `planned: true` and are labelled so on the page.
 * - Approved commercial policy only: prepaid wholesale purchasing; dealer credit is approved separately;
 *   dealerships are non-exclusive unless a written agreement says otherwise.
 */

export type PartnerBenefit = { title: string; detail: string; planned?: boolean };

export const resellerAudiences: readonly string[] = [
  "Radio dealers",
  "Security equipment suppliers",
  "IT companies",
  "Telecommunications businesses",
  "Technology distributors",
  "Security companies",
  "Independent equipment retailers",
];

export const resellerBenefits: readonly PartnerBenefit[] = [
  { title: "Wholesale and volume purchasing", detail: "Buy at wholesale, with volume-based pricing for approved dealers. Wholesale prices are shared only with approved dealers, never published." },
  { title: "Professional communications products", detail: "Push-to-talk radios, accessories and related equipment from the Signal One range, quoted for your customers' needs." },
  { title: "Recurring communications revenue", detail: "Sell the communications service with the radios: push-to-talk platform, SIM and data that your customers keep renewing. Terms are set in your dealer agreement." },
  { title: "Training and marketing resources", detail: "Product training for your team, and sales and marketing material for your customers." },
  { title: "Technical and commercial support", detail: "Help with configuration, activation and quotations, and a named contact for your dealership." },
  { title: "An integrated dealer workspace", detail: "A workspace in Signal One Sales OS for your sales, customers, equipment and communications subscriptions, kept separate from every other dealer. Offered to approved dealers once it is qualified for use.", planned: true },
];

/** Approved commercial policy (founder, 2026-11-27). */
export const resellerPolicy: readonly string[] = [
  "Wholesale purchases are prepaid.",
  "Credit is not part of a standard dealership. It needs a separate application and approval.",
  "Dealerships are non-exclusive unless a written agreement says otherwise.",
];

export const resellerSteps: ReadonlyArray<readonly [string, string]> = [
  ["Apply", "Tell us about your business, where you sell and who you sell to."],
  ["We review", "We look at every application and call you to talk it through. Submitting this form does not approve a dealership."],
  ["Agreement", "If it is a fit, you receive a dealer agreement that sets out pricing, terms and territory."],
  ["Set-up", "We set up your dealer account and product training."],
  ["First order", "Your first prepaid wholesale order."],
];

export const resellerFields: IntakeField[] = [
  { name: "companyName", label: "Company name", required: true, autoComplete: "organization", error: "Enter your company name." },
  { name: "contactName", label: "Your name", required: true, autoComplete: "name", error: "Enter your name." },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", error: "Enter an email address we can reply to." },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, autoComplete: "tel", error: "Enter a mobile number." },
  { name: "contactRole", label: "Your role", placeholder: "e.g. Owner, sales director" },
  { name: "businessType", label: "Type of business", type: "select", required: true, error: "Choose the type of business.", options: [...resellerAudiences, "Other"] },
  { name: "registrationStatus", label: "Business registration", type: "select", required: true, error: "Choose how your business is registered.", options: ["Registered company (Pty) Ltd or CC", "Sole proprietor", "Other", "Not yet registered"], hint: "No documents are needed now. We ask for them only if we go ahead." },
  { name: "regions", label: "Where you sell", required: true, error: "Tell us where you sell.", placeholder: "e.g. Gauteng and North West", wide: true },
  { name: "customerSegments", label: "Who your customers are", placeholder: "e.g. security companies, estates, logistics firms", wide: true },
  { name: "currentBrands", label: "Brands you sell today", placeholder: "e.g. radios, CCTV or IT brands" },
  { name: "salesChannels", label: "How you sell", type: "select", options: ["Showroom or shop", "Field sales", "Online", "Projects and tenders", "A mix of these"] },
  { name: "expectedVolume", label: "Radios you expect to sell in a year", type: "select", options: ["Up to 20", "21 to 100", "101 to 500", "More than 500", "Not sure yet"] },
  { name: "interests", label: "What you want to sell", type: "select", options: ["Radios and communications services", "Radios only", "Communications services for radios customers already own", "Radios, communications and 1GUARD", "Not sure yet"] },
  { name: "notes", label: "Anything else", type: "textarea", placeholder: "Your experience, current suppliers, or questions about the programme" },
];

export const salesPartnerFacts: readonly PartnerBenefit[] = [
  { title: "Independent, not employed", detail: "Sales partners work independently. It is not a salaried job, and it is not a dealership: partners introduce customers, they do not buy stock." },
  { title: "What you introduce", detail: "Businesses that need professional radios and communications services, and security companies that need 1GUARD." },
  { title: "How you are paid", detail: "Commission on eligible sales, as set out in your partner agreement. We do not publish rates or earnings estimates, and nothing is guaranteed." },
  { title: "Quotes and commitments", detail: "Binding quotations, discounts and commercial commitments are approved by Signal One." },
  { title: "Your partner tools", detail: "Submitting leads, following your opportunities, preparing quotations within your permissions and tracking eligible commission in Signal One Sales OS, once partner access is ready.", planned: true },
];

export const salesPartnerSteps: ReadonlyArray<readonly [string, string]> = [
  ["Apply", "Tell us about your experience and the businesses you can reach."],
  ["Conversation", "We call you to talk about the programme and how it fits."],
  ["Agreement", "If it is a fit, you receive a partner agreement with the commission terms."],
  ["Onboarding", "Product training and the material you need to introduce customers."],
];

export const salesPartnerFields: IntakeField[] = [
  { name: "fullName", label: "Full name", required: true, autoComplete: "name", error: "Enter your full name." },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", error: "Enter an email address we can reply to." },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, autoComplete: "tel", error: "Enter a mobile number." },
  { name: "location", label: "Where you are based", required: true, error: "Tell us where you are based.", placeholder: "e.g. Durban" },
  { name: "workingStatus", label: "How you would work with us", type: "select", required: true, error: "Choose how you would work with us.", options: ["As an independent individual", "Through my own business", "Alongside my current job", "Not sure yet"] },
  { name: "availability", label: "Time you can give", type: "select", options: ["A few hours a week", "Part-time", "Full-time", "Not sure yet"] },
  { name: "background", label: "Your sales experience", type: "textarea", required: true, error: "Tell us about your sales experience.", placeholder: "What you have sold, to whom, and for how long" },
  { name: "networks", label: "Businesses you can reach", type: "textarea", placeholder: "e.g. security companies in KZN, property managers, logistics firms" },
  { name: "interests", label: "What you want to introduce", type: "select", options: ["Radios and communications", "1GUARD", "Both", "Not sure yet"] },
  { name: "notes", label: "Anything else", type: "textarea", placeholder: "Questions about the programme" },
];

export const technologyPartnerFields: IntakeField[] = [
  { name: "companyName", label: "Organisation", required: true, autoComplete: "organization", error: "Enter your organisation's name." },
  { name: "contactName", label: "Your name", required: true, autoComplete: "name", error: "Enter your name." },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", error: "Enter an email address we can reply to." },
  { name: "mobile", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "contactRole", label: "Your role" },
  { name: "partnershipType", label: "Kind of partnership", type: "select", required: true, error: "Choose the kind of partnership.", options: ["Technology partnership", "System integration", "Regional distribution", "Implementation for large organisations", "Strategic collaboration"] },
  { name: "website", label: "Website", placeholder: "e.g. https://example.co.za" },
  { name: "notes", label: "What you have in mind", type: "textarea", required: true, error: "Tell us what you have in mind." },
];
