import type { Page } from '@playwright/test';

/**
 * Shared base for every selectors/component class. Subclasses declare
 * their locators as `readonly` field initializers referencing `this.page`
 * (e.g. `readonly loginButton: Locator = this.page.getByTestId('login-button')`),
 * which only works because this class assigns `this.page` in its own
 * constructor - by the time a subclass's field initializers run, `super()`
 * has already returned and `this.page` is set.
 */
export class Base {
  constructor(protected readonly page: Page) {}
}
