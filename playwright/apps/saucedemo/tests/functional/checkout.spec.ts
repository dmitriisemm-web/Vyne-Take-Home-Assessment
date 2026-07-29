import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES, VALID_CHECKOUT_INFO } from '../../constants';

test.describe('Checkout', () => {
  test.beforeEach(async ({ app }) => {
    await app.loginPage.goto();
    await app.loginPage.login(USERS.STANDARD, PASSWORD);
    await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
    await app.inventoryPage.header.goToCart();
    await app.cartPage.checkout();
  });

  test('completing checkout with valid info reaches the confirmation page', { tag: ['@functional', '@smoke'] }, async ({ app }) => {
    const { checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage } = app;

    await checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
    await checkoutInfoPage.continueToOverview();
    await checkoutOverviewPage.finish();

    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('empty first name blocks checkout with a required error', { tag: ['@functional', '@smoke'] }, async ({ app }) => {
    const { checkoutInfoPage } = app;

    await checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, firstName: '' });
    await checkoutInfoPage.continueToOverview();

    await expect(checkoutInfoPage.errorMessage).toContainText('First Name is required');
  });

  test('empty last name blocks checkout with a required error', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { checkoutInfoPage } = app;

    await checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, lastName: '' });
    await checkoutInfoPage.continueToOverview();

    await expect(checkoutInfoPage.errorMessage).toContainText('Last Name is required');
  });

  test('empty postal code blocks checkout with a required error', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { checkoutInfoPage } = app;

    await checkoutInfoPage.fill({ ...VALID_CHECKOUT_INFO, postalCode: '' });
    await checkoutInfoPage.continueToOverview();

    await expect(checkoutInfoPage.errorMessage).toContainText('Postal Code is required');
  });

  test('overview total equals subtotal plus tax', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { checkoutInfoPage, checkoutOverviewPage } = app;

    await checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
    await checkoutInfoPage.continueToOverview();

    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('cancel from checkout info returns to the cart page', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { checkoutInfoPage, cartPage } = app;

    await checkoutInfoPage.cancel();

    await expect(cartPage.cartItem(PRODUCT_NAMES.BACKPACK)).toBeVisible();
  });

  test('cancel from checkout overview returns to the inventory page', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { checkoutInfoPage, checkoutOverviewPage, inventoryPage } = app;

    await checkoutInfoPage.fill(VALID_CHECKOUT_INFO);
    await checkoutInfoPage.continueToOverview();
    await checkoutOverviewPage.cancel();

    await expect(inventoryPage.title).toHaveText('Products');
  });
});
