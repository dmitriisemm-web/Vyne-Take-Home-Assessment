import type { Locator, Page } from '@playwright/test';

export class HeaderSelectors {
  constructor(protected readonly page: Page) {}

  get menuButton(): Locator {
    return this.page.getByTestId('open-menu');
  }

  get closeMenuButton(): Locator {
    return this.page.getByTestId('close-menu');
  }

  get allItemsLink(): Locator {
    return this.page.getByTestId('inventory-sidebar-link');
  }

  get aboutLink(): Locator {
    return this.page.getByTestId('about-sidebar-link');
  }

  get logoutLink(): Locator {
    return this.page.getByTestId('logout-sidebar-link');
  }

  get resetAppStateLink(): Locator {
    return this.page.getByTestId('reset-sidebar-link');
  }

  get cartLink(): Locator {
    return this.page.getByTestId('shopping-cart-link');
  }

  get cartBadge(): Locator {
    return this.page.getByTestId('shopping-cart-badge');
  }
}
