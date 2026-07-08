import { rankFor } from "../engine/scoring";

type Props = {
  keystrokes: number;
  par: number;
  isLastExercise: boolean;
  /** The next exercise starts the end-of-lesson practice session. */
  nextIsPractice?: boolean;
  onRetry: () => void;
  onNext: () => void;
};

const RANK_LABEL: Record<string, string> = {
  S: "Perfect — at or under par!",
  A: "Great, close to par.",
  B: "Solved. Try again for fewer keystrokes.",
  C: "Solved, but there is a much shorter way.",
};

export function FeedbackOverlay({
  keystrokes,
  par,
  isLastExercise,
  nextIsPractice,
  onRetry,
  onNext,
}: Props) {
  const rank = rankFor(par, keystrokes);

  return (
    <div className="feedback-overlay">
      <div className="feedback-card">
        <div className={`feedback-rank rank-${rank}`}>{rank}</div>
        <h2>Solved! ✓</h2>
        <p className="feedback-stats">
          {keystrokes} keystroke{keystrokes === 1 ? "" : "s"} · par {par}
        </p>
        <p className="feedback-label">{RANK_LABEL[rank]}</p>
        <div className="feedback-actions">
          <button className="btn btn-ghost" onClick={onRetry}>
            Retry
          </button>
          <button className="btn btn-primary" onClick={onNext} autoFocus>
            {isLastExercise
              ? "Finish lesson"
              : nextIsPractice
                ? "Start practice →"
                : "Next exercise →"}
          </button>
        </div>
      </div>
    </div>
  );
}
