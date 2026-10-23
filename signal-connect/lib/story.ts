/**
 * Signal Connect V3 — 03A frozen editorial, NOT a live story implementation.
 *
 * Public UI MUST refuse to render a chapter as photographic product proof until
 * its approvedMediaPath has passed the provenance/crop/product-truth gate.
 * Reference scenes are stored outside public/ intentionally.
 */
export type StoryChapterId = "WIN" | "HIRE" | "RUN" | "EQUIP" | "PROVE";
export type StoryMediaReview = "blocked" | "manufacturer-conditional" | "approved";

export type StoryChapter = Readonly<{
  id: StoryChapterId;
  heading: string;
  body: string;
  disclosure: string;
  draftAssetPath: string;
  mediaReview: StoryMediaReview;
  approvedMediaPath: string | null;
  altWhenApproved: string;
}>;

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "WIN",
    heading: "From first contact to opportunity.",
    body: "Signal One's sales workspace is being developed to bring enquiries, quotations and follow-ups into a clearer commercial journey.",
    disclosure: "Sales workspace in development; not presented as a customer-live product.",
    draftAssetPath: "assets/story/reference/win-illustrative.webp",
    mediaReview: "blocked",
    approvedMediaPath: null,
    altWhenApproved: "Signal One representative discussing a service opportunity with a security-company decision-maker.",
  },
  {
    id: "HIRE",
    heading: "Put the right people behind the promise.",
    body: "Hiring and workforce readiness should connect to the work that needs to be delivered. Guard Marketplace is part of that vision.",
    disclosure: "Guard Marketplace is in development, not a live recruitment or booking service.",
    draftAssetPath: "assets/story/reference/hire-illustrative.webp",
    mediaReview: "blocked",
    approvedMediaPath: null,
    altWhenApproved: "Security supervisor briefing a diverse field team before their first shift, in a real South African workplace.",
  },
  {
    id: "RUN",
    heading: "Make field operations visible.",
    body: "Signal One Guard is being built around shifts, checkpoint scans, incident capture and control-room oversight, creating an operational trail.",
    disclosure: "Guard is in demo/staging and must not be described as generally launched.",
    draftAssetPath: "assets/story/reference/run-illustrative.webp",
    mediaReview: "blocked",
    approvedMediaPath: null,
    altWhenApproved: "Officer making a patrol checkpoint scan on a real site, with the phone screen turned away from camera.",
  },
  {
    id: "EQUIP",
    heading: "Equip people for the work.",
    body: "Professional push-to-talk radios and vehicle trackers support connected field operations. Hardware supply and future software integrations are separate offerings.",
    disclosure: "Shown: genuine manufacturer device imagery. Do not imply integrated PTT or tracking is live.",
    draftAssetPath: "public/media/hardware/hytera-pnc360s.webp",
    mediaReview: "manufacturer-conditional",
    approvedMediaPath: null,
    altWhenApproved: "Hytera PNC360S push-to-talk over cellular radio, official manufacturer product photograph.",
  },
  {
    id: "PROVE",
    heading: "Turn activity into evidence.",
    body: "Shift records, checkpoint events and incidents can support clearer service reporting—so clients can understand what was delivered.",
    disclosure: "Proof-of-service screens require approved captures from a synthetic demo tenant; no verified production-client report is available.",
    draftAssetPath: "assets/story/reference/prove-illustrative.webp",
    mediaReview: "blocked",
    approvedMediaPath: null,
    altWhenApproved: "Facilities manager reviewing an authentic Signal One Guard proof-of-service report produced from safely synthetic demo data.",
  },
] as const;

export const publicStoryMediaApproved =
  storyChapters.length === 5 &&
  storyChapters.every(
    (chapter) => chapter.mediaReview === "approved" && chapter.approvedMediaPath?.startsWith("/media/story/"),
  );
