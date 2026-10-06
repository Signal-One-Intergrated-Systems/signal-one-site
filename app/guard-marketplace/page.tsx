import type { Metadata } from "next";
import Link from "next/link";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";
import { ButtonLink, Check, Kicker, Status, Steps } from "../components/ui";

export const metadata: Metadata = {
  title: "Guard Marketplace: Hire Guards for New Contracts",
  description:
    "Guard Marketplace is the hiring step being built into Signal One Security: filter by location, PSiRA grade, availability, experience and skills, shortlist, send a hire request and allocate accepted guards to sites and shifts.",
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

const demoProfiles = [
  { tag: "Sample A", area: "Midrand, Gauteng", grade: "C", availability: "Available now", years: "4 years", skills: ["Access control", "Patrol"] },
  { tag: "Sample B", area: "Kempton Park, Gauteng", grade: "B", availability: "Available in 2 weeks", years: "7 years", skills: ["Control room", "CCTV"] },
  { tag: "Sample C", area: "Centurion, Gauteng", grade: "C", availability: "Available now", years: "2 years", skills: ["Access control", "Reception"] },
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

function DemoChip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-light-2 px-3 py-1 text-[0.875rem] font-medium">{children}</span>;
}

export default function GuardMarketplacePage() {
  return (
    <main id="main">
      <section className="surface-base">
        <div className="wrap grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Kicker tone="dark">Guard Marketplace</Kicker>
              <Status kind="mvp" tone="dark">
                MVP in development
              </Status>
            </div>
            <h1 className="t-h1 mt-5">Win the contract. Then staff it from the same system.</h1>
            <p className="t-lead measure mt-6 text-text-inv-2">
              Find guards near the site, check what they have recorded, send a hire request and allocate the guards who
              accept. Inside your company workspace, next to the sites and shifts they will work.
            </p>
          </div>
          <div className="rounded-card border border-line-dark bg-raised p-6">
            <h2 className="t-h4">Where Marketplace is today</h2>
            <p className="t-small mt-2 text-text-inv-2">
              Marketplace is not live yet. We are building the MVP described on this page. Register interest and we will
              tell you when your company can use it.
            </p>
            <ButtonLink href="#interest" className="mt-5">
              Register interest
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="surface-light section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">From contract to shift, in ten steps.</h2>
            <p className="t-body mt-4 text-text-2">
              The hiring workflow ends where your operation already lives: a guard allocated to a site and a shift in Signal
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

      <section className="surface-white section" aria-labelledby="demo-h">
        <div className="wrap">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="demo-h" className="t-h2">
                What it will look like
              </h2>
              <p className="t-body measure mt-3 text-text-2">
                A design preview of the MVP. These profiles are invented, and nothing on this page connects to a real
                guard.
              </p>
            </div>
            <p className="shrink-0 rounded-full bg-beta-tint px-4 py-2 text-[0.9375rem] font-semibold text-beta">
              Illustrative demo · synthetic data
            </p>
          </div>

          <div
            className="mt-10 overflow-hidden rounded-card ring-1 ring-line"
            role="img"
            aria-label="Illustrative Marketplace design preview with synthetic data: filters for location, PSiRA grade, availability, experience and skills, and three sample guard profiles with shortlist and hire request buttons"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-light px-4 py-3 text-[0.875rem] sm:px-6">
              <span className="font-semibold">Guard Marketplace · design preview</span>
              <span className="text-text-2">Illustrative demo · synthetic data</span>
            </div>
            <div className="grid md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div className="border-b border-line bg-light/60 p-4 sm:p-6 md:border-b-0 md:border-r">
                <p className="t-h4">Filters</p>
                <dl className="mt-4 grid gap-3 text-[0.9375rem]">
                  {[
                    ["Location", "Within 25 km of Midrand"],
                    ["PSiRA grade", "C or higher"],
                    ["Availability", "Available now"],
                    ["Experience", "2+ years"],
                    ["Skills", "Access control"],
                  ].map(([term, value]) => (
                    <div key={term} className="rounded-ui bg-white px-3 py-2 ring-1 ring-line">
                      <dt className="text-text-2">{term}</dt>
                      <dd className="m-0 font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <ul className="m-0 list-none divide-y divide-line p-0">
                {demoProfiles.map((profile) => (
                  <li key={profile.tag} className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                    <div className="flex gap-4">
                      <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-light-2 font-display text-[1.125rem] font-bold">
                        {profile.tag.slice(-1)}
                      </span>
                      <div>
                        <p className="font-semibold">{profile.tag} · {profile.area}</p>
                        <p className="t-small text-text-2">
                          PSiRA grade {profile.grade} recorded · {profile.years} · {profile.availability}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <DemoChip key={skill}>{skill}</DemoChip>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="btn btn-ghost-light pointer-events-none min-h-[44px] px-4 text-[0.9375rem]">Shortlist</span>
                      <span className="btn btn-primary pointer-events-none min-h-[44px] px-4 text-[0.9375rem]">Request hire</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="t-caption mt-3 text-text-2">
            Design preview, not the live product. No ratings, scores or badges will be shown on profiles.
          </p>
        </div>
      </section>

      <section className="surface-light section">
        <div className="wrap grid gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="t-h2">Private by design.</h2>
            <ul className="m-0 mt-6 grid list-none gap-4 p-0">
              {[
                "Profiles are only visible inside a signed-in Signal One company workspace.",
                "There is no public guard search and no public jobs board.",
                "Guards choose whether to accept a hire request.",
                "PSiRA number, grade and expiry are shown as recorded. Signal One does not check them with PSiRA.",
                "No ratings, readiness scores or badges.",
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
              <h2 className="t-h3">Already live in Signal One Guard</h2>
              <Status kind="live">Live</Status>
            </div>
            <p className="t-body mt-4 text-text-2">
              You can already offer open posts to your own guards. Each guard sees the offer in the Guard app and accepts
              or declines it. Marketplace extends the same accept-or-decline step to guards outside your company.
            </p>
            <ButtonLink href="/solutions/security" variant="ghost-light" className="mt-6">
              See the live platform
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
