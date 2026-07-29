# Vyne Take-Home Assessment — Playwright test automation

Multi-app Playwright framework: `saucedemo` (UI, Page Object Model) and
`jsonplaceholder` (API, no browser). TypeScript, Yarn 4, ESLint, Prettier.

## Commands

- `yarn test:<app>` / `:smoke` / `:regression` — run a suite (`<app>` is `saucedemo` or `jsonplaceholder`)
- `yarn typecheck` / `yarn lint` / `yarn format` — must all pass before committing (also enforced by the pre-commit hook via lint-staged)
- Never run `playwright test` without `--config=playwright/apps/<app>/<app>.config.ts` — there is no root Playwright config that discovers tests on its own

## Page Object Model (saucedemo)

- **Structure per app**: `selectors/` (locators only), `pages/` (one page object per screen, extends its matching selectors class), `components/` (shared pieces like the nav header — locators _and_ methods in one file, no separate selectors file), `app.fixture.ts` (single fixture exposing every page), `tests/functional/`.
- Selectors are `readonly` field initializers, not getters: `readonly loginButton: Locator = this.page.getByTestId('login-button');`. Parameterized locators are `readonly` arrow-function fields: `readonly addToCartButton = (name: string): Locator => ...`.
- Every selectors/component class extends `UiBase` (`playwright/common/ui-base.ts`), which is what makes the field-initializer pattern safe — `UiBase`'s constructor assigns `this.page` before any subclass field initializer runs. Do not give a selectors/component class its own `constructor(page: Page)`; let it inherit `UiBase`'s.
- Page objects compose shared components as fields: `readonly header: HeaderComponent = new HeaderComponent(this.page);` — same field-initializer reasoning applies.
- **Locators only live in `*.selectors.ts` or `*.component.ts` files.** Never call `.locator()`/`.getByTestId()`/`.getByRole()`/etc. directly from a page, test, or util — enforced by `local/no-selectors-outside-file`.
- **No XPath, anywhere** — enforced by `local/no-xpath-selectors`. Use `getByTestId`/`getByRole`/CSS instead.
- Locators use `data-test` attributes (`testIdAttribute: 'data-test'` in `saucedemo.config.ts`) — verify the real attribute against the live DOM before adding a new one, don't guess.

## API clients (jsonplaceholder)

- Mirrors the same shape: `clients/resource.client.ts` is a generic CRUD client (`getAll`/`getById`/`create`/`update`/`patch`/`delete`/`getNested`) that every resource-specific client (`posts.client.ts`, etc.) extends. Only add a dedicated client subclass for a resource that needs relation methods beyond the generic CRUD shape — otherwise instantiate `ResourceClient` directly.
- Every client extends `ApiBase` (`playwright/common/api-base.ts`), the API-side counterpart to `UiBase`.
- Tests use the `request` fixture, never `page`/`context` — that's what keeps this app's config free of a browser.

## Fixtures

- Each app's `app.fixture.ts` exports a `test`/`expect` pair and an app-named fixture: `saucedemoApp` for saucedemo, `jsonplaceholderApp` for jsonplaceholder. Import from `'../../app.fixture'`, never import `test`/`expect` from `@playwright/test` directly in a spec.
- Access pages/clients via `saucedemoApp.loginPage`, `jsonplaceholderApp.postsClient`, etc. — don't destructure (`const { loginPage } = saucedemoApp`) at the top of a test.

## Test conventions

- Every test title starts with **"Verify"** or **"Check"** — enforced by `playwright/valid-title` (`mustMatch`).
- Every test is broken into `test.step()` blocks that separate the action from the assertion.
- `test.describe()` titles are a full sentence, not a bare noun: `"Check Login page functionalities"`, not `"Login"`.
- Tag every test with `{ tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }` or `[TAGS.FUNCTIONAL, TAGS.REGRESSION]`, importing `TAGS` from `playwright/common/constants.ts` — tags are framework-level, not per-app, so they don't belong in an app's own `constants.ts`.
- Use each app's own `constants.ts` for reusable test data (users, routes, resource counts, valid/invalid IDs) — don't hardcode strings that already have a constant.
- Before writing an assertion about real-app behavior (error text, status codes, sort order, etc.), verify it against the live site/API first. This codebase has caught itself being wrong more than once (cart persistence, `PUT` vs `PATCH` on a missing resource) — don't assume, check.

## ESLint/TypeScript (see `eslint.config.mjs`, `eslint-rules/`, `tsconfig.json`)

- `@typescript-eslint/no-explicit-any`, `no-non-null-assertion`, `no-require-imports` are errors — no `any`, no `!`, no `require()` (use ESM `import`).
- Single quotes, no XPath (`local/no-xpath-selectors`), locators confined to selectors/component files (`local/no-selectors-outside-file`), `no-console` except `info`/`warn`/`error`.
- `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noEmitOnError` in `tsconfig.json` — keep code clean of unused bindings, don't suppress with `_` prefixes.
- Default to **no comments**; add one only when it explains a non-obvious _why_ (see `ui-base.ts`'s field-initializer-ordering comment for the bar to clear).

## Workflow

- Every meaningful change gets its own branch and PR — never commit directly to `master`.
- Verify before shipping: run the relevant suite locally (and, for CI/workflow changes, trigger a real run) rather than trusting a diff review alone.
