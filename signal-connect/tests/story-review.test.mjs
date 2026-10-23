import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isStoryReviewEnabled } from "../lib/story-review.ts";

test("story review is closed by default and always blocked on Vercel production", () => {
  for (const flag of [undefined, "", "true", "1", "ENABLED", "disabled"]) {
    assert.equal(isStoryReviewEnabled(flag, undefined), false);
  }
  assert.equal(isStoryReviewEnabled("enabled", "production"), false);
  assert.equal(isStoryReviewEnabled("enabled", "preview"), true);
  assert.equal(isStoryReviewEnabled("enabled", undefined), true);
});

test("actual story route must check server-only review gate", () => {
  const route = readFileSync("app/review/story/[profile]/page.tsx", "utf8");
  const publicVisitor = readFileSync("app/connect/[profile]/page.tsx", "utf8");
  const visitorCard = readFileSync("components/VisitorIdentity.tsx", "utf8");
  assert.match(route, /isStoryReviewEnabled\(process\.env\.CONNECT_STORY_QA, process\.env\.VERCEL_ENV\)/);
  assert.match(route, /notFound\(\)/);
  assert.doesNotMatch(publicVisitor + visitorCard, /\/review\/story\/|SignalStory|StoryPanel/);
  assert.match(visitorCard, /Coming soon/);
});

test("gated story images are truthful, internal and isolated from public routes", () => {
  const panel = readFileSync("components/StoryPanel.tsx", "utf8");
  const story = readFileSync("components/SignalStory.tsx", "utf8");
  const mediaRoute = readFileSync("app/review/story-media/[chapter]/route.ts", "utf8");
  const mapping = readFileSync("lib/story-review-media.ts", "utf8");
  assert.match(panel, /data-review-media="illustrative-photography"/);
  assert.match(panel, /review\/story-media/);
  assert.match(mediaRoute, /isStoryReviewEnabled/);
  assert.match(mediaRoute, /no-store/);
  assert.match(mapping, /Manufacturer image/);
  assert.doesNotMatch(panel + story, /approvedMediaPath|draftAssetPath/);
  const styles = readFileSync("components/SignalStory.module.css", "utf8");
  assert.doesNotMatch(styles, /!important|box-shadow|backdrop-filter|linear-gradient/);
  assert.match(styles, /prefers-reduced-motion: no-preference/);
});
