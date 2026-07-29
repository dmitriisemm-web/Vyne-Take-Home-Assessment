import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check Cart page functionalities', () => {
  test.beforeEach(async ({ app }) => {
    await test.step('Log in as standard_user and add a product to the cart', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.STANDARD, PASSWORD);
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
    });
  });

  test('Verify the cart page shows the added product', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    await test.step('Go to the cart page', async () => {
      await app.inventoryPage.header.goToCart();
    });

    await test.step('Verify the product is listed with the correct quantity', async () => {
      await expect(app.cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toBeVisible();
      await expect(app.cartPage.itemQuantity(PRODUCT_NAMES.BACKPACK)).toHaveText('1');
    });
  });

  test('Verify removing a product from the cart page updates the badge', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Go to the cart page and remove the product', async () => {
      await app.inventoryPage.header.goToCart();
      await app.cartPage.removeItem(PRODUCT_NAMES.BACKPACK);
    });

    await test.step('Verify the cart is empty', async () => {
      expect(await app.cartPage.header.getCartCount()).toBe(0);
      await expect(app.cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toHaveCount(0);
    });
  });

  test('Verify continue shopping returns to the inventory page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Go to the cart page and continue shopping', async () => {
      await app.inventoryPage.header.goToCart();
      await app.cartPage.continueShopping();
    });

    await test.step('Verify the inventory page is shown', async () => {
      await expect(app.inventoryPage.title).toHaveText('Products');
    });
  });
});
