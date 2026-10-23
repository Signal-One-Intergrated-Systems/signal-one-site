import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { storyChapters, publicStoryMediaApproved } from "../lib/story.ts";

/**
 * Verify real committed binary assets, not URL strings or mocked responses.
 * Existing site asset blobs are the source of truth; no generative edit or upscale.
 */
const assets = [
  {
    id: "WIN", staged: "assets/story/reference/win-illustrative.webp",
    source: "../public/images/photo/team-briefing.webp", size: 118530, width: 1672, height: 731, kind: "reference",
  },
  {
    id: "HIRE", staged: "assets/story/reference/hire-illustrative.webp",
    source: "../public/images/photo/warehouse-security.webp", size: 115730, width: 1448, height: 1086, kind: "reference",
  },
  {
    id: "RUN", staged: "assets/story/reference/run-illustrative.webp",
    source: "../public/images/story/checkpoint.webp", size: 31486, width: 960, height: 540, kind: "reference",
  },
  {
    id: "EQUIP", staged: "public/media/hardware/hytera-pnc360s.webp",
    source: "../public/images/hardware/hytera-pnc360s.webp", size: 44962, width: 539, height: 1043, kind: "manufacturer",
  },
  {
    id: "PROVE", staged: "assets/story/reference/prove-illustrative.webp",
    source: "../public/images/photo/control-room-team.webp", size: 90446, width: 1170, height: 751, kind: "reference",
  },
  {
    id: "EQUIP_SECONDARY", staged: "public/media/hardware/teltonika-fmc920.webp",
    source: "../public/images/hardware/teltonika-fmc920.webp", size: 62134, width: 1359, height: 667, kind: "manufacturer",
  },
];

function webpDimensions(data) {
  assert.equal(data.toString("ascii", 0, 4), "RIFF");
  assert.equal(data.toString("ascii", 8, 12), "WEBP");
  const fourcc = data.toString("ascii", 12, 16);
  if (fourcc === "VP8X") {
    return [
      1 + data[24] + (data[25] << 8) + (data[26] << 16),
      1 + data[27] + (data[28] << 8) + (data[29] << 16),
    ];
  }
  if (fourcc === "VP8 ") {
    return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
  }
  if (fourcc === "VP8L") {
    return [
      1 + (((data[22] & 0x3f) << 8) | data[21]),
      1 + (((data[24] & 0x0f) << 10) | (data[23] << 2) | ((data[22] & 0xc0) >> 6)),
    ];
  }
  assert.fail(`Unsupported WebP FourCC: ${fourcc}`);
}
function gitBlobSha(data) {
  return createHash("sha1").update(Buffer.from(`blob ${data.length}\0`)).update(data).digest("hex");
}

test("editorial chapters are complete, ordered and kept distinct from public release media", () => {
  assert.deepEqual(storyChapters.map((x) => x.id), ["WIN", "HIRE", "RUN", "EQUIP", "PROVE"]);
  assert.equal(publicStoryMediaApproved, false, "Never approve a chapter without rights and actual correct imagery");
  for (const chapter of storyChapters) {
    assert.ok(chapter.heading.length >= 18);
    assert.ok(chapter.body.length >= 70);
    assert.ok(chapter.disclosure.length >= 30);
    assert.equal(chapter.approvedMediaPath, null);
    assert.notEqual(chapter.mediaReview, "approved");
    assert.ok(!chapter.draftAssetPath.startsWith("http"));
    assert.ok(chapter.altWhenApproved.length >= 30);
  }
  assert.equal(storyChapters.find((x) => x.id === "HIRE")?.disclosure.includes("in development"), true);
  assert.equal(storyChapters.find((x) => x.id === "RUN")?.disclosure.includes("staging"), true);
  assert.equal(storyChapters.find((x) => x.id === "PROVE")?.disclosure.includes("synthetic demo"), true);
});

for (const candidate of assets) {
  test(`${candidate.id}: staged image exists, retains native WebP resolution and exactly matches source`, () => {
    const copy = readFileSync(candidate.staged);
    const original = readFileSync(candidate.source);
    assert.equal(statSync(candidate.staged).size, candidate.size);
    assert.equal(copy.length, candidate.size);
    assert.deepEqual(webpDimensions(copy), [candidate.width, candidate.height]);
    assert.equal(gitBlobSha(copy), gitBlobSha(original));
    assert.ok(copy.equals(original), "Image binary must not be AI edited, cropped or upscaled");
    if (candidate.kind === "reference") {
      assert.ok(!candidate.staged.startsWith("public/"), "Unapproved AI illustration must not be served publicly");
    }
  });
}

test("visitor card does not link or advertise unapproved story imagery", () => {
  const ui = readFileSync("components/VisitorIdentity.tsx", "utf8");
  const page = readFileSync("app/connect/[profile]/page.tsx", "utf8");
  assert.doesNotMatch(ui + page, /\/media\/story\//);
  assert.match(ui, /Coming soon/);
  assert.match(ui, /Save contact|ContactExchange/i);
  assert.doesNotMatch(page, /SignalStory|StoryPanel/);
});
