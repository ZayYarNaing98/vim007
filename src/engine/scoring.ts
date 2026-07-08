import type { Attempt, SkillProgress } from "../storage/storage";
import { categoryOf, parOf } from "../lessons";

export type Rank = "S" | "A" | "B" | "C";

export function rankFor(par: number, used: number): Rank {
  if (used <= par) return "S";
  if (used <= par * 1.5) return "A";
  if (used <= par * 2.5) return "B";
  return "C";
}

/** Score for a single attempt: success ? clamp(par / used, 0.3, 1.0) * 100 : 0 */
export function attemptScore(attempt: Attempt): number {
  if (!attempt.success) return 0;
  const par = parOf(attempt.exerciseId);
  const used = Math.max(attempt.keystrokesUsed, 1);
  return Math.min(1, Math.max(0.3, par / used)) * 100;
}

const RECENT_ATTEMPTS = 10;
const DECAY_PER_DAY = 2;

/**
 * Proficiency per category: average of the last N attempt scores,
 * decayed by 2 points per day since last practice.
 */
export function computeSkillProgress(attempts: Attempt[]): SkillProgress[] {
  const byCategory = new Map<string, Attempt[]>();
  for (const attempt of attempts) {
    const category = categoryOf(attempt.exerciseId);
    const list = byCategory.get(category) ?? [];
    list.push(attempt);
    byCategory.set(category, list);
  }

  const result: SkillProgress[] = [];
  for (const [category, list] of byCategory) {
    const recent = list.slice(-RECENT_ATTEMPTS);
    const avg = recent.reduce((sum, a) => sum + attemptScore(a), 0) / recent.length;
    const lastPracticedAt = list[list.length - 1].at;
    const daysSince = Math.max(0, (Date.now() - Date.parse(lastPracticedAt)) / 86_400_000);
    const proficiency = Math.max(0, Math.round(avg - daysSince * DECAY_PER_DAY));
    result.push({ category, proficiency, lastPracticedAt });
  }
  return result.sort((a, b) => a.proficiency - b.proficiency);
}
