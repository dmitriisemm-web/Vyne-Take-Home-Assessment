import type { Locator, Page } from '@playwright/test';

export class LoginSelectors {
  constructor(protected readonly page: Page) {}

  get usernameInput(): Locator {
    return this.page.getByTestId('username');
  }

  get passwordInput(): Locator {
    return this.page.getByTestId('password');
  }

  get loginButton(): Locator {
    return this.page.getByTestId('login-button');
  }

  get errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  get errorDismissButton(): Locator {
    return this.page.getByTestId('error-button');
  }
}
