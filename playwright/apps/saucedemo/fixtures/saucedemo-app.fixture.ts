import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInfoPage } from '../pages/checkout-info.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';

/**
 * Single entry point into every SauceDemo page object. Tests pull in the
 * `saucedemoApp` fixture and reach any page from it, instead of importing
 * and constructing each page object individually.
 */
export class SaucedemoApp {
  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
  readonly productDetailPage: ProductDetailPage;
  readonly cartPage: CartPage;
  readonly checkoutInfoPage: CheckoutInfoPage;
  readonly checkoutOverviewPage: CheckoutOverviewPage;
  readonly checkoutCompletePage: CheckoutCompletePage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.productDetailPage = new ProductDetailPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutInfoPage = new CheckoutInfoPage(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
  }
}

type SaucedemoFixtures = {
  saucedemoApp: SaucedemoApp;
};

export const test = base.extend<SaucedemoFixtures>({
  saucedemoApp: async ({ page }, use) => {
    await use(new SaucedemoApp(page));
  }
});

export { expect } from '@playwright/test';
