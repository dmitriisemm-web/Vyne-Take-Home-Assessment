import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';

test.describe('Special users', () => {
  test('problem_user: Add to cart on the product detail page does not add the item', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { loginPage, inventoryPage, productDetailPage } = app;

    await loginPage.goto();
    await loginPage.login(USERS.PROBLEM, PASSWORD);
    await inventoryPage.openProduct(PRODUCT_NAMES.BACKPACK);
    await productDetailPage.addToCart();

    expect(await inventoryPage.header.getCartCount()).toBe(0);
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });

  test('performance_glitch_user: login eventually succeeds', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { loginPage, inventoryPage } = app;

    await loginPage.goto();
    await loginPage.login(USERS.PERFORMANCE_GLITCH, PASSWORD);

    await expect(inventoryPage.title).toHaveText('Products', { timeout: 15000 });
  });
});
