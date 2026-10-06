/**
 * Photography in use on the public site.
 *
 * Every photograph here is an AI-generated ENVIRONMENT image of a fictional
 * guarding company, pending the commissioned shoot in
 * docs/PHOTOGRAPHY_BRIEF.md. None of them depicts the Signal One product:
 * product evidence is always a real screenshot (see lib/productProof.ts).
 * Sources are 1170–1916px wide. Never render a photograph wider than its
 * native width: bands cap their width and fade into the section colour
 * instead of stretching.
 *
 * Source names follow the hosted set: hero-integrated-security,
 * warehouse-security, estate-response-night (re-cropped locally to remove
 * Table Mountain), guard-site-operations, field-radio-tracking (cropped to
 * remove Table Mountain) and control-room-day (cropped to remove the
 * windows and aerial monitors).
 */
import hero from "../../public/images/photo/hero-integrated-security.webp";
import warehouse from "../../public/images/photo/warehouse-security.webp";
import estateNight from "../../public/images/photo/estate-response-night-band.webp";
import siteOperations from "../../public/images/photo/guard-site-operations.webp";
import teamBriefing from "../../public/images/photo/team-briefing.webp";
import controlRoomTeam from "../../public/images/photo/control-room-team.webp";
import checkpoint from "../../public/images/story/checkpoint.webp";

export const photos = {
  hero: {
    src: hero,
    alt: "Security officers and a supervisor with a tablet at the boom gate of a Johannesburg business park in morning light",
  },
  warehouse: {
    src: warehouse,
    alt: "Security officers in high-visibility vests checking a truck at a logistics yard gate",
  },
  estateNight: {
    src: estateNight,
    alt: "A security officer speaking to a driver at a residential estate gate at dusk, with a second officer at the boom",
  },
  siteOperations: {
    src: siteOperations,
    alt: "A security officer helping a visitor sign in at an office-park access point",
  },
  teamBriefing: {
    src: teamBriefing,
    alt: "A supervisor briefing four security officers beside a table of radios and tablets",
  },
  controlRoomTeam: {
    src: controlRoomTeam,
    alt: "Control-room operators at their desks while a manager and a colleague review a tablet",
  },
  guardPatrol: {
    src: checkpoint,
    alt: "A security officer on patrol scanning a checkpoint mounted beside a gate",
  },
} as const;

export const illustrativeCaption = "Illustrative scene · fictional security company";
