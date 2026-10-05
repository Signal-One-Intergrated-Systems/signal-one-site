import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Terms",
  description: "Signal One public website terms for product information, pricing and acceptable use.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <article className="mx-auto max-w-4xl">
        <p className="s1-eyebrow">Website terms</p>
        <h1 className="s1-display mt-5 font-semibold">Website Terms</h1>
        <p className="mt-6 text-base leading-8 text-white/72">
          These website terms govern use of the public Signal One site. Product orders, rentals, Guard access and other paid services remain subject to the applicable quotation, order, rental or service agreement.
        </p>
        {[
          ["Website information", "We aim to keep public product information accurate, but availability, hardware specifications and commercial terms are confirmed before an order or rental is accepted."],
          ["Pricing", "The public Guard rate is R2 per guard day excluding VAT. Radios are rental by quote only. Other services and modules are priced separately where stated."],
          ["No invented commitments", "A website statement does not create a certification, uptime commitment, service-level agreement or product capability that is not stated in the governing customer agreement."],
          ["Acceptable use", "You may not interfere with the website, attempt unauthorised access, submit unlawful content or misuse public forms and application journeys."],
          ["Intellectual property", "Signal One branding, website content and product interfaces remain subject to their respective intellectual-property rights."],
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
