import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';

test.describe('Cart', () => {
  test.beforeEach(async ({ app }) => {
    await app.loginPage.goto();
    await app.loginPage.login(USERS.STANDARD, PASSWORD);
    await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
  });

  test('cart page shows the added product', { tag: ['@functional', '@smoke'] }, async ({ app }) => {
    const { inventoryPage, cartPage } = app;

    await inventoryPage.header.goToCart();

    await expect(cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toBeVisible();
    await expect(cartPage.itemQuantity(PRODUCT_NAMES.BACKPACK)).toHaveText('1');
  });

  test('removing a product from the cart page updates the badge', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage, cartPage } = app;

    await inventoryPage.header.goToCart();
    await cartPage.removeItem(PRODUCT_NAMES.BACKPACK);

    expect(await cartPage.header.getCartCount()).toBe(0);
    await expect(cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toHaveCount(0);
  });

  test('continue shopping returns to the inventory page', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage, cartPage } = app;

    await inventoryPage.header.goToCart();
    await cartPage.continueShopping();

    await expect(inventoryPage.title).toHaveText('Products');
  });
});
