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
          <span className="brand-badge" aria-hidden="true">V7</span>
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
            {theme === "dark" ? "☀️" : "🌙"}
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
