import { Page, Locator, expect } from '@playwright/test';

export class FlowerProductDetailPage {
  readonly page: Page;
  // evaluate confirmed: document.querySelector('main h1').textContent === "Small Vibrant Pink Mixed Rose Bouquet"
  readonly productHeading: Locator;
  // DOM snapshot: button with id="add-to-bag-button"
  readonly addToBagBtn: Locator;
  // DOM snapshot: disclosuretriangle "Delivery, collection & returns"
  readonly deliverySection: Locator;
  // DOM snapshot: Journey Modal dialog
  readonly journeyModal: Locator;
  // DOM snapshot: button "Skip" in journey modal
  readonly skipBtn: Locator;
  // DOM snapshot: button "Checkout" in upsell modal
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // DOM snapshot: h1:heading "Small Vibrant Pink Mixed Rose Bouquet"
    this.productHeading = page.locator('main h1');
    // get_attributes confirmed: button id="add-to-bag-button"
    this.addToBagBtn = page.locator('#add-to-bag-button');
    // DOM snapshot: disclosuretriangle "Delivery, collection & returns" — statictext "Delivery, collection & returns"
    this.deliverySection = page.locator('summary').filter({ hasText: 'Delivery, collection & returns' });
    // DOM snapshot: div:dialog "Journey Modal"
    this.journeyModal = page.getByRole('dialog', { name: 'Journey Modal' });
    // DOM snapshot: button "Skip" in Journey Modal (text content confirmed)
    this.skipBtn = page.getByRole('button', { name: 'Skip' });
    // DOM snapshot: button "Checkout" in upsell modal (text content confirmed)
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
  }

  async verifyLoaded() {
    await expect(this.productHeading).toBeVisible({ timeout: 30000 });
  }

  async addToBag() {
    await expect(this.addToBagBtn).toBeVisible({ timeout: 30000 });
    await this.addToBagBtn.click();
    // Handle greeting card modal if it appears
    try {
      await expect(this.journeyModal).toBeVisible({ timeout: 5000 });
      // Skip greeting card step
      const skipVisible = await this.skipBtn.isVisible({ timeout: 3000 });
      if (skipVisible) {
        await this.skipBtn.click();
      }
      // Handle upsell modal — click Checkout to proceed to basket
      await expect(this.checkoutBtn).toBeVisible({ timeout: 5000 });
      await this.checkoutBtn.click();
    } catch {
      // No modal appeared — item added directly
    }
    await this.page.waitForLoadState('load');
  }
}