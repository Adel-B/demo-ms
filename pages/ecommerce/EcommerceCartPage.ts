import { Page, Locator, expect } from '@playwright/test';

export class EcommerceCartPage {
  readonly page: Page;
  readonly cartHeading: Locator;
  readonly checkoutBtn: Locator;
  readonly continueShoppingBtn: Locator;
  readonly orderSummaryHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    // evaluate confirmed: document.querySelector('main h1').textContent === "Shopping Cart"
    this.cartHeading = page.locator('main h1').filter({ hasText: 'Shopping Cart' });
    // evaluate confirmed: main button text "Proceed to Checkout"
    this.checkoutBtn = page.getByRole('button', { name: 'Proceed to Checkout' });
    // evaluate confirmed: main button text "Continue Shopping"
    this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' });
    // evaluate confirmed: main h3 text "Order Summary"
    this.orderSummaryHeading = page.locator('main h3').filter({ hasText: 'Order Summary' });
  }

  async verifyLoaded() {
    await expect(this.cartHeading).toBeVisible({ timeout: 30000 });
  }

  async verifyItemInCart(productName: string) {
    await expect(this.page.getByRole('heading', { name: productName })).toBeVisible({ timeout: 30000 });
  }

  async verifyOrderSummaryVisible() {
    await expect(this.orderSummaryHeading).toBeVisible({ timeout: 30000 });
  }

  async proceedToCheckout() {
    await expect(this.checkoutBtn).toBeVisible({ timeout: 30000 });
    await this.checkoutBtn.click();
    await this.page.waitForLoadState('load');
  }
}