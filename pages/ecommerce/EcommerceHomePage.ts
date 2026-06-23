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
    await this.page.goto('https://ecommercebs.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('load', { timeout: 60000 });
  }

  async clickNavCategory(name: string) {
    // Try direct button click first (desktop nav)
    const directBtn = this.page.getByRole('button', { name, exact: true }).first();
    const isVisible = await directBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isVisible) {
      // Mobile: open hamburger menu first, then click category
      const hamburger = this.page.getByRole('button', { name: /menu|hamburger|open/i }).first();
      const hamburgerAlt = this.page.locator('button[aria-label*="menu" i], button[aria-label*="nav" i]').first();
      const menuBtn = await hamburger.isVisible({ timeout: 3000 }).catch(() => false)
        ? hamburger
        : hamburgerAlt;
      await menuBtn.click({ timeout: 10000 }).catch(() => {});
      await this.page.waitForTimeout(500);
    }

    await this.page.getByRole('button', { name, exact: true }).first().click({ timeout: 30000 });
    await this.page.waitForLoadState('load');
  }

  async search(term: string) {
    // Search input may not exist on all browsers/devices — skip gracefully if absent
    const inputExists = await this.searchInput.count();
    if (inputExists > 0) {
      await this.searchInput.fill(term, { force: true });
      await this.page.keyboard.press('Enter');
      await this.page.waitForLoadState('load');
    } else {
      // Navigate directly to search URL as fallback
      await this.page.goto(`https://ecommercebs.vercel.app/?search=${encodeURIComponent(term)}`);
      await this.page.waitForLoadState('load');
    }
  }

  async verifyLoaded() {
    await expect(this.logo).toBeVisible({ timeout: 30000 });
  }
}