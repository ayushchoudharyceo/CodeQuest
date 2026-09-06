# CodeQuest — MVP Scaffold

Working MVP for the platform described in `final_prompt.md` / `Rule_book.docx`:
zero-login entry, in-browser Python execution (Pyodide in a Web Worker), a skill
tree built from `CodeQuest_Levels.xlsx`, XP/coins/streak, one hint per lesson,
and confetti on a perfect run.

## What's included vs. deferred

Included (runnable today, frontend-only):
- Next.js 14 App Router + TypeScript + Tailwind
- Pyodide Web Worker with a 3s watchdog timer and stdout/stderr capture
- Zustand + localStorage guest profile (XP, coins, streak, completed levels)
- Skill tree generated from the real 44-level `levels.json` (converted from the xlsx)
- Lesson runner that checks `stdout ==` style assertions and rewards per the
  Rule_book economy (10 coins/20 XP base, +10/+10 perfect bonus)

Deferred (the full spec's backend layer — add once the MVP is validated):
- FastAPI + PostgreSQL + Redis sync backend, Google OAuth, leaderboards
- IndexedDB via `idb-keyval` (currently plain localStorage — same shape, swap later)
- Monaco/CodeMirror editor (currently a plain textarea)
- Drag-and-drop / AST-based mechanics for non-stdout assertions (currently only
  `stdout == '...'` levels are auto-gradable; others are stubbed)

## 1. Prerequisites to install

| Tool | Why | Check |
|---|---|---|
| [Node.js 20 LTS](https://nodejs.org) | Runs Next.js | `node -v` |
| npm (bundled with Node) | Package manager | `npm -v` |
| [VS Code](https://code.visualstudio.com) | Editor | — |
| [Git](https://git-scm.com) | Version control | `git --version` |

You do **not** need to install Python locally — Python runs inside the
browser via Pyodide (WebAssembly), which is the whole point of the platform.

Optional, only if/when you build the deferred backend:
- Python 3.11+ (for FastAPI)
- PostgreSQL 15+, Redis 7+ (or Docker Desktop to run both in containers)

## 2. Install & run

```bash
cd codequest
npm install
npm run dev
```

Open http://localhost:3000 — Level 1 (`print("Hello, World!")`) loads immediately,
no login.

## 3. Folder structure

```
codequest/
├── data/
│   └── levels.json          # all 44 levels, generated from CodeQuest_Levels.xlsx
├── src/
│   ├── app/
│   │   ├── layout.tsx        # root layout, global styles
│   │   ├── globals.css
│   │   ├── page.tsx          # skill tree home page
│   │   └── lesson/[levelId]/page.tsx   # split-pane lesson + terminal
│   ├── components/
│   │   ├── StatusHUD.tsx     # streak / coins / XP bar
│   │   ├── LevelCard.tsx     # skill tree node (locked/unlocked/done)
│   │   └── CodeEditor.tsx    # code input (swap for Monaco later)
│   ├── store/
│   │   └── useGameStore.ts   # Zustand: xp, coins, streak, completed levels
│   ├── workers/
│   │   └── pyodide.worker.ts # loads Pyodide Wasm, runs code w/ 3s watchdog
│   ├── lib/
│   │   ├── levels.ts         # loads/queries levels.json
│   │   └── runPython.ts      # CodeRunner interface + worker messaging
│   └── types/
│       └── level.ts
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## 4. Next steps toward the full `final_prompt.md` spec

1. Swap `localStorage` in `useGameStore.ts` for `idb-keyval` (same persist API).
2. Replace the textarea in `CodeEditor.tsx` with Monaco or CodeMirror for
   syntax highlighting + the fill-in-the-blank/drag-drop mechanics.
3. Extend `checkAssertion` in the lesson page to evaluate non-stdout
   assertions by reading Pyodide globals back from the worker.
4. Stand up FastAPI + PostgreSQL + Redis, add `POST /api/v1/sync/claim-guest`,
   and wire Google OAuth per section 2 of `final_prompt.md`.
