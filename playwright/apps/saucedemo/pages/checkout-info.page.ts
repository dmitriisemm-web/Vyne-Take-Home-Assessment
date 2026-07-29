import { CheckoutInfoSelectors } from '../selectors/checkout-info.selectors';
import { HeaderComponent } from '../components/header.component';
import { ROUTES } from '../constants';
import type { CheckoutInfo } from '../types';

export class CheckoutInfoPage extends CheckoutInfoSelectors {
  readonly header: HeaderComponent = new HeaderComponent(this.page);

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.CHECKOUT_STEP_ONE);
  }

  async fill(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
