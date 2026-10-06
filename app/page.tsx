import type { Metadata } from "next";
import Link from "next/link";
import GuardDayCalculator from "./components/GuardDayCalculator";
import ProductProof, { ProductWindow } from "./components/ProductProof";
import { Arrow, ButtonLink, Check, HeroPhoto, Kicker, Photo, PhotoBand, Status } from "./components/ui";
import { illustrativeCaption, photos } from "./lib/photos";
import { proofViews } from "./lib/productProof";

export const metadata: Metadata = {
  title: { absolute: "Security Guard Management Software South Africa | Signal One: Integrated Systems" },
  alternates: { canonical: "/" },
};

const ownerQuestions = [
  "Who is on site right now?",
  "Did the guard arrive, and on time?",
  "Was the patrol actually walked?",
  "What happened overnight?",
  "Can I prove it to my client?",
  "How fast can I staff the next contract?",
] as const;

const hireFlow = [
  "Contract won",
  "Staffing need",
  "Filter",
  "Profile",
  "Shortlist",
  "Hire request",
  "Guard accepts or declines",
  "Your workforce",
  "Site and shift",
] as const;

const runCapabilities = [
  ["Sites, posts and shifts", "Set up each site's posts, build shifts and allocate guards. The roster shows where you are short before the shift starts."],
  ["Clock in and out", "Guards clock in at the post on their own phone or an authorised Central Device."],
  ["Patrols", "QR or NFC checkpoints. If signal drops, the patrol keeps recording and syncs when it is back."],
  ["Occurrence book and incidents", "One chronological record of what happened on site, with incidents logged as they happen."],
  ["SOS to the control room", "An SOS lands in the control-room queue to acknowledge, navigate to and resolve."],
  ["People and access", "Invite supervisors, limit each one to their sites, and switch access off without deleting history."],
] as const;

const equipment = [
  {
    category: "Radios and PTT",
    items: ["Hytera PNC360S", "P30 Lite PoC", "E600 PoC LTE", "PTT platform with SIM and data"],
    terms: "Rental, 12, 24 or 36 months",
  },
  {
    category: "Vehicle and asset tracking",
    items: ["FMC920 tracker", "FMB920 tracker"],
    terms: "Scoped per vehicle or asset",
  },
  {
    category: "Body cameras",
    items: ["SC780 body camera"],
    terms: "Rental",
  },
] as const;

const companySees = [
  "Every site, post, guard and shift",
  "The control-room queue and SOS",
  "Occurrence book and incidents as they happen",
  "Supervisors, access and audit history",
  "Proof of service across all clients",
] as const;

const clientSees = [
  "Only the sites authorised for them",
  "Scheduled service coverage",
  "Patrol and checkpoint evidence",
  "Incidents on their sites",
  "Proof-of-service reports they can generate themselves",
] as const;

