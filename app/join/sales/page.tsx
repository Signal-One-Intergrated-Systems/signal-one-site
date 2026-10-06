import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import SalesApplication from "../../components/journey/SalesApplication";
import { Photo } from "../../components/ui";
import { getCareersConfig } from "../../lib/careers";
import { photos } from "../../lib/photos";

// Recruitment status comes from server env at request time.
export const dynamic = "force-dynamic";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Careers: Sales Representative at Signal One",
  description: "Work at Signal One as a sales representative, selling the operating system South African security companies run on.",
  robots: { index: false, follow: true },
};

const youWill = [
  "Meet owners and operations managers of South African security companies",
  "Show them the platform on their own operation",
  "Explain guard-day pricing and scope radio, tracking and body-camera quotes",
  "Take new companies through onboarding",
] as const;

const weExpect = [
  "You are comfortable in a room with a business owner",
  "You follow up when you said you would",
  "You are honest about what the product does, and what it does not do yet",
  "Security-industry experience helps, but it is not required",
] as const;

const process = [
  ["Apply", "This form. About eight minutes, saved as you go."],
  ["Review", "The Signal One team reviews your application."],
  ["CV request", "If you are shortlisted, we email you to ask for your CV."],
  ["Interview", "We offer interview slots by email, based on the preferences you give."],
  ["Decision", "We email you the outcome."],
  ["Onboarding", "Successful candidates are onboarded and get access to Signal One's internal Sales OS."],
] as const;

export default function SalesCareersPage() {
  const config = getCareersConfig();
  const open = config.status === "open";

  return (
    <main id="main" className={serif.variable + " bg-paper text-text"}>
      <section>
        <div className="wrap grid gap-10 py-12 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <p className="t-kicker text-brass">Careers at Signal One</p>
            <h1 className="mt-4 font-serif text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[4rem]">
              Sell the system security companies run on.
            </h1>
            <p className="t-lead measure mt-6 text-text-2">
              We are building a sales team to work for Signal One itself, bringing South African security companies onto
              Signal One Security.
            </p>
            <p className="mt-8 inline-flex flex-wrap items-center gap-3">
              <span
                className={
                  "rounded-full px-4 py-2 text-[0.9375rem] font-semibold " +
                  (open ? "bg-brass-tint text-brass" : "bg-soon-tint text-soon")
                }
              >
                {open
                  ? config.openRoles
                    ? "Applications open · " + config.openRoles + (config.openRoles === 1 ? " role" : " roles")
                    : "Applications open"
                  : "Applications closed"}
              </span>
              {open ? (
                <a href="#apply" className="btn btn-brass">
                  Apply now
                </a>
              ) : null}
            </p>
          </div>
          <Photo
            src={photos.careersDesk.src}
            alt={photos.careersDesk.alt}
            priority
            sizes="(min-width: 1024px) 480px, 100vw"
            className="mx-auto aspect-[4/3] w-full max-w-[480px]"
            imgClassName="object-cover object-[60%_50%]"
            caption="Illustrative scene"
          />
        </div>
      </section>

      <section id="role" className="scroll-mt-[72px] bg-white py-16 md:py-24">
        <div className="wrap">
          <h2 className="font-serif text-[2.25rem] font-semibold leading-tight sm:text-[2.75rem]">The role</h2>
          <p className="t-lead measure mt-4 text-text-2">Sales representative, selling to security companies.</p>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="t-h3">What you will do</h3>
              <ul className="m-0 mt-4 list-none p-0">
                {youWill.map((item) => (
                  <li key={item} className="t-body border-t border-line py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="t-h3">What we look for</h3>
              <ul className="m-0 mt-4 list-none p-0">
                {weExpect.map((item) => (
                  <li key={item} className="t-body border-t border-line py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="t-small mt-10 text-text-2">
            You will work in Signal One&apos;s internal Sales OS for leads, pipeline, follow-ups and quotes. Pay and terms
            are discussed at interview.
          </p>
        </div>
      </section>

      <section id="process" className="scroll-mt-[72px] py-16 md:py-24">
        <div className="wrap">
          <h2 className="font-serif text-[2.25rem] font-semibold leading-tight sm:text-[2.75rem]">How hiring works</h2>
          <ol className="m-0 mt-10 grid list-none gap-x-8 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {process.map(([title, body], index) => (
              <li key={title} className="border-t-2 border-brass pt-4">
                <span className="font-serif text-[2rem] font-semibold text-brass">{index + 1}</span>
                <h3 className="t-h4 mt-1">{title}</h3>
                <p className="t-small mt-1 text-text-2">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="scroll-mt-[72px] bg-night py-16 text-text-inv md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="font-serif text-[2.25rem] font-semibold leading-tight sm:text-[2.75rem]">
              {open ? "Apply" : "Applications are closed"}
            </h2>
            <p className="t-body mt-4 text-text-inv-2">
              {open
                ? "Seven short steps. Your answers are saved in this browser, so you can finish later."
                : "We are not recruiting sales representatives right now. When the next intake opens, it will be announced on this page."}
            </p>
          </div>
          <div className="text-text">
            {open ? (
              <SalesApplication roleCount={config.openRoles} />
            ) : (
              <div className="rounded-card bg-white p-6 sm:p-8">
                <h3 className="t-h3">No open roles at the moment</h3>
                <p className="t-body mt-3 text-text-2">
                  Thank you for your interest. Please check this page again; we do not keep a waiting list.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="wrap flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="t-h4">Already a Signal One representative?</h2>
            <p className="t-small text-text-2">Sign in to Sales OS with the account your manager set up for you.</p>
          </div>
          {config.salesOsUrl ? (
            <a href={config.salesOsUrl} className="btn btn-ghost-light" rel="noopener">
              Sign in to Sales OS
            </a>
          ) : (
            <p className="t-small rounded-ui bg-paper-2 px-4 py-3 text-text-2">
              Sales OS sign-in: use the link from your onboarding email.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
