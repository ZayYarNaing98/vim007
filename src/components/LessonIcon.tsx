import type { ReactNode } from "react";

/** Simple stroke icons for lesson cards, keyed by lesson slug. */
const paths: Record<string, ReactNode> = {
  "survival": (
    // move / arrows-cross
    <>
      <path d="M12 3v18M3 12h18" />
      <path d="M9.5 5.5 12 3l2.5 2.5M9.5 18.5 12 21l2.5-2.5M5.5 9.5 3 12l2.5 2.5M18.5 9.5 21 12l-2.5 2.5" />
    </>
  ),
  "horizontal-motions": (
    <>
      <path d="M3 12h18" />
      <path d="M7 8l-4 4 4 4M17 8l4 4-4 4" />
    </>
  ),
  "vertical-motions": (
    <>
      <path d="M12 3v18" />
      <path d="M8 7l4-4 4 4M8 17l4 4 4-4" />
    </>
  ),
  "operators": (
    // backspace / delete
    <>
      <path d="M8 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-5.5-7L8 5Z" />
      <path d="M11.5 9.5l5 5M16.5 9.5l-5 5" />
    </>
  ),
  "counts-repeat": (
    // hash
    <path d="M9.5 4 8 20M16 4l-1.5 16M4.5 9h16M3.5 15h16" />
  ),
  "visual-mode": (
    // eye
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "yank-paste": (
    // clipboard
    <>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 5a3 3 0 0 1 6 0M9 11h6M9 15h6" />
    </>
  ),
  "text-objects": (
    // dashed selection box
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M9.5 12h5" />
    </>
  ),
  "search-replace": (
    // magnifier
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l6 6" />
    </>
  ),
  "insert-append": (
    // text cursor (I-beam)
    <>
      <path d="M12 5v14" />
      <path d="M9 5c1.5 0 3 .5 3 2 0-1.5 1.5-2 3-2M9 19c1.5 0 3-.5 3-2 0 1.5 1.5 2 3 2" />
    </>
  ),
  "replace-join": (
    // pen
    <>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4.5 1.5L5 15 16.5 3.5Z" />
      <path d="M14 6l3 3" />
    </>
  ),
  "indentation": (
    <>
      <path d="M11 5h10M11 12h10M3 19h18" />
      <path d="M3 8.5 7 12l-4 3.5" />
    </>
  ),
  "find-till": (
    // target
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
    </>
  ),
  "operators-targets": (
    // arrow into target
    <>
      <circle cx="15.5" cy="15.5" r="5.5" />
      <path d="M3 3l7.5 7.5M10.5 5.5v5h-5" />
    </>
  ),
  "macros": (
    // play circle
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" />
    </>
  ),
  "big-word-motions": (
    // double chevrons
    <path d="M5 6l6 6-6 6M13 6l6 6-6 6" />
  ),
  "changing-case": (
    <>
      <path d="M3 18 8 6l5 12M4.7 14h6.6" />
      <path d="M20.5 12.5V18M20.5 14.2a2.6 2.6 0 1 0-.1 2.6" />
    </>
  ),
  "registers": (
    // archive box
    <>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4" />
    </>
  ),
  "quick-edits": (
    // lightning bolt
    <path d="M13 2 4.5 13.5h6L10 22l8.5-11.5h-6L13 2Z" />
  ),
  "matching-pairs": (
    // percent
    <>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </>
  ),
  "marks": (
    // bookmark
    <path d="M6 3h12v18l-6-4.5L6 21V3Z" />
  ),
  "undo-redo": (
    // rotate counter-clockwise
    <>
      <path d="M4 10a8 8 0 1 1 2.2 7.2" />
      <path d="M4 4v6h6" />
    </>
  ),
  "paragraph-objects": (
    // pilcrow
    <path d="M17 4v16M13 4v16M17 4h-6.5a4.25 4.25 0 0 0 0 8.5H13M19 4h-2" />
  ),
  "tag-objects": (
    // code </>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
  ),
};

export function LessonIcon({ slug }: { slug: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[slug] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