export default function Home() {
  const proveShot = proofViews.find((view) => view.id === "proof")?.shots[0];

  return (
    <main id="main">
      {/* 1 · HERO */}
      <section className="surface-ink relative">
        <HeroPhoto src={photos.hero.src} alt={photos.hero.alt} objectPositionMobile="66% 45%" objectPosition="74% 40%" />
        <div className="wrap relative pb-14 pt-10 lg:flex lg:min-h-[clamp(620px,44vw,780px)] lg:items-center lg:pb-24 lg:pt-24">
          <div className="max-w-[48rem]">
            <Kicker tone="dark">For growing South African security companies</Kicker>
            <h1 className="t-display mt-5">
              Win more contracts.
              <br />
              Run every site.
              <br />
              <span className="text-signal-bright">Prove the service.</span>
            </h1>
            <p className="t-lead measure mt-6 text-text-inv-2">
              One operating system for guard hiring, sites, shifts, patrols, the control room, radios and PTT, tracking
              and the proof your clients ask for.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#product" size="lg" event="hero_product_proof" eventLabel="Hero primary">
                See Signal One in action
              </ButtonLink>
              <ButtonLink href="/pricing#calculator" variant="ghost-dark" size="lg" event="hero_pricing" eventLabel="Hero secondary">
                <span className="sm:hidden">Calculate guard cost · R2/day</span>
                <span className="hidden sm:inline">Calculate guard cost · R2 per guard per day</span>
              </ButtonLink>
            </div>
            <p className="t-small mt-6 text-text-inv-2">
              Your guards can use their own phones or an authorised Central Device.
            </p>
            <p className="t-caption mt-3 text-text-inv-2/80">{illustrativeCaption}</p>
          </div>
        </div>
      </section>

      {/* 2 + 3 · PROBLEM → REAL PRODUCT */}
      <section id="product" className="surface-paper section scroll-mt-[72px]">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <Kicker>The problem</Kicker>
              <h2 className="t-h2 mt-4">Winning the contract is only the beginning.</h2>
              <p className="t-lead mt-5 text-text-2">
                Then the questions start, usually on WhatsApp and often at 2am. Most companies answer them from group
                chats, spreadsheets, paper OBs and phone calls.
              </p>
            </div>
            <ul className="m-0 grid list-none gap-0 p-0 sm:grid-cols-2 sm:gap-x-10">
              {ownerQuestions.map((question) => (
                <li key={question} className="border-t border-line py-4 font-display text-[1.25rem] font-semibold leading-snug md:text-[1.375rem]">
                  {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 border-t-2 border-ink pt-10 md:mt-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="t-h2">Signal One answers them from one record.</h2>
                <p className="t-body measure mt-4 text-text-2">
                  These are real Signal One Guard screens, not mock-ups. The data is synthetic.
                </p>
              </div>
              <Link href="/solutions/security" className="link-arrow shrink-0 text-signal">
                Everything the platform does <Arrow />
              </Link>
            </div>
            <div className="mt-10">
              <ProductProof />
            </div>
          </div>
        </div>
      </section>

      {/* 4 · HIRE */}
      <PhotoBand
        src={photos.warehouse.src}
        alt={photos.warehouse.alt}
        objectPosition="50% 38%"
        kicker={
          <span className="flex flex-wrap items-center gap-3">
            <Kicker tone="dark">Hire</Kicker>
            <Status kind="mvp" tone="dark">
              Guard Marketplace · MVP in development
            </Status>
          </span>
        }
        headline="Won the contract? Staff it."
        caption={illustrativeCaption}
      />
      <section className="surface-ink section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <p className="t-lead measure text-text-inv-2">
              Guard Marketplace is the hiring step we are building into Signal One. Find guards near the site, shortlist
              them and send a hire request. The guard accepts or declines on their phone, and accepted guards join your
              workforce, ready for a site and a shift.
            </p>
            <Link href="/guard-marketplace" className="link-arrow mt-8 text-signal-bright">
              See how Marketplace will work <Arrow />
            </Link>
          </div>
          <div>
            <ol aria-label="Marketplace hiring flow" className="m-0 flex list-none flex-wrap gap-x-2 gap-y-3 p-0">
              {hireFlow.map((step, index) => (
                <li key={step} className="flex items-center gap-2 text-[1rem] font-medium">
                  <span className="rounded-ui border border-line-dark bg-graphite px-3 py-2">{step}</span>
                  {index < hireFlow.length - 1 ? <span aria-hidden="true" className="text-text-inv-2">→</span> : null}
                </li>
              ))}
            </ol>

            <dl className="mt-12 grid gap-6 border-t border-line-dark pt-8 sm:grid-cols-2">
              <div>
                <dt className="t-h4">Five filters, nothing else</dt>
                <dd className="t-small m-0 mt-2 text-text-inv-2">Location, PSiRA grade, availability, experience and skills.</dd>
              </div>
              <div>
                <dt className="t-h4">Private, not a jobs board</dt>
                <dd className="t-small m-0 mt-2 text-text-inv-2">
                  Profiles stay inside your signed-in company workspace. Nothing is published publicly.
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="t-h4 flex flex-wrap items-center gap-3">
                  Already live <Status kind="live" tone="dark">Live</Status>
                </dt>
                <dd className="t-small m-0 mt-2 text-text-inv-2">
                  Offer open posts to your own guards in Signal One Guard. They accept or decline in the app.
                </dd>
              </div>
            </dl>

          </div>
        </div>
      </section>

      {/* 5 · RUN */}
      <PhotoBand
        src={photos.estateNight.src}
        alt={photos.estateNight.alt}
        objectPosition="50% 20%"
        textSide="right"
        kicker={
          <span className="flex flex-wrap items-center gap-3">
            <Kicker tone="dark">Run</Kicker>
            <Status kind="live" tone="dark">
              Live
            </Status>
          </span>
        }
        headline="Run every site from one record."
        caption={illustrativeCaption}
      />
      <section className="surface-paper section">
        <div className="wrap">
          <p className="t-lead measure text-text-2">
            Sites, shifts, attendance, patrols, incidents and SOS feed the same operational record your control room,
            managers and clients work from.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <Photo
              src={photos.siteOperations.src}
              alt={photos.siteOperations.alt}
              sizes="(min-width: 1320px) 720px, (min-width: 1024px) 58vw, 100vw"
              className="w-full self-start"
              aspect="aspect-[4/3]"
              imgClassName="object-cover object-[30%_50%]"
              caption={illustrativeCaption + ". Day shift at an office park."}
            />
            <div>
              <ul className="m-0 grid list-none p-0">
                {runCapabilities.map(([title, body]) => (
                  <li key={title} className="border-t border-line py-5">
                    <h3 className="t-h4">{title}</h3>
                    <p className="t-small mt-1 text-text-2">{body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-card bg-white p-6 ring-1 ring-line">
                <h3 className="t-h4">PSiRA rules are built in</h3>
                <p className="t-small mt-2 text-text-2">
                  Each officer&apos;s PSiRA number, grade and expiry are recorded. A missing or expired registration blocks
                  the assignment. Only a grade mismatch can be overridden, and every override is logged with a reason.
                  Signal One does not check registrations with PSiRA itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · EQUIP */}
      <section className="surface-paper-2 section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Kicker>Equip</Kicker>
                <Status kind="quote">By quote</Status>
              </div>
              <h2 className="t-h2 mt-4">Radios, PTT, tracking and body cameras for the contract.</h2>
            </div>
            <p className="t-body text-text-2">
              Tell us the sites, quantities and term. We confirm availability, fit and price in a written quote. No cart,
              no online prices.
            </p>
          </div>

          <div className="mt-12 border-b border-line">
            {equipment.map((group) => (
              <div key={group.category} className="grid gap-3 border-t border-line py-6 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)] md:gap-8">
                <h3 className="t-h3">{group.category}</h3>
                <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 text-[1.0625rem] font-medium">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="t-small text-text-2 md:text-right">{group.terms}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="t-small measure text-text-2">
              Equipment is available to rent today. Controls for activating devices and viewing tracking inside Signal
              One Guard are <strong className="font-semibold text-text">coming soon</strong>.
            </p>
            <ButtonLink href="/radios-equipment#quote" variant="ghost-light" className="shrink-0">
              Request an equipment quote
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 7 · PROVE */}
      <section className="surface-ink section">
        <div className="wrap">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <Kicker tone="dark">Prove</Kicker>
              <Status kind="live" tone="dark">
                Client portal · Live
              </Status>
            </div>
            <h2 className="t-h2 mt-4">Transparency without giving away the operation.</h2>
            <p className="t-lead mt-5 text-text-inv-2">
              Your clients sign in to see the service you deliver on their sites. They never see your whole workspace.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-card bg-line-dark md:grid-cols-2">
            <div className="bg-graphite p-6 sm:p-8">
              <h3 className="t-h3">Your security company sees</h3>
              <ul className="m-0 mt-5 grid list-none gap-3 p-0">
                {companySees.map((item) => (
                  <li key={item} className="t-body flex gap-3">
                    <Check className="mt-1 text-text-inv-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-graphite p-6 sm:p-8">
              <h3 className="t-h3">Your client sees</h3>
              <ul className="m-0 mt-5 grid list-none gap-3 p-0">
                {clientSees.map((item) => (
                  <li key={item} className="t-body flex gap-3">
                    <Check className="mt-1 text-signal-bright" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="t-small mt-6 border-t border-line-dark pt-4 text-text-inv-2">
                <Status kind="soon" tone="dark">
                  Coming soon
                </Status>{" "}
                Live map, clock-in status and live patrol progress for clients.
              </p>
            </div>
          </div>

          {proveShot ? (
            <ProductWindow screen="Proof of service" shot={proveShot} className="mt-14" />
          ) : null}
        </div>
      </section>

      {/* 8 · PRICING */}
      <section className="surface-paper section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
          <div>
            <Kicker>Pricing</Kicker>
            <h2 className="sr-only">R2 per guard per day, excluding VAT</h2>
            <p aria-hidden="true" className="mt-6 flex items-end gap-4">
              <span className="t-num text-[6.5rem] text-signal sm:text-[8.5rem]">R2</span>
              <span className="pb-3 font-display text-[1.375rem] font-semibold leading-tight sm:text-[1.625rem]">
                per guard
                <br />
                per day
              </span>
            </p>
            <p className="t-body mt-4 text-text-2">Excluding VAT. One price, no tiers or packages.</p>

            <dl className="mt-8 grid gap-0">
              {[
                ["A guard day", "One allocated guard clocking in and out of one on-site shift."],
                ["Minimum purchase", "10 guard days."],
                ["Unused days", "Carry over."],
                ["Exceptions", "No-shows, cancellations, partial and multiple shifts follow your customer terms."],
              ].map(([term, detail]) => (
                <div key={term} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="t-small m-0 text-text-2">{detail}</dd>
                </div>
              ))}
            </dl>
            <Link href="/pricing" className="link-arrow mt-4 text-signal">
              Full pricing details <Arrow />
            </Link>
          </div>
          <GuardDayCalculator />
        </div>
      </section>

      {/* 9 · NEXT STEP */}
      <section className="surface-ink section">
        <div className="wrap">
          <h2 className="t-h2 max-w-3xl">See it, price it, or talk to us.</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-card bg-line-dark md:grid-cols-3">
            {[
              {
                title: "See the product",
                body: "Walk through every part of the platform with real screens.",
                href: "/solutions/security",
                cta: "Explore the platform",
                variant: "ghost-dark" as const,
              },
              {
                title: "Calculate guard cost",
                body: "Guards × days × R2. See the number before you talk to anyone.",
                href: "/pricing#calculator",
                cta: "Open the calculator",
                variant: "ghost-dark" as const,
              },
              {
                title: "Talk to Signal One",
                body: "Tell us about your sites and contracts. A representative replies by email or phone.",
                href: "/contact",
                cta: "Talk to Signal One",
                variant: "primary" as const,
              },
            ].map((option) => (
              <div key={option.title} className="flex flex-col bg-graphite p-6 sm:p-8">
                <h3 className="t-h3">{option.title}</h3>
                <p className="t-body mt-3 text-text-inv-2">{option.body}</p>
                <ButtonLink href={option.href} variant={option.variant} className="mt-8 self-start">
                  {option.cta}
                </ButtonLink>
              </div>
            ))}
          </div>
          <p className="t-small mt-8 text-text-inv-2">
            Prefer email?{" "}
            <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold text-text-inv">
              sales@signalone.co.za
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
