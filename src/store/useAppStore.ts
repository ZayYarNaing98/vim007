import { create } from "zustand";
import type { Attempt, SkillProgress } from "../storage/storage";
import { localProgressStorage } from "../storage/localStorage";
import { computeSkillProgress } from "../engine/scoring";

const storage = localProgressStorage;

type AppState = {
  completed: string[];
  skills: SkillProgress[];
  totalAttempts: number;
  refresh: () => Promise<void>;
  recordAttempt: (attempt: Attempt) => Promise<void>;
  exportProgress: () => Promise<string>;
  importProgress: (json: string) => Promise<void>;
  clearProgress: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  completed: [],
  skills: [],
  totalAttempts: 0,

  refresh: async () => {
    const [completed, attempts] = await Promise.all([
      storage.getCompletedExercises(),
      storage.getAttempts(),
    ]);
    set({
      completed,
      skills: computeSkillProgress(attempts),
      totalAttempts: attempts.length,
    });
  },

  recordAttempt: async (attempt) => {
    await storage.saveAttempt(attempt);
    await get().refresh();
  },

  exportProgress: () => storage.exportAll(),

  importProgress: async (json) => {
    await storage.importAll(json);
    await get().refresh();
  },

  clearProgress: async () => {
    await storage.clearAll();
    await get().refresh();
  },
}));
