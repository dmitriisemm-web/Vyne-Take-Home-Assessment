import type { Page } from '@playwright/test';
import { ProductDetailSelectors } from '../selectors/product-detail.selectors';
import { HeaderComponent } from './header.component';
import { parsePrice } from '../utils';

export class ProductDetailPage extends ProductDetailSelectors {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async getPrice(): Promise<number> {
    return parsePrice(await this.productPrice.innerText());
  }
}
