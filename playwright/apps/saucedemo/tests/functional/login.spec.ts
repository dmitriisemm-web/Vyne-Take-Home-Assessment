import { test, expect } from '../../app.fixture';
import { USERS, PASSWORD } from '../../constants';

test.describe('Login', () => {
  test('standard_user can log in and lands on the inventory page', { tag: ['@functional', '@smoke'] }, async ({ app }) => {
    const { loginPage, inventoryPage } = app;

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD, PASSWORD);

    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('invalid credentials show an inline error', { tag: ['@functional', '@smoke'] }, async ({ app }) => {
    const { loginPage } = app;

    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');

    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('locked_out_user is blocked with a lockout error', { tag: ['@functional', '@smoke'] }, async ({ app }) => {
    const { loginPage } = app;

    await loginPage.goto();
    await loginPage.login(USERS.LOCKED_OUT, PASSWORD);

    await expect(loginPage.errorMessage).toContainText('this user has been locked out');
  });

  test('logout returns to the login page', { tag: ['@functional', '@regression'] }, async ({ app }) => {
    const { loginPage, inventoryPage } = app;

    await loginPage.goto();
    await loginPage.login(USERS.STANDARD, PASSWORD);
    await inventoryPage.header.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });
});
