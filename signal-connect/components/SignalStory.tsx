"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { FounderProfile } from "../lib/profiles";
import type { StoryChapter } from "../lib/story";
import { StoryPanel } from "./StoryPanel";
import styles from "./SignalStory.module.css";

export function SignalStory({
  chapters,
  profile,
}: {
  chapters: readonly StoryChapter[];
  profile: FounderProfile;
}) {
  const [active, setActive] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasMoved = useRef(false);
  const current = chapters[active];
  const last = chapters.length - 1;
  const contactUrl = `/connect/${encodeURIComponent(profile.id)}`;

  useEffect(() => {
    // Do not steal focus when the review first loads. After a user navigation,
    // move focus to the new heading so keyboard/VoiceOver users get context.
    if (hasMoved.current) titleRef.current?.focus();
  }, [active]);

  function goTo(index: number) {
    if (index < 0 || index > last || index === active) return;
    hasMoved.current = true;
    setActive(index);
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  }

  return (
    <main id="main" className={styles.layout} onKeyDown={onKeyDown}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Internal experience review</p>
        <h1 className={styles.title}>The Signal One journey</h1>
        <p className={styles.intro}>
          Five chapters. One connected operating vision.
          <span className={styles.warning}> Illustrative photography for internal review only.</span>
        </p>
      </div>

      <nav aria-label="Story chapter progress" className={styles.progress}>
        <ol className={styles.steps}>
          {chapters.map((chapter, index) => (
            <li
              key={chapter.id}
              className={index === active ? styles.stepActive : styles.step}
              aria-current={index === active ? "step" : undefined}
            >
              {chapter.id}
            </li>
          ))}
        </ol>
      </nav>

      <section className={styles.story} aria-label="Story chapter">
        <p className={styles.position} role="status" aria-live="polite">
          Chapter {active + 1} of {chapters.length}
        </p>
        <StoryPanel chapter={current} ordinal={active + 1} headingRef={titleRef} />
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => goTo(active + 1)}
            disabled={active === last}
          >
            Next chapter
          </button>
        </div>
        <a className={styles.exit} href={contactUrl}>Exit to Andisiwe&apos;s contact card</a>
        <p className={styles.keyHint}>Use Previous and Next, or the left and right arrow keys.</p>
      </section>
    </main>
  );
}
