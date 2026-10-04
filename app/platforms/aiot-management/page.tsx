import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export default function AIoTManagementPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="Signal One AIoT"
          title="AIoT Device Management"
          body="A unified Mobile Device Management (MDM) and IoT monitoring suite. Secure, configure, and update your entire fleet of radios and sensors from the cloud."
          image="/images/What-we-deliver/platforms.jpg"
          imageAlt="Connected operational platform for device management"
          primary={{ href: "/contact", label: "Discuss device management" }}
        />

        <section className="py-20 md:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Zero-Touch Provisioning", "Deploy devices instantly. Configurations are pushed over-the-air (OTA) immediately upon activation, removing the need for manual setup."],
              ["Kiosk Mode", "Lock down devices to specific applications. Prevent distraction and misuse by restricting access to unauthorised apps and settings."],
              ["Remote Diagnostics", "Monitor battery health, signal strength, and storage status. Troubleshoot issues remotely with screen sharing and log retrieval."],
            ].map(([title,body])=>(
              <article key={title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-7">
                <span className="mb-5 block h-1 w-8 rounded-full bg-[#0EA5E9]" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-white/10 py-20 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div>
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Enterprise Security Features</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">Keep the fleet governed from one control plane.</h2>
            <ul className="mt-7 grid gap-3">
              {[
                "Remote Wipe & Lock capability",
                "Application Whitelisting/Blacklisting",
                "Enforced Password Policies",
                "Geofence-based Policy Enforcement",
              ].map((item)=>(
                <li key={item} className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[.025] px-4 py-4 text-sm text-white/62">
                  <span className="text-[#38BDF8]">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12]">
            <Image src="/images/products/mdm-platform.jpg" alt="Signal One device management platform" fill className="object-contain p-8" sizes="(min-width:1024px) 58vw,100vw" />
          </div>
        </section>
      </div>
    </main>
  );
}
