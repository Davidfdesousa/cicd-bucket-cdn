# AGENTS.md — template-vite-webcomponents

Guidance for AI coding agents working in this repository.

## Stack

Vite 8 · TypeScript 6 (strict) · Lit 3 Web Components · plain CSS with design tokens · Firebase Auth (Google) · Vitest + happy-dom · ESLint + Prettier · semantic-release.

## Commands

- `npm run verify` — lint, format check, typecheck, tests and build. Run it before declaring a task done.
- `npm test` — unit tests only.
- `npm run dev` — local server on port 5173.

## Conventions

- All identifiers, file names, tags, props and CSS tokens are in **English**. UI copy is in Brazilian Portuguese.
- Custom element tags use the `app-` prefix. One folder per component under `src/components/<name>/` with `<name>.ts`, optional `<name>.styles.ts`, and `<name>.test.ts`.
- Register every tag in `HTMLElementTagNameMap` and every custom event in `HTMLElementEventMap`.
- Use Lit decorators (`@customElement`, `@property`, `@state`). The project relies on `experimentalDecorators` + `useDefineForClassFields: false`.
- Import local modules with the `.ts` extension.
- Pages are stateless: data comes in as properties, actions go out as bubbling, composed events. `app-root` owns the auth state.
- Never import Firebase outside `src/services/auth/` and `src/config/firebase.config.ts`. Components talk to `AuthService` through `AuthController`.

## Styling

- Components consume **semantic tokens only** (`--color-bg-*`, `--color-content-*`, `--color-border-*`, `--spacing-stack|inline|inset-*`, `--typography-*`, `--radius-control|surface`). Never use `--palette-*` or `--size-*` inside a component.
- New color tokens go in `src/styles/tokens/semantic.css` using `light-dark(<light>, <dark>)` inside the `:root, [data-theme]` block.
- Use logical properties (`inline-size`, `padding-inline`, `margin-block`…).
- Every interactive element needs a visible `:focus-visible` state and must work with the keyboard.

## Commits

Conventional Commits are enforced (commitlint). The type decides the release: `fix` → patch, `feat` → minor, `!`/`BREAKING CHANGE` → major. Use `chore`, `docs`, `refactor`, `test`, `ci` for changes that should not release.
