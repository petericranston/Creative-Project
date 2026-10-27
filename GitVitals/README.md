# GitVitals

GitVitals is a web dashboard that reports on the health of a GitHub user's public repositories. Enter a GitHub username, pick one of their repositories, and GitVitals shows how active the project is, how evenly the work is shared between contributors, and provides an AI review of individual files.

Live site: https://gitvitals-ten-tau.vercel.app

## Features

- **Overview** shows the repository's basic details (created and last updated dates, main language) alongside an overall health score.
- **Contribution** shows who has contributed and how much, with a commit timeline and a "dominance" score for each contributor. This makes it easy to see when one person is doing most of the work.
- **Analysis** lists every file in the repository. Choosing a file sends it to Claude (Anthropic's AI model), which returns a quality score from 0 to 100, a closer look at any issues, and a plain-English summary that someone who doesn't code can follow.
- **Settings** lets you change the GitHub user being analysed. The username is checked against GitHub before it is saved.

### How the scores work

- **Dominance score** for each contributor = `commits × 0.4 + lines added × 0.4 + lines deleted × 0.2`.
- **Health score** is the average of four sub-scores, each out of 100:
  - **Recency:** how recently the repository was updated (it drops to 0 after about six months).
  - **Spread:** how evenly commits are shared, so a single dominant committer lowers the score.
  - **Frequency:** how often commits are made.
  - **Balance:** lines deleted compared with lines added, which rewards refactoring and clean-up.

Only the last 100 commits on the default branch are analysed. Each commit's line counts are capped at 500, so bulk uploads of starter code don't skew the results.

## Architecture

GitVitals is made of two separate applications: a React frontend and an Express backend. The frontend never talks to GitHub or Anthropic directly. Every request goes through the backend, which keeps the API keys secret.

```
Browser (React + Vite)  ──/api/...──▶  Express backend  ──▶  GitHub API (REST + GraphQL)
     hosted on Vercel                  hosted on Azure  ──▶  Anthropic API (Claude)
```

### Frontend (`Frontend/`)

- Built with **React 19** and **Vite**, styled with **Tailwind CSS** and charts drawn with **Recharts**.
- `react-router-dom` handles the four pages (Overview, Contribution, Analysis, Settings).
- `App.jsx` holds the shared state: the current username and the chosen repository. It passes these down to each page.
- The username is saved in the browser's `localStorage`, so it is remembered between visits. There are no accounts or logins.

### Backend (`Backend/`)

- A **Node.js / Express** API with three parts:
  - `server.js` defines the API endpoints and calls Claude for file analysis.
  - `APIs/github.js` fetches data from GitHub using Octokit. It uses GraphQL for commit history and REST for everything else.
  - `Models/analysis.js` holds the scoring logic (dominance and health scores).
- GitHub responses are cached in memory for 5 minutes, which keeps the app fast and avoids GitHub's rate limits. As a result, new commits can take up to 5 minutes to appear.

| Endpoint                                     | Returns                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `GET /api/getRepos?username=`                | The user's repositories, most recently updated first                       |
| `GET /api/overview?repo=&username=`          | Repository name, created and updated dates, and language                   |
| `GET /api/contributors?repo=&username=`      | Contributors with dominance scores, a commit timeline and the health score |
| `GET /api/filesContent?repo=&username=`      | Every file path in the repository                                          |
| `GET /api/analyseFile?repo=&username=&path=` | Claude's score, deep dive and conclusion for one file                      |

### Deployment

- The frontend is deployed on **Vercel**.
- The backend is deployed to an **Azure Web App** by a GitHub Actions workflow every time changes are pushed to `main`.
