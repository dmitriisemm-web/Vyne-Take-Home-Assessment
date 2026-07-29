import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES } from '../../constants';

test.describe('Inventory', () => {
  test.beforeEach(async ({ app }) => {
    await app.loginPage.goto();
    await app.loginPage.login(USERS.STANDARD, PASSWORD);
  });

  test('adding a product updates the cart badge and button label', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage } = app;

    await inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);

    expect(await inventoryPage.header.getCartCount()).toBe(1);
    await expect(inventoryPage.removeButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
  });

  test('removing a product updates the cart badge and button label', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage } = app;

    await inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
    await inventoryPage.removeFromCart(PRODUCT_NAMES.BACKPACK);

    expect(await inventoryPage.header.getCartCount()).toBe(0);
    await expect(inventoryPage.addToCartButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
  });

  test('add-to-cart state stays in sync between inventory and product detail page', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage, productDetailPage } = app;

    await inventoryPage.openProduct(PRODUCT_NAMES.BIKE_LIGHT);
    await productDetailPage.addToCart();
    await expect(productDetailPage.removeButton).toBeVisible();

    await productDetailPage.backToProducts();
    await expect(inventoryPage.removeButton(PRODUCT_NAMES.BIKE_LIGHT)).toBeVisible();
  });

  test('sorting by name Z to A orders products in reverse', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage } = app;

    await inventoryPage.sortBy('za');

    await expect
      .poll(() => inventoryPage.getProductNamesInOrder())
      .toEqual([
        PRODUCT_NAMES.RED_T_SHIRT,
        PRODUCT_NAMES.ONESIE,
        PRODUCT_NAMES.FLEECE_JACKET,
        PRODUCT_NAMES.BOLT_T_SHIRT,
        PRODUCT_NAMES.BIKE_LIGHT,
        PRODUCT_NAMES.BACKPACK
      ]);
  });

  test('sorting by price low to high orders products ascending', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage } = app;

    await inventoryPage.sortBy('lohi');

    await expect
      .poll(() => inventoryPage.getProductNamesInOrder())
      .toEqual([
        PRODUCT_NAMES.ONESIE,
        PRODUCT_NAMES.BIKE_LIGHT,
        PRODUCT_NAMES.BOLT_T_SHIRT,
        PRODUCT_NAMES.RED_T_SHIRT,
        PRODUCT_NAMES.BACKPACK,
        PRODUCT_NAMES.FLEECE_JACKET
      ]);
  });

  test('sorting by price high to low orders products descending', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { inventoryPage } = app;

    await inventoryPage.sortBy('hilo');

    await expect
      .poll(() => inventoryPage.getProductNamesInOrder())
      .toEqual([
        PRODUCT_NAMES.FLEECE_JACKET,
        PRODUCT_NAMES.BACKPACK,
        PRODUCT_NAMES.BOLT_T_SHIRT,
        PRODUCT_NAMES.RED_T_SHIRT,
        PRODUCT_NAMES.BIKE_LIGHT,
        PRODUCT_NAMES.ONESIE
      ]);
  });

  test('cart persists across a page reload', { tag: ['@functional', '@regression'] }, async ({ app, page }) => {
    const { inventoryPage } = app;

    await inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
    expect(await inventoryPage.header.getCartCount()).toBe(1);

    await page.reload();

    expect(await inventoryPage.header.getCartCount()).toBe(1);
    await expect(inventoryPage.removeButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
  });
});
