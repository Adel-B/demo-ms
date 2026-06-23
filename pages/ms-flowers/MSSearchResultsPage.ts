import { Page, Locator, expect } from '@playwright/test';

export class MSSearchResultsPage {
  readonly page: Page;
  // M&S search results use h1 with the search term
  readonly resultsHeading: Locator;
  // Product cards on search results
  readonly productCards: Locator;
  readonly productHeadings: Locator;

  constructor(page: Page) {
    this.page = page;
    // M&S search results h1
    this.resultsHeading = page.locator('main h1');
    // get_attributes confirmed: a[class="product-card_cardWrapper__GVSTY"]
    this.productCards = page.locator('a.product-card_cardWrapper__GVSTY');
    // DOM snapshot: product h2 headings
    this.productHeadings = page.locator('main h2');
  }

  async waitForResults() {
    await this.page.waitForLoadState('load');
    await expect(this.resultsHeading).toBeVisible({ timeout: 30000 });
  }

  async verifyResultsVisible() {
    await expect(this.productHeadings.first()).toBeVisible({ timeout: 30000 });
  }
}