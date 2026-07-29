import type { Page } from '@playwright/test';
import { CartSelectors } from '../selectors/cart.selectors';
import { HeaderComponent } from './header.component';
import { ROUTES } from '../constants';
import { parsePrice } from '../utils';

export class CartPage extends CartSelectors {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.CART);
  }

  async removeItem(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  async getItemPrice(name: string): Promise<number> {
    return parsePrice(await this.itemPrice(name).innerText());
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
