import type { Exercise, Lesson } from "./types";
import survival from "./01-survival.json";
import horizontalMotions from "./02-horizontal-motions.json";
import operators from "./03-operators.json";
import verticalMotions from "./04-vertical-motions.json";
import countsRepeat from "./05-counts-repeat.json";
import visualMode from "./06-visual-mode.json";
import yankPaste from "./07-yank-paste.json";
import textObjects from "./08-text-objects.json";
import searchReplace from "./09-search-replace.json";
import insertAppend from "./10-insert-append.json";
import replaceJoin from "./11-replace-join.json";
import indentation from "./12-indentation.json";
import findTill from "./13-find-till.json";
import operatorsTargets from "./14-operators-targets.json";
import macros from "./15-macros.json";
import wordMotions from "./16-word-motions.json";
import changingCase from "./17-changing-case.json";
import registers from "./18-registers.json";
import quickEdits from "./19-quick-edits.json";
import matchingPairs from "./20-matching-pairs.json";
import marks from "./21-marks.json";
import undoRedo from "./22-undo-redo.json";
import paragraphObjects from "./23-paragraph-objects.json";
import tagObjects from "./24-tag-objects.json";
import replaceMode from "./25-replace-mode.json";
import incrementNumbers from "./26-increment-numbers.json";
import lineStarts from "./27-line-starts.json";
import backwardWordEnds from "./28-backward-word-ends.json";
import bracketObjects from "./29-bracket-objects.json";
import swapDuplicate from "./30-swap-duplicate.json";

export const lessons: Lesson[] = (
  [
    survival,
    horizontalMotions,
    operators,
    verticalMotions,
    countsRepeat,
    visualMode,
    yankPaste,
    textObjects,
    searchReplace,
    insertAppend,
    replaceJoin,
    indentation,
    findTill,
    operatorsTargets,
    macros,
    wordMotions,
    changingCase,
    registers,
    quickEdits,
    matchingPairs,
    marks,
    undoRedo,
    paragraphObjects,
    tagObjects,
    replaceMode,
    incrementNumbers,
    lineStarts,
    backwardWordEnds,
    bracketObjects,
    swapDuplicate,
  ] as Lesson[]
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
