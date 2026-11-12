import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { categories, lessons } from "../lessons";
import { useAppStore } from "../store/useAppStore";

const groups = categories.map((category) => ({
  category,
  lessons: lessons.filter((l) => l.category === category),
}));

type Props = {
  /** Drawer state on narrow screens; ignored on desktop where the sidebar is always visible. */
  open: boolean;
  onNavigate: () => void;
};

export function LessonSidebar({ open, onNavigate }: Props) {
  const completed = useAppStore((s) => s.completed);
  const refresh = useAppStore((s) => s.refresh);
  const { pathname } = useLocation();
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Keep the current lesson visible in the (independently scrolling) list.
  useEffect(() => {
    const aside = asideRef.current;
    const active = aside?.querySelector<HTMLElement>(".sidebar-item.active");
    if (!aside || !active) return;
    const top = active.offsetTop;
    if (top < aside.scrollTop || top + active.offsetHeight > aside.scrollTop + aside.clientHeight) {
      aside.scrollTop = top - aside.clientHeight / 2;
    }
  }, [pathname]);

  return (
    <aside ref={asideRef} className={`lesson-sidebar${open ? " open" : ""}`}>
      <nav aria-label="Lessons">
        {groups.map((group) => (
          <section key={group.category} className="sidebar-group">
            <h2 className="sidebar-title">{group.category.replace(/-/g, " ")}</h2>
            <ul>
              {group.lessons.map((lesson) => {
                const isComplete = lesson.exercises.every((e) => completed.includes(e.id));
                return (
                  <li key={lesson.slug}>
                    <NavLink
                      to={`/lesson/${lesson.slug}`}
                      className="sidebar-item"
                      onClick={onNavigate}
                    >
                      <span className="sidebar-item-title">
                        {isComplete && (
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label="completed">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        )}
                        {lesson.title}
                      </span>
                      <span className="sidebar-keys">
                        {lesson.keys.slice(0, 3).map((k) => (
                          <kbd key={k}>{k}</kbd>
                        ))}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}
