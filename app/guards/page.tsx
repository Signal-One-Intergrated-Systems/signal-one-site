import type { Metadata } from "next";
import Link from "next/link";
import { Check, SplitHero } from "../components/ui";
import { photos } from "../lib/photos";

export const metadata: Metadata = {
  title: "Security Officer App: Clock In, Patrol and SOS",
  description:
    "How the Signal One Guard app works on shift for security officers: clock in, QR and NFC patrols, occurrence book and SOS. What PSiRA details we ask for and why.",
  alternates: { canonical: "/guards" },
};

const onShift = [
  ["Clock in and out", "At your post, on your own phone or the site's authorised Central Device."],
  ["Walk your patrol", "Scan each checkpoint with QR or NFC. No signal? It keeps recording and sends later."],
  ["Report what happens", "Write in the occurrence book and log incidents as they happen."],
  ["Press SOS", "One button sends an alert to your control room."],
  ["Accept or decline offers", "Your company can offer you open shifts. You choose."],
] as const;

const joinSteps = [
  ["Create your profile", "About 5 minutes on your phone. Your progress is saved as you go."],
  ["Signal One reviews it", "We save your profile and review it."],
  ["We contact you", "To confirm your details and your PSiRA registration."],
  ["Marketplace, when it launches", "Signed-in Signal One client companies will be able to find your profile and send you a hire request. You accept or decline."],
] as const;

export default function GuardsPage() {
  return (
    <main id="main" className="bg-light text-text">
      <SplitHero src={photos.siteOperations.src} alt={photos.siteOperations.alt} side="left" objectPositionMobile="0% 8%" objectPosition="0% 12%">
          <p className="text-[1.0625rem] font-semibold text-signal-400">For security officers</p>
          <h1 className="t-hero mt-4">Your work, on record. Your next job, your choice.</h1>
          <p className="mt-6 text-[1.25rem] leading-relaxed text-text-inv-2">
            Signal One Guard is the app you use on shift. Guard Marketplace is not live yet. When it launches,
            signed-in security companies will be able to send you hire requests. You will always decide whether to accept.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/guards/join" className="btn btn-primary btn-lg">
              Create your profile
            </Link>
            <Link href="#how-it-works" className="btn btn-ghost-dark btn-lg">
              How it works
            </Link>
          </div>
          <p className="t-caption mt-6 text-text-inv-2">Illustrative scene · fictional security company</p>
      </SplitHero>

      <section id="how-it-works" className="scroll-mt-[72px] bg-white py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="t-h2">On shift: the Guard app</h2>
            <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">
              If your company uses Signal One, this is what you do in the app.
            </p>
            <ul className="m-0 mt-8 list-none p-0">
              {onShift.map(([title, body]) => (
                <li key={title} className="border-t border-line py-5">
                  <h3 className="text-[1.1875rem] font-semibold">{title}</h3>
                  <p className="mt-1 text-[1.0625rem] text-text-2">{body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="t-h2">Planned: Guard Marketplace</h2>
              <span className="rounded-full bg-beta-tint px-3 py-1 text-[0.9375rem] font-semibold text-beta">Coming soon</span>
            </div>
            <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">
              We are building Marketplace. When it launches, signed-in Signal One client companies will be able to find profiles by:
            </p>
            <ul className="m-0 mt-6 grid list-none gap-3 p-0 text-[1.125rem]">
              {["Where you can work", "Your PSiRA grade", "When you are available", "Your experience", "Your skills"].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 text-signal-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[1.0625rem] text-text-2">
              No ratings, no scores, no badges. A company will be able to send you a hire request, which you accept or decline. Nothing is live today, and we cannot promise when it will be or that you will receive any request.
            </p>
          </div>
        </div>
      </section>

      <section id="psira" className="scroll-mt-[72px] py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">PSiRA: what we ask and why</h2>
          </div>
          <div className="text-[1.125rem] leading-relaxed">
            <p>
              We ask for your <strong>PSiRA registration number, grade and expiry date</strong>.
            </p>
            <p className="mt-4 text-text-2">
              A company can only put you on a site if your registration is valid. In Signal One, a missing or expired
              registration blocks the assignment, and your grade decides which posts you can work.
            </p>
            <p className="mt-4 text-text-2">
              Signal One records the details you give. We do not check them with PSiRA, so keep them up to date, especially
              your expiry date.
            </p>
          </div>
        </div>
      </section>

      <section id="your-information" className="scroll-mt-[72px] bg-white py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="t-h2">Your information</h2>
            <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">Handled under POPIA. Here is the short version.</p>
          </div>
          <ul className="m-0 grid list-none gap-4 p-0 text-[1.125rem]">
            {[
              "Your profile is never shown on a public website or jobs board.",
              "Today we save it and Signal One reviews it. When Marketplace launches, only signed-in Signal One client companies will be able to find it.",
              "We do not ask for your ID number on the form.",
              "When hire requests exist, you decide on each one.",
              "You can ask us to correct or delete your information at any time.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-1 text-signal-ink" />
                {item}
              </li>
            ))}
            <li className="mt-2 text-[1.0625rem] text-text-2">
              Questions or requests:{" "}
              <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold text-signal-ink">
                sales@signalone.co.za
              </a>
              . Full detail on our{" "}
              <Link href="/popia" className="link-inline font-semibold text-signal-ink">
                POPIA page
              </Link>
              .
            </li>
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          <h2 className="t-h2">How joining works</h2>
          <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-4">
            {joinSteps.map(([title, body], index) => (
              <li key={title} className="border-t-2 border-field pt-4">
                <span className="t-num text-[2rem] text-signal-600">{index + 1}</span>
                <h3 className="mt-2 text-[1.1875rem] font-semibold">{title}</h3>
                <p className="mt-1 text-[1.0625rem] text-text-2">{body}</p>
              </li>
            ))}
          </ol>
          <Link href="/guards/join" className="btn btn-primary btn-lg mt-10">
            Create your profile
          </Link>
        </div>
      </section>
    </main>
  );
}
