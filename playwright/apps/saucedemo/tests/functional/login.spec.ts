import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD, INVALID_CREDENTIALS } from '../../constants';
import { TAGS } from '../../../../common/constants';

test.describe('Check Login page functionalities', () => {
  test('Verify standard_user can log in and lands on the inventory page', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    await test.step('Log in as standard_user', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.STANDARD, PASSWORD);
    });

    await test.step('Verify the inventory page is shown with all products', async () => {
      await expect(app.inventoryPage.title).toHaveText('Products');
      await expect(app.inventoryPage.items).toHaveCount(6);
    });
  });

  test('Verify invalid credentials show an inline error', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    await test.step('Attempt to log in with invalid credentials', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password);
    });

    await test.step('Verify an invalid credentials error is shown', async () => {
      await expect(app.loginPage.errorMessage).toContainText('Username and password do not match');
    });
  });

  test('Verify locked_out_user is blocked with a lockout error', { tag: [TAGS.FUNCTIONAL, TAGS.SMOKE] }, async ({ app }) => {
    await test.step('Attempt to log in as locked_out_user', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.LOCKED_OUT, PASSWORD);
    });

    await test.step('Verify a lockout error is shown', async () => {
      await expect(app.loginPage.errorMessage).toContainText('this user has been locked out');
    });
  });

  test('Verify logout returns to the login page', { tag: [TAGS.FUNCTIONAL, TAGS.REGRESSION] }, async ({ app }) => {
    await test.step('Log in as standard_user', async () => {
      await app.loginPage.goto();
      await app.loginPage.login(USERS.STANDARD, PASSWORD);
    });

    await test.step('Log out', async () => {
      await app.inventoryPage.header.logout();
    });

    await test.step('Verify the login page is shown', async () => {
      await expect(app.loginPage.loginButton).toBeVisible();
    });
  });
});
