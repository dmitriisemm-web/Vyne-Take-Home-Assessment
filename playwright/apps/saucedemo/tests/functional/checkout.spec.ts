import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES, VALID_CHECKOUT_INFO } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check Checkout flow functionalities', () => {
  test.beforeEach(async ({ saucedemoApp }) => {
    await test.step('Log in, add a product to the cart, and go to checkout', async () => {
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(USERS.STANDARD, PASSWORD);
      await saucedemoApp.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
      await saucedemoApp.inventoryPage.header.goToCart();
      await saucedemoApp.cartPage.checkout();
    });
  });

  test('Verify completing checkout with valid info reaches the confirmation page', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ saucedemoApp }) => {
    await test.step('Fill in valid checkout info and finish the order', async () => {
      await saucedemoApp.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await saucedemoApp.checkoutInfoPage.continueToOverview();
      await saucedemoApp.checkoutOverviewPage.finish();
    });

    await test.step('Verify the order confirmation is shown', async () => {
      await expect(saucedemoApp.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('Verify empty first name blocks checkout with a required error', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ saucedemoApp }) => {
    await test.step('Submit checkout info with an empty first name', async () => {
      await saucedemoApp.checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, firstName: '' });
      await saucedemoApp.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify a first name required error is shown', async () => {
      await expect(saucedemoApp.checkoutInfoPage.errorMessage).toContainText('First Name is required');
    });
  });

  test('Verify empty last name blocks checkout with a required error', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Submit checkout info with an empty last name', async () => {
      await saucedemoApp.checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, lastName: '' });
      await saucedemoApp.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify a last name required error is shown', async () => {
      await expect(saucedemoApp.checkoutInfoPage.errorMessage).toContainText('Last Name is required');
    });
  });

  test('Verify empty postal code blocks checkout with a required error', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Submit checkout info with an empty postal code', async () => {
      await saucedemoApp.checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, postalCode: '' });
      await saucedemoApp.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify a postal code required error is shown', async () => {
      await expect(saucedemoApp.checkoutInfoPage.errorMessage).toContainText('Postal Code is required');
    });
  });

  test('Verify overview total equals subtotal plus tax', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Fill in valid checkout info and reach the overview page', async () => {
      await saucedemoApp.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await saucedemoApp.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify the total matches subtotal plus tax', async () => {
      const subtotal = await saucedemoApp.checkoutOverviewPage.getSubtotal();
      const tax = await saucedemoApp.checkoutOverviewPage.getTax();
      const total = await saucedemoApp.checkoutOverviewPage.getTotal();

      expect(total).toBeCloseTo(subtotal + tax, 2);
    });
  });

  test('Verify cancel from checkout info returns to the cart page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Cancel from the checkout info page', async () => {
      await saucedemoApp.checkoutInfoPage.cancel();
    });

    await test.step('Verify the cart page is shown', async () => {
      await expect(saucedemoApp.cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toBeVisible();
    });
  });

  test('Verify cancel from checkout overview returns to the inventory page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Reach the overview page and cancel', async () => {
      await saucedemoApp.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await saucedemoApp.checkoutInfoPage.continueToOverview();
      await saucedemoApp.checkoutOverviewPage.cancel();
    });

    await test.step('Verify the inventory page is shown', async () => {
      await expect(saucedemoApp.inventoryPage.title).toHaveText('Products');
    });
  });
});

test.describe('Check Checkout flow functionalities with an empty cart', () => {
  test.beforeEach(async ({ saucedemoApp }) => {
    await test.step('Log in and go to the cart page without adding any product', async () => {
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(USERS.STANDARD, PASSWORD);
      await saucedemoApp.inventoryPage.header.goToCart();
    });
  });

  test('Verify checking out with an empty cart reaches a $0 confirmation', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ saucedemoApp }) => {
    await test.step('Checkout with no items in the cart', async () => {
      await saucedemoApp.cartPage.checkout();
      await saucedemoApp.checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
      await saucedemoApp.checkoutInfoPage.continueToOverview();
    });

    await test.step('Verify the overview shows a $0 total', async () => {
      expect(await saucedemoApp.checkoutOverviewPage.getSubtotal()).toBe(0);
      expect(await saucedemoApp.checkoutOverviewPage.getTotal()).toBe(0);
    });

    await test.step('Verify the order can still be completed', async () => {
      await saucedemoApp.checkoutOverviewPage.finish();
      await expect(saucedemoApp.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
