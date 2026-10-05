import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Signal One handles personal information submitted through its public website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <article className="mx-auto max-w-4xl">
        <p className="s1-eyebrow">For legal review</p>
        <h1 className="s1-display mt-5 font-semibold">Privacy Policy</h1>
        <p className="mt-6 text-base leading-8 text-white/72">
          This draft describes the public website and enquiry flows. It must be reviewed against Signal One's final legal, hosting and retention arrangements before it is treated as legal advice or a final policy.
        </p>
        {[
          ["Information we collect", "We collect information you choose to submit through enquiries, onboarding, quote requests and applications, such as names, company details, contact information and the information needed to respond to your request."],
          ["Why we use it", "We use submitted information to respond to enquiries, prepare quotes, assess applications, activate requested services, support customers and maintain an auditable business record."],
          ["Access and security", "Access to operational systems is role-controlled. The platform includes authentication, permission controls and audit logging. We do not claim security certifications that have not been independently awarded."],
          ["Sharing", "Information may be processed by contracted infrastructure, communications, payment or service providers where needed to deliver the requested service. We do not publish private guard or customer records on the public website."],
          ["Retention and rights", "Retention periods must follow the purpose of processing, contractual requirements and applicable South African law. Requests to access, correct or object to processing can be sent to sales@signalone.co.za until a dedicated privacy address is confirmed."],
        ].map(([title, body]) => (
          <section key={title} className="border-b border-white/10 py-8">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">{body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
