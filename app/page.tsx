import type { Metadata } from "next";
import { getImageProps } from "next/image";
import Link from "next/link";
import GuardDayCalculator from "./components/GuardDayCalculator";
import BusinessJourney from "./components/BusinessJourney";
import EquipmentShowcase from "./components/EquipmentShowcase";
import DemoLauncher from "./components/DemoLauncher";
import { Arrow, ButtonLink, Kicker, GuardStatus } from "./components/ui";
import HomeWorkflow from "./components/HomeWorkflow";
import {
  guardOnboardingLine,
  guardIsLive,
  guardStatusLabel,
} from "./lib/guardStatus";
import { illustrativeCaption, photos } from "./lib/photos";
import { guardDayPrice, minimumPhrase, priceTerms } from "./lib/pricing";

export const metadata: Metadata = {
  title: {
    absolute: "Security Guard Management Software South Africa | Signal One",
  },
  alternates: { canonical: "/" },
};

export default function Home() {
  // Keep Next's responsive optimisation, but paint the critical photograph without image hydration.
  const { props: heroImage } = getImageProps({
    src: photos.guardPatrol.src,
    alt: photos.guardPatrol.alt,
    fill: true,
    sizes: "(min-width: 768px) 960px, 320px",
    quality: 80,
    fetchPriority: "high",
    decoding: "sync",
    loading: "eager",
  });
  return (
    <main id="main">
      <link
        rel="preload"
        as="image"
        imageSrcSet={heroImage.srcSet}
        imageSizes={heroImage.sizes}
        fetchPriority="high"
      />
      <section className="mission-hero" aria-labelledby="home-heading">
        <div className="wrap">
          <div className="mission-hero-intro">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Kicker tone="dark">Technology for security operations</Kicker>
                <GuardStatus tone="dark" />
              </div>
              <h1 id="home-heading">
                From the field.
                <br />
                To <em>proof of service.</em>
              </h1>
            </div>
            <div className="mission-hero-copy">
              <p className="t-lead text-text-inv-2">
                Connect your guards, sites and control room through Signal One
                GUARD. Turn everyday operational activity into evidence your
                clients can use.
              </p>
              <div className="mission-hero-actions">
                <a
                  className="btn btn-primary btn-lg"
                  href="#home-workflow"
                  data-analytics-event="hero_product_proof"
                  data-analytics-label="Visible workflow"
                >
                  Follow the evidence <span aria-hidden="true">↓</span>
                </a>
                <DemoLauncher secondary />
              </div>
            </div>
          </div>
          <HomeWorkflow>
            <div className="home-field-photo">
              <picture>
                <img {...heroImage} alt={heroImage.alt} />
              </picture>
            </div>
            <p className="home-field-caption">{illustrativeCaption}</p>
          </HomeWorkflow>
          <div className="mission-hero-foot">
            <p>
              Software for your security company. Equipment for your contracts.
            </p>
            <ButtonLink
              href="/pricing#calculator"
              variant="ghost-dark"
              event="hero_pricing"
              eventLabel="Hero secondary"
            >
              Calculate guard cost <Arrow />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section
        id="product"
        className="surface-light mission-section scroll-mt-[72px]"
      >
        <div className="wrap">
          <div className="mission-section-head">
            <div>
              <Kicker>Your operation, connected</Kicker>
              <h2>
                One business.
                <br />
                Every next step.
              </h2>
            </div>
            <p>
              Win the work, build your workforce, run the sites and equip the
              field. Give your clients the evidence behind the service.
            </p>
          </div>
          <BusinessJourney guardLabel={guardStatusLabel} />
        </div>
      </section>

      <section className="surface-white mission-section">
        <div className="wrap">
          <div className="mission-section-head">
            <div>
              <Kicker>Equipment for the field</Kicker>
              <h2>
                Built to go
                <br />
                where the work is.
              </h2>
            </div>
            <p>
              Genuine Hytera radios and Teltonika trackers, specified for your
              sites. Choose a model and start a rental or deployment enquiry.
            </p>
          </div>
          <EquipmentShowcase compact />
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <p className="t-caption text-text-2">
              Equipment is supplied alongside GUARD. In-platform device
              activation and tracking are coming soon.
            </p>
            <Link
              prefetch={false}
              data-route-intent=""
              href="/radios-equipment"
              className="link-arrow text-signal-ink"
            >
              Full equipment catalogue <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-light mission-section">
        <div className="wrap mission-pricing">
          <div>
            <Kicker>Simple guard-day pricing</Kicker>
            <h2 className="t-h2">
              Scale with the
              <br />
              work you do.
            </h2>
            <p className="mission-price">
              {guardDayPrice}
              <span>
                per guard
                <br />
                per day
              </span>
            </p>
            <p className="t-small mt-5 text-text-2">
              {priceTerms} Unused guard days carry over.
            </p>
            <p className="t-small mt-3 text-text-2">
              One platform rate. Equipment is quoted separately.
            </p>
            {(guardIsLive || guardOnboardingLine) && (
              <p className="t-small mt-4 font-semibold">
                {guardIsLive
                  ? "Already live in Signal One GUARD."
                  : guardOnboardingLine}
              </p>
            )}
            <Link
              prefetch={false}
              data-route-intent=""
              href="/pricing"
              className="link-arrow text-signal-ink mt-6"
            >
              Pricing and all commercial terms <Arrow />
            </Link>
            <span className="sr-only">Minimum purchase {minimumPhrase}.</span>
          </div>
          <GuardDayCalculator />
        </div>
      </section>

      <section className="surface-base mission-section">
        <div className="wrap mission-closing">
          <div>
            <Kicker tone="dark">Let’s connect your operation</Kicker>
            <h2 className="t-h2 mt-4">
              Your next chapter
              <br />
              starts with a conversation.
            </h2>
            <p>Tell us about your company, sites and contracts.</p>
          </div>
          <div className="mission-closing-links">
            <ButtonLink href="/contact" size="lg">
              Request a walkthrough <Arrow />
            </ButtonLink>
            <ButtonLink href="/get-started" variant="ghost-dark" size="lg">
              Start company onboarding
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
