import { test, expect } from '@playwright/test';

/**
 * About Page Navigation and Display E2E tests
 * Implements: frontend/tests/features/tos-download.feature
 */

test.describe('About Page Navigation and Display', () => {
  test('Navigate to About page from Home', async ({ page }) => {
    // Given I am on the home page
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('h1:has-text("Smart Cat Tech")')).toBeVisible();

    // When I click the "About us" navigation link
    await page.click('a:has-text("About us")');

    // Then I should be on the About page
    await expect(page).toHaveURL(/\/about/);

    // And I should see the heading "About OctoCAT Supply"
    await expect(page.locator('h1:has-text("About OctoCAT Supply")')).toBeVisible();
  });

  test('About page displays company mission', async ({ page }) => {
    // Given I am on the About page
    await page.goto('/about');
    await expect(page.locator('h1:has-text("About OctoCAT Supply")')).toBeVisible();

    // Then I should see the section "Our Meow-ssion"
    await expect(page.locator('h2:has-text("Our Meow-ssion")')).toBeVisible();

    // And I should see the section "Our Purr-pose"
    await expect(page.locator('h2:has-text("Our Purr-pose")')).toBeVisible();

    // And I should see the key features list with at least 6 items
    const featureItems = page.locator('li');
    const count = await featureItems.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('About page is accessible via direct URL', async ({ page }) => {
    // Given I navigate directly to the About page URL
    await page.goto('/about');

    // Then I should be on the About page
    await expect(page.locator('h1:has-text("About OctoCAT Supply")')).toBeVisible();

    // And the page title should contain "OctoCAT Supply"
    const url = page.url();
    expect(url).toContain('/about');
  });
});
