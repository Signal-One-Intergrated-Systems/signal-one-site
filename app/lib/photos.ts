/**
 * Photography in use on the public site.
 *
 * Every photograph here is an AI-generated ENVIRONMENT image of a fictional
 * guarding company, pending the commissioned shoot in
 * docs/PHOTOGRAPHY_BRIEF.md. None of them depicts the Signal One product —
 * product evidence is always a real screenshot (see lib/productProof.ts).
 * Sources are 800–1916px wide; never render them wider than that.
 */
import businessParkGate from "../../public/images/photo/business-park-gate.webp";
import businessParkGateMobile from "../../public/images/photo/business-park-gate-mobile.webp";
import estateGateDusk from "../../public/images/photo/estate-gate-dusk.webp";
import logisticsGate from "../../public/images/photo/logistics-gate.webp";
import officeParkAccess from "../../public/images/photo/office-park-access.webp";
import checkpoint from "../../public/images/story/checkpoint.webp";
import femaleGuard from "../../public/images/story/female-guard.webp";
import fieldSupervisor from "../../public/images/story/field-supervisor.webp";
import careersDesk from "../../public/images/story/sales.webp";

export const photos = {
  businessParkGate: {
    src: businessParkGate,
    mobile: businessParkGateMobile,
    alt: "Security officers and a supervisor at the boom gate of a Johannesburg business park in morning light",
  },
  logisticsGate: {
    src: logisticsGate,
    alt: "Security officers in high-visibility vests checking a truck at a logistics yard gate",
  },
  officeParkAccess: {
    src: officeParkAccess,
    alt: "A security officer helping a visitor sign in at an office-park access point",
  },
  estateGateDusk: {
    src: estateGateDusk,
    alt: "A security officer speaking to a driver at a residential estate gate at dusk",
  },
  guardCheckpoint: {
    src: femaleGuard,
    alt: "A security officer scanning a patrol checkpoint at a logistics site in early morning light",
  },
  guardPatrol: {
    src: checkpoint,
    alt: "A security officer on patrol scanning a checkpoint mounted beside a gate",
  },
  supervisor: {
    src: fieldSupervisor,
    alt: "A site supervisor walking the yard with a clipboard tablet while an officer stands at the guardhouse",
  },
  careersDesk: {
    src: careersDesk,
    alt: "A professional working at a laptop in an office overlooking the city at sunset",
  },
} as const;

export const illustrativeCaption = "Illustrative scene · fictional security company";
