import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';

export class CheckoutOverviewSelectors extends UiBase {
  readonly items: Locator = this.page.getByTestId('inventory-item');
  readonly paymentInfoValue: Locator = this.page.getByTestId('payment-info-value');
  readonly shippingInfoValue: Locator = this.page.getByTestId('shipping-info-value');
  readonly subtotalLabel: Locator = this.page.getByTestId('subtotal-label');
  readonly taxLabel: Locator = this.page.getByTestId('tax-label');
  readonly totalLabel: Locator = this.page.getByTestId('total-label');
  readonly cancelButton: Locator = this.page.getByTestId('cancel');
  readonly finishButton: Locator = this.page.getByTestId('finish');

  readonly cartItem = (name: string): Locator => this.items.filter({ hasText: name });
}
