import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check special user account behaviors', () => {
  test(
    'Check problem_user cannot add a product to the cart from the product detail page',
    { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] },
    async ({ saucedemoApp }) => {
      await test.step('Log in as problem_user and attempt to add a product to the cart', async () => {
        await saucedemoApp.loginPage.goto();
        await saucedemoApp.loginPage.login(USERS.PROBLEM, PASSWORD);
        await saucedemoApp.inventoryPage.openProduct(PRODUCT_NAMES.BACKPACK);
        await saucedemoApp.productDetailPage.addToCart();
      });

      await test.step('Verify the product was not added to the cart', async () => {
        expect(await saucedemoApp.inventoryPage.header.getCartCount()).toBe(0);
        await expect(saucedemoApp.productDetailPage.addToCartButton).toBeVisible();
      });
    }
  );

  test('Check performance_glitch_user eventually logs in', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Log in as performance_glitch_user', async () => {
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(USERS.PERFORMANCE_GLITCH, PASSWORD);
    });

    await test.step('Verify the inventory page eventually loads', async () => {
      await expect(saucedemoApp.inventoryPage.title).toHaveText('Products', { timeout: 15000 });
    });
  });
});
