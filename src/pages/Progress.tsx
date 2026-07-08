import { useEffect, useRef, useState } from "react";
import { lessons } from "../lessons";
import { useAppStore } from "../store/useAppStore";

export function ProgressPage() {
  const { completed, skills, totalAttempts, refresh, exportProgress, importProgress, clearProgress } =
    useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
  const weakest = skills[0];

  const handleExport = async () => {
    const json = await exportProgress();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vim-typetutor-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      await importProgress(await file.text());
      setMessage("Progress imported.");
    } catch {
      setMessage("Import failed — not a valid progress file.");
    }
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
        Progress lives in this browser's localStorage. Export it to move devices or keep a
        backup.
      </p>
      <div className="feedback-actions">
        <button className="btn btn-primary" onClick={handleExport}>
          Export progress
        </button>
        <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
          Import progress
        </button>
        <button className="btn btn-danger" onClick={handleReset}>
          Reset all
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImport(file);
            e.target.value = "";
          }}
        />
      </div>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
