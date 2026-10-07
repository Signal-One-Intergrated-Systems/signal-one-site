import type { Metadata } from "next";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";
import { Kicker, Steps } from "../components/ui";
import { guardDayPricePhrase } from "../lib/pricing";

export const metadata: Metadata = {
  title: "Talk to Signal One About Security Guard Software",
  description:
    "Talk to a Signal One specialist about guard management software: " + guardDayPricePhrase + ", a walkthrough on your operation, radios, tracking and Guard Marketplace.",
  alternates: { canonical: "/contact" },
};

const fields: IntakeField[] = [
  { name: "contactName", label: "Your name", required: true, autoComplete: "name" },
  { name: "companyName", label: "Security company", required: true, autoComplete: "organization" },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, autoComplete: "tel", placeholder: "+27" },
  {
    name: "topic",
    label: "What would you like to talk about?",
    type: "select",
    required: true,
    wide: true,
    options: [
      "A walkthrough of the platform",
      "Guard pricing and getting started",
      "Radios, PTT, tracking or body cameras",
      "Guard Marketplace",
      "Something else",
    ],
  },
  {
    name: "message",
    label: "Anything we should know",
    type: "textarea",
    placeholder: "Number of sites and guards, a contract you are bidding on, or what is not working today.",
  },
];

export default function ContactPage() {
  return (
    <main id="main" className="surface-light">
      <div className="wrap grid gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <Kicker>Talk to Signal One</Kicker>
          <h1 className="t-h1 mt-4">Talk to a person who knows security operations.</h1>
          <p className="t-lead mt-5 text-text-2">
            A short form. A Signal One representative replies by email or phone.
          </p>

          <h2 className="t-h3 mt-12">What happens next</h2>
          <div className="mt-4">
            <Steps
              items={[
                ["We read your message", "A representative looks at your sites, guards and what you asked about."],
                ["We get in touch", "By email or phone, using the details you give us."],
                ["We show you the platform", "On your operation, not a generic demo. You decide what happens after that."],
              ]}
            />
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <p className="t-small text-text-2">Prefer email?</p>
            <a href="mailto:sales@signalone.co.za" className="mt-1 inline-flex min-h-[44px] items-center text-[1.25rem] font-semibold text-signal-ink underline underline-offset-4">
              sales@signalone.co.za
            </a>
          </div>
        </div>

        <div>
          <IntakeForm
            intent="consultation"
            fields={fields}
            submitLabel="Send to Signal One"
            events={{ start: "consultation_start", complete: "consultation_complete" }}
            consentText="I agree that Signal One may use these details to reply to me about this request."
            successTitle="Thanks. A Signal One representative will be in touch."
            successBody="We reply by email or phone using the details you gave us. Nothing else happens until we have spoken."
          />
        </div>
      </div>
    </main>
  );
}
