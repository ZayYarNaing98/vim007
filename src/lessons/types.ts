export type CursorPos = { line: number; ch: number };

export type Goal = {
  cursor?: CursorPos;
  buffer?: string;
  /** Require the editor to be in this Vim mode (e.g. "normal" so Esc is part of the exercise). */
  mode?: "normal" | "insert" | "visual";
};

export type ExerciseType = "motion" | "edit" | "combined";

export type Exercise = {
  id: string;
  type: ExerciseType;
  instruction: string;
  initialCode: string;
  initialCursor: CursorPos;
  goal: Goal;
  allowedKeys?: string[];
  parKeystrokes: number;
  hints?: string[];
  /** End-of-lesson practice exercise — shown as a separate "Practice" section. Must come after all core exercises. */
  practice?: boolean;
};

export type Lesson = {
  slug: string;
  title: string;
  category: string;
  order: number;
  intro: string;
  /** One-line description shown on the lesson card. */
  summary: string;
  /** Representative keys/commands shown as chips on the lesson card. */
  keys: string[];
  exercises: Exercise[];
};
