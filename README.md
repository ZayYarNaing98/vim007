# Vim TypeTutor (vim007)

An interactive Vim learning app inspired by [vim-hero.com](https://www.vim-hero.com/) — a real editor in the browser with Vim keybindings, bite-sized exercises, instant feedback, and progress tracking. React-only: no backend, progress lives in `localStorage`.

Built from the implementation guide in `aps/documents/vim-typetutor-implementation.md`.

## Stack

- **React 19 + TypeScript + Vite**
- **CodeMirror 6** with [`@replit/codemirror-vim`](https://github.com/replit/codemirror-vim) for full Vim emulation
- **Zustand** for app state, **react-router-dom** for routing
- Progress persistence behind a `ProgressStorage` interface (`src/storage/`) — swap in an API implementation later without touching editor or lesson code

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## How it works

1. Each **lesson** (`src/lessons/*.json`) contains exercises with an initial buffer, initial cursor, a **goal** (target cursor position and/or buffer content), allowed keys, and a par keystroke count.
2. The `VimEditor` component intercepts every keystroke, blocks keys not allowed in the exercise, and reports buffer/cursor changes.
3. `checkGoal()` (`src/engine/goalChecker.ts`) runs on every editor update — outcomes are validated, not keystroke sequences, so any valid Vim solution counts.
4. On success you get a rank (S/A/B/C) based on keystrokes vs par, and the attempt is saved.
5. The Progress page shows per-skill proficiency (with daily decay), suggests what to practice next, and can export/import progress as JSON.

## Project structure

```
src/
├── components/   VimEditor, VimStatusBar, InstructionPanel, FeedbackOverlay
├── engine/       goalChecker, scoring (ranks + proficiency)
├── lessons/      lesson JSON files + types + index
├── storage/      ProgressStorage interface + localStorage implementation
├── store/        Zustand store
└── pages/        Home (lesson list), Lesson (the tutor), Progress
```

## Adding a lesson

Create `src/lessons/NN-name.json` following the schema in `src/lessons/types.ts`, then register it in `src/lessons/index.ts`. Verify `goal.cursor` positions by playing the exercise yourself — Vim's normal-mode cursor sits *on* a character.

## Roadmap

- [ ] More lessons: counts & repeat, visual mode, search/replace, macros
- [ ] Drill mode with randomized exercise templates
- [ ] Speed drills with timers
- [ ] Optional backend (accounts, sync) via a second `ProgressStorage` implementation
