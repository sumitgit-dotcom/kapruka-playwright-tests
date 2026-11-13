// tests/kapruka-navigation.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Kapruka category navigation', () => {
  test('navigate Electronics > Headphones > Headphones And Earbuds > first product', async ({ page }) => {
    // 1. Go to home page
    await page.goto('https://www.kapruka.com/', { waitUntil: 'domcontentloaded' });

    // 2. Click "Electronics" icon tile on the homepage.
    //    Use the visible accessible name. Do NOT use `a[href$="/online/electronics"]`.first()
    //    because it matches the hidden mega-menu entry first (tabindex="-1", display:none),
    //    and .first() does not filter for visibility.
    const electronicsLink = page.getByRole('link', { name: /Electronics Image Electronics/i });
    await expect(electronicsLink).toBeVisible();
    await electronicsLink.click();

    // Wait for the electronics category page to load
    await page.waitForURL(/\/online\/electronics/i);

    // 3. Click "Headphones" subcategory.
    //    Same pitfall possible: multiple matches, hidden first. Restrict to visible and prefer
    //    exact name to avoid matching long product titles that contain "headphones".
    const headphonesLink = page
      .getByRole('link', { name: /headphones/i })
      .filter({ hasNotText: /image|buy|online for/i })
      .first();
    await headphonesLink.waitFor({ state: 'visible' });
    await headphonesLink.click();

    // Wait for navigation to the headphones category
    await page.waitForLoadState('domcontentloaded');

    // 4. Click "Headphones And Earbuds" above the product list (link or heading, whichever exists)
    const headphonesAndEarbuds = page
      .getByRole('link', { name: /headphones and earbuds/i })
      .or(page.getByRole('heading', { name: /headphones and earbuds/i }))
      .first();
    await headphonesAndEarbuds.waitFor({ state: 'visible' });
    await headphonesAndEarbuds.click();

    await page.waitForLoadState('domcontentloaded');

    // 5. Click the very first product in the list.
    //    Products are anchors to /buyonline/ or /buyservice/.
    //    Use :visible to skip hidden mega-menu / promo duplicates.
    const productLinks = page.locator(
      'a[href*="/buyonline/"]:visible, a[href*="/buyservice/"]:visible'
    );
    await expect(productLinks.first()).toBeVisible();

    const firstProduct = productLinks.first();
    await firstProduct.click();

    // 6. Verify we landed on the product detail page
    await expect(page).toHaveURL(/kapruka\.com\/(buyonline|buyservice)\//);
  });
});