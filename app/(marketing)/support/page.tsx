import type { Metadata } from "next";
import { ButtonLink, Check, FactPanel, PageHero } from "../../components/ui";
import { contact } from "../../lib/site";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Customer Support",
  description:
    "Support for Signal One customers: radio and connectivity faults, lost or damaged equipment, 1GUARD access, billing and returns. How to reach us and what to include.",
  alternates: { canonical: "/support" },
});

const subject = (topic: string) => "mailto:" + contact.supportEmail + "?subject=" + encodeURIComponent("Support: " + topic);

const topics = [
  ["Radio or connectivity fault", "A radio will not connect, talk groups are wrong, or SIM data has stopped. Tell us the radio model, serial or SIM number and the site.", "Radio or connectivity fault"],
  ["Lost, stolen or damaged equipment", "Report it as soon as you know, with the serial number, the date and what happened, so the next steps can be confirmed.", "Lost, stolen or damaged equipment"],
  ["1GUARD access", "Can't sign in, or need a supervisor or guard added? Your company administrator can manage users; contact us if you are the administrator.", "1GUARD access"],
  ["Billing or invoice question", "Quote or invoice number, the line you are asking about, and the contact person for your accounts team.", "Billing question"],
  ["Returns and end of rental term", "Which units, the contract or quote number, and when they can be collected or returned.", "Return or end of term"],
  ["Your personal information", "To see, correct or delete information we hold about you, see how we handle requests under POPIA.", null],
] as const;

const include = [
  "Your company name and your name",
  "The site or location affected",
  "Device model and serial number, or SIM number, where it is equipment",
  "What happened, when, and how many people or units are affected",
];

export default function SupportPage() {
  return (
    <main id="main" className="s1-scene-page s1-scene-page--security">
      <PageHero
        kicker="Customer support"
        title="Something not working? Tell us what, where and since when."
        lead="Support for customers renting or buying radios, tracking and body cameras, and for companies piloting 1GUARD. Email or WhatsApp us; the details below help us answer the first time."
        actions={
          <>
            <ButtonLink href={subject("General")} size="lg">Email support</ButtonLink>
            <ButtonLink href={contact.whatsappHref} variant="ghost-dark" size="lg">WhatsApp {contact.whatsappDisplay}</ButtonLink>
          </>
        }
        aside={
          <FactPanel
            title="How to reach us"
            facts={[
              ["Email", contact.supportEmail + ". Start the subject with \"Support:\" and your company name"],
              ["New enquiries", contact.email],
              ["WhatsApp", contact.whatsappDisplay],
              ["Hours and response times", "As set out in your customer agreement"],
              ["Emergencies", "Use your own control-room procedure and emergency services first"],
            ]}
          />
        }
      />

      <section className="surface-light section" aria-labelledby="support-safety">
        <div className="wrap">
          <div className="rounded-card border border-signal-400/40 bg-surface p-6 sm:p-8">
            <h2 id="support-safety" className="t-h3">If someone is in danger, do not wait for us</h2>
            <p className="t-body mt-3 measure text-ink-2">
              Follow your own emergency and control-room procedures first, and call emergency services if needed. Email and WhatsApp are not monitored as emergency lines.
            </p>
          </div>
        </div>
      </section>

      <section className="surface-light section pt-0" aria-labelledby="support-topics">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 id="support-topics" className="t-h2">What do you need help with?</h2>
          <ul className="m-0 grid list-none gap-x-12 p-0 md:grid-cols-2">
            {topics.map(([title, body, mailTopic]) => (
              <li key={title} className="border-t border-hairline py-6">
                <h3 className="t-h4">{title}</h3>
                <p className="t-small mt-2 text-ink-2">{body}</p>
                <a href={mailTopic ? subject(mailTopic) : "/popia"} className="link-arrow mt-3 inline-flex text-accent">
                  {mailTopic ? "Email about this →" : "POPIA and your rights →"}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-light-2 section" aria-labelledby="support-include">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 id="support-include" className="t-h2">What to include</h2>
          <div>
            <ul className="m-0 grid list-none gap-3 p-0">
              {include.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 shrink-0 text-accent" />
                  <span className="t-body text-ink-2">{item}</span>
                </li>
              ))}
            </ul>
            <p className="t-small mt-6 text-ink-2">
              Support hours and response times are set out in your customer agreement.
              Security officers: for shift or pay questions, contact your employer or control room; for your guard profile, see <a href="/guards" className="link-inline font-semibold text-accent">For security officers</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
