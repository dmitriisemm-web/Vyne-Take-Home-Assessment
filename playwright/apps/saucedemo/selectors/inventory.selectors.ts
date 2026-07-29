import type { Locator, Page } from '@playwright/test';
import { slugify } from '../utils';

export class InventorySelectors {
  constructor(protected readonly page: Page) {}

  get title(): Locator {
    return this.page.getByTestId('title');
  }

  get sortDropdown(): Locator {
    return this.page.getByTestId('product-sort-container');
  }

  get items(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  productCard(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  productPrice(name: string): Locator {
    return this.productCard(name).getByTestId('inventory-item-price');
  }

  productLink(name: string): Locator {
    return this.productCard(name).getByTestId('inventory-item-name');
  }

  addToCartButton(name: string): Locator {
    return this.page.getByTestId(`add-to-cart-${slugify(name)}`);
  }

  removeButton(name: string): Locator {
    return this.page.getByTestId(`remove-${slugify(name)}`);
  }
}
