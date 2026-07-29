export const BASE_URL = 'https://www.saucedemo.com';

export const PASSWORD = 'secret_sauce';

export const USERS = {
  STANDARD: 'standard_user',
  LOCKED_OUT: 'locked_out_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user'
} as const;

export const ROUTES = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html'
} as const;

export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo'
} as const;

export const SESSION_COOKIE_NAME = 'session-username';

export const INVALID_CREDENTIALS = {
  username: 'invalid_user',
  password: 'wrong_password'
};

export const VALID_CHECKOUT_INFO = {
  firstName: 'Dmitrii',
  lastName: 'Semm',
  postalCode: '12345'
};

export const PRODUCT_NAMES = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_T_SHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  RED_T_SHIRT: 'Test.allTheThings() T-Shirt (Red)'
} as const;
