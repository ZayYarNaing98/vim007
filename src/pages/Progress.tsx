import { useEffect, useState } from "react";
import { lessons } from "../lessons";
import type { SkillProgress } from "../storage/storage";
import { useAppStore } from "../store/useAppStore";

/** Self-contained HTML progress report, styled to match the app's dark theme. */
function buildReportHtml(
  completed: string[],
  totalExercises: number,
  totalAttempts: number,
  skills: SkillProgress[]
): string {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const skillRows = skills
    .map(
      (s) => `
      <div class="row">
        <span class="name">${s.category}</span>
        <div class="bar"><div class="fill" style="width:${s.proficiency}%"></div></div>
        <span class="value">${s.proficiency}</span>
      </div>`
    )
    .join("");

  const lessonRows = lessons
    .map((l) => {
      const done = l.exercises.filter((e) => completed.includes(e.id)).length;
      const total = l.exercises.length;
      const status = done === total ? `<span class="done">✓ complete</span>` : `${done}/${total}`;
      return `<tr><td>${l.order}</td><td>${l.title}</td><td class="num">${status}</td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Vim TypeTutor — Progress Report</title>
<style>
  body { background: #0f1117; color: #e2e6ef; font-family: "Segoe UI", system-ui, sans-serif;
         max-width: 720px; margin: 0 auto; padding: 2rem 1rem; }
  h1 { margin-bottom: 0.25rem; }
  .date { color: #8b93a7; margin-top: 0; }
  .stats { display: flex; gap: 1rem; margin: 1.5rem 0; }
  .stat { flex: 1; background: #1c212e; border: 1px solid #2a3040; border-radius: 10px;
          padding: 1rem; text-align: center; }
  .stat b { display: block; font-size: 1.6rem; color: #7aa2f7; }
  .stat span { color: #8b93a7; font-size: 0.85rem; }
  .row { display: flex; align-items: center; gap: 0.75rem; margin: 0.5rem 0; }
  .name { width: 7rem; text-transform: capitalize; }
  .bar { flex: 1; height: 8px; background: #1c212e; border-radius: 999px; overflow: hidden; }
  .fill { height: 100%; background: linear-gradient(90deg, #7aa2f7, #bb9af7); border-radius: 999px; }
  .value { width: 2.5rem; text-align: right; font-family: monospace; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #2a3040; }
  .num { text-align: right; font-family: monospace; }
  .done { color: #9ece6a; }
</style>
</head>
<body>
  <h1>Vim TypeTutor — Progress Report</h1>
  <p class="date">Exported ${date}</p>
  <div class="stats">
    <div class="stat"><b>${completed.length}/${totalExercises}</b><span>exercises completed</span></div>
    <div class="stat"><b>${totalAttempts}</b><span>total attempts</span></div>
  </div>
  <h2>Skill proficiency</h2>
  ${skillRows || `<p class="date">No attempts yet.</p>`}
  <h2>Lessons</h2>
  <table>${lessonRows}</table>
</body>
</html>`;
}

export function ProgressPage() {
  const { completed, skills, totalAttempts, refresh, clearProgress } = useAppStore();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
  const weakest = skills[0];

  const handleExport = () => {
    const html = buildReportHtml(completed, totalExercises, totalAttempts, skills);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vim-typetutor-progress.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (window.confirm("Delete all progress? This cannot be undone.")) {
      await clearProgress();
      setMessage("Progress cleared.");
    }
  };

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

      <h2>Backup</h2>
      <p className="muted">
        Progress lives in this browser's localStorage. Export a shareable HTML report of your
        stats.
      </p>
      <div className="feedback-actions">
        <button className="btn btn-primary" onClick={handleExport}>
          Export progress
        </button>
        <button className="btn btn-danger" onClick={handleReset}>
          Reset all
        </button>
      </div>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
