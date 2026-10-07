import type { Metadata } from "next";
import { ProductWindow } from "../../components/ProductProof";
import { ButtonLink, Check, Kicker, Photo, SplitHero, Status } from "../../components/ui";
import { illustrativeCaption, photos } from "../../lib/photos";
import { proofViews } from "../../lib/productProof";

export const metadata: Metadata = {
  title: "Security Company Software: Patrols, Attendance, SOS",
  description:
    "Guard management software for South African security companies: sites, shifts, attendance, QR and NFC patrols, SOS, control room and proof of service.",
  alternates: { canonical: "/solutions/security" },
};

function view(id: string) {
  const found = proofViews.find((item) => item.id === id);
  if (!found) throw new Error("Unknown proof view " + id);
  return found;
}

const fieldCapabilities = [
  ["Clock in and out at the post", "On the guard's own phone or an authorised Central Device at the site. The attendance record belongs to the shift and the post."],
  ["Patrols with QR or NFC checkpoints", "Guards scan each checkpoint on the route. Missed and late checkpoints show up in proof of service."],
  ["Keeps working offline", "Scans, clock events, incidents and occurrence entries are saved on the phone and sent when signal returns. SOS needs a mobile signal to reach the control room."],
  ["Occurrence book and incidents", "A chronological record of the shift, with incidents logged as they happen instead of written up afterwards."],
  ["SOS", "One press sends an alert to the control room with the guard's position when the phone has a fix. It needs a mobile signal."],
  ["Shift offers", "Offer an open post to your own guards. They accept or decline in the app."],
] as const;

export default function SecurityPlatformPage() {
  const control = view("control");
  const proof = view("proof");
  const people = view("people");

  return (
    <main id="main">
      <SplitHero src={photos.teamBriefing.src} alt={photos.teamBriefing.alt} objectPositionMobile="55% 50%" objectPosition="62% 45%">
        <div className="flex flex-wrap items-center gap-3">
          <Kicker tone="dark">Signal One Security · the platform</Kicker>
          <Status kind="live" tone="dark">
            Live
          </Status>
        </div>
        <h1 className="t-hero mt-5">Run security operations from the record, not the group chat.</h1>
        <p className="t-lead measure mt-6 text-text-inv-2">
          Sites, posts, shifts, attendance, patrols, incidents, SOS, the control room and client proof of service. One
          system for owners, supervisors, control-room operators, guards and your clients.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">
            Talk to Signal One
          </ButtonLink>
          <ButtonLink href="/pricing" variant="ghost-dark" size="lg">
            R2 per guard per day
          </ButtonLink>
        </div>
        <p className="t-caption mt-6 text-text-inv-2">{illustrativeCaption}</p>
      </SplitHero>

      {/* Coverage */}
      <section className="surface-light section">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
          <div>
            <Kicker>Coverage and supervision</Kicker>
            <h2 className="t-h2 mt-4">Know which posts are short before the client does.</h2>
            <p className="t-body mt-5 text-text-2">The supervisor&rsquo;s day in one place: your sites, the roster against each post, shortfalls, and every SOS or late patrol waiting for action.</p>
            <ul className="m-0 mt-6 grid list-none gap-3 p-0">
              {["Sites, posts and shifts", "Roster or map view", "Shortfalls per post", "Guards on duty now"].map((item) => (
                <li key={item} className="t-body flex gap-3">
                  <Check className="mt-1 text-signal-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-6">
            <ProductWindow screen={control.screen} shot={control.shots[0]} priority />
            <h3 className="t-h3">The control room sees every SOS in order.</h3>
            <p className="t-body text-text-2">{control.body}</p>
            <p className="t-body text-text-2">
              Supervisors see each post&rsquo;s roster and any shortfall before the shift starts, and the map shows the last known
              position of each guard with its age.
            </p>
          </div>
        </div>
      </section>

      {/* Field */}
      <section className="surface-white section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-end lg:gap-14">
            <div>
              <Kicker>On site</Kicker>
              <h2 className="t-h2 mt-4">What the guard does, on record.</h2>
            </div>
            <p className="t-body text-text-2">
              Guards use the Signal One Guard app on their own phone or an authorised Central Device.
            </p>
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
            <Photo
              src={photos.guardPatrol.src}
              alt={photos.guardPatrol.alt}
              sizes="(min-width: 1320px) 720px, (min-width: 1024px) 58vw, 100vw"
              className="w-full"
              aspect="aspect-[16/10]"
              imgClassName="object-cover object-[50%_50%]"
              caption={illustrativeCaption}
            />
            <ul className="m-0 grid list-none p-0">
              {fieldCapabilities.map(([title, body]) => (
                <li key={title} className="border-t border-line py-5">
                  <h3 className="t-h4">{title}</h3>
                  <p className="t-small mt-1 text-text-2">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PSiRA */}
      <section className="surface-light-2 section">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <Kicker>PSiRA</Kicker>
            <h2 className="t-h2 mt-4">Every assignment checks PSiRA status.</h2>
          </div>
          <dl className="m-0">
            {[
              ["What is recorded", "Each officer's PSiRA registration number, grade and expiry date."],
              ["Missing or expired registration", "Blocks the assignment. It cannot be overridden."],
              ["Grade below what the post needs", "Can be overridden by an authorised user, who must give a reason. The override is logged."],
              ["What Signal One does not do", "Check registrations with PSiRA or run background checks. Records are as entered by your company."],
            ].map(([term, detail]) => (
              <div key={term} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="font-semibold">{term}</dt>
                <dd className="t-body m-0 text-text-2">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Proof + client portal */}
      <section className="surface-base section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Kicker tone="dark">Proof of service and client portal</Kicker>
                <Status kind="live" tone="dark">
                  Live
                </Status>
              </div>
              <h2 className="t-h2 mt-4">Show the client what was delivered.</h2>
              <p className="t-body mt-5 text-text-inv-2">{proof.body}</p>
              <p className="t-body mt-4 text-text-inv-2">
                Your clients get their own sign-in. They see only their authorised sites: service coverage, patrol and
                checkpoint evidence, incidents, and proof-of-service reports that client users can generate themselves.
                They never see the rest of your operation.
              </p>
              <p className="t-small mt-6 border-t border-line-dark pt-4 text-text-inv-2">
                <Status kind="soon" tone="dark">
                  Coming soon
                </Status>{" "}
                A live map, clock-in status and live patrol progress for client users.
              </p>
            </div>
            <ProductWindow screen={proof.screen} shot={proof.shots[0]} />
          </div>
        </div>
      </section>

      {/* People & access */}
      <section className="surface-light section">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
          <ProductWindow screen={people.screen} shot={people.shots[0]} className="order-2 lg:order-1" />
          <div className="order-1 lg:order-2">
            <Kicker>People and access</Kicker>
            <h2 className="t-h2 mt-4">Supervisors see their sites. Nobody sees more than they should.</h2>
            <p className="t-body mt-5 text-text-2">{people.body}</p>
          </div>
        </div>
      </section>

      <section className="surface-base section">
        <div className="wrap flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="t-h2">See it on your own operation.</h2>
            <p className="t-lead mt-4 text-text-inv-2">
              Tell us your sites and guard numbers. We walk you through the platform using your setup, not a generic demo.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/pricing#calculator" variant="ghost-dark" size="lg">
              Calculate guard cost
            </ButtonLink>
            <ButtonLink href="/contact" size="lg">
              Talk to Signal One
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
