import { useEffect } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LessonPage } from "./pages/Lesson";
import { ProgressPage } from "./pages/Progress";
import { useThemeStore } from "./store/useThemeStore";

export default function App() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <header className="app-header">
        <NavLink to="/" className="brand">
          <span className="brand-badge" aria-hidden="true">V</span>
          Vim TypeTutor
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Lessons
          </NavLink>
          <NavLink to="/progress">Progress</NavLink>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
              </svg>
            )}
          </button>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
