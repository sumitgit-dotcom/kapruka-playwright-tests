
const { test, expect } = require('@playwright/test');

test.describe('Kapruka Events - New Year Gifts', () => {

  test('Navigate to New Year Gifts and select 21 Years Older', async ({ page }) => {

    test.setTimeout(120000);

    // STEP 1: Open homepage
    await page.goto('/');

    console.log('STEP 1: Homepage opened');
    console.log('Homepage URL:', page.url());

    // STEP 2: Click Events
    const eventsLink = page.getByRole('link', {
      name: 'Events',
      exact: true
    });

    await expect(eventsLink).toBeVisible();
    await eventsLink.click();

    await expect(page).toHaveURL(/events_home/i);

    console.log('STEP 2: Events page opened');
    console.log('Events URL:', page.url());

    // STEP 3: Click New Year Gifts
    const newYearLink = page.locator(
      'a[href*="/online/newyear_january"]'
    ).first();

    await expect(newYearLink).toBeVisible();

    await newYearLink.click();

    await expect(page).toHaveURL(/newyear_january/i);

    console.log('STEP 3: New Year Gifts page opened');
    console.log('New Year URL:', page.url());

    // STEP 4: Verify age verification popup
    const agePopup = page.getByRole('dialog');

    await expect(agePopup).toBeVisible({
      timeout: 20000
    });

    console.log('STEP 4: Age Verification popup displayed');

    // Print popup content
    const popupText = await agePopup.innerText();

    console.log('Age Verification Popup Content:');
    console.log(popupText);

   // STEP 5: Click "I am 21 or older"
const ageButton = agePopup.getByRole('button', {
  name: /I am 21 or older/
});

await expect(ageButton).toBeVisible();
await ageButton.click();

console.log('STEP 5: Clicked I am 21 or older');

// STEP 6: Verify popup is closed
await expect(agePopup).toBeHidden({ timeout: 15000 });

console.log('STEP 6: Age verification popup closed');

    // STEP 7: Capture final screenshot
console.log('Capturing final screenshot...');

await page.screenshot({
  path: 'test-results/new-year-age-verification.png',
  fullPage: false,
  timeout: 10000
});

console.log('Screenshot captured successfully.');
console.log('======================================');
console.log('KAPRUKA AGE VERIFICATION TEST PASSED');
console.log('======================================');

    

  });

});
