import { useState, type ReactNode } from "react";
import type { Exercise } from "../lessons/types";

/** Render `code` spans inside instruction text. */
export function renderInstruction(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

type Props = {
  exercise: Exercise;
  /** Index within the current section (core exercises or practice session). */
  index: number;
  /** Size of the current section. */
  total: number;
  blockedKey: string | null;
};

export function InstructionPanel({ exercise, index, total, blockedKey }: Props) {
  const [showHint, setShowHint] = useState(false);
  const isPractice = !!exercise.practice;

  return (
    <div className={`instruction-panel${isPractice ? " practice" : ""}`}>
      <div className="instruction-header">
        <span className="exercise-counter">
          {isPractice && <span className="practice-badge">Practice</span>}
          {isPractice ? "Round" : "Exercise"} {index + 1} / {total}
        </span>
        {exercise.allowedKeys && (
          <span className="allowed-keys">
            keys:{" "}
            {exercise.allowedKeys.map((k) => (
              <kbd key={k}>{k}</kbd>
            ))}
            <kbd>Esc</kbd>
          </span>
        )}
      </div>

      {isPractice && index === 0 && (
        <p className="practice-note">
          Practice session — put everything from this lesson together. All keys are open.
        </p>
      )}

      <p className="instruction-text">{renderInstruction(exercise.instruction)}</p>

      {blockedKey && (
        <p className="blocked-key-warning">
          <kbd>{blockedKey}</kbd> is disabled in this exercise — use the keys above.
        </p>
      )}

      {exercise.hints && exercise.hints.length > 0 && (
        <div className="hint-area">
          {showHint ? (
            <p className="hint-text">💡 {renderInstruction(exercise.hints[0])}</p>
          ) : (
            <button className="btn btn-ghost" onClick={() => setShowHint(true)}>
              Show hint
            </button>
          )}
        </div>
      )}
    </div>
  );
}
