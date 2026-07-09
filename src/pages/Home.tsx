import { useEffect } from "react";
import { Link } from "react-router-dom";
import { lessons } from "../lessons";
import { LessonIcon } from "../components/LessonIcon";
import { useAppStore } from "../store/useAppStore";

export function HomePage() {
  const completed = useAppStore((s) => s.completed);
  const refresh = useAppStore((s) => s.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalExercises = lessons.reduce((n, l) => n + l.exercises.length, 0);
  const doneExercises = lessons.reduce(
    (n, l) => n + l.exercises.filter((e) => completed.includes(e.id)).length,
    0
  );
  const percent = totalExercises ? Math.round((doneExercises / totalExercises) * 100) : 0;

  let lessonsDone = 0;
  let lessonsInProgress = 0;
  for (const lesson of lessons) {
    const done = lesson.exercises.filter((e) => completed.includes(e.id)).length;
    if (done === lesson.exercises.length) lessonsDone += 1;
    else if (done > 0) lessonsInProgress += 1;
  }
  const lessonsToStart = lessons.length - lessonsDone - lessonsInProgress;

  return (
    <div className="page">
      <div className="hero">
        <p className="hero-eyebrow">Learn by doing</p>
        <h1>Master Vim, one motion at a time</h1>
        <p className="hero-sub">
          A real editor, real keybindings, instant feedback. Pick a lesson and build the
          muscle memory that makes editing feel effortless.
        </p>
      </div>

      <div className="overview-card">
        <div className="overview-stats">
          <div className="overview-percent">
            <span className="overview-percent-value">
              {percent}
              <small>%</small>
            </span>
            <span className="overview-label">Complete</span>
          </div>
          <div className="overview-stat">
            <span className="overview-value">{lessonsDone}</span>
            <span className="overview-label">Lessons done</span>
          </div>
          <div className="overview-stat">
            <span className="overview-value in-progress">{lessonsInProgress}</span>
            <span className="overview-label">In progress</span>
          </div>
          <div className="overview-stat">
            <span className="overview-value">{lessonsToStart}</span>
            <span className="overview-label">To start</span>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="lesson-grid">
        {lessons.map((lesson) => {
          const done = lesson.exercises.filter((e) => completed.includes(e.id)).length;
          const total = lesson.exercises.length;
          const isComplete = done === total;
          const started = done > 0;
          const status = isComplete ? "Completed" : started ? "In progress" : "Not started";
          const statusClass = isComplete ? "complete" : started ? "started" : "";

          return (
            <Link key={lesson.slug} to={`/lesson/${lesson.slug}`} className="lesson-card">
              <div className="lesson-card-top">
                <span className={`lesson-icon ${statusClass}`}>
                  <LessonIcon slug={lesson.slug} />
                </span>
                <span className="lesson-number">
                  Lesson {String(lesson.order).padStart(2, "0")}
                </span>
                {isComplete && (
                  <span className="lesson-check" aria-label="completed">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                )}
              </div>
              <h2>{lesson.title}</h2>
              <p className="lesson-summary">{lesson.summary}</p>
              <div className="lesson-keys">
                {lesson.keys.map((k) => (
                  <kbd key={k}>{k}</kbd>
                ))}
              </div>
              <div className={`lesson-status ${statusClass}`}>
                <span>{status}</span>
                <span>{isComplete ? "done" : `${done}/${total}`}</span>
              </div>
              <div className="progress-track small">
                <div
                  className={`progress-fill ${statusClass}`}
                  style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
