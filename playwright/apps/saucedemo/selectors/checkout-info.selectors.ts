import type { Locator, Page } from '@playwright/test';

export class CheckoutInfoSelectors {
  constructor(protected readonly page: Page) {}

  get firstNameInput(): Locator {
    return this.page.getByTestId('firstName');
  }

  get lastNameInput(): Locator {
    return this.page.getByTestId('lastName');
  }

  get postalCodeInput(): Locator {
    return this.page.getByTestId('postalCode');
  }

  get cancelButton(): Locator {
    return this.page.getByTestId('cancel');
  }

  get continueButton(): Locator {
    return this.page.getByTestId('continue');
  }

  get errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  get errorDismissButton(): Locator {
    return this.page.getByTestId('error-button');
  }
}
