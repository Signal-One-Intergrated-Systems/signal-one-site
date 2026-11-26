import type { Metadata } from "next";
import LegalPage from "../../components/LegalPage";
import { PRIVACY_NOTICE_VERSION } from "../../lib/intake";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Signal One handles personal information submitted through its public website, including enquiries, quote requests, onboarding, security-officer profiles and campaign information.",
  alternates: { canonical: "/privacy" },
});

const sections = [
  ["Information we collect", "We collect information you choose to submit through enquiries, onboarding, quote requests and applications, such as names, company details, contact information and the information needed to respond to your request. When you arrive from an advertising or campaign link, we also keep the campaign information described below."],
  ["Why we use it", "We use submitted information to respond to enquiries, prepare quotes, assess applications, activate requested services, support customers and maintain an auditable business record."],
  ["How your enquiry reaches us today", "Each form tells you how it will be sent before you start. While online submission is not available for a form, it prepares an email in your own email app: nothing reaches Signal One until you send that email, and it is then handled as an email to sales@signalone.co.za. Where online submission is available, your answers go directly to Signal One's customer records system and you are shown a reference once they have been saved. A form never reports that an enquiry was received unless our system has confirmed it."],
  ["Product news and offers", "Replying to your enquiry and sending you marketing are separate. Product news and offers are sent only if you tick the optional box on the form, and you can unsubscribe at any time by replying or by emailing sales@signalone.co.za. If a form prepares an email for you instead, that email does not include this choice, so tell us in it if you would like product news."],
  [
    "Campaign information",
    <>
      <p>
        If you reach this website from a link that carries campaign tags (the <code>utm_source</code>, <code>utm_medium</code>, <code>utm_campaign</code>, <code>utm_term</code> and <code>utm_content</code> parameters) or a Google Ads click identifier (<code>gclid</code>, <code>gbraid</code> or <code>wbraid</code>), your browser keeps those values, the page you landed on (its path only), the name of the website that sent you there (its host name only, such as www.google.com) and the time of your visit. They are kept in this browser tab&apos;s session storage, not in a cookie, until you close the tab. A later campaign visit replaces them. A visit without campaign tags records nothing.
      </p>
      <p className="mt-4">
        Campaign information leaves your browser only with an enquiry from a company (a contact or Guard Marketplace enquiry, a quote request or an onboarding request) that you send online with the consent box ticked. It is stored with that enquiry in Signal One&apos;s customer records system, so we can tell which advertisement or campaign brought the enquiry and whether our advertising leads to customers. It is never attached to a guard profile or a job application. If a form prepares an email for you to send instead, the email does not include it.
      </p>
      <p className="mt-4">
        Google Analytics and Google Ads measurement are only active on this website if Signal One switches them on. When they are on, Google receives the address of each page you view (including any campaign tags in it) and the website actions we measure, such as starting a form. Google&apos;s analytics and advertising storage settings are set to &quot;denied&quot;, so these tools do not set their cookies; Google&apos;s tag may instead carry an ad click identifier in the address of the next page you open. When Signal One&apos;s system confirms that it has saved a sales enquiry, the record reference it gave that enquiry and the type of enquiry are sent to Google as a conversion. Your name and contact details are not sent to Google.
      </p>
      <p className="mt-4">
        Campaign information kept with an enquiry is retained, and can be accessed, corrected or objected to, as described under &quot;Retention and rights&quot; below.
      </p>
    </>,
  ],
  ["Access and security", "Access to operational systems is role-controlled. The platform includes authentication, permission controls and audit logging. We do not claim security certifications that have not been independently awarded."],
  ["Sharing", "Information may be processed by contracted infrastructure, communications, payment or service providers where needed to deliver the requested service. We do not publish private guard or customer records on the public website."],
  ["Retention and rights", "Retention periods must follow the purpose of processing, contractual requirements and applicable South African law. Requests to access, correct or object to processing can be sent to sales@signalone.co.za until a dedicated privacy address is confirmed."],
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      reviewNote
      kicker="Privacy"
      title="Privacy policy"
      intro="This policy describes how Signal One handles information submitted through the public website and enquiry flows. Product-specific agreements and notices may add requirements for operational services."
      sections={sections}
      footer={<p>Notice version {PRIVACY_NOTICE_VERSION}. An online enquiry records the version of this notice that was in force when you agreed to it.</p>}
    />
  );
}
