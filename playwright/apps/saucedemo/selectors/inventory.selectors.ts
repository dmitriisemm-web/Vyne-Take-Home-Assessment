import type { Locator } from '@playwright/test';
import { Base } from '../../../common/base';
import { slugify } from '../utils';

export class InventorySelectors extends Base {
  readonly title: Locator = this.page.getByTestId('title');
  readonly sortDropdown: Locator = this.page.getByTestId('product-sort-container');
  readonly items: Locator = this.page.getByTestId('inventory-item');

  readonly productCard = (name: string): Locator => this.items.filter({ hasText: name });
  readonly productPrice = (name: string): Locator => this.productCard(name).getByTestId('inventory-item-price');
  readonly productLink = (name: string): Locator => this.productCard(name).getByTestId('inventory-item-name');
  readonly addToCartButton = (name: string): Locator => this.page.getByTestId(`add-to-cart-${slugify(name)}`);
  readonly removeButton = (name: string): Locator => this.page.getByTestId(`remove-${slugify(name)}`);
}
