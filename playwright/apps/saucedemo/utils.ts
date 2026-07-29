import type { BrowserContext } from '@playwright/test';
import { BASE_URL, SESSION_COOKIE_NAME } from './constants';

export function parsePrice(text: string): number {
  // Most prices render as "$29.99", but an empty cart's subtotal renders
  // as the integer "$0" with no decimal part, so the fraction is optional.
  const match = text.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : NaN;
}

/**
 * Mirrors the app's own name -> data-test slug transformation
 * (e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack"), so product
 * locators can be built directly from product names.
 */
export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Bypasses the login form by setting the session cookie directly.
 * SauceDemo has no backend auth API - this cookie is the entire session
 * mechanism, so injecting it is the fastest valid precondition for tests
 * that don't care about the login flow itself.
 */
export async function loginViaCookie(context: BrowserContext, username: string): Promise<void> {
  await context.addCookies([
    {
      name: SESSION_COOKIE_NAME,
      value: username,
      url: BASE_URL
    }
  ]);
}
