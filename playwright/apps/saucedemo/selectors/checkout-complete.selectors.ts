import type { Locator, Page } from '@playwright/test';

export class CheckoutCompleteSelectors {
  constructor(protected readonly page: Page) {}

  get completeHeader(): Locator {
    return this.page.getByTestId('complete-header');
  }

  get completeText(): Locator {
    return this.page.getByTestId('complete-text');
  }

  get backToProductsButton(): Locator {
    return this.page.getByTestId('back-to-products');
  }

  get generatePdfOrderButton(): Locator {
    return this.page.getByTestId('generate-pdf-order');
  }
}
