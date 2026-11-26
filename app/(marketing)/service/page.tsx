import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Status, Kicker } from "../../components/ui";
import ProductSignature from "../../components/brand/ProductSignature";

export const metadata: Metadata = {
  title: "1Service | Restaurant-First Business Operating System",
  description: "Explore the 1Service vision from Signal One: restaurant operations, staff planning, kitchen workflows, stock, purchasing and decision support. In development; register interest.",
  alternates: { canonical: "/service" },
};

const ambitions = [
  ["Run the day", "Connect bookings and orders with service, kitchen and exception workflows.", "/images/editorial/restaurant-staff-briefing.webp", "Illustrative chef and waiters preparing together before service"],
  ["Manage the team", "Bring hiring, shifts, attendance, work assignments and verified time into one service-business view.", "/images/bright/02-team-planning.webp", "Illustrative restaurant team reviewing staffing and daily assignments"],
  ["Understand the margins", "Bring purchasing, recipe costs, stock movements and daily performance into one view through planned integrations.", "/images/bright/03-stock-and-margins.webp", "Illustrative kitchen team checking stock and purchasing records"],
  ["Know what to improve", "Turn connected operational information into recommendations, with your team in control of important decisions.", "/images/bright/04-performance-review.webp", "Illustrative restaurant managers reviewing business performance documents in daylight"],
] as const;

export default function ServicePage() {
  return (
    <main id="main" className="s1-scene-page s1-scene-page--service">
      <section className="surface-deep section s1-people-scene-service">
        <div className="wrap grid gap-10 items-center lg:grid-cols-2">
          <div>
            <Kicker tone="dark">Signal One · Service Business Operating System</Kicker>
            <p className="mt-5"><Status kind="beta">In development · Restaurant-first</Status></p>
            <h1 className="t-hero mt-6"><ProductSignature name="Service" tone="dark" /></h1>
            <p className="t-lead mt-5 text-ink-2">Run your service business. As one.</p>
            <p className="t-body measure mt-5 text-ink-2">1Service is the Service Business Operating System we are developing for SMEs, starting with restaurants. The vision connects customers, bookings, people, service, kitchen workflows, inventory, purchasing and business performance in one coherent experience.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">Discuss early access</ButtonLink>
              <ButtonLink href="#vision" variant="ghost-dark" size="lg">Explore the vision</ButtonLink>
            </div>
            <p className="t-caption mt-5 text-ink-3">1Service is in development. The workflows below describe our plans; early-access availability will be confirmed with you.</p>
          </div>
          <div className="s1-people-main-photo aspect-video">
            <Image src="/images/bright/01-restaurant-service.webp" alt="Illustrative chef and server coordinating plated orders in a restaurant kitchen" fill
              sizes="(min-width:1024px) 49vw, 100vw" className="object-cover" priority />
            <div className="photo-chip">Illustrative restaurant team at work</div>
          </div>
        </div>
      </section>
      <section id="vision" className="section surface-light scroll-mt-[96px]">
        <div className="wrap">
          <Kicker>From opening to close</Kicker>
          <h2 className="t-h2 mt-4">More than a roster. The operating system for your service business.</h2>
          <p className="t-lead mt-4 max-w-3xl text-ink-2">From the first booking to the end-of-day review, every handoff affects your customers, your team and your margins.</p>
          <p className="t-small mt-4 text-ink-2">Planned capabilities · Illustrative hospitality scenes</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {ambitions.map(([name, detail, src, alt]) => (
              <article key={name} className="card p-5 sm:p-7 s1-service-capability">
                <div className="relative mb-5 aspect-video overflow-hidden rounded-card s1-service-capability-photo">
                  <Image src={src} alt={alt} fill sizes="(min-width:1440px) 580px, (min-width:768px) 43vw, 90vw" className="object-contain" loading="lazy" />
                </div>
                <h3 className="t-h3">{name}</h3>
                <p className="t-body mt-3 text-ink-2">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="surface-deep section">
        <div className="wrap flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="t-h2">Help shape the service-business OS.</h2>
            <p className="t-body mt-4 max-w-2xl text-ink-2">Tell us which workflows cost your business time and margin. We will discuss suitability, development progress and possible early access.</p>
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg">Register 1Service interest</Link>
        </div>
      </section>
    </main>
  );
}
