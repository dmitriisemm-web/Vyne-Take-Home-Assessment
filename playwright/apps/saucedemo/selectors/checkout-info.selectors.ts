import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';

export class CheckoutInfoSelectors extends UiBase {
  readonly firstNameInput: Locator = this.page.getByTestId('firstName');
  readonly lastNameInput: Locator = this.page.getByTestId('lastName');
  readonly postalCodeInput: Locator = this.page.getByTestId('postalCode');
  readonly cancelButton: Locator = this.page.getByTestId('cancel');
  readonly continueButton: Locator = this.page.getByTestId('continue');
  readonly errorMessage: Locator = this.page.getByTestId('error');
  readonly errorDismissButton: Locator = this.page.getByTestId('error-button');
}
