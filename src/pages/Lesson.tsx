import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLesson } from "../lessons";
import type { CursorPos } from "../lessons/types";
import { checkGoal } from "../engine/goalChecker";
import { useAppStore } from "../store/useAppStore";
import { VimEditor, type VimMode } from "../components/VimEditor";
import { VimStatusBar } from "../components/VimStatusBar";
import { InstructionPanel, renderInstruction } from "../components/InstructionPanel";
import { FeedbackOverlay } from "../components/FeedbackOverlay";

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const recordAttempt = useAppStore((s) => s.recordAttempt);

  const lesson = slug ? getLesson(slug) : undefined;

  const [exIndex, setExIndex] = useState(0);
  const [attemptNo, setAttemptNo] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState<VimMode>("normal");
  const [blockedKey, setBlockedKey] = useState<string | null>(null);

  // Refs mirror state for use inside editor callbacks (avoids stale closures).
  const keystrokesRef = useRef(0);
  const solvedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const blockedTimerRef = useRef<number | undefined>(undefined);
  const modeRef = useRef<VimMode>("normal");
  const lastStateRef = useRef<{ buffer: string; cursor: CursorPos } | null>(null);

  const exercise = lesson?.exercises[exIndex];

  const resetExercise = useCallback(() => {
    keystrokesRef.current = 0;
    solvedRef.current = false;
    startTimeRef.current = null;
    setKeystrokes(0);
    setSolved(false);
    modeRef.current = "normal";
    lastStateRef.current = null;
    setMode("normal");
    setBlockedKey(null);
    setAttemptNo((n) => n + 1);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(blockedTimerRef.current);
  }, []);

  const handleKeystroke = useCallback(() => {
    if (solvedRef.current) return;
    startTimeRef.current ??= Date.now();
    keystrokesRef.current += 1;
    setKeystrokes(keystrokesRef.current);
    setBlockedKey(null);
  }, []);

  const handleBlockedKey = useCallback((key: string) => {
    setBlockedKey(key);
    window.clearTimeout(blockedTimerRef.current);
    blockedTimerRef.current = window.setTimeout(() => setBlockedKey(null), 1800);
  }, []);

  const trySolve = useCallback(() => {
    const last = lastStateRef.current;
    if (!exercise || !last || solvedRef.current || keystrokesRef.current === 0) return;
    if (!checkGoal(exercise.goal, last.buffer, last.cursor, modeRef.current)) return;

    solvedRef.current = true;
    setSolved(true);
    void recordAttempt({
      exerciseId: exercise.id,
      keystrokesUsed: keystrokesRef.current,
      durationMs: startTimeRef.current ? Date.now() - startTimeRef.current : 0,
      success: true,
      at: new Date().toISOString(),
    });
  }, [exercise, recordAttempt]);

  const handleStateChange = useCallback(
    (buffer: string, cursor: CursorPos) => {
      lastStateRef.current = { buffer, cursor };
      trySolve();
    },
    [trySolve]
  );

  // Esc produces no document update, so mode changes must also re-check the goal.
  const handleModeChange = useCallback(
    (newMode: VimMode) => {
      modeRef.current = newMode;
      setMode(newMode);
      trySolve();
    },
    [trySolve]
  );

  const handleNext = useCallback(() => {
    if (!lesson) return;
    if (exIndex + 1 >= lesson.exercises.length) {
      setFinished(true);
      return;
    }
    setExIndex((i) => i + 1);
    resetExercise();
  }, [lesson, exIndex, resetExercise]);

  if (!lesson || !exercise) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/" className="btn btn-primary">
          Back to lessons
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="page">
        <div className="lesson-complete">
          <h1>🎉 Lesson complete!</h1>
          <p>
            You finished <strong>{lesson.title}</strong>.
          </p>
          <div className="feedback-actions">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFinished(false);
                setExIndex(0);
                resetExercise();
              }}
            >
              Practice again
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Back to lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page lesson-page">
      <div className="lesson-header">
        <Link to="/" className="back-link">
          ← Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p className="lesson-intro">{renderInstruction(lesson.intro)}</p>
      </div>

      <InstructionPanel
        exercise={exercise}
        index={exIndex}
        total={lesson.exercises.length}
        blockedKey={blockedKey}
      />

      <div className="editor-wrap">
        <VimEditor
          key={`${exercise.id}-${attemptNo}`}
          initialCode={exercise.initialCode}
          initialCursor={exercise.initialCursor}
          allowedKeys={exercise.allowedKeys}
          disabled={solved}
          onStateChange={handleStateChange}
          onKeystroke={handleKeystroke}
          onModeChange={handleModeChange}
          onBlockedKey={handleBlockedKey}
        />
        <VimStatusBar mode={mode} keystrokes={keystrokes} par={exercise.parKeystrokes} />

        {solved && (
          <FeedbackOverlay
            keystrokes={keystrokes}
            par={exercise.parKeystrokes}
            isLastExercise={exIndex + 1 >= lesson.exercises.length}
            onRetry={resetExercise}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
