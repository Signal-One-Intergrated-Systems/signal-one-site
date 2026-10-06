import type { Metadata } from "next";
import GuardJoin from "../../components/journey/GuardJoin";

export const metadata: Metadata = {
  title: "Create Your Guard Profile",
  description:
    "Security officers: create a private Signal One guard profile with your PSiRA details, experience, skills, areas and availability. Never shown on a public website. Signal One reviews it and contacts you.",
  alternates: { canonical: "/guards/join" },
};

export default function GuardJoinPage() {
  return (
    <main id="main" className="min-h-[calc(100vh-72px)] bg-sand text-text">
      <GuardJoin />
    </main>
  );
}
