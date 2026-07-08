export type Attempt = {
  exerciseId: string;
  keystrokesUsed: number;
  durationMs: number;
  success: boolean;
  at: string; // ISO date
};

export type SkillProgress = {
  category: string;
  proficiency: number; // 0–100
  lastPracticedAt: string;
};

/**
 * All persistence goes through this interface. The app only ships a
 * localStorage implementation today; a future backend (API) implementation
 * can replace it without touching editor or lesson code.
 */
export interface ProgressStorage {
  saveAttempt(attempt: Attempt): Promise<void>;
  getAttempts(exerciseId?: string): Promise<Attempt[]>;
  getCompletedExercises(): Promise<string[]>;
  exportAll(): Promise<string>;
  importAll(json: string): Promise<void>;
  clearAll(): Promise<void>;
}
