# Repository Guidelines

## Project Structure & Module Organization

- `src/app` uses the Next.js App Router with route groups like `(auth)` and `(main)`. Route entries follow the `page.tsx` and `layout.tsx` convention.
- `src/components` holds shared UI building blocks, while `src/features` groups feature-specific UI, hooks, and data access.
- `src/hooks`, `src/lib`, `src/providers`, and `src/types` contain reusable hooks, utilities, React providers, and shared TypeScript types.
- Static assets live in `public`, and global styles are in `src/app/globals.css`.
- Middleware lives at `src/middleware.ts`.

## Build, Test, and Development Commands

- `pnpm dev` runs the Next.js dev server with Turbopack (listens on `0.0.0.0`).
- `pnpm build` creates a production build.
- `pnpm start` runs the production server from `.next` output.
- `pnpm lint` runs ESLint; `pnpm lint:fix` applies safe fixes.
- `pnpm format` and `pnpm format:check` run Prettier.
- `pnpm knip` checks for unused dependencies, files, and exports.

## Coding Style & Naming Conventions

- TypeScript is the default; prefer `.ts`/`.tsx` and keep types in `src/types` when shared.
- Components and providers use `PascalCase`; hooks use the `useX` pattern (e.g., `useSocialProfile`).
- Follow Prettier formatting and ESLint rules; keep JSX files under `src`.

## Testing Guidelines

- No dedicated test runner is configured in `package.json` yet. If you add tests, document the runner and add a `test` script.
- Prefer co-locating tests with feature modules (e.g., `src/features/foo/foo.test.tsx`) when introduced.

## Commit & Pull Request Guidelines

- Commit history follows Conventional Commits (e.g., `feat:`, `refactor:`, `chore:`). Keep messages short and scoped.
- PRs should describe the change, include relevant screenshots for UI updates, and link related issues or tasks.

## Configuration & Environment

- Local environment values live in `.env.local`; avoid committing secrets.
- Husky + lint-staged run formatting and lint fixes on staged files; keep changes formatted before committing.
