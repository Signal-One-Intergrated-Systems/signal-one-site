import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { photos } from "../../lib/photos";
import { ButtonLink, Kicker } from "../../components/ui";

export const metadata: Metadata = {
  title: "1Service | Service Operations by Signal One",
  description: "Discover 1Service by Signal One: service teams, attendance, shifts, timesheets and job cards. Request an introduction.",
  alternates: { canonical: "/service" },
};

const capabilities = [
  ["Time and attendance", "Capture workforce attendance, review exceptions and manage operational evidence."],
  ["Shifts and teams", "Organise field teams and planned work across your sites and assignments."],
  ["Timesheets", "Review time records and exceptions before downstream payroll processing."],
  ["Job cards", "Keep work allocation and evidence linked to an accountable operational record."],
] as const;

export default function ServicePage() {
  return <main id="main">
    <section className="surface-deep section">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Kicker tone="dark">Signal One · Service Business Operating System</Kicker>
          <h1 className="t-display mt-6"><span className="text-signal-400">1</span>Workforce</h1>
          <p className="t-lead mt-6 text-text-inv-2">Take control of your service business.</p>
          <p className="t-body measure mt-5 text-text-inv-2">Bring your teams, shifts, timesheets and job cards into one manageable view. Designed to support the wider day-to-day operation of service businesses, starting with the workflows currently available.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/get-started" size="lg">Get 14 Day Free Trial</ButtonLink>
            <ButtonLink href="#capabilities" variant="ghost-dark" size="lg">Explore the platform</ButtonLink>
          </div>
          <p className="t-caption mt-5 text-text-inv-3">Commercial onboarding and availability are confirmed directly with Signal One.</p>
        </div>
        <div className="s1-workforce-hero-media glass rounded-card" aria-label="Field teams at work"><Image src={photos.warehouse.src} alt={photos.warehouse.alt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" /></div>
        <div className="sr-only" aria-label="1Service capabilities">
          <div className="flex items-center justify-between border-b border-line-dark pb-5">
            <span className="t-h3">1Service</span>
            <span className="t-caption text-signal-400">Workforce operations</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {capabilities.map(([name, detail]) => <div key={name} className="rounded-ui border border-line-dark bg-raised p-4">
              <h2 className="t-h4">{name}</h2><p className="t-small mt-2 text-text-inv-2">{detail}</p>
            </div>)}
          </div>
          <p className="t-caption mt-5 text-text-inv-3">Learn more about the supported 1Service capabilities.</p>
        </div>
      </div>
    </section>
    <section id="capabilities" className="surface-light section scroll-mt-[72px]">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div><Kicker>For service businesses</Kicker><h2 className="t-h2 mt-4">Start with the daily operation.</h2><p className="t-body mt-5 text-text-2">See attendance exceptions, review hours and keep work records together so teams and supervisors can spend less time reconciling updates.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">{capabilities.map(([name, detail])=><article key={name} className="card p-6"><h3 className="t-h3">{name}</h3><p className="t-small mt-3 text-text-2">{detail}</p></article>)}</div>
      </div>
    </section>
    <section className="surface-white section"><div className="wrap flex flex-wrap items-center justify-between gap-8">
      <div><h2 className="t-h2">See how 1Service can fit your business.</h2><p className="t-body mt-4 text-text-2">Tell us about your teams, sites and required workflows. We will confirm the supported rollout and commercial terms.</p></div>
      <Link className="btn btn-primary btn-lg" href="/contact">Talk to Signal One</Link>
    </div></section>
  </main>;
}
