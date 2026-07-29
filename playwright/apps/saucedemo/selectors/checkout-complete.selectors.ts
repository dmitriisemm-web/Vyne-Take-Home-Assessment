import type { Locator } from '@playwright/test';
import { UiBase } from '../../../common/ui-base';

export class CheckoutCompleteSelectors extends UiBase {
  readonly completeHeader: Locator = this.page.getByTestId('complete-header');
  readonly completeText: Locator = this.page.getByTestId('complete-text');
  readonly backToProductsButton: Locator = this.page.getByTestId('back-to-products');
  readonly generatePdfOrderButton: Locator = this.page.getByTestId('generate-pdf-order');
}
