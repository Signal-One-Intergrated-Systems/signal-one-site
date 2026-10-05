import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MarketingHero from "../../components/MarketingHero";
import PlatformProof from "../../components/PlatformProof";

export const metadata: Metadata = {
  title: "Security Operations",
  description: "Run security operations from evidence with Signal One Guard attendance, post coverage, patrol verification, incidents, SOS and proof of service.",
};

const pillars = [
  ["Attendance", "Record clock-in and clock-out against the operational site, with geofence policy and preserved evidence.", "/images/logistics.jpg"],
  ["Post coverage", "See what each post requires, what is allocated, what is verified and where a shortfall needs action.", "/images/security.jpg"],
  ["Patrol verification", "Run routes and checkpoints with QR or NFC verification, GPS policy and offline synchronisation.", "/images/industries/security.jpg"],
  ["Occurrence & incidents", "Keep a chronological operational record of incidents, exceptions, corrections and response.", "/images/emergency.jpg"],
  ["Control Room", "Bring SOS, operational exceptions and live site awareness into the workspace used to respond.", "/images/What-we-deliver/platforms.jpg"],
  ["Proof of service", "Give management and authorised clients a clearer record of what was scheduled, what happened and what can be proven.", "/images/product-proof/proof-of-service-demo.jpg"],
] as const;

export default function SecuritySolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One Guard for security companies"
          title="Run security operations from evidence, not assumptions."
          body="Signal One Guard connects attendance, posts, patrol verification, incidents, SOS, occurrence records and proof of service so operations teams can see what is happening and preserve what happened."
          image="/images/industries/security.jpg"
          imageAlt="Security operations control room"
          primary={{ href: "/contact", label: "Book operational review" }}
          secondary={{ href: "/#proof", label: "See product proof" }}
        />

        <section className="py-14 md:py-16">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map(([title, body, image], index) => (
              <article key={title} className="group overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-500 hover:border-[#0EA5E9]/30">
                <div className="relative h-44 overflow-hidden">
                  <Image src={image} alt="" fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,18,.04),rgba(10,13,18,.76))]" />
                  <span className="s1-mono absolute bottom-4 left-5 text-[11px] text-white/68">0{index + 1}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold tracking-[-.025em]">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/68">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="proof" className="border-y border-white/10 py-14 md:py-16">
          <div className="mb-8 max-w-4xl">
            <p className="s1-mono text-[11px] font-semibold text-[#38BDF8]">Inside the product</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-5xl">
              The same operational facts serve management, control and client proof.
            </h2>
          </div>
          <PlatformProof />
        </section>

        <section className="py-14 md:py-16">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["Owners & directors", "A clearer operating picture, stronger evidence and less dependence on fragmented manual reporting."],
              ["Operations & control", "Live attention on coverage gaps, SOS, patrol exceptions and the sites that need intervention."],
              ["Your clients", "Authorised service visibility and proof without opening the security company's internal operational workspace."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[18px] border border-white/10 bg-white/[.025] p-6">
                <span className="mb-5 block h-1 w-8 rounded-full bg-[#0EA5E9]" />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/68">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] p-8 md:p-12">
          <Image src="/images/security.jpg" alt="" fill className="-z-20 object-cover opacity-35" sizes="100vw" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,13,18,.98),rgba(10,13,18,.88))]" />
          <p className="s1-mono text-[11px] font-semibold text-[#38BDF8]">Next step</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                Review the operation before choosing the rollout.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
                Start with the sites, people, control-room workflow and service evidence you need to bring under control.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="s1-primary-action px-6 py-3 text-sm font-semibold">Book operational review</Link>
              <Link href="/get-started" className="s1-secondary-action px-6 py-3 text-sm font-semibold">Start onboarding</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
