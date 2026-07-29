import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';

export class HeaderComponent extends UiBase {
  readonly menuButton: Locator = this.page.getByRole('button', { name: 'Open Menu' });
  readonly closeMenuButton: Locator = this.page.getByRole('button', { name: 'Close Menu' });
  readonly allItemsLink: Locator = this.page.getByTestId('inventory-sidebar-link');
  readonly aboutLink: Locator = this.page.getByTestId('about-sidebar-link');
  readonly logoutLink: Locator = this.page.getByTestId('logout-sidebar-link');
  readonly resetAppStateLink: Locator = this.page.getByTestId('reset-sidebar-link');
  readonly cartLink: Locator = this.page.getByTestId('shopping-cart-link');
  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateLink.click();
    await this.closeMenu();
  }

  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    return Number(await this.cartBadge.textContent());
  }
}
