import { Page, Locator, expect } from '@playwright/test';

export class FlowersLandingPage {
  readonly page: Page;
  // evaluate confirmed: document.querySelector('main h1').textContent === "Flowers"
  readonly heading: Locator;
  // evaluate confirmed: filter buttons text "Categories", "Flower Type", etc.
  readonly filterCategories: Locator;
  readonly filterFlowerType: Locator;
  readonly filterOccasion: Locator;
  // evaluate confirmed: select[aria-label="Sort by"]
  readonly sortSelect: Locator;
  // evaluate confirmed: product h2 headings inside product cards
  readonly productHeadings: Locator;
  // DOM snapshot: product card links with aria-label containing product details
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // DOM snapshot: h1:heading "Flowers"
    this.heading = page.locator('main h1').filter({ hasText: 'Flowers' });
    // get_attributes confirmed: button text "Categories"
    this.filterCategories = page.getByRole('button', { name: 'Categories' });
    // get_attributes confirmed: button text "Flower Type"
    this.filterFlowerType = page.getByRole('button', { name: 'Flower Type' });
    // get_attributes confirmed: button text "Occasion"
    this.filterOccasion = page.getByRole('button', { name: 'Occasion' });
    // get_attributes confirmed: select id="sortBy"
    this.sortSelect = page.locator('#sortBy');
    // DOM snapshot: product h2 headings
    this.productHeadings = page.locator('main h2');
    // get_attributes confirmed: a[class="product-card_cardWrapper__GVSTY"]
    this.productCards = page.locator('a.product-card_cardWrapper__GVSTY');
  }

  async goto() {
    await this.page.goto('https://www.marksandspencer.com/l/gifts/flowers', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('load', { timeout: 60000 });
  }

  async verifyLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 30000 });
  }

  async verifyProductsVisible() {
    await expect(this.productHeadings.first()).toBeVisible({ timeout: 30000 });
  }

  async clickFirstProduct() {
    await this.productCards.first().click();
    await this.page.waitForLoadState('load');
  }
}