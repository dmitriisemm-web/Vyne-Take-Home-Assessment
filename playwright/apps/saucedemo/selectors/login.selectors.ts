import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';

export class LoginSelectors extends UiBase {
  readonly usernameInput: Locator = this.page.getByTestId('username');
  readonly passwordInput: Locator = this.page.getByTestId('password');
  readonly loginButton: Locator = this.page.getByTestId('login-button');
  readonly errorMessage: Locator = this.page.getByTestId('error');
  readonly errorDismissButton: Locator = this.page.getByTestId('error-button');
}
