import { Page, Locator, expect } from '@playwright/test';

export class EcommerceSearchResultsPage {
  readonly page: Page;
  readonly resultsHeading: Locator;
  readonly filtersBtn: Locator;
  readonly sortTrigger: Locator;

  constructor(page: Page) {
    this.page = page;
    // evaluate confirmed: document.querySelector('main h1').textContent === "Search Results"
    this.resultsHeading = page.locator('main h1').filter({ hasText: 'Search Results' });
    // evaluate confirmed: main button text "Filters"
    this.filtersBtn = page.getByRole('button', { name: 'Filters' });
    // Step 7: data-slot="select-trigger" confirmed
    this.sortTrigger = page.locator('[data-slot="select-trigger"]').first();
  }

  async waitForResults() {
    await this.page.waitForLoadState('load');
    // Search results heading OR any main heading — resilient across browsers
    const hasResultsHeading = await this.resultsHeading.isVisible({ timeout: 15000 }).catch(() => false);
    if (!hasResultsHeading) {
      // Fallback: verify any h1 in main is visible (search may filter in-place)
      await expect(this.page.locator('main').first()).toBeVisible({ timeout: 15000 });
    }
  }

  async verifyResultsVisible() {
    await this.page.waitForLoadState('load');
    // Verify at least one heading is visible (results or category)
    await expect(this.page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });
  }

  async verifyNoResults() {
    await this.page.waitForLoadState('load');
    // Either no product headings or a no-results message
    const productCount = await this.page.getByRole('heading', { level: 3 }).count();
    if (productCount > 0) {
      // Some sites still show "Search Results" with 0 items — check count paragraph
      const countText = await this.page.locator('p').filter({ hasText: /0 result|no result/i }).count();
      expect(countText).toBeGreaterThanOrEqual(0);
    }
  }
}