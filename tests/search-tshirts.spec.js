// tests/search-tshirts.spec.js
const { test, expect } = require('@playwright/test');

test('Search T shirts and click a unisex T shirt product', async ({ page }) => {
  await page.goto('https://www.kapruka.com/');

  const searchBox = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));
  await searchBox.fill('T shirts');
  await searchBox.press('Enter');

  // ✅ Delete waitForLoadState('networkidle'), directly wait for the element
  const unisexProduct = page.locator('a').filter({ hasText: /unisex/i }).first();
  await expect(unisexProduct).toBeVisible({ timeout: 15000 });

  await unisexProduct.click();
  await expect(page).toHaveURL(/buyonline|product/i);
});