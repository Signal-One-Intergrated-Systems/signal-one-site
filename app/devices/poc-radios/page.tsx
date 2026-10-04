import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export default function PoCRadiosPage() {
    return (
        <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
            <div className="mx-auto max-w-[90rem]">
                <MarketingHero
                    eyebrow="Signal One devices"
                    title="Push-to-Talk (PoC) Devices"
                    body="Enterprise-grade PoC radios combining the instant communication of two-way radio with the global reach of cellular networks. Built for security, logistics, and field operations."
                    image="/images/Devices/poc/hero-radios.jpg"
                    imageAlt="Signal One Push-to-Talk over Cellular radios"
                    primary={{ href: "/contact", label: "Request a radio quote" }}
                    secondary={{ href: "/marketplace", label: "Browse marketplace" }}
                />

                <div className="h-16 md:h-20" />

                <div className="grid md:grid-cols-2 gap-12">

                    {/* D11 */}
                    <article className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-300 hover:border-[#0EA5E9]/30">
                        <div className="h-64 bg-black/20 relative">
                            <Image
                                src="/images/Devices/poc/D11.jpg"
                                alt="D11 Radio"
                                fill
                                className="object-contain p-8 hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Model D11</h2>
                                    <span className="text-[#0EA5E9] text-sm tracking-wider uppercase font-medium">Compact Professional</span>
                                </div>
                            </div>
                            <p className="text-white/60 mb-6">
                                A compact, lightweight radio designed for hospitality, retail, and light security applications. Features a slim profile without compromising on audio quality or battery life.
                            </p>
                            <ul className="space-y-2 text-sm text-white/48 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    LTE / Wi-Fi Connectivity
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Compact Form Factor
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Crystal Clear Audio
                                </li>
                            </ul>
                        </div>
                    </article>

                    {/* D12 */}
                    <article className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-300 hover:border-[#0EA5E9]/30">
                        <div className="h-64 bg-black/20 relative">
                            <Image
                                src="/images/Devices/poc/D12.jpg"
                                alt="D12 Radio"
                                fill
                                className="object-contain p-8 hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Model D12</h2>
                                    <span className="text-[#0EA5E9] text-sm tracking-wider uppercase font-medium">Display Standard</span>
                                </div>
                            </div>
                            <p className="text-white/60 mb-6">
                                The standard for fleet management and logistics, featuring a high-visibility colour display for group management and dispatch messaging.
                            </p>
                            <ul className="space-y-2 text-sm text-white/48 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    1.77" Colour Screen
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    IP54 Dust/Water Resistance
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Group Selector Knob
                                </li>
                            </ul>
                        </div>
                    </article>

                    {/* D21 */}
                    <article className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-300 hover:border-[#0EA5E9]/30">
                        <div className="h-64 bg-black/20 relative">
                            <Image
                                src="/images/Devices/poc/D21.jpg"
                                alt="D21 Radio"
                                fill
                                className="object-contain p-8 hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Model D21</h2>
                                    <span className="text-[#0EA5E9] text-sm tracking-wider uppercase font-medium">Rugged Industrial</span>
                                </div>
                            </div>
                            <p className="text-white/60 mb-6">
                                Built for construction and heavy industry, the D21 is IP68 rated and drop-tested. It delivers loud audio and reliable connection in the harshest conditions.
                            </p>
                            <ul className="space-y-2 text-sm text-white/48 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    IP68 Waterproof
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    High-Capacity Battery
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Dedicated SOS Button
                                </li>
                            </ul>
                        </div>
                    </article>

                    {/* D22 */}
                    <article className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0A0D12] transition duration-300 hover:border-[#0EA5E9]/30">
                        <div className="h-64 bg-black/20 relative">
                            <Image
                                src="/images/Devices/poc/D22.jpg"
                                alt="D22 Radio"
                                fill
                                className="object-contain p-8 hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Model D22</h2>
                                    <span className="text-[#0EA5E9] text-sm tracking-wider uppercase font-medium">Video Smart Radio</span>
                                </div>
                            </div>
                            <p className="text-white/60 mb-6">
                                A smart body-worn radio with camera capabilities, allowing for live video streaming back to dispatch. Essential for security and emergency response.
                            </p>
                            <ul className="space-y-2 text-sm text-white/48 mb-8">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Front & Rear Cameras
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Touchscreen Interface
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                                    Android OS
                                </li>
                            </ul>
                        </div>
                    </article>

                </div>

                {/* Compatibility Note */}
                <div className="mt-20 p-8 rounded-[18px] bg-[#0EA5E9]/10 border border-[#0EA5E9]/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Seamless Compatibility</h3>
                    <p className="text-white/60">
                        All Signal One PoC devices are fully certified for the Signal One Critical Connect platform, ensuring instant provisioning, over-the-air updates, and end-to-end encryption.
                    </p>
                </div>

            </div>
        </main>
    );
}
