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

test("story always uses neutral placeholders and no unapproved photographic media", () => {
  const panel = readFileSync("components/StoryPanel.tsx", "utf8");
  const story = readFileSync("components/SignalStory.tsx", "utf8");
  assert.match(panel, /data-review-media="neutral-placeholder"/);
  assert.doesNotMatch(panel + story, /approvedMediaPath|draftAssetPath|<img|<Image|\/media\/hardware\//);
  const css = readFileSync("components/SignalStory.module.css", "utf8");
  assert.doesNotMatch(css, /!important|backdrop-filter|box-shadow|linear-gradient|radial-gradient/);
  assert.match(css, /prefers-reduced-motion: no-preference/);
});
