/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

const mockListResponse = {
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
      photo: undefined,
    },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('**/tokens', async (route, request) => {
    const postData = request.postData() || '';
    if (postData.includes('id=')) {
      const detailResponse = {
        data: [
          {
            ...mockListResponse.data[0],
            timeline: {
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 3600 * 1000).toISOString(),
            },
          },
        ],
        holders: [],
      };
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(detailResponse),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockListResponse),
    });
  });
});

test('launchpad shows tokens and navigates to detail', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Mock Token')).toBeVisible();

  await page.getByText('Mock Token').click();
  await expect(page).toHaveURL(/launchpad\/mock-token/);
  await expect(page.getByText('Funding Progress')).toBeVisible();
});

test('filter chips toggle state', async ({ page }) => {
  await page.goto('/');
  const filterChip = page.getByRole('button', { name: /Has X/i });
  await filterChip.click();
  await expect(filterChip).toHaveClass(/active/);
});
