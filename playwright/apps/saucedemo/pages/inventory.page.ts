import type { Page } from '@playwright/test';
import { InventorySelectors } from '../selectors/inventory.selectors';
import { HeaderComponent } from './header.component';
import { ROUTES } from '../constants';
import { parsePrice } from '../utils';
import type { SortOption } from '../types';

export class InventoryPage extends InventorySelectors {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.INVENTORY);
  }

  async addToCart(name: string): Promise<void> {
    await this.addToCartButton(name).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  async openProduct(name: string): Promise<void> {
    await this.productLink(name).click();
  }

  async getPrice(name: string): Promise<number> {
    return parsePrice(await this.productPrice(name).innerText());
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNamesInOrder(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allTextContents();
  }

  async isInCart(name: string): Promise<boolean> {
    return this.removeButton(name).isVisible();
  }
}
