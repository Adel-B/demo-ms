import { Page, Locator, expect } from '@playwright/test';

export class EcommerceProductDetailPage {
  readonly page: Page;
  readonly productHeading: Locator;
  readonly addToCartBtn: Locator;
  readonly viewCartBtn: Locator;
  readonly backBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // evaluate confirmed: document.querySelector('main h1').textContent === "Polo Shirt"
    this.productHeading = page.locator('main h1');
    // evaluate confirmed: main button text "Add to Cart - $59.99" (matches /Add to Cart/i)
    this.addToCartBtn = page.getByRole('button', { name: /Add to Cart/i });
    // evaluate confirmed: main button text "View Cart"
    this.viewCartBtn = page.getByRole('button', { name: 'View Cart' });
    // evaluate confirmed: main button text "Back to Products"
    this.backBtn = page.getByRole('button', { name: 'Back to Products' });
  }

  async verifyLoaded() {
    await expect(this.productHeading).toBeVisible({ timeout: 30000 });
  }

  async selectSize(size: string) {
    const sizeBtn = this.page.getByRole('button', { name: size, exact: true });
    if (await sizeBtn.isVisible({ timeout: 5000 })) {
      await sizeBtn.click();
    }
  }

  async addToCart() {
    await expect(this.addToCartBtn).toBeVisible({ timeout: 30000 });
    await this.addToCartBtn.click();
    // Wait for "Adding..." state to resolve — button text returns to "Add to Cart"
    await expect(this.addToCartBtn).not.toHaveText('Adding...', { timeout: 10000 });
  }

  async goToCart() {
    await expect(this.viewCartBtn).toBeVisible({ timeout: 30000 });
    await this.viewCartBtn.click();
    await this.page.waitForLoadState('load');
  }
}