import type { CursorPos, Goal } from "../lessons/types";

const normalize = (text: string) => text.replace(/\s+$/gm, "");

export function checkGoal(
  goal: Goal,
  buffer: string,
  cursor: CursorPos,
  mode: string
): boolean {
  if (goal.buffer !== undefined && normalize(buffer) !== normalize(goal.buffer)) {
    return false;
  }
  if (goal.cursor && (goal.cursor.line !== cursor.line || goal.cursor.ch !== cursor.ch)) {
    return false;
  }
  if (goal.mode && goal.mode !== mode) {
    return false;
  }
  return true;
}
