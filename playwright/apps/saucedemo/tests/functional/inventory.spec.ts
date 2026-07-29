import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, PRODUCT_NAMES, SORT_OPTIONS } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Inventory', () => {
  test.beforeEach(async ({ app }) => {
    await test.step('Log in as standard_user', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.STANDARD, PASSWORD);
    });
  });

  test('Verify adding a product updates the cart badge and button label', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Add a product to the cart', async () => {
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
    });

    await test.step('Verify the cart badge and button label update', async () => {
      expect(await app.inventoryPage.header.getCartCount()).toBe(1);
      await expect(app.inventoryPage.removeButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
    });
  });

  test('Verify removing a product updates the cart badge and button label', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Add then remove a product from the cart', async () => {
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
      await app.inventoryPage.removeFromCart(PRODUCT_NAMES.BACKPACK);
    });

    await test.step('Verify the cart badge and button label reset', async () => {
      expect(await app.inventoryPage.header.getCartCount()).toBe(0);
      await expect(app.inventoryPage.addToCartButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
    });
  });

  test(
    'Verify add-to-cart state stays in sync between inventory and product detail page',
    { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] },
    async ({ app }) => {
      await test.step('Add a product to the cart from the product detail page', async () => {
        await app.inventoryPage.openProduct(PRODUCT_NAMES.BIKE_LIGHT);
        await app.productDetailPage.addToCart();
      });

      await test.step('Verify the product detail page reflects the cart state', async () => {
        await expect(app.productDetailPage.removeButton).toBeVisible();
      });

      await test.step('Verify the inventory page reflects the same cart state', async () => {
        await app.productDetailPage.backToProducts();
        await expect(app.inventoryPage.removeButton(PRODUCT_NAMES.BIKE_LIGHT)).toBeVisible();
      });
    }
  );

  test('Verify sorting by name A to Z orders products alphabetically', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Sort by name Z to A, then back to A to Z', async () => {
      await app.inventoryPage.sortBy(SORT_OPTIONS.NAME_Z_TO_A);
      await app.inventoryPage.sortBy(SORT_OPTIONS.NAME_A_TO_Z);
    });

    await test.step('Verify products are ordered alphabetically', async () => {
      await expect
        .poll(() => app.inventoryPage.getProductNamesInOrder())
        .toEqual([
          PRODUCT_NAMES.BACKPACK,
          PRODUCT_NAMES.BIKE_LIGHT,
          PRODUCT_NAMES.BOLT_T_SHIRT,
          PRODUCT_NAMES.FLEECE_JACKET,
          PRODUCT_NAMES.ONESIE,
          PRODUCT_NAMES.RED_T_SHIRT
        ]);
    });
  });

  test('Verify sorting by name Z to A orders products in reverse', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Sort by name Z to A', async () => {
      await app.inventoryPage.sortBy(SORT_OPTIONS.NAME_Z_TO_A);
    });

    await test.step('Verify products are ordered in reverse alphabetical order', async () => {
      await expect
        .poll(() => app.inventoryPage.getProductNamesInOrder())
        .toEqual([
          PRODUCT_NAMES.RED_T_SHIRT,
          PRODUCT_NAMES.ONESIE,
          PRODUCT_NAMES.FLEECE_JACKET,
          PRODUCT_NAMES.BOLT_T_SHIRT,
          PRODUCT_NAMES.BIKE_LIGHT,
          PRODUCT_NAMES.BACKPACK
        ]);
    });
  });

  test('Verify sorting by price low to high orders products ascending', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Sort by price low to high', async () => {
      await app.inventoryPage.sortBy(SORT_OPTIONS.PRICE_LOW_TO_HIGH);
    });

    await test.step('Verify products are ordered by ascending price', async () => {
      await expect
        .poll(() => app.inventoryPage.getProductNamesInOrder())
        .toEqual([
          PRODUCT_NAMES.ONESIE,
          PRODUCT_NAMES.BIKE_LIGHT,
          PRODUCT_NAMES.BOLT_T_SHIRT,
          PRODUCT_NAMES.RED_T_SHIRT,
          PRODUCT_NAMES.BACKPACK,
          PRODUCT_NAMES.FLEECE_JACKET
        ]);
    });
  });

  test('Verify sorting by price high to low orders products descending', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Sort by price high to low', async () => {
      await app.inventoryPage.sortBy(SORT_OPTIONS.PRICE_HIGH_TO_LOW);
    });

    await test.step('Verify products are ordered by descending price', async () => {
      await expect
        .poll(() => app.inventoryPage.getProductNamesInOrder())
        .toEqual([
          PRODUCT_NAMES.FLEECE_JACKET,
          PRODUCT_NAMES.BACKPACK,
          PRODUCT_NAMES.BOLT_T_SHIRT,
          PRODUCT_NAMES.RED_T_SHIRT,
          PRODUCT_NAMES.BIKE_LIGHT,
          PRODUCT_NAMES.ONESIE
        ]);
    });
  });

  test('Verify the cart badge stays accurate across multiple products', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Add two products to the cart', async () => {
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BIKE_LIGHT);
    });

    await test.step('Verify the cart badge counts both products', async () => {
      expect(await app.inventoryPage.header.getCartCount()).toBe(2);
      await expect(app.inventoryPage.removeButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
      await expect(app.inventoryPage.removeButton(PRODUCT_NAMES.BIKE_LIGHT)).toBeVisible();
    });

    await test.step('Remove one product from the cart', async () => {
      await app.inventoryPage.removeFromCart(PRODUCT_NAMES.BACKPACK);
    });

    await test.step('Verify the cart badge reflects only the remaining product', async () => {
      expect(await app.inventoryPage.header.getCartCount()).toBe(1);
      await expect(app.inventoryPage.addToCartButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
      await expect(app.inventoryPage.removeButton(PRODUCT_NAMES.BIKE_LIGHT)).toBeVisible();
    });
  });

  test('Verify cart persists across a page reload', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app, page }) => {
    await test.step('Add a product to the cart', async () => {
      await app.inventoryPage.addToCart(PRODUCT_NAMES.BACKPACK);
      expect(await app.inventoryPage.header.getCartCount()).toBe(1);
    });

    await test.step('Reload the page', async () => {
      await page.reload();
    });

    await test.step('Verify the cart still contains the product', async () => {
      expect(await app.inventoryPage.header.getCartCount()).toBe(1);
      await expect(app.inventoryPage.removeButton(PRODUCT_NAMES.BACKPACK)).toBeVisible();
    });
  });
});
