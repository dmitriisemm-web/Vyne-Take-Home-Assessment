import type { Locator, Page } from '@playwright/test';

export class CheckoutOverviewSelectors {
  constructor(protected readonly page: Page) {}

  get items(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  get paymentInfoValue(): Locator {
    return this.page.getByTestId('payment-info-value');
  }

  get shippingInfoValue(): Locator {
    return this.page.getByTestId('shipping-info-value');
  }

  get subtotalLabel(): Locator {
    return this.page.getByTestId('subtotal-label');
  }

  get taxLabel(): Locator {
    return this.page.getByTestId('tax-label');
  }

  get totalLabel(): Locator {
    return this.page.getByTestId('total-label');
  }

  get cancelButton(): Locator {
    return this.page.getByTestId('cancel');
  }

  get finishButton(): Locator {
    return this.page.getByTestId('finish');
  }

  cartItem(name: string): Locator {
    return this.items.filter({ hasText: name });
  }
}
