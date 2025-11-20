/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/tokens', async (route, request) => {
    const postData = request.postData() || '';
    if (postData.includes('id=')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              token: 'mock-token',
              name: 'Mock Token',
              symbol: 'MCK',
              status: 'active',
              progress: 0.4,
              marketCapUsd: 1200,
              holders: 42,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
              targetAmount: '2000',
              currentAmount: '800',
              tokenPrice: '0.02',
              tags: [],
            },
          ],
          holders: [],
        }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            token: 'mock-token',
            name: 'Mock Token',
            symbol: 'MCK',
            status: 'active',
            progress: 0.4,
            marketCapUsd: 1200,
            holders: 42,
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
            targetAmount: '2000',
            currentAmount: '800',
            tokenPrice: '0.02',
            tags: [],
          },
        ],
      }),
    });
  });
});

test('opens settings modal and updates theme', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByText(/Settings/i)).toBeVisible();

  await page.getByLabel(/Theme/i).click();
  await page.getByRole('option', { name: /Dark/ }).click();

  await page.reload();
  await page.getByRole('button', { name: 'Open settings' }).click();
  await expect(page.getByLabel(/Theme/i)).toContainText(/Dark/i);
});
