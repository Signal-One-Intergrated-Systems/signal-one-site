import IntakeAvailability from "../../components/journey/IntakeAvailability";
import type { Metadata } from "next";
import IntakeForm, { type IntakeField } from "../../components/IntakeForm";
import { Kicker, Steps } from "../../components/ui";
import { contact } from "../../lib/site";

export const metadata: Metadata = {
  title: "Talk to Signal One | 1GUARD, 1Service and Equipment",
  description:
    "Talk to Signal One about 1GUARD, 1Service, security equipment and connected operations. Request a walkthrough or product quotation.",
  alternates: { canonical: "/contact" },
};

const fields: IntakeField[] = [
  { name: "contactName", label: "Your name", required: true, error: "Enter your name.", autoComplete: "name" },
  { name: "companyName", label: "Company or organisation", required: true, error: "Enter your company or organisation.", autoComplete: "organization" },
  { name: "email", label: "Work email", type: "email", required: true, error: "Enter your work email address.", autoComplete: "email" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, error: "Enter your mobile number.", autoComplete: "tel", placeholder: "+27" },
  {
    name: "topic",
    label: "What would you like to talk about?",
    type: "select",
    required: true,
    error: "Choose what you would like to talk about.",
    wide: true,
    options: [
      "1GUARD Security Business OS walkthrough",
      "1Service restaurant and service operations (in development)",
      "Guard pricing and getting started",
      "Radios, PTT, tracking or body cameras",
      "Hire guards through marketplace",
      "Equipment purchase or rental",
      "Something else",
    ],
  },
  {
    name: "message",
    label: "Anything we should know",
    type: "textarea",
    placeholder: "Number of sites, workforce size, equipment quantities or the outcomes you need.",
  },
];

export default function ContactPage() {
  return (
    <main id="main" className="surface-light s1-premium-contact s1-scene-page s1-scene-page--contact">
      <div className="wrap grid gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <Kicker>Talk to Signal One</Kicker>
          <h1 className="t-h1 mt-4">Tell us what you need. We will show you the right solution.</h1>
          <p className="t-lead mt-5 text-text-inv-2">
            From business operating systems for security and service SMEs to radios and connected equipment, tell us what you are trying to achieve.
          </p>


          <h2 className="t-h3 mt-12">What happens next</h2>
          <div className="mt-4">
            <Steps
              items={[
                ["We read your message", "We review your business requirements and the solution you selected."],
                ["We get in touch", "By email or phone, using the details you give us."],
                ["We discuss your solution", "We explain the relevant platform, available options and next steps before you decide."],
              ]}
            />
          </div>

          <div className="mt-10 grid gap-4 border-t border-line-dark pt-6 sm:grid-cols-2">
            <div>
              <p className="t-small text-text-inv-2">Prefer email?</p>
              <a href={"mailto:" + contact.email} className="mt-1 inline-flex min-h-[44px] items-center text-[1.25rem] font-semibold text-signal-300 underline underline-offset-4">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="t-small text-text-inv-2">Prefer WhatsApp?</p>
              <a href={contact.whatsappHref} rel="noopener" className="mt-1 inline-flex min-h-[44px] items-center text-[1.25rem] font-semibold text-signal-300 underline underline-offset-4">
                {contact.whatsappDisplay}
              </a>
            </div>
            <p className="t-small text-text-inv-2 sm:col-span-2">Already a customer? <a href="/support" className="link-inline font-semibold text-signal-300">Get support</a>.</p>
          </div>
        </div>

        <div>
          <IntakeAvailability />
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
