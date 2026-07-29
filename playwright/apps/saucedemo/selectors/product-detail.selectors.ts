import type { Locator, Page } from '@playwright/test';

export class ProductDetailSelectors {
  constructor(protected readonly page: Page) {}

  get backToProductsButton(): Locator {
    return this.page.getByTestId('back-to-products');
  }

  get productName(): Locator {
    return this.page.getByTestId('inventory-item-name');
  }

  get productDescription(): Locator {
    return this.page.getByTestId('inventory-item-desc');
  }

  get productPrice(): Locator {
    return this.page.getByTestId('inventory-item-price');
  }

  get addToCartButton(): Locator {
    return this.page.getByTestId('add-to-cart');
  }

  get removeButton(): Locator {
    return this.page.getByTestId('remove');
  }
}
