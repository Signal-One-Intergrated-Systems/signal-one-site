import type { StoryChapterId } from "./story";

type ReviewImage = Readonly<{
  file: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  fit: "cover" | "contain";
}>;

/** Draft illustrations used only inside the gated story review. */
export const reviewImages: Record<StoryChapterId, ReviewImage> = {
  WIN: {
    file: "assets/story/reference/win-illustrative.webp",
    width: 1672, height: 731,
    alt: "Fictional security team briefing illustration, not a Signal One sales meeting.",
    caption: "Illustrative scene — Sales photograph pending",
    fit: "cover",
  },
  HIRE: {
    file: "assets/story/reference/hire-illustrative.webp",
    width: 1448, height: 1086,
    alt: "Illustrative warehouse security activity; does not depict a real hiring process.",
    caption: "Illustrative scene — Recruitment photograph pending",
    fit: "cover",
  },
  RUN: {
    file: "assets/story/reference/run-illustrative.webp",
    width: 960, height: 540,
    alt: "Illustrative checkpoint scan; not a real Signal One operation.",
    caption: "Illustrative scene — Guard in demo/staging",
    fit: "cover",
  },
  EQUIP: {
    file: "public/media/hardware/hytera-pnc360s.webp",
    width: 539, height: 1043,
    alt: "Manufacturer reference image of Hytera PNC360S radio.",
    caption: "Manufacturer image — Usage rights pending",
    fit: "contain",
  },
  PROVE: {
    file: "assets/story/reference/prove-illustrative.webp",
    width: 1170, height: 751,
    alt: "Fictional control-room illustration, not actual Signal One reporting evidence.",
    caption: "Illustrative scene — Real report capture pending",
    fit: "cover",
  },
};
