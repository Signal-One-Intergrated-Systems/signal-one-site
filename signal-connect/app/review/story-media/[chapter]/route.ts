import { readFile } from "node:fs/promises";
import path from "node:path";
import { isStoryReviewEnabled } from "../../../../lib/story-review";
import { reviewImages } from "../../../../lib/story-review-media";
import type { StoryChapterId } from "../../../../lib/story";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chapter: string }> },
) {
  if (!isStoryReviewEnabled(process.env.CONNECT_STORY_QA, process.env.VERCEL_ENV)) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const { chapter } = await params;
  const key = chapter.toUpperCase() as StoryChapterId;
  if (chapter !== chapter.toLowerCase() || !Object.hasOwn(reviewImages, key)) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const image = reviewImages[key];
    const bytes = await readFile(path.join(process.cwd(), image.file));
    return new Response(bytes, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, max-age=0, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return new Response("Review image missing", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
