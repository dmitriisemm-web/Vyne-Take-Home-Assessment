import type { Page } from '@playwright/test';
import { CheckoutOverviewSelectors } from '../selectors/checkout-overview.selectors';
import { HeaderComponent } from './header.component';
import { parsePrice } from '../utils';

export class CheckoutOverviewPage extends CheckoutOverviewSelectors {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async getSubtotal(): Promise<number> {
    return parsePrice(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return parsePrice(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return parsePrice(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
