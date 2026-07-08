import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LessonPage } from "./pages/Lesson";
import { ProgressPage } from "./pages/Progress";

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <NavLink to="/" className="brand">
          ⌨️ Vim TypeTutor
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Lessons
          </NavLink>
          <NavLink to="/progress">Progress</NavLink>
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
