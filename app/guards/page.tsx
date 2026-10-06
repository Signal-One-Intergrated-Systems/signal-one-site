import type { Metadata } from "next";
import Link from "next/link";
import { Check, Photo } from "../components/ui";
import { photos } from "../lib/photos";

export const metadata: Metadata = {
  title: "For Security Officers: Signal One Guard and Guard Marketplace",
  description:
    "For security officers in South Africa: how the Signal One Guard app works on shift, how Guard Marketplace hire requests will work, what PSiRA details we ask for and why, and how your information is kept private.",
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
  ["We contact you", "To confirm your details and your PSiRA registration."],
  ["Hire requests", "When Guard Marketplace opens, companies near you can send a hire request."],
  ["You decide", "Accept or decline. If you accept, the company adds you to its team and gives you shifts."],
] as const;

export default function GuardsPage() {
  return (
    <main id="main" className="bg-sand text-text">
      <section>
        <div className="wrap grid gap-10 py-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center md:gap-14 md:py-20">
          <div>
            <p className="text-[1.0625rem] font-semibold text-field">For security officers</p>
            <h1 className="mt-4 font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.025em] sm:text-[3.75rem]">
              Your work, on record. Your next job, your choice.
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.25rem] leading-relaxed text-text-2">
              Signal One Guard is the app you use on shift. Guard Marketplace, coming soon, lets security companies find
              you for new work. You always decide whether to take it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/guards/join" className="btn btn-field btn-lg">
                Create your profile
              </Link>
              <Link href="#how-it-works" className="btn btn-ghost-light btn-lg">
                How it works
              </Link>
            </div>
          </div>
          <Photo
            src={photos.guardCheckpoint.src}
            alt={photos.guardCheckpoint.alt}
            priority
            sizes="(min-width: 768px) 420px, 100vw"
            className="mx-auto aspect-[4/5] w-full max-w-[420px]"
            imgClassName="object-cover object-[30%_50%]"
            caption="Illustrative scene"
          />
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-[72px] bg-white py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[2.25rem] font-bold leading-tight tracking-[-0.02em]">On shift: the Guard app</h2>
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
              <h2 className="font-display text-[2.25rem] font-bold leading-tight tracking-[-0.02em]">New work: Marketplace</h2>
              <span className="rounded-full bg-beta-tint px-3 py-1 text-[0.9375rem] font-semibold text-beta">Coming soon</span>
            </div>
            <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">
              Security companies that win new contracts need guards. Marketplace will let them find you by:
            </p>
            <ul className="m-0 mt-6 grid list-none gap-3 p-0 text-[1.125rem]">
              {["Where you can work", "Your PSiRA grade", "When you are available", "Your experience", "Your skills"].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 text-field" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[1.0625rem] text-text-2">
              No ratings, no scores, no badges. A company sends you a hire request, and you accept or decline it.
            </p>
          </div>
        </div>
      </section>

      <section id="psira" className="scroll-mt-[72px] py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-[2.25rem] font-bold leading-tight tracking-[-0.02em]">PSiRA: what we ask and why</h2>
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
            <h2 className="font-display text-[2.25rem] font-bold leading-tight tracking-[-0.02em]">Your information</h2>
            <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">Handled under POPIA. Here is the short version.</p>
          </div>
          <ul className="m-0 grid list-none gap-4 p-0 text-[1.125rem]">
            {[
              "Your profile is never shown on a public website or jobs board.",
              "Only signed-in Signal One client companies will see it, once Marketplace opens.",
              "We do not ask for your ID number on the form.",
              "You decide on every hire request.",
              "You can ask us to correct or delete your information at any time.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-1 text-field" />
                {item}
              </li>
            ))}
            <li className="mt-2 text-[1.0625rem] text-text-2">
              Questions or requests:{" "}
              <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold text-field">
                sales@signalone.co.za
              </a>
              . Full detail on our{" "}
              <Link href="/popia" className="link-inline font-semibold text-field">
                POPIA page
              </Link>
              .
            </li>
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          <h2 className="font-display text-[2.25rem] font-bold leading-tight tracking-[-0.02em]">How joining works</h2>
          <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-4">
            {joinSteps.map(([title, body], index) => (
              <li key={title} className="border-t-2 border-field pt-4">
                <span className="t-num text-[2rem] text-field">{index + 1}</span>
                <h3 className="mt-2 text-[1.1875rem] font-semibold">{title}</h3>
                <p className="mt-1 text-[1.0625rem] text-text-2">{body}</p>
              </li>
            ))}
          </ol>
          <Link href="/guards/join" className="btn btn-field btn-lg mt-10">
            Create your profile
          </Link>
        </div>
      </section>
    </main>
  );
}
