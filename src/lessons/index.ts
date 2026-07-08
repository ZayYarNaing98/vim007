import type { Exercise, Lesson } from "./types";
import survival from "./01-survival.json";
import horizontalMotions from "./02-horizontal-motions.json";
import operators from "./03-operators.json";

export const lessons: Lesson[] = (
  [survival, horizontalMotions, operators] as Lesson[]
).sort((a, b) => a.order - b.order);

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

const exerciseCategory = new Map<string, string>();
const exercisePar = new Map<string, number>();
for (const lesson of lessons) {
  for (const ex of lesson.exercises) {
    exerciseCategory.set(ex.id, lesson.category);
    exercisePar.set(ex.id, ex.parKeystrokes);
  }
}

export function categoryOf(exerciseId: string): string {
  return exerciseCategory.get(exerciseId) ?? "unknown";
}

export function parOf(exerciseId: string): number {
  return exercisePar.get(exerciseId) ?? 1;
}

export const categories = [...new Set(lessons.map((l) => l.category))];

export type { Exercise, Lesson };
