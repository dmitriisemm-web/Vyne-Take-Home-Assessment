import type { Locator, Page } from '@playwright/test';
import { slugify } from '../utils';

export class CartSelectors {
  constructor(protected readonly page: Page) {}

  get items(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  get continueShoppingButton(): Locator {
    return this.page.getByTestId('continue-shopping');
  }

  get checkoutButton(): Locator {
    return this.page.getByTestId('checkout');
  }

  cartItem(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  itemQuantity(name: string): Locator {
    return this.cartItem(name).getByTestId('item-quantity');
  }

  itemPrice(name: string): Locator {
    return this.cartItem(name).getByTestId('inventory-item-price');
  }

  removeButton(name: string): Locator {
    return this.page.getByTestId(`remove-${slugify(name)}`);
  }
}
