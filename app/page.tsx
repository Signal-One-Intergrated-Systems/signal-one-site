import type { Metadata } from "next";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import GuardDayCalculator from "./components/GuardDayCalculator";
import BusinessJourney from "./components/BusinessJourney";
import EquipmentShowcase from "./components/EquipmentShowcase";
import DemoLauncher from "./components/DemoLauncher";
import { Arrow, ButtonLink, Kicker, GuardStatus } from "./components/ui";
import { catalogue } from "./lib/catalogue";
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
  const radio = catalogue[0].products[0];
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
          <div className="mission-hero-grid">
            <div className="mission-hero-copy">
              <div className="flex flex-wrap items-center gap-3">
                <Kicker tone="dark">Technology for security operations</Kicker>
                <GuardStatus tone="dark" />
              </div>
              <h1 id="home-heading">
                From the field.
                <br />
                To <em>proof of service.</em>
              </h1>
              <p className="t-lead text-text-inv-2">
                Connect your guards, sites and control room through Signal One
                GUARD. Turn everyday operational activity into evidence your
                clients can use.
              </p>
              <div className="mission-hero-actions">
                <DemoLauncher />
                <ButtonLink
                  href="/pricing#calculator"
                  variant="ghost-dark"
                  size="lg"
                  event="hero_pricing"
                  eventLabel="Hero secondary"
                >
                  Calculate guard cost <Arrow />
                </ButtonLink>
              </div>
              <p className="t-caption mt-5 text-text-inv-3">
                Software for your security company. Equipment for your
                contracts.
              </p>
            </div>
            <div className="mission-hero-scene">
              <div className="mission-hero-photo">
                <picture><img {...heroImage} alt={heroImage.alt} /></picture>
              </div>
              <div className="mission-scene-top">
                <span>Where the record begins.</span>
                <span aria-hidden="true">→</span>
              </div>
              <p className="mission-scene-caption">{illustrativeCaption}</p>
              <Link
                prefetch={false}
                data-route-intent=""
                href="/radios-equipment"
                className="mission-device"
              >
                <Image
                  src={radio.image!.src}
                  alt={radio.image!.alt}
                  width={130}
                  height={135}
                  sizes="80px"
                  quality={90}
                />
                <strong>Hytera PNC360S</strong>
                <small>By quote</small>
              </Link>
              <div className="mission-scene-bottom">
                <svg
                  aria-hidden="true"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M4 16h24M20 8l8 8-8 8" />
                </svg>
                <span>
                  Field activity.
                  <br />
                  Connected evidence.
                </span>
              </div>
            </div>
          </div>
          <div className="mission-hero-foot">
            <ol aria-label="Operational sequence">
              <li>
                <span>01</span> Field action
              </li>
              <li>
                <span>02</span> Operational record
              </li>
              <li>
                <span>03</span> Client evidence
              </li>
            </ol>
            <Link
              prefetch={false}
              data-route-intent=""
              href="/solutions/security"
              className="link-arrow text-signal-400"
            >
              Explore GUARD <Arrow />
            </Link>
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
