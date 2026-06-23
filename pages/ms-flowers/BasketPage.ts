import { Page, Locator, expect } from '@playwright/test';

export class BasketPage {
  readonly page: Page;
  // evaluate confirmed: document.querySelector('h1').textContent === "Basket"
  readonly heading: Locator;
  // evaluate confirmed: h2 "Your secure bag"
  readonly secureBagHeading: Locator;
  // evaluate confirmed: h2 "Summary"
  readonly summaryHeading: Locator;
  // evaluate confirmed: button text "Checkout securely"
  readonly checkoutBtn: Locator;
  // DOM snapshot: button:tab "Basket (1)"
  readonly basketTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1').filter({ hasText: 'Basket' });
    this.secureBagHeading = page.locator('h2').filter({ hasText: 'Your secure bag' });
    this.summaryHeading = page.locator('h2').filter({ hasText: 'Summary' });
    this.checkoutBtn = page.getByRole('button', { name: /Checkout securely/i });
    this.basketTab = page.getByRole('tab', { name: /Basket/i });
  }

  async verifyLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 30000 });
  }

  async verifyItemInBasket(productName: string) {
    await expect(this.page.getByRole('link', { name: new RegExp(productName, 'i') })).toBeVisible({ timeout: 30000 });
  }

  async verifyBasketCount(count: number) {
    await expect(this.page.getByRole('tab', { name: new RegExp(`Basket \\(${count}\\)`) })).toBeVisible({ timeout: 30000 });
  }

  async removeItem(productName: string) {
    const removeBtn = this.page.getByRole('button', { name: new RegExp(`Remove item ${productName}`, 'i') });
    if (await removeBtn.isVisible({ timeout: 5000 })) {
      await removeBtn.click();
      await this.page.waitForLoadState('load');
    }
  }
}