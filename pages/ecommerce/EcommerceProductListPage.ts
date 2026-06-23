import { Page, Locator, expect } from '@playwright/test';

export class EcommerceProductListPage {
  readonly page: Page;
  readonly filtersBtn: Locator;
  readonly sortTrigger: Locator;
  readonly productImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filtersBtn = page.getByRole('button', { name: 'Filters' });
    this.sortTrigger = page.locator('[data-slot="select-trigger"]').first();
    this.productImages = page.getByRole('img').filter({ hasNot: page.locator('header') });
  }

  async waitForProducts() {
    await this.page.waitForLoadState('load');
    await expect(this.filtersBtn).toBeVisible({ timeout: 30000 });
  }

  async clickFirstProduct() {
    // Click the first product image area
    const firstProductImg = this.page.getByRole('img').nth(1);
    await firstProductImg.click();
    await this.page.waitForLoadState('load');
  }

  async verifyPageHeading(name: string) {
    await expect(this.page.getByRole('heading', { name })).toBeVisible({ timeout: 30000 });
  }

  async verifyFiltersVisible() {
    await expect(this.filtersBtn).toBeVisible({ timeout: 30000 });
  }

  async verifySortVisible() {
    await expect(this.sortTrigger).toBeVisible({ timeout: 30000 });
  }
}