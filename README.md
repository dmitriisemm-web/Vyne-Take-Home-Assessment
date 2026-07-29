# Vyne Take-Home Assessment — Test Automation Framework

Playwright test automation for two applications:

- **[SauceDemo](https://www.saucedemo.com/)** — UI end-to-end tests using a Page Object Model
- **[JSONPlaceholder](https://jsonplaceholder.typicode.com/)** — API tests using Playwright's `request` fixture, no browser involved

This repo is built with **scalability, maintainability, and reusability** in mind: adding a third app, a third page, or a third API resource should mean following an existing pattern, not inventing a new one. See [Framework rules](#framework-rules) for what that actually means in practice — and why it's the difference between "a repo with Playwright installed" and a test automation _framework_.

## Table of contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Page Object Model](#page-object-model)
- [API client architecture](#api-client-architecture)
- [Test conventions](#test-conventions)
- [CI pipelines](#ci-pipelines)
- [Framework rules](#framework-rules)

## Tech stack

| Tool                                                                                                   | Purpose                                                           |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [TypeScript](https://www.typescriptlang.org/)                                                          | Language, strict mode                                             |
| [Playwright](https://playwright.dev/)                                                                  | Test runner, browser automation, API testing                      |
| [Yarn 4](https://yarnpkg.com/) (via Corepack)                                                          | Package manager                                                   |
| [ESLint](https://eslint.org/) (flat config)                                                            | Static analysis — built-in, Playwright-specific, and custom rules |
| [Prettier](https://prettier.io/)                                                                       | Formatting                                                        |
| [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Pre-commit gate: lint, format, typecheck staged files             |
| [GitHub Actions](https://github.com/features/actions)                                                  | CI: static analysis on every PR, on-demand regression pipeline    |

## Getting started

**Prerequisites:** Node 24, Corepack (ships with Node).

```bash
corepack enable
yarn install --immutable
yarn playwright install --with-deps chromium webkit
```

JSONPlaceholder's tests never launch a browser, so if you only plan to run that suite you can skip the browser install.

### Running tests

```bash
# Full suite for one app
yarn test:saucedemo
yarn test:jsonplaceholder

# Just smoke or regression
yarn test:saucedemo:smoke
yarn test:saucedemo:regression
yarn test:jsonplaceholder:smoke
yarn test:jsonplaceholder:regression

# UI mode / headed mode (saucedemo only — jsonplaceholder has no UI to watch)
yarn test:saucedemo:ui
yarn test:saucedemo:headed

# View the last HTML report
yarn report
```

Every test command requires `--config=playwright/apps/<app>/<app>.config.ts` under the hood (already wired into the scripts above) — there's no root Playwright config that auto-discovers tests, by design. See [Project structure](#project-structure).

## Available scripts

| Script                                 | What it does                                     |
| -------------------------------------- | ------------------------------------------------ |
| `yarn test:<app>[:smoke\|:regression]` | Run a suite for `saucedemo` or `jsonplaceholder` |
| `yarn lint` / `yarn lint:fix`          | ESLint across the whole repo                     |
| `yarn typecheck`                       | `tsc --noEmit`                                   |
| `yarn format` / `yarn format:check`    | Prettier write / check                           |
| `yarn report`                          | Open the last Playwright HTML report             |

## Project structure

```
playwright.config.ts               # Shared base config every app extends
eslint.config.mjs                  # ESLint flat config (built-in + custom rules)
eslint-rules/                      # Custom ESLint rules (see Framework rules)

playwright/
├── common/                        # Cross-app building blocks
│   ├── ui-base.ts                 #   Base class for UI selectors/components (wraps Page)
│   ├── api-base.ts                #   Base class for API clients (wraps APIRequestContext)
│   └── constants.ts               #   TAGS (@functional/@smoke/@regression) — framework-level, not per-app
│
└── apps/
    ├── saucedemo/
    │   ├── saucedemo.config.ts     # Extends the base config: baseURL, browser projects, testIdAttribute
    │   ├── selectors/               # One *.selectors.ts per screen — locators only
    │   ├── pages/                   # One *.page.ts per screen — extends its selectors class, adds actions
    │   ├── components/              # Shared pieces (e.g. nav header) — locators + methods in one file
    │   ├── app.fixture.ts           # `saucedemoApp` fixture — single entry point into every page object
    │   ├── constants.ts / types.ts / utils.ts
    │   └── tests/functional/        # *.spec.ts, tagged @smoke/@regression
    │
    └── jsonplaceholder/
        ├── jsonplaceholder.config.ts  # No browser projects — API-only
        ├── clients/                   # ResourceClient (generic CRUD) + per-resource subclasses
        ├── app.fixture.ts             # `jsonplaceholderApp` fixture
        ├── constants.ts / types.ts / utils.ts
        └── tests/functional/
```

## Page Object Model

Every SauceDemo screen is represented by two classes:

1. **A selectors class** (`*.selectors.ts`) — locators only, declared as `readonly` field initializers, not getters:

   ```ts
   export class LoginSelectors extends UiBase {
     readonly usernameInput: Locator = this.page.getByTestId('username');
     readonly loginButton: Locator = this.page.getByTestId('login-button');
   }
   ```

   Parameterized locators (e.g. "the Add to Cart button for product X") are `readonly` arrow-function fields:

   ```ts
   readonly addToCartButton = (name: string): Locator => this.page.getByTestId(`add-to-cart-${slugify(name)}`);
   ```

2. **A page class** (`*.page.ts`) — extends the matching selectors class and adds the actions/assertions a test actually calls:

   ```ts
   export class LoginPage extends LoginSelectors {
     async login(username: string, password: string): Promise<void> {
       await this.usernameInput.fill(username);
       await this.loginButton.click();
     }
   }
   ```

Both selectors and page classes extend **`UiBase`** (`playwright/common/ui-base.ts`), which does one thing: assign `this.page` in its constructor. That's what makes the `readonly` field-initializer pattern above safe — per JavaScript class-field semantics, a subclass's field initializers only run _after_ `super()` returns, so `this.page` is guaranteed set by the time a locator field initializes. A selectors/page class must never define its own `constructor(page: Page)` — that would break this guarantee.

### Shared components

Some UI — the nav header, the cart badge, the hamburger menu — appears on almost every screen, not just one. Duplicating its locators and click methods into every page class would violate the whole point of the model, so it gets factored out into `components/` instead: one file per component, holding both locators and methods together (unlike the selectors/page split), since a component is small and self-contained enough not to need it.

A component is **composed into** each page as a field, not inherited:

```ts
export class InventoryPage extends InventorySelectors {
  readonly header: HeaderComponent = new HeaderComponent(this.page);
}
```

```ts
await saucedemoApp.inventoryPage.header.logout();
```

This is why `components/` exists as its own concept rather than just being "smaller pages": a page represents one screen, but a component represents a piece of UI that's reused _across_ screens, so it can't live inside any single page's own selectors/page pair.

All of it is tied together by **`app.fixture.ts`**, which exposes a single `saucedemoApp` fixture holding an instance of every page:

```ts
test('Verify user can log in', async ({ saucedemoApp }) => {
  await saucedemoApp.loginPage.login('standard_user', 'secret_sauce');
  await expect(saucedemoApp.inventoryPage.title).toHaveText('Products');
});
```

## API client architecture

JSONPlaceholder has no UI, so it uses the same idea in a different shape: **clients** instead of **pages**. A generic `ResourceClient` (`clients/resource.client.ts`) implements the full CRUD + nested-relation shape that every JSONPlaceholder resource speaks:

```ts
export class ResourceClient extends ApiBase {
  async getAll(params?): Promise<APIResponse> { ... }
  async getById(id): Promise<APIResponse> { ... }
  async create(data): Promise<APIResponse> { ... }
  async update(id, data): Promise<APIResponse> { ... }   // PUT
  async patch(id, data): Promise<APIResponse> { ... }
  async delete(id): Promise<APIResponse> { ... }
}
```

Resource-specific clients (`posts.client.ts`, `albums.client.ts`, `users.client.ts`) extend it _only_ to add relation methods that don't fit the generic shape (`getComments`, `getPhotos`, `getTodos`). Resources with no extra relations (comments, photos, todos) are used as plain `ResourceClient` instances — no subclass needed just for a name.

The `jsonplaceholderApp` fixture exposes every client the same way `saucedemoApp` exposes every page:

```ts
test('Verify GET /posts/1 returns the correct shape', async ({ jsonplaceholderApp }) => {
  const response = await jsonplaceholderApp.postsClient.getById(1);
  expect(response.status()).toBe(200);
});
```

Tests only ever consume the `request` fixture (via the client classes), never `page`/`context` — that's what keeps `jsonplaceholder.config.ts` free of any browser project.

## Test conventions

- Every test title starts with **`Verify`** or **`Check`**.
- Every test is broken into `test.step()` blocks, separating the action from the assertion.
- Every test is tagged `{ tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }` or `[TAGS.FUNCTIONAL, TAGS.REGRESSION]`.
- Reusable test data (users, routes, resource counts, valid/invalid IDs) lives in each app's own `constants.ts` — no ad-hoc hardcoded strings.

## CI pipelines

### `Pull Request Check` — runs on every PR

Lint + typecheck (`eslint.config.mjs`, `tsc --noEmit`). This is a **required status check** — a PR cannot merge into `master` until it's green.

### `Regression Pipeline` — on demand (`workflow_dispatch`)

Manually triggered from the Actions tab (or `gh workflow run regression-pipeline.yml -f app=... -f suite=...`), with two inputs:

- **app**: `saucedemo` or `jsonplaceholder`
- **suite**: `smoke`, `regression`, or `all`

Runs inside the official `mcr.microsoft.com/playwright:<version>-jammy` Docker image, which ships with the browsers pre-installed — no separate browser-install step. Uploads the HTML report as a build artifact regardless of pass/fail.

## Framework rules

**Installing Playwright is not a framework.** A framework is what you get when you take a design pattern — here, the Page Object Model on the UI side and the resource-client pattern on the API side — and _enforce_ its usage, so the pattern survives contact with deadlines and new contributors instead of eroding one PR at a time. Enforcement is what separates "a folder of Playwright tests" from an actual test automation framework, and it's why this repo splits its rules into two kinds:

### Soft rules (convention — followed by habit and code review)

These aren't mechanically enforced; they rely on the patterns above being followed consistently:

- Page/client classes extend `UiBase`/`ApiBase` and never define their own `constructor(page)` — see [Page Object Model](#page-object-model) for why.
- Fixture access via `saucedemoApp.loginPage`, not destructured at the top of a test.
- `test.describe()` titles are a full sentence ("Check Login page functionalities"), not a bare noun.

### Hard rules (enforced — bad code cannot reach `master`)

| Rule                                                                                                                  | Enforced by                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Test titles must start with "Verify" or "Check"                                                                       | `playwright/valid-title` (ESLint)                                                                                   |
| No locator (`.locator()`, `.getByTestId()`, `.getByRole()`, etc.) outside a `*.selectors.ts` or `*.component.ts` file | `local/no-selectors-outside-file` — **custom ESLint rule**, `eslint-rules/no-selectors-outside-file.mjs`            |
| No XPath selectors anywhere in the framework                                                                          | `local/no-xpath-selectors` — **custom ESLint rule**, `eslint-rules/no-xpath-selectors.mjs`                          |
| No `any`, no non-null assertions (`!`), no `require()`                                                                | `@typescript-eslint/no-explicit-any`, `no-non-null-assertion`, `no-require-imports`                                 |
| Consistent formatting                                                                                                 | Prettier, `no-console` (except `info`/`warn`/`error`), single quotes                                                |
| Nothing above can be skipped locally                                                                                  | Husky pre-commit hook runs `lint-staged` (ESLint --fix, Prettier, `tsc --noEmit`) on every staged file              |
| Nothing above can be skipped remotely                                                                                 | `Pull Request Check` is a required GitHub branch protection status check — a failing PR physically cannot be merged |

The two custom ESLint rules are the clearest example of what "enforcing a pattern" means in practice: nothing about Playwright or TypeScript stops a developer from writing `page.getByTestId('foo').click()` straight inside a test file, bypassing the Page Object Model entirely. The rule does. That's the difference this README is pointing at.
