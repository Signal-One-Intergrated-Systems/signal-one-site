import type { Metadata } from "next";
import { withSocial } from "../../../lib/seo";
import GuardJoin from "../../../components/journey/GuardJoin";

export const metadata: Metadata = withSocial({
  title: "Create Your Security Officer Profile",
  description:
    "Create a private Signal One guard profile with your PSiRA details, experience, skills and availability. Never shown on a public website; Signal One reviews it and contacts you.",
  alternates: { canonical: "/guards/join" },
});

export default function GuardJoinPage() {
  return (
    <main id="main" className="min-h-[calc(100vh-72px)] bg-light text-text s1-scene-page s1-scene-page--officer-apply">
      <GuardJoin />
    </main>
  );
}
