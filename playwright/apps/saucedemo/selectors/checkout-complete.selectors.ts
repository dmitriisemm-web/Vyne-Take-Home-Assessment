import type { Locator } from '@playwright/test';
import { Base } from '../../../common/base';

export class CheckoutCompleteSelectors extends Base {
  readonly completeHeader: Locator = this.page.getByTestId('complete-header');
  readonly completeText: Locator = this.page.getByTestId('complete-text');
  readonly backToProductsButton: Locator = this.page.getByTestId('back-to-products');
  readonly generatePdfOrderButton: Locator = this.page.getByTestId('generate-pdf-order');
}
