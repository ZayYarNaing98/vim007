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
};

export type Lesson = {
  slug: string;
  title: string;
  category: string;
  order: number;
  intro: string;
  exercises: Exercise[];
};
