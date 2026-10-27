/** Version 1 catalogue. IDs persist unchanged; labels are snapshotted by the receiving service. */
export const INTEREST_GROUPS = [
  {
    "heading": "Software & operations",
    "options": [
      {
        "id": "guard",
        "label": "Signal One Guard — Security operations"
      },
      {
        "id": "workforce",
        "label": "Workforce management & attendance"
      },
      {
        "id": "control-room",
        "label": "Control room & dispatch software"
      },
      {
        "id": "monitoring-sos",
        "label": "Security monitoring & SOS"
      }
    ]
  },
  {
    "heading": "Communications & connectivity",
    "options": [
      {
        "id": "ptt",
        "label": "Push-to-talk (PoC/PTT) radios"
      },
      {
        "id": "dmr",
        "label": "DMR & two-way radios"
      },
      {
        "id": "sim-data",
        "label": "SIM cards, data & IoT connectivity"
      },
      {
        "id": "networking",
        "label": "Networking & wireless infrastructure"
      },
      {
        "id": "satellite",
        "label": "Satellite communications"
      }
    ]
  },
  {
    "heading": "Security & smart infrastructure",
    "options": [
      {
        "id": "cctv",
        "label": "CCTV & surveillance systems"
      },
      {
        "id": "access-control",
        "label": "Access control & biometrics"
      },
      {
        "id": "tracking",
        "label": "Vehicle, fleet & asset tracking"
      },
      {
        "id": "iot",
        "label": "IoT sensors & smart monitoring"
      },
      {
        "id": "drones",
        "label": "Drones & aerial technology"
      }
    ]
  },
  {
    "heading": "Equipment & services",
    "options": [
      {
        "id": "rugged-devices",
        "label": "Rugged mobile devices"
      },
      {
        "id": "backup-power",
        "label": "UPS, inverters & backup power"
      },
      {
        "id": "ppe",
        "label": "PPE & safety equipment"
      },
      {
        "id": "integration",
        "label": "System supply, installation & integration"
      },
      {
        "id": "partnerships",
        "label": "Reseller & business partnerships"
      },
      {
        "id": "other",
        "label": "Other / Not sure yet"
      }
    ]
  }
] as const;
export const INTEREST_OPTIONS = INTEREST_GROUPS.flatMap(group => [...group.options]);
export type InterestId = (typeof INTEREST_OPTIONS)[number]["id"];
export function isInterestId(value: unknown): value is InterestId {
  return typeof value === "string" && INTEREST_OPTIONS.some(option => option.id === value);
}
