import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Kicker } from "../../components/ui";
import servicePhoto from "../../../public/images/home/service-restaurant-operations.jpg";

export const metadata: Metadata = {
  title: "1Service | The Restaurant-First Service Business Operating System",
  description: "Explore the 1Service vision from Signal One: restaurant operations, staff planning, kitchen workflows, stock, purchasing and decision support. In development; register interest.",
  alternates: { canonical: "/service" },
};

const ambitions = [
  ["Run the day", "Connect bookings and orders with service, kitchen and exception workflows. Planned."],
  ["Manage the team", "Bring hiring, shifts, attendance, work assignments and verified time into one service-business view. Planned."],
  ["Understand the margins", "Connect purchasing, recipe costing, stock movement and trading-day performance using certified system integrations. Planned."],
  ["Know what to improve", "Make recommendations from connected operational data while keeping people in control of important decisions. Planned."],
] as const;

export default function ServicePage() {
  return (
    <main id="main">
      <section className="surface-deep section">
        <div className="wrap grid gap-10 items-center lg:grid-cols-2">
          <div>
            <Kicker tone="dark">Signal One · Service Business Operating System</Kicker>
            <p className="mt-5 inline-flex rounded-full border border-signal-400/35 bg-signal-400/10 px-3 py-2 text-[0.875rem] font-semibold text-signal-400">In development · Restaurant-first</p>
            <h1 className="t-display mt-6"><span className="text-signal-400">1</span>Service</h1>
            <p className="t-lead mt-5 text-text-inv-2">One place to understand the people, service and performance behind your business.</p>
            <p className="t-body measure mt-5 text-text-inv-2">1Service expands the original workforce concept into an end-to-end operating system for service businesses. We are starting with restaurants: bringing the trading day, teams, kitchen, stock, customers and decisions into a coherent experience.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">Discuss early access</ButtonLink>
              <ButtonLink href="#vision" variant="ghost-dark" size="lg">Explore the vision</ButtonLink>
            </div>
            <p className="t-caption mt-5 text-text-inv-3">This page describes the intended direction. Full restaurant POS, kitchen, inventory, financial and marketplace workflows are not presented as live.</p>
          </div>
          <div className="relative min-h-[370px] overflow-hidden rounded-card border border-line-dark bg-raised shadow-xl lg:min-h-[540px]">
            <Image src={servicePhoto} alt="Illustrative restaurant team preparing food and coordinating service" fill
              sizes="(min-width:1024px) 49vw, 100vw" className="object-cover" priority />
            <div className="absolute bottom-4 left-5 rounded-full bg-deep/85 px-3 py-2 text-[0.875rem] text-text-inv">Illustrative restaurant operation</div>
          </div>
        </div>
      </section>
      <section id="vision" className="section surface-light scroll-mt-[96px]">
        <div className="wrap">
          <Kicker>From opening to close</Kicker>
          <h2 className="t-h2 mt-4">Run a connected service business.</h2>
          <p className="t-lead mt-4 max-w-3xl text-text-2">A service business is not just the people on the shift. Every handoff changes customer experience and profitability.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {ambitions.map(([name, detail]) => (
              <article key={name} className="card p-7">
                <h3 className="t-h3">{name}</h3>
                <p className="t-body mt-3 text-text-2">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="surface-deep section">
        <div className="wrap flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="t-h2">Help shape the service-business OS.</h2>
            <p className="t-body mt-4 max-w-2xl text-text-inv-2">Tell us which workflows cost your business time and margin. We will discuss suitability, development progress and possible early access.</p>
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg">Register 1Service interest</Link>
        </div>
      </section>
    </main>
  );
}
