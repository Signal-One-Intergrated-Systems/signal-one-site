import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import OperationsExperience from "../../components/OperationsExperience";
import {
  Arrow,
  ButtonLink,
  Kicker,
  PageHero,
  GuardStatus,
  Status,
} from "../../components/ui";
import { guardOnboardingLine } from "../../lib/guardStatus";
import { illustrativeCaption, photos } from "../../lib/photos";
import { guardDayPricePhrase } from "../../lib/pricing";

export const metadata: Metadata = {
  title: "Security Company Software: Patrols, Attendance, SOS",
  description:
    "Guard management software for South African security companies: sites, shifts, attendance, QR and NFC patrols, SOS, control room and proof of service.",
  alternates: { canonical: "/solutions/security" },
};
const capabilities = [
  [
    "Sites, posts & shifts",
    "Build the roster and allocate guards to posts. See shortfalls before a shift starts.",
    "/guard-attendance-software",
  ],
  [
    "Attendance",
    "Clock in and out at the post, on the guard’s own phone or an authorised Central Device.",
    "/guard-attendance-software",
  ],
  [
    "QR & NFC patrols",
    "Associate checkpoint scans with their patrol, capture time and applicable GPS evidence.",
    "/guard-patrol-software",
  ],
  [
    "Occurrence records",
    "Keep a chronological site record, with incidents logged as they happen.",
    "/contact",
  ],
  [
    "SOS & control room",
    "Acknowledge, navigate to and resolve an SOS. Delivery requires a mobile signal.",
    "#experience",
  ],
  [
    "Client proof",
    "Assess scheduled service with a reason. Let authorised clients generate reports for their sites.",
    "#proof",
  ],
] as const;

export default function SecurityPlatformPage() {
  return (
    <main id="main" className="landing-main">
      <PageHero
        kicker="Signal One GUARD"
        status={<GuardStatus tone="dark" />}
        title="Your operation. One connected record."
        lead="Bring your sites, guards, supervisors and control room together. Build an operational record that your clients can use as evidence of service."
        actions={
          <>
            <ButtonLink href="#experience" size="lg">
              Explore the workflow <Arrow />
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost-dark" size="lg">
              Request a walkthrough
            </ButtonLink>
          </>
        }
        aside={
          <div className="access-plate">
            <p>Built around your operation</p>
            <h3>
              From allocation
              <br />
              to service evidence.
            </h3>
            <ul>
              {[
                "Sites → posts → shifts",
                "Guards → attendance → activity",
                "Supervision → action → evidence",
              ].map((text, i) => (
                <li key={text}>
                  <span>0{i + 1}</span>
                  {text}
                </li>
              ))}
            </ul>
            <p>
              Own phone or Central Device · {guardDayPricePhrase}, excl. VAT
            </p>
            {guardOnboardingLine && <p>{guardOnboardingLine}</p>}
          </div>
        }
      />
      <section className="surface-light mission-section">
        <div className="wrap">
          <div className="mission-section-head">
            <div>
              <Kicker>See the operational sequence</Kicker>
              <h2>
                A checkpoint is
                <br />
                just the beginning.
              </h2>
            </div>
            <p>
              Explore the physical action, the evidence GUARD records, the
              supervisor’s role and the information your client can access.
            </p>
          </div>
          <OperationsExperience />
        </div>
      </section>
      <section className="surface-white section">
        <div className="wrap">
          <div className="mission-section-head">
            <div>
              <Kicker>The working platform</Kicker>
              <h2>
                The everyday work,
                <br />
                brought together.
              </h2>
            </div>
            <p>
              Scans, clock events, incidents and occurrence entries are saved on
              the phone and sent when signal returns. SOS needs a mobile signal
              to reach the control room.
            </p>
          </div>
          <ul className="capability-grid m-0 grid list-none p-0 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([title, body, href], i) => (
              <li key={title}>
                <p className="t-caption text-signal-ink">0{i + 1}</p>
                <h3 className="t-h4 mt-3">{title}</h3>
                <p className="t-small text-text-2 mt-3">{body}</p>
                <Link href={href} className="link-arrow text-signal-ink mt-5">
                  {href === "/contact" ? "Discuss this workflow" : "Explore"}
                  <span className="sr-only"> {title}</span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="proof" className="surface-base section scroll-mt-[72px]">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Kicker tone="dark">People, access & client proof</Kicker>
            <h2 className="t-h2 mt-4">
              The right evidence.
              <br />
              For the right people.
            </h2>
            <p className="t-body text-text-inv-2 mt-5">
              Company administrators control invitations and site access.
              Supervisors work within assigned sites. Clients see the sites
              authorised for them and can generate proof-of-service reports.
            </p>
            <p className="t-small text-text-inv-2 mt-4">
              Deactivating a person ends their access without deleting the
              history of their work.
            </p>
            <ButtonLink href="/contact" variant="ghost-dark" className="mt-6">
              See a scoped-access walkthrough <Arrow />
            </ButtonLink>
          </div>
          <div className="access-plate">
            <p>Access model · editorial guide</p>
            <h3>
              One company.
              <br />
              Defined boundaries.
            </h3>
            <ul>
              <li>
                <span>01</span>Company → operation across its clients
              </li>
              <li>
                <span>02</span>Supervisor → assigned sites
              </li>
              <li>
                <span>03</span>Client → authorised sites and reports
              </li>
            </ul>
            <p>Live patrol progress and a live client map are coming soon.</p>
          </div>
        </div>
      </section>
      <section className="surface-light section">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-card">
            <Image
              src={photos.teamBriefing.src}
              alt={photos.teamBriefing.alt}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              quality={90}
              className="object-cover"
            />
            <p className="absolute bottom-0 inset-x-0 bg-deep p-3 t-caption text-text-inv">
              {illustrativeCaption}
            </p>
          </div>
          <div>
            <Kicker>Assignment safeguards</Kicker>
            <h2 className="t-h2 mt-4">
              Registration details.
              <br />
              Clear rules.
            </h2>
            <p className="t-body text-text-2 mt-5">
              Record each officer’s PSiRA number, grade and expiry. Missing or
              expired registration blocks assignment. Only a grade mismatch can
              be overridden, with a recorded reason.
            </p>
            <p className="t-small text-text-2 mt-4">
              Signal One records the details provided. It does not verify
              registrations with PSiRA itself.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Status kind="mvp">Marketplace · MVP in development</Status>
              <Status kind="soon">Payroll · coming soon</Status>
              <Status kind="beta">Accounting · beta, separately priced</Status>
            </div>
          </div>
        </div>
      </section>
      <section className="surface-deep section">
        <div className="wrap mission-closing">
          <div>
            <Kicker tone="dark">Your operation is the starting point</Kicker>
            <h2 className="t-h2 mt-4">
              Let’s walk through
              <br />
              your first sites.
            </h2>
            <p>{guardDayPricePhrase}, excluding VAT.</p>
          </div>
          <div className="mission-closing-links">
            <ButtonLink href="/get-started" size="lg">
              Start company onboarding
            </ButtonLink>
            <ButtonLink href="/pricing" variant="ghost-dark" size="lg">
              Explore pricing
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
