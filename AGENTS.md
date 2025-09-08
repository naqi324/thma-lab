# Repository Guidelines

## Project Structure & Module Organization
- `src/` — React + TypeScript app code (`components/`, `services/`, styles).
- `public/` — static assets: `index.md` (main content), `images/`, `kb/` CSVs.
- `amplify/` — AWS Amplify backend configuration (`auth/`, `data/`, `backend.ts`).
- Root config: `package.json`, `vite.config.ts`, `tsconfig*.json`, `.eslintrc.cjs`, `.env.example`.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start Vite dev server (http://localhost:5173).
- `npm run build` — type-check with `tsc` then build with Vite to `dist/`.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run ESLint (TypeScript + React Hooks rules).

## Coding Style & Naming Conventions
- Language: TypeScript + React functional components.
- Indentation: 2 spaces; keep diffs small and avoid mass reformatting.
- Naming: PascalCase for React components, camelCase for variables/functions, kebab-case for asset filenames (e.g., `public/images/save-button.png`).
- Files: `.tsx` for components, `.ts` for logic/services.
- Linting: configured via `.eslintrc.cjs` with `@typescript-eslint`, `react-hooks`, and `react-refresh` rules. Fix issues before committing.
- Env vars: must be prefixed with `VITE_` (see `.env.example`); do not commit secrets.

## Testing Guidelines
- No test runner is configured yet. Validate changes by:
  - `npm run build` and `npm run preview` without warnings/errors.
  - Verifying core flows in Chrome/Safari/Firefox.
- If adding tests, prefer Vitest + React Testing Library; name files `*.test.ts(x)` and keep them near sources.

## Commit & Pull Request Guidelines
- Branch from `main`; keep PRs focused and small.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`…).
- Before opening a PR: run `npm run lint`, `npm run build`, and update docs (e.g., `README.md`) as needed.
- PR description: what/why/how, screenshots/GIFs for UI changes, linked issues, and any config/env notes.

## Security & Configuration Tips
- Use `.env.local` for local secrets; never commit it. Start from `.env.local.example` (or `.env.example`) and adjust as needed.
- Do not expose API keys in frontend code; prefer a proxy or AWS Secrets Manager in production.
- Check Amplify settings (`amplify.yml`) for deployment behavior; output is `dist/`.

## Notes for Agents (and Maintainers)
- Follow this guide’s conventions, minimize unrelated refactors, and keep changes scoped.
- When adding features, place UI in `src/components/`, logic in `src/services/`, and update `public/index.md` if user-facing steps change.
