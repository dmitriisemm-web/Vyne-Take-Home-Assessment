import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';

export class ProductDetailSelectors extends UiBase {
  readonly backToProductsButton: Locator = this.page.getByTestId('back-to-products');
  readonly productName: Locator = this.page.getByTestId('inventory-item-name');
  readonly productDescription: Locator = this.page.getByTestId('inventory-item-desc');
  readonly productPrice: Locator = this.page.getByTestId('inventory-item-price');
  readonly addToCartButton: Locator = this.page.getByTestId('add-to-cart');
  readonly removeButton: Locator = this.page.getByTestId('remove');
}
