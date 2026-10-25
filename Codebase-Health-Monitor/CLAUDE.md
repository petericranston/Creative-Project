# CLAUDE.md

GitVitals: a web dashboard that reports the health of a public GitHub user's repositories (activity, contributor balance, AI per-file code review). University creative project. Two independent npm projects in one repo, with no root `package.json`.

## Layout

- `Backend/` is a CommonJS Express 5 API.
  - `server.js` holds the routes, CORS and the Anthropic call.
  - `APIs/github.js` wraps Octokit (REST and GraphQL).
  - `Models/analysis.js` holds the pure scoring functions.
- `Frontend/` is React 19 + Vite 8 (ESM, JSX, no TypeScript), with Tailwind 4 via `@tailwindcss/vite`, react-router-dom 7 and recharts.
  - `src/App.jsx` holds the routes and top-level state.
  - `src/pages/` has Overview, Contribution, Analysis and Settings. `Risk.jsx` is an unrouted stub.
  - `src/components/Navbar.jsx` is the nav. `settings.jsx` is an empty stub.
  - `src/styles/` has CSS (`overview.css` is empty).

## Commands

Backend (`cd Backend`):

- `npm run dev` runs nodemon. `npm start` runs node. Default port is 3000 (`PORT` overrides it).
- There are no tests (`npm test` is a placeholder).

Frontend (`cd Frontend`):

- `npm run dev` starts Vite. `npm run build`, `npm run lint` and `npm run preview` also exist.
- Vite proxies `/api` to `http://localhost:3000`, with polling file watch and 60s timeouts.

## Environment

- Backend `.env` (gitignored) needs `GITHUB_TOKEN` and `ANTHROPIC_API_KEY`. `PORT` is optional.
- Frontend needs `VITE_API_URL`, the backend base URL. Every `fetch` uses `${import.meta.env.VITE_API_URL}/api/...`. It is not used with the dev proxy, so set it for local dev too (e.g. `http://localhost:3000`).
- CORS in `server.js` is hardcoded to `https://gitvitals-ten-tau.vercel.app`. Local dev against a different origin needs that changed, or the Vite proxy with an empty `VITE_API_URL`.
- Deployment: the frontend is on Vercel and the backend is hosted separately.

## Architecture and data flow

There is no auth or database. The user types a GitHub username in Settings (validated by calling `/api/getRepos`, which must return a non-empty list) and it is stored in `localStorage["username"]`. `App.jsx` holds `username`, `chosenRepo` and `newUser`, and passes them to pages as props. Every API call passes `repo` and `username` as query params, and all GitHub reads use the server's single `GITHUB_TOKEN`.

Endpoints (all GET, in `server.js`):

- `/api/getRepos?username` returns `[{name}]`, sorted by updated.
- `/api/overview?repo&username` returns `{name, created_at, updated_at, language}`.
- `/api/contributors?repo&username` returns `{contributors (with dominanceScore), timeline, healthScore:{overall}}`.
- `/api/filesContent?repo&username` returns `[{name, path}]` for all blobs.
- `/api/analyseFile?repo&username&path` sends the file to Claude (`claude-haiku-4-5`) and returns `{analysis:{overallScore, deepDive, conclusion}}`. The prompt asks for raw JSON. The server strips code fences and falls back to `overallScore: 0` if parsing fails.

Caching: every GitHub request in `APIs/github.js` goes through `cached(key, request)`, an in-memory 5-minute cache.
- It stores the promise, so requests made at the same moment share one GitHub call.
- Failed requests are removed from the cache, so they are retried next time.
- `getRepo()` is the single shared `repos.get`, used by both `overview` and `repoContent`.
- New commits can take up to 5 minutes to show. A server restart clears the cache.

Scoring (`Models/analysis.js`):

- Dominance score = `commits*0.4 + additions*0.4 + deletions*0.2`.
- Health score is the average of four 0-100 sub-scores: recency, spread (1 − top committer's share), frequency, and deletion/addition ratio.

## Gotchas and known quirks

- GraphQL fetches only the last 100 commits on the default branch. Per-commit additions and deletions are capped at 500. Commits without a linked GitHub user are skipped.
- In `server.js`, `chosenRepo`, `username` and `path` are assigned without `const`/`let`. They are implicit globals shared across requests, which is a race hazard under concurrent requests. Declare them locally if you touch those handlers.
- Several handlers only `console.log` on error and never respond, so the request hangs. `github.js` functions often swallow errors and return `undefined`. `/api/contributors` then crashes on `overviewData.updated_at`.
- `calculateHealthScore` divides by `totalCommits` and calls `Math.max(...)` on an empty list. Repos with no attributable commits give `NaN` or `-Infinity`.
- The "commitsPerWeek" variable actually groups by month (`day.slice(0, 7)`).
- `calculateDominance` takes `totalCommits` but doesn't use it.
- `App.jsx` imports unused recharts pieces. `main.jsx` imports `StrictMode` but doesn't use it.
- `Frontend/README.md` is the stock Vite template, not project docs.

## Conventions

- Code comments are inline `//Comment` (no space) beside the line they explain. Match that style.
- Frontend data fetching is done in `useEffect` with inner async functions and `credentials: "include"`.
- Prettier-style formatting: double quotes, semicolons, 2 spaces.
