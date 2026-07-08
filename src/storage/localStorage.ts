import type { Attempt, ProgressStorage } from "./storage";

const KEY = "vim-typetutor:v1";

type StoredData = { attempts: Attempt[] };

function load(): StoredData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { attempts: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.attempts)) return { attempts: [] };
    return parsed;
  } catch {
    return { attempts: [] };
  }
}

function save(data: StoredData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export const localProgressStorage: ProgressStorage = {
  async saveAttempt(attempt: Attempt) {
    const data = load();
    data.attempts.push(attempt);
    save(data);
  },

  async getAttempts(exerciseId?: string) {
    const all = load().attempts;
    return exerciseId ? all.filter((a) => a.exerciseId === exerciseId) : all;
  },

  async getCompletedExercises() {
    const done = new Set<string>();
    for (const a of load().attempts) {
      if (a.success) done.add(a.exerciseId);
    }
    return [...done];
  },

  async exportAll() {
    return JSON.stringify(load(), null, 2);
  },

  async importAll(json: string) {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed.attempts)) {
      throw new Error("Invalid progress file: missing attempts array");
    }
    save(parsed);
  },

  async clearAll() {
    localStorage.removeItem(KEY);
  },
};
