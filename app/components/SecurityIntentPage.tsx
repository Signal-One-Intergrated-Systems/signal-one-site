import Image from "next/image";
import Link from "next/link";

export type IntentFaq = {
  question: string;
  answer: string;
};

export type IntentFeature = {
  title: string;
  body: string;
};

export default function SecurityIntentPage({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  outcomeTitle,
  outcomeBody,
  features,
  proofTitle,
  proofBody,
  proofImage,
  proofImageAlt,
  faqs,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  outcomeTitle: string;
  outcomeBody: string;
  features: IntentFeature[];
  proofTitle: string;
  proofBody: string;
  proofImage: string;
  proofImageAlt: string;
  faqs: IntentFaq[];
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-[90rem]">
        <section className="relative isolate overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] shadow-[var(--s1-shadow-panel)]">
          <Image src={image} alt={imageAlt} fill priority className="-z-20 object-cover" sizes="100vw" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,13,18,.99)_0%,rgba(10,13,18,.94)_50%,rgba(10,13,18,.55)_100%)]" />

          <div className="flex min-h-[560px] max-w-4xl flex-col justify-end p-7 md:p-12">
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{eyebrow}</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.01] tracking-[-.04em] md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/64 md:text-lg md:leading-8">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tour" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                See product tour
              </Link>
              <Link href="/contact?intent=demo" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                Book a 30-minute demo
              </Link>
              <Link href="/pricing" className="px-3 py-3 text-sm font-semibold text-white/60 transition hover:text-[#38BDF8]">
                See packages →
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-20 lg:grid-cols-[.78fr_1.22fr] lg:items-start md:py-24">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">The operational outcome</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-5xl">{outcomeTitle}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/54">{outcomeBody}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <article key={feature.title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-6">
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">0{index + 1}</p>
                <h3 className="mt-5 text-xl font-semibold tracking-[-.025em]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/48">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border-y border-white/10 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center md:py-24">
          <div className="relative min-h-[380px] overflow-hidden rounded-[18px] border border-white/10 bg-[#06090D]">
            <Image src={proofImage} alt={proofImageAlt} fill className="object-cover object-top" sizes="(min-width:1024px) 48vw,100vw" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
          </div>
          <div className="lg:pl-8">
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Product proof</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{proofTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-white/54">{proofBody}</p>
            <p className="mt-5 text-xs leading-5 text-white/34">
              Product imagery is captured from controlled Signal One Guard QA/demo states using synthetic test data.
            </p>
            <Link href="/tour" className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition hover:text-[#7DD3FC]">
              Open the full product tour →
            </Link>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Buyer questions</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                Straight answers before the sales conversation.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/50">
                These answers are limited to what Signal One currently supports in the public product repository. Contractual, architecture and security details should be confirmed during procurement.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-[16px] border border-white/10 bg-[#0A0D12] p-5">
                  <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-white/86">
                    {faq.question}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-white/50">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/[.06] p-7 md:p-10">
          <p className="s1-mono text-[9px] font-semibold text-[#7DD3FC]">Evaluate Signal One</p>
          <div className="mt-4 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                Put your own sites and operating model into the evaluation.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                Use a live demo to confirm how the workflow fits your guard force, control room, supervisors and client-service requirements.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact?intent=demo" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                Book demo
              </Link>
              <Link href="/trust" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                Trust & deployment
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
