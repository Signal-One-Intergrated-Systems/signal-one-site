import { permanentRedirect } from "next/navigation";

/** 1Workforce is now 1Service; preserve old bookmarks and campaign links. */
export default function LegacyWorkforcePage() {
  permanentRedirect("/service");
}
