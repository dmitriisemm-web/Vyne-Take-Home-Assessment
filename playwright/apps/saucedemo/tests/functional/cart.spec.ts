import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check Cart page functionalities', () => {
  test.beforeEach(async ({ saucedemoApp }) => {
    await test.step('Log in as standard_user and add a product to the cart', async () => {
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(USERS.STANDARD, PASSWORD);
      await saucedemoApp.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
    });
  });

  test('Verify the cart page shows the added product', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ saucedemoApp }) => {
    await test.step('Go to the cart page', async () => {
      await saucedemoApp.inventoryPage.header.goToCart();
    });

    await test.step('Verify the product is listed with the correct quantity', async () => {
      await expect(saucedemoApp.cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toBeVisible();
      await expect(saucedemoApp.cartPage.itemQuantity(PRODUCT_NAMES.BACKPACK)).toHaveText('1');
    });
  });

  test('Verify removing a product from the cart page updates the badge', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Go to the cart page and remove the product', async () => {
      await saucedemoApp.inventoryPage.header.goToCart();
      await saucedemoApp.cartPage.removeItem(PRODUCT_NAMES.BACKPACK);
    });

    await test.step('Verify the cart is empty', async () => {
      expect(await saucedemoApp.cartPage.header.getCartCount()).toBe(0);
      await expect(saucedemoApp.cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toHaveCount(0);
    });
  });

  test('Verify continue shopping returns to the inventory page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Go to the cart page and continue shopping', async () => {
      await saucedemoApp.inventoryPage.header.goToCart();
      await saucedemoApp.cartPage.continueShopping();
    });

    await test.step('Verify the inventory page is shown', async () => {
      await expect(saucedemoApp.inventoryPage.title).toHaveText('Products');
    });
  });
});
