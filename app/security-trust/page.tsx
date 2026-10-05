import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Trust",
  description: "Signal One security, access-control, audit, hosting and product-truth practices.",
  alternates: { canonical: "/security-trust" },
};

export default function SecurityTrustPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <article className="mx-auto max-w-5xl">
        <p className="s1-eyebrow">Security & trust</p>
        <h1 className="s1-display mt-5 font-semibold">Control access. Preserve evidence. State only what is proven.</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/72">
          Signal One uses managed cloud infrastructure and platform controls including authentication, role-based access, tenant-aware data boundaries and audit logging. We do not claim ISO, SOC or other certifications that have not been independently awarded.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Authentication & access", "Authenticated product areas use role and permission controls. Guard also separates company, supervisor, client and guard access paths."],
            ["Audit trails", "The operating platforms record audited actions for important administrative and operational changes."],
            ["Data transport", "Public and product endpoints are served over HTTPS. Provider credentials and application secrets are stored outside public source code."],
            ["Storage", "The enterprise platform contains managed PostgreSQL and object-storage integrations. Exact customer data-location commitments remain subject to the final hosting configuration."],
            ["Backup & recovery", "Backup, restoration and recovery controls exist in the platform engineering stack. Public RPO, RTO and retention commitments are not published until they are formally approved."],
            ["POPIA", "Signal One's product design uses purpose-limited access and private operational workspaces. The final POPIA notice and operator responsibilities remain subject to legal review."],
            ["Support", "Customer support and incident handling are part of the operating model. Exact support hours and response-time commitments will be stated in the customer agreement rather than invented on the website."],
            ["Product status", "Capabilities are labelled Live, Beta, Coming soon or Not offered. A planned integration is not marketed as live."],
          ].map(([title, body]) => (
            <section key={title} className="rounded-[18px] border border-white/10 bg-[#0F131A] p-6">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 rounded-[14px] border border-white/10 bg-white/[.025] p-5 text-sm leading-7 text-white/70">
          Procurement or security review? Contact <a href="mailto:sales@signalone.co.za" className="font-semibold text-[#7DD3FC]">sales@signalone.co.za</a>. Contractual support hours, data-location commitments, backup retention and recovery objectives are confirmed in the applicable customer agreement rather than invented on the public website.
        </p>
      </article>
    </main>
  );
}
