import { notFound } from "next/navigation";
import { SignalStory } from "../../../../components/SignalStory";
import { getProfile } from "../../../../lib/profiles";
import { isStoryReviewEnabled } from "../../../../lib/story-review";
import { storyChapters } from "../../../../lib/story";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoryReviewPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  // Never expose unapproved media/story on the public visitor route.
  if (!isStoryReviewEnabled(process.env.CONNECT_STORY_QA, process.env.VERCEL_ENV)) {
    notFound();
  }
  const profile = getProfile((await params).profile);
  if (!profile) notFound();
  return <SignalStory chapters={storyChapters} profile={profile} />;
}
