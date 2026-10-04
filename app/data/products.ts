export interface Product {
    id: string;
    title: string;
    description: string;
    category: 'systems' | 'platforms' | 'devices' | 'connectivity' | 'solutions';
    specs: string[];
    imagePlaceholder: string;
    imagePath?: string;
    tags: string[];
}

export const products: Product[] = [
    // --- CONNECTIVITY ---
    {
        id: 's1-global-connect-sim',
        title: 'Signal One Global IoT SIM',
        description: 'Enterprise-grade roaming SIM offering multi-network redundancy across 180+ countries. Designed for mission-critical asset tracking and fleet management.',
        category: 'connectivity',
        specs: [
            'Coverage: 180+ Countries, 680+ Networks',
            'Form Factors: 2FF, 3FF, 4FF, MFF2 (eSIM)',
            'Network Support: 2G, 3G, 4G, 5G, LTE-M, NB-IoT',
            'lifecycle Management: Real-time CMP Platform',
        ],
        imagePlaceholder: 'yctel-iot-sim.jpg',
        imagePath: '/images/products/sim-card.jpg',
        tags: ['IoT', 'Connectivity', 'Global Roaming'],
    },
    {
        id: 's1-esim-platform',
        title: 'Signal One eSIM / eUICC Platform',
        description: 'Remote SIM Provisioning (RSP) compliant eSIM solution allowing over-the-air profile management for massive IoT deployments.',
        category: 'connectivity',
        specs: [
            'Standard: GSMA SGP.02 / SGP.11',
            'Flexibility: Switch carriers OTA',
            'Durability: Industrial grade (-40°C to +105°C)',
            'Integration: API-first management',
        ],
        imagePlaceholder: 'yctel-esim.jpg',
        imagePath: '/images/products/esim-platform.jpg',
        tags: ['eSIM', 'Remote Provisioning', 'Industrial IoT'],
    },

    // --- PLATFORMS ---
    {
        id: 's1-mcptt-core',
        title: 'Signal One Critical Connect (MCPTT)',
        description: 'Carrier-grade communications platform delivering instant voice, video, and data dispatch for public safety and enterprise operations.',
        category: 'platforms',
        specs: [
            'Latency: < 300ms call setup',
            'Capacity: 100,000+ concurrent users',
            'Features: Voice, Video, GEO-Fencing, SOS',
            'Encryption: AES-256 End-to-End',
        ],
        imagePlaceholder: 'pocstar-mcx.jpg',
        imagePath: '/images/products/dispatch-console.jpg',
        tags: ['Dispatch', 'MCPTT', 'Software'],
    },
    {
        id: 's1-mdm-suite',
        title: 'Unified Device Management (MDM)',
        description: 'Centralised management suite for remote configuration, firmware updates, and security policy enforcement across device fleets.',
        category: 'platforms',
        specs: [
            'Control: Remote Kiosk Mode, App Whitelisting',
            'Updates: Batch OTA Firmware Management',
            'Security: Remote Wipe & Lock',
            'Analytics: Device Health Monitoring',
        ],
        imagePlaceholder: 'pocstar-mdm.jpg',
        imagePath: '/images/products/mdm-platform.jpg',
        tags: ['MDM', 'Device Management', 'Security'],
    },
    {
        id: 's1-dispatch-console',
        title: 'Command & Control Console',
        description: 'Windows-based visual dispatch console providing map-based command and control for dispatchers managing distributed field teams.',
        category: 'platforms',
        specs: [
            'Interface: Multi-screen Map & List View',
            'Recording: Full Voice & Video Logging',
            'Location: Real-time GPS Tracking & History',
            'Alerts: Instant Emergency Handling',
        ],
        imagePlaceholder: 'pocstar-console.jpg',
        imagePath: '/images/products/dispatch-console.jpg',
        tags: ['Console', 'Command & Control'],
    },

    // --- DEVICES ---
    {
        id: 's1-livestock-tracker',
        title: 'S1-Agri LoRaWAN Tracker',
        description: 'Ruggedised solar-powered GPS tracker designed for large-scale livestock monitoring and geofencing in rural environments.',
        category: 'devices',
        specs: [
            'Connectivity: LoRaWAN Class A',
            'Power: Solar + 19000mAh Battery',
            'Durability: IP67 Waterproof / Collar Mount',
            'Sensors: GPS/BDS, Accelerometer',
        ],
        imagePlaceholder: 'hkt-cattle-tracker.jpg',
        imagePath: '/images/products/cattle-tracker.jpg',
        tags: ['Tracking', 'Agriculture', 'LoRaWAN'],
    },
    {
        id: 's1-smoke-detector',
        title: 'S1-Safety Smart Smoke Detector',
        description: 'Wireless fire safety sensor providing real-time alerts and remote status monitoring for facility management.',
        category: 'devices',
        specs: [
            'Protocol: LoRaWAN 1.0.3',
            'Sensitivity: Photoelectric Detection',
            'Battery Life: 5+ Years',
            'Features: Low Battery Alert, Tamper Alarm',
        ],
        imagePlaceholder: 'hkt-smoke-detector.jpg',
        imagePath: '/images/products/smoke-detector.jpg',
        tags: ['Safety', 'Building Management', 'Sensors'],
    },
    {
        id: 's1-iot-meter',
        title: 'S1-Grid IoT Energy Meter',
        description: 'High-precision energy monitoring meter with LoRaWAN uplink for smart grid and industrial power management applications.',
        category: 'devices',
        specs: [
            'Measurement: Voltage, Current, Power Factor',
            'Class: 1.0 Accuracy',
            'Communication: LoRaWAN / RS485',
            'Installation: DIN Rail Mount',
        ],
        imagePlaceholder: 'hkt-energy-meter.jpg',
        imagePath: '/images/products/smart-meter.jpg',
        tags: ['Metering', 'Utilities', 'Smart Grid'],
    },
    {
        id: 's1-panic-alarm',
        title: 'S1-Rescue SOS Button',
        description: 'Wearable or mounted emergency button for lone worker safety and security response, featuring instant LoRaWAN alert transmission.',
        category: 'devices',
        specs: [
            'Response Time: Instant Uplink',
            'Form Factor: Compact / Lanyard / Wall-mount',
            'Power: Ultra-low consumption',
            'Range: up to 15km (Rural)',
        ],
        imagePlaceholder: 'hkt-sos-button.jpg',
        imagePath: '/images/products/sos-button.jpg',
        tags: ['Safety', 'Security', 'Lone Worker'],
    },
];
