import type { RefObject } from "react";
import type { StoryChapter } from "../lib/story";
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
  return (
    <article className={styles.panel} aria-labelledby="chapter-heading">
      <div
        key={chapter.id + "-media"}
        className={styles.media}
        role="img"
        aria-label={`Neutral media placeholder for ${chapter.id}; approved photography pending`}
        data-review-media="neutral-placeholder"
      >
        <span className={styles.mediaNumber} aria-hidden="true">{index}</span>
        <span className={styles.mediaCaption} aria-hidden="true">Photography pending approval</span>
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
