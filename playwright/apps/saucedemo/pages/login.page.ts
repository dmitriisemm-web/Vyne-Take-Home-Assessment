import { LoginSelectors } from '../selectors/login.selectors';
import { ROUTES } from '../constants';

export class LoginPage extends LoginSelectors {
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
