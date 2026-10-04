import Image from "next/image";
import MarketingHero from "../../components/MarketingHero";

export default function LoRaWANSensorsPage() {
    return (
        <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
            <div className="mx-auto max-w-[90rem]">
                <MarketingHero
                    eyebrow="Signal One devices"
                    title="LoRaWAN Devices & Sensors"
                    body="A comprehensive portfolio of industrial LoRaWAN sensors designed for long-range, low-power data acquisition. Ruggedised for harsh environments and built for massive scale IoT deployments."
                    image="/images/Devices/Lorawan/hero-sensors.jpg"
                    imageAlt="Signal One LoRaWAN sensors"
                    primary={{ href: "/contact", label: "Request a sensor quote" }}
                    secondary={{ href: "/marketplace", label: "Browse marketplace" }}
                />

                <div className="h-16 md:h-20" />

                {/* --- Environmental & Safety --- */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Environmental & Safety
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "IAQ-1000-H",
                                name: "High-Precision Indoor Air Quality",
                                desc: "Advanced monitoring of PM2.5, PM10, CO2, TVOC, Temperature, and Humidity for critical indoor environments."
                            },
                            {
                                model: "IAQ-1000-L",
                                name: "Standard Indoor Environment Sensor",
                                desc: "Cost-effective monitoring of core environmental parameters including temperature, humidity, and CO2."
                            },
                            {
                                model: "TH-103",
                                name: "Industrial Temp & Humidity",
                                desc: "IP67 ruggedised sensor for harsh industrial and outdoor climate monitoring."
                            },
                            {
                                model: "SD-300",
                                name: "Smart Smoke Detector",
                                desc: "Photoelectric smoke detection with LoRaWAN wireless alert transmission for facility safety."
                            },
                            {
                                model: "PIR-100",
                                name: "Infrared Motion Sensor",
                                desc: "Passive infrared occupancy and motion detection for security and building automation."
                            },
                            {
                                model: "AVA-1000",
                                name: "Vibration & Anomaly Sensor",
                                desc: "Industrial motor and machinery health monitoring using tri-axial vibration analysis."
                            },
                            {
                                model: "OBA-1000",
                                name: "Optical Beam Smoke Detector",
                                desc: "Wide-area smoke detection for warehouses and large atriums using beam interruption technology."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Access & People --- */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Access & People
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "DS-100",
                                name: "Door / Window Contact",
                                desc: "Magnetic contact sensor for detecting open/close status of doors, windows, and cabinets."
                            },
                            {
                                model: "PC-100",
                                name: "People Counter",
                                desc: "Bi-directional people counting for foot traffic analysis and occupancy management."
                            },
                            {
                                model: "SDL-100",
                                name: "Smart Door Lock",
                                desc: "Remote managed access control lock with LoRaWAN status reporting and command capabilities."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Utilities & Infrastructure --- */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Utilities & Infrastructure
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "EM-100",
                                name: "Single-Phase Energy Meter",
                                desc: "Smart electricity metering for sub-metering and energy management applications."
                            },
                            {
                                model: "EM-300",
                                name: "Three-Phase Energy Meter",
                                desc: "Industrial-grade 3-phase power monitoring with high-precision measurement."
                            },
                            {
                                model: "UVC-L100",
                                name: "Ultrasonic Valve Controller",
                                desc: "Remote water valve control and flow metering for smart water management."
                            },
                            {
                                model: "SVC-100",
                                name: "Smart Valve Controller",
                                desc: "Retrofit valve actuator for automated fluid control in pipes and irrigation."
                            },
                            {
                                model: "UDS-100",
                                name: "Ultrasonic Distance Sensor",
                                desc: "Non-contact level measurement for tanks, silos, and waste bins."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Smart City & Parking --- */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Smart City & Parking
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "MPS-100",
                                name: "Magnetic Parking Sensor",
                                desc: "Surface-mount vehicle detection sensor for on-street parking management."
                            },
                            {
                                model: "EPS-100",
                                name: "Geomagnetic Parking Sensor",
                                desc: "Advanced dual-detection parking sensor with radar/magnetic fusion for high accuracy."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Agriculture & Livestock --- */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Agriculture & Livestock
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "GAT-100",
                                name: "GPS Asset Tracker",
                                desc: "Solar-assisted asset tracker designed for containers, trailers, and heavy equipment."
                            },
                            {
                                model: "RBC-100",
                                name: "Smart Cattle Collar",
                                desc: "Livestock tracking collar with GPS positioning and activity monitoring for herd management."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Wearables --- */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Workforce Safety Wearables
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "SW-200",
                                name: "Smart Safety Watch",
                                desc: "Connected smartwatch providing health monitoring, location tracking, and SOS alerts for workers."
                            },
                            {
                                model: "WB-100",
                                name: "SOS Wristband",
                                desc: "Simple, lightweight wristband with panic button and location beacon for lone worker safety."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- Testing & Gateways --- */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 border-b border-white/10 pb-4">
                        Infrastructure & Testing
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                model: "ST-1000",
                                name: "Network Site Tester",
                                desc: "Handheld field tester for validating LoRaWAN network coverage and signal quality."
                            },
                            {
                                model: "GW-XD200",
                                name: "Outdoor Macro Gateway",
                                desc: "Carrier-grade outdoor IP67 gateway for wide-area city and rural network coverage."
                            },
                            {
                                model: "GW-100PRO",
                                name: "Enterprise Indoor Gateway",
                                desc: "High-performance indoor gateway for deep building penetration and campus connectivity."
                            }
                        ].map((item) => (
                            <div key={item.model} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                                <span className="s1-mono text-[9px] text-[#38BDF8] block mb-2">{item.model}</span>
                                <div className="aspect-square w-full mb-4 bg-black/20 rounded-lg overflow-hidden relative p-4">
                                    <Image
                                        src={`/images/Devices/Lorawan/${item.model}.jpg`}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                                <p className="text-sm text-white/48 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
