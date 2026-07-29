import type { Locator } from '@playwright/test';
import { Base } from '../../../common/base';

export class LoginSelectors extends Base {
  readonly usernameInput: Locator = this.page.getByTestId('username');
  readonly passwordInput: Locator = this.page.getByTestId('password');
  readonly loginButton: Locator = this.page.getByTestId('login-button');
  readonly errorMessage: Locator = this.page.getByTestId('error');
  readonly errorDismissButton: Locator = this.page.getByTestId('error-button');
}
