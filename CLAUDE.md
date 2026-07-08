# Vim TypeTutor (vim007)

Interactive Vim learning app inspired by vim-hero.com. React-only SPA — no backend; progress lives in `localStorage`. The full design doc lives at `../../../aps/documents/vim-typetutor-implementation.md`.

## Commands

```bash
npm run dev      # dev server (Vite)
npm run build    # tsc -b && vite build — run this to verify changes compile
npm run lint     # oxlint
```

## Architecture

- `src/components/VimEditor.tsx` — CodeMirror 6 + `@replit/codemirror-vim`. Intercepts keydown before Vim (Prec.highest domEventHandlers) to count keystrokes, block disallowed keys, and prevent Ctrl-w closing the tab. The initial cursor and the `vim-mode-change` listener are set in a `useEffect` that polls for the view — NOT in `onCreateEditor`, which fires on a view StrictMode immediately destroys.
- `src/engine/goalChecker.ts` — pure function; validates buffer/cursor/mode against the exercise goal. Outcomes are validated, never keystroke sequences.
- `src/pages/Lesson.tsx` — the tutor loop. Editor callbacks use refs (`keystrokesRef`, `solvedRef`, `modeRef`, `lastStateRef`) to avoid stale closures. Mode changes re-run the goal check because `Esc` produces no document update.
- `src/lessons/*.json` — lesson data; registered in `src/lessons/index.ts`.
- `src/storage/` — `ProgressStorage` interface + localStorage impl. All persistence goes through the interface so a backend can be added later by writing one new implementation.
- `src/engine/scoring.ts` — S/A/B/C ranks vs par; per-category proficiency with daily decay.

## Conventions

- Exercise goals: verify `goal.cursor` positions by computing `string.indexOf(target)` — Vim's normal-mode cursor sits ON a character. Trailing whitespace is normalized before buffer comparison.
- Insert-mode exercises must set `"mode": "normal"` in the goal so pressing `Esc` is part of the exercise.
- The editor is remounted via `key={exercise.id + attemptNo}` for every exercise/retry — never mutate editor state across exercises.
- `Escape` is always allowed even when `allowedKeys` is set (users must never get stuck in Insert mode).
