import { useEffect } from "react";
import { Link } from "react-router-dom";
import { lessons } from "../lessons";
import { renderInstruction } from "../components/InstructionPanel";
import { useAppStore } from "../store/useAppStore";

export function HomePage() {
  const completed = useAppStore((s) => s.completed);
  const refresh = useAppStore((s) => s.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="page">
      <div className="hero">
        <h1>Vim TypeTutor</h1>
        <p>
          Learn Vim by doing — real editor, real keybindings, instant feedback. Pick a
          lesson and build muscle memory.
        </p>
      </div>

      <div className="lesson-list">
        {lessons.map((lesson) => {
          const done = lesson.exercises.filter((e) => completed.includes(e.id)).length;
          const total = lesson.exercises.length;
          const isComplete = done === total;
          return (
            <Link key={lesson.slug} to={`/lesson/${lesson.slug}`} className="lesson-card">
              <div className="lesson-card-header">
                <span className="lesson-order">{lesson.order}</span>
                <h2>{lesson.title}</h2>
                <span className={`lesson-progress ${isComplete ? "complete" : ""}`}>
                  {isComplete ? "✓ done" : `${done}/${total}`}
                </span>
              </div>
              <p className="lesson-card-intro">{renderInstruction(lesson.intro)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
