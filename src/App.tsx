import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LessonPage } from "./pages/Lesson";
import { ProgressPage } from "./pages/Progress";
import { LessonSidebar } from "./components/LessonSidebar";
import { useThemeStore } from "./store/useThemeStore";

/** Remount the tutor loop per lesson so exercise state never leaks across lessons. */
function LessonRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <LessonPage key={slug} />;
}

function Shell() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { pathname } = useLocation();
  const onLesson = pathname.startsWith("/lesson/");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="header-left">
            {onLesson && (
              <button
                className="icon-btn menu-toggle"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle lesson list"
                aria-expanded={menuOpen}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <NavLink to="/" className="brand">
              <span className="brand-badge" aria-hidden="true">V</span>
              <span className="brand-name">Vim TypeTutor</span>
            </NavLink>
          </div>
          <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive || onLesson ? "active" : "")}>
              Lessons
            </NavLink>
            <NavLink to="/progress">Progress</NavLink>
          </nav>
          <div className="header-right">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <div className={`app-body${onLesson ? " with-sidebar" : ""}`}>
        {onLesson && (
          <>
            <LessonSidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
            {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
          </>
        )}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lesson/:slug" element={<LessonRoute />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
