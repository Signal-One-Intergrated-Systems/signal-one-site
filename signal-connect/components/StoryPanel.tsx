import type { RefObject } from "react";
import type { StoryChapter } from "../lib/story";
import { reviewImages } from "../lib/story-review-media";
import styles from "./SignalStory.module.css";

export function StoryPanel({
  chapter,
  ordinal,
  headingRef,
}: {
  chapter: StoryChapter;
  ordinal: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const index = String(ordinal).padStart(2, "0");
  const image = reviewImages[chapter.id];
  return (
    <article className={styles.panel} aria-labelledby="chapter-heading">
      <div
        key={chapter.id + "-media"}
        className={styles.media}
        data-review-media="illustrative-photography"
      >
        {/* Exact local WebP reference, only reachable through the server review gate. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={image.fit === "contain" ? styles.mediaContain : styles.mediaImage}
          src={`/review/story-media/${chapter.id.toLowerCase()}`}
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading="eager"
          decoding="async"
        />
        <span className={styles.mediaNumber} aria-hidden="true">{index}</span>
        <span className={styles.mediaCaption}>{image.caption}</span>
      </div>
      <div key={chapter.id + "-copy"} className={styles.copy}>
        <p className={styles.chapterName}>{index} / {chapter.id}</p>
        <h2 id="chapter-heading" ref={headingRef} tabIndex={-1} className={styles.heading}>{chapter.heading}</h2>
        <p className={styles.body}>{chapter.body}</p>
        <p className={styles.disclosure}>{chapter.disclosure}</p>
      </div>
    </article>
  );
}
