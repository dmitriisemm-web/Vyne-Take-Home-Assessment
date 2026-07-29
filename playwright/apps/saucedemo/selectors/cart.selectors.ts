import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';
import { slugify } from '../utils';

export class CartSelectors extends UiBase {
  readonly items: Locator = this.page.getByTestId('inventory-item');
  readonly continueShoppingButton: Locator = this.page.getByTestId('continue-shopping');
  readonly checkoutButton: Locator = this.page.getByTestId('checkout');

  readonly cartItem = (name: string): Locator => this.items.filter({ hasText: name });
  readonly itemQuantity = (name: string): Locator => this.cartItem(name).getByTestId('item-quantity');
  readonly itemPrice = (name: string): Locator => this.cartItem(name).getByTestId('inventory-item-price');
  readonly removeButton = (name: string): Locator => this.page.getByTestId(`remove-${slugify(name)}`);
}
