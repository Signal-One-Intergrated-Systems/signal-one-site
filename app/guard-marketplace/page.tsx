import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guard Marketplace",
  description:
    "The planned Signal One Guard Marketplace will let paying security-company clients find eligible guards and send hire requests through the Guard app.",
};

const fields = [
  ["Location", "Where the guard is available to work"],
  ["PSiRA grade", "The grade recorded against the guard profile"],
  ["Experience", "Relevant security work history"],
  ["Availability", "Whether the guard is available for opportunities"],
  ["Skills", "Operational skills recorded on the profile"],
  ["Profile photo", "A current profile image supplied by the guard"],
] as const;

const flow = [
  ["Browse", "A paying Signal One security company opens the private Guard Marketplace."],
  ["Request hire", "The company selects an eligible guard and sends a request to hire."],
  ["Guard accepts", "The guard receives the request in the Guard app and accepts or declines from their phone."],
  ["Allocate", "Once hired, the company can bring the guard into its workforce and allocate shifts."],
] as const;

export default function GuardMarketplacePage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[1280px]">
        <section className="grid gap-10 border-b border-white/10 pb-16 lg:grid-cols-[.9fr_1.1fr] lg:items-end md:pb-20">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="s1-eyebrow">Guard Marketplace</p>
              <span className="s1-mono rounded-[8px] border border-[#38BDF8]/22 bg-[#0EA5E9]/[.055] px-2.5 py-1 text-[8px] font-semibold text-[#7DD3FC]">
                Target product
              </span>
            </div>
            <h1 className="s1-display mt-5 max-w-4xl font-semibold">
              Win the contract.
              <span className="block text-[#38BDF8]">Then staff it.</span>
            </h1>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/62">
              Guard Marketplace is the planned hiring layer inside the Signal One flywheel. It will be available only to paying Signal One security-company clients—guard profiles will never be publicly browsable.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/42">
              The public page explains the workflow. It does not expose real guard identities, employment documents or private profile data.
            </p>
          </div>
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-[.82fr_1.18fr] lg:items-start md:py-20">
          <div>
            <p className="s1-eyebrow">Private client workspace</p>
            <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
              The marketplace only opens after the security company is a Signal One client.
            </h2>
            <p className="s1-body mt-5 max-w-xl">
              A company first buys guard days and activates its Signal One environment. Marketplace access can then sit inside that authenticated company relationship rather than behaving like a public job board.
            </p>
            <div className="mt-7 rounded-[14px] border border-[#22C55E]/20 bg-[#22C55E]/[.045] p-5">
              <p className="s1-mono text-[8px] font-semibold text-[#86EFAC]">Current Guard foundation</p>
              <p className="mt-3 text-sm leading-7 text-white/52">
                Guard already supports mobile offers that a guard can accept or decline. The full browse → request hire → workforce allocation lifecycle is the planned extension.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0A0D12]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="s1-mono text-[8px] text-white/28">Authenticated preview</p>
                <p className="mt-2 text-sm font-semibold text-white/80">Guard profile anatomy</p>
              </div>
              <span className="rounded-[8px] border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/42">
                Demo structure only
              </span>
            </div>

            <div className="grid gap-3 p-6 sm:grid-cols-2">
              {fields.map(([title, body]) => (
                <div key={title} className="rounded-[14px] border border-white/[.075] bg-white/[.025] p-4">
                  <p className="text-sm font-semibold text-white/74">{title}</p>
                  <p className="mt-2 text-xs leading-6 text-white/38">{body}</p>
                </div>
              ))}
              <div className="rounded-[14px] border border-[#38BDF8]/18 bg-[#0EA5E9]/[.04] p-4 sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white/74">Rating</p>
                  <span className="s1-mono text-[8px] text-[#7DD3FC]">Planned</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-white/38">
                  The target rating combines company ratings, historical operational performance and an internal Signal One score. It will not be shown publicly until that scoring model is implemented.
                </p>
              </div>
            </div>

            <div className="absolute inset-0 grid place-items-center bg-[#0A0D12]/36 backdrop-blur-[2px]">
              <div className="rounded-[14px] border border-white/12 bg-[#0F131A]/94 px-5 py-4 text-center shadow-[0_18px_50px_rgba(0,0,0,.38)]">
                <p className="s1-mono text-[8px] text-[#38BDF8]">Client only</p>
                <p className="mt-2 text-sm font-semibold text-white/78">Guard profiles stay behind authenticated access.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <p className="s1-eyebrow">Hiring flow</p>
              <h2 className="s1-h2 mt-5 max-w-xl font-semibold">
                Request to hire, then let the guard decide.
              </h2>
              <p className="s1-body mt-5 max-w-xl">
                Signal One is the rail between the security company and the guard. Employment documents remain between the guard and the company that hires them.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {flow.map(([title, body], index) => (
                <article key={title} className="rounded-[16px] border border-white/10 bg-[#0F131A] p-5">
                  <p className="s1-mono text-[8px] text-[#38BDF8]">0{index + 1}</p>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/44">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-[1fr_.9fr] lg:items-start md:py-20">
          <div>
            <p className="s1-eyebrow">PSiRA eligibility</p>
            <h2 className="s1-h2 mt-5 max-w-2xl font-semibold">
              Marketplace eligibility will use live PSiRA verification.
            </h2>
            <p className="s1-body mt-5 max-w-2xl">
              Guard already contains a live verification integration against PSiRA&apos;s official individual verification service. It can compare the supplied ID number and PSiRA reference and reject mismatched registration details, grade or expiry.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/42">
              The Marketplace itself is still a target product, so the website does not yet claim that every visible profile has passed a Marketplace eligibility gate.
            </p>
          </div>

          <div className="rounded-[16px] border border-white/10 bg-[#0F131A] p-6">
            <p className="s1-eyebrow">Not a public job board</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-white/50">
              <li>• No public guard search.</li>
              <li>• No public profile identities.</li>
              <li>• No public employment documents.</li>
              <li>• No invented “verified” badges.</li>
              <li>• Hiring requests go through the authenticated Signal One relationship.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#0EA5E9]/20 bg-[#0EA5E9]/[.045] p-7 md:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="s1-eyebrow">Become a Signal One client</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.035em]">
                Marketplace access starts with the operating platform.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                Buy guard days, activate the company environment and bring the hiring workflow into the same system used to allocate and operate the guard force.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                See Guard pricing
              </Link>
              <Link href="/get-started" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                Get started
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
