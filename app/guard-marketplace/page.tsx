import type { Metadata } from "next";
import Link from "next/link";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";
import { ButtonLink, Check, PageHero, Status, Steps, GuardStatus } from "../components/ui";
import { guardIsLive } from "../lib/guardStatus";

export const metadata: Metadata = {
  title: "Guard Marketplace: Staff New Contracts (in development)",
  description:
    "Guard Marketplace is being built into Signal One Security: filter by location, PSiRA grade, availability and skills, shortlist and send hire requests. Register interest.",
  alternates: { canonical: "/guard-marketplace" },
};

const flow = [
  ["Contract won", "You have a new site, or more posts on an existing one."],
  ["Staffing need", "Post count, grade and shift pattern the contract needs."],
  ["Filter", "Location, PSiRA grade, availability, experience and skills."],
  ["View profile", "See the recorded PSiRA details, experience, skills and areas."],
  ["Shortlist", "Keep the guards you want to approach."],
  ["Request hire", "Send a hire request from your company workspace."],
  ["Guard accepts or declines", "The guard decides on their phone. No one is placed without saying yes."],
  ["Add to workforce", "Accepted guards join your company in Signal One Guard."],
  ["Allocate to a site", "PSiRA rules apply: missing or expired registration blocks the assignment."],
  ["Allocate to a shift", "From here it is a normal shift: clock in, patrol, report."],
] as const;

const interestFields: IntakeField[] = [
  { name: "contactName", label: "Your name", required: true, autoComplete: "name" },
  { name: "companyName", label: "Security company", required: true, autoComplete: "organization" },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
  { name: "mobile", label: "Mobile number", type: "tel", autoComplete: "tel", placeholder: "+27" },
  {
    name: "need",
    label: "What would you hire for?",
    type: "textarea",
    placeholder: "e.g. 12 Grade C officers for a new logistics contract in Germiston from March.",
  },
];

export default function GuardMarketplacePage() {
  return (
    <main id="main" className="landing-main marketplace-main">
      <PageHero
        kicker="Guard Marketplace"
        status={
          <Status kind="mvp" tone="dark">
            MVP in development
          </Status>
        }
        title="Your next workforce. Connected to the work."
        lead="When it launches, you will be able to find guards near the site, check what they have recorded, send a hire request and allocate the guards who accept. Inside your company workspace, next to the sites and shifts they will work."
        aside={
          <div className="access-plate">
            <p>Marketplace · MVP in development</p><h2 className="t-h3 mt-4">Built around a guard’s choice.</h2>
            <p className="t-body mt-3 text-text-inv-2">
              Marketplace is not live yet. We are building the MVP described on this page. Register interest and we will
              tell you when your company can use it.
            </p>
            <ButtonLink href="#interest" size="lg" className="mt-6">
              Register interest
            </ButtonLink>
          </div>
        }
      />

      <section className="surface-light section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">A planned path from contract to shift.</h2>
            <p className="t-body mt-4 text-text-2">
              The planned hiring workflow ends where your operation already lives: a guard allocated to a site and a shift in Signal
              One Guard.
            </p>
          </div>
          <div className="grid gap-x-10 md:grid-cols-2">
            <Steps items={flow.slice(0, 5)} />
            <ol start={6} className="m-0 grid list-none gap-0 p-0">
              {flow.slice(5).map(([title, body], index) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-5">
                  <span className="t-num pt-0.5 text-[1.5rem] text-signal-600">{index + 6}</span>
                  <div>
                    <h3 className="t-h4">{title}</h3>
                    <p className="t-small mt-1 text-text-2">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="surface-light section">
        <div className="wrap grid gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="t-h2">Private by design.</h2>
            <ul className="m-0 mt-6 grid list-none gap-4 p-0">
              {[
                "Profiles will only be visible inside a signed-in Signal One company workspace.",
                "There is no public guard search and no public jobs board.",
                "Guards will choose whether to accept a hire request.",
                "PSiRA number, grade and expiry will be shown as recorded. Signal One does not check them with PSiRA.",
                "There will be no ratings, readiness scores or badges.",
              ].map((item) => (
                <li key={item} className="t-body flex gap-3">
                  <Check className="mt-1 text-signal-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-white p-6 ring-1 ring-line sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="t-h3">{guardIsLive ? "Already live in Signal One Guard" : "In the Signal One Guard pilot"}</h2>
              <GuardStatus />
            </div>
            <p className="t-body mt-4 text-text-2">
              {guardIsLive ? "You can already offer open posts to your own guards." : "Pilot companies can offer open posts to their own guards."} Each guard sees the offer in the Guard app and accepts
              or declines it. Marketplace will extend the same accept-or-decline step to guards outside your company.
            </p>
            <ButtonLink href="/solutions/security" variant="ghost-light" className="mt-6">
              See the platform
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="interest" className="surface-white section scroll-mt-[72px]">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Register interest</h2>
            <p className="t-body mt-4 text-text-2">
              Tell us what you would hire for. We will let you know when Marketplace is ready for your company, and use your
              answers to shape the MVP.
            </p>
            <p className="t-small mt-6 text-text-2">
              Are you a guard?{" "}
              <Link href="/guards" className="link-inline font-semibold text-signal-ink">
                Create your profile here
              </Link>
              .
            </p>
          </div>
          <IntakeForm
            intent="marketplace-interest"
            fields={interestFields}
            submitLabel="Register interest"
            events={{ complete: "marketplace_interest" }}
            consentText="I agree that Signal One may contact me about Guard Marketplace."
            successTitle="You are on the list."
            successBody="We will email you when Guard Marketplace is ready for your company."
          />
        </div>
      </section>
    </main>
  );
}
