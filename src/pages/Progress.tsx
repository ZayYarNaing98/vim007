import { useEffect } from "react";
import { lessons } from "../lessons";
import { useAppStore } from "../store/useAppStore";

export function ProgressPage() {
  const { completed, skills, totalAttempts, refresh } = useAppStore();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
  const weakest = skills[0];

  return (
    <div className="page">
      <h1>Your Progress</h1>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">
            {completed.length}/{totalExercises}
          </div>
          <div className="stat-label">exercises completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalAttempts}</div>
          <div className="stat-label">total attempts</div>
        </div>
      </div>

      <h2>Skill proficiency</h2>
      {skills.length === 0 ? (
        <p className="muted">No attempts yet — complete some exercises first.</p>
      ) : (
        <>
          <div className="skill-bars">
            {skills.map((s) => (
              <div key={s.category} className="skill-bar-row">
                <span className="skill-name">{s.category}</span>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${s.proficiency}%` }} />
                </div>
                <span className="skill-value">{s.proficiency}</span>
              </div>
            ))}
          </div>
          {weakest && weakest.proficiency < 80 && (
            <p className="practice-suggestion">
              💡 Practice next: <strong>{weakest.category}</strong>
            </p>
          )}
        </>
      )}
    </div>
  );
}
