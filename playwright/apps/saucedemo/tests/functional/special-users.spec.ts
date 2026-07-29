import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check special user account behaviors', () => {
  test(
    'Check problem_user cannot add a product to the cart from the product detail page',
    { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] },
    async ({ app }) => {
      await test.step('Log in as problem_user and attempt to add a product to the cart', async () => {
        await app.loginPage.goto();
        await app.loginPage.login(USERS.PROBLEM, PASSWORD);
        await app.inventoryPage.openProduct(PRODUCT_NAMES.BACKPACK);
        await app.productDetailPage.addToCart();
      });

      await test.step('Verify the product was not added to the cart', async () => {
        expect(await app.inventoryPage.header.getCartCount()).toBe(0);
        await expect(app.productDetailPage.addToCartButton).toBeVisible();
      });
    }
  );

  test('Check performance_glitch_user eventually logs in', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Log in as performance_glitch_user', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.PERFORMANCE_GLITCH, PASSWORD);
    });

    await test.step('Verify the inventory page eventually loads', async () => {
      await expect(app.inventoryPage.title).toHaveText('Products', { timeout: 15000 });
    });
  });
});
