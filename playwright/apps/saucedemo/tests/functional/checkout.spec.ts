import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES, VALID_CHECKOUT_INFO } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Checkout', () => {
  test.beforeEach(async ({ app }) => {
    await test.step('Log in, add a product to the cart, and go to checkout', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.STANDARD, PASSWORD);
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
      await app.inventoryPage.header.goToCart();
      await app.cartPage.checkout();
    });
  });

  test('Verify completing checkout with valid info reaches the confirmation page', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    await test.step('Fill in valid checkout info and finish the order', async () => {
      await app.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await app.checkoutInfoPage.continueToOverview();
      await app.checkoutOverviewPage.finish();
    });

    await test.step('Verify the order confirmation is shown', async () => {
      await expect(app.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('Verify empty first name blocks checkout with a required error', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    await test.step('Submit checkout info with an empty first name', async () => {
      await app.checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, firstName: '' });
      await app.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify a first name required error is shown', async () => {
      await expect(app.checkoutInfoPage.errorMessage).toContainText('First Name is required');
    });
  });

  test('Verify empty last name blocks checkout with a required error', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Submit checkout info with an empty last name', async () => {
      await app.checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, lastName: '' });
      await app.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify a last name required error is shown', async () => {
      await expect(app.checkoutInfoPage.errorMessage).toContainText('Last Name is required');
    });
  });

  test('Verify empty postal code blocks checkout with a required error', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Submit checkout info with an empty postal code', async () => {
      await app.checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, postalCode: '' });
      await app.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify a postal code required error is shown', async () => {
      await expect(app.checkoutInfoPage.errorMessage).toContainText('Postal Code is required');
    });
  });

  test('Verify overview total equals subtotal plus tax', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Fill in valid checkout info and reach the overview page', async () => {
      await app.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await app.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify the total matches subtotal plus tax', async () => {
      const subtotal = await app.checkoutOverviewPage.getSubtotal();
      const tax = await app.checkoutOverviewPage.getTax();
      const total = await app.checkoutOverviewPage.getTotal();

      expect(total).toBeCloseTo(subtotal + tax, 2);
    });
  });

  test('Verify cancel from checkout info returns to the cart page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Cancel from the checkout info page', async () => {
      await app.checkoutInfoPage.cancel();
    });

    await test.step('Verify the cart page is shown', async () => {
      await expect(app.cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toBeVisible();
    });
  });

  test('Verify cancel from checkout overview returns to the inventory page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Reach the overview page and cancel', async () => {
      await app.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await app.checkoutInfoPage.continueToOverview();
      await app.checkoutOverviewPage.cancel();
    });

    await test.step('Verify the inventory page is shown', async () => {
      await expect(app.inventoryPage.title).toHaveText('Products');
    });
  });
});

test.describe('Checkout with an empty cart', () => {
  test.beforeEach(async ({ app }) => {
    await test.step('Log in and go to the cart page without adding any product', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.STANDARD, PASSWORD);
      await app.inventoryPage.header.goToCart();
    });
  });

  test('Verify checking out with an empty cart reaches a $0 confirmation', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Checkout with no items in the cart', async () => {
      await app.cartPage.checkout();
      await app.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await app.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify the overview shows a $0 total', async () => {
      expect(await app.checkoutOverviewPage.getSubtotal()).toBe(0);
      expect(await app.checkoutOverviewPage.getTotal()).toBe(0);
    });

    await test.step('Verify the order can still be completed', async () => {
      await app.checkoutOverviewPage.finish();
      await expect(app.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
