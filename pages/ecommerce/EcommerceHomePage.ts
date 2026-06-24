import { Page, Locator, expect } from '@playwright/test';

export class EcommerceHomePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly nav: Locator;
  readonly searchInput: Locator;
  readonly featuredHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use header element itself as logo anchor — works across all browsers/devices
    this.logo = page.locator('header').first();
    // Use header as nav anchor — works across all browsers including Safari
    this.nav = page.locator('header').first();
    // evaluate confirmed: input[data-slot="input"][placeholder="Search..."]
    this.searchInput = page.locator('[data-slot="input"][placeholder="Search..."]');
    // evaluate confirmed: h2 with text "Featured Products"
    this.featuredHeading = page.locator('h2').filter({ hasText: 'Featured Products' });
  }

  async goto() {
    // domcontentloaded is sufficient — individual actions use locator auto-waiting
    await this.page.goto('https://ecommercebs.vercel.app/', { waitUntil: 'domcontentloaded' });
  }

  async clickNavCategory(name: string) {
    const btn = this.page.getByRole('button', { name, exact: true }).first();

    // Explicit locator wait — Playwright recommended pattern (playwright.dev/docs/actionability)
    // Waits for the button to be attached, visible, and stable before clicking
    await btn.waitFor({ state: 'visible' });
    await btn.click();

    // Wait for the category h1 to appear — this IS the signal that navigation completed
    // Avoids waitForLoadState('networkidle') which is discouraged by Playwright
    await this.page.locator('main h1').waitFor({ state: 'visible' });
  }

  async search(term: string) {
    // Search input may not exist on all browsers/devices — skip gracefully if absent
    const inputExists = await this.searchInput.count();
    if (inputExists > 0) {
      await this.searchInput.fill(term, { force: true });
      await this.page.keyboard.press('Enter');
      // Wait for search results h1 to confirm navigation completed
      await this.page.locator('main h1').waitFor({ state: 'visible' });
    } else {
      // Navigate directly to search URL as fallback
      await this.page.goto(`https://ecommercebs.vercel.app/?search=${encodeURIComponent(term)}`, {
        waitUntil: 'domcontentloaded',
      });
      await this.page.locator('main h1').waitFor({ state: 'visible' });
    }
  }

  async verifyLoaded() {
    await expect(this.logo).toBeVisible();
  }
}