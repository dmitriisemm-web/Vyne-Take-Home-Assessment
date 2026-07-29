import type { Page } from '@playwright/test';
import { CheckoutCompleteSelectors } from '../selectors/checkout-complete.selectors';
import { HeaderComponent } from './header.component';

export class CheckoutCompletePage extends CheckoutCompleteSelectors {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async getHeaderText(): Promise<string | null> {
    return this.completeHeader.textContent();
  }
}
