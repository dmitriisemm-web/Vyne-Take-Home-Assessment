import { CheckoutCompleteSelectors } from '../selectors/checkout-complete.selectors';
import { HeaderComponent } from '../components/header.component';

export class CheckoutCompletePage extends CheckoutCompleteSelectors {
  readonly header: HeaderComponent = new HeaderComponent(this.page);

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async getHeaderText(): Promise<string | null> {
    return this.completeHeader.textContent();
  }
}
