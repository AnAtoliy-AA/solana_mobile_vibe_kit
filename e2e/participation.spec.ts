/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

type TokenResponse = {
  data: Array<Record<string, unknown>>;
  holders?: Array<Record<string, unknown>>;
};

const baseToken = {
  token: 'mock-token',
  name: 'Mock Token',
  symbol: 'MCK',
  status: 'active',
  progress: 0.5,
  marketCapUsd: 2000,
  holders: 120,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
  targetAmount: '4000',
  currentAmount: '2000',
  tokenPrice: '0.04',
  tags: [],
};

const secondaryToken = {
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
};

const mockTokensEndpoint = async (
  page: Page,
  responses: { detail: TokenResponse; list?: TokenResponse }
) => {
  await page.route('**/tokens', async (route, request) => {
    const postData = request.postData() || '';
    const isDetailRequest = postData.includes('id=');
    const body = isDetailRequest ? responses.detail : (responses.list ?? responses.detail);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
};

test.describe('participation submission flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockTokensEndpoint(page, {
      detail: { data: [baseToken], holders: [] },
      list: { data: [baseToken] },
    });
  });

  test('user can participate in a pool and see toast confirmation', async ({ page }) => {
    let participateCalls = 0;
    await page.route('**/participate', async (route, request) => {
      participateCalls += 1;
      const body = JSON.parse(request.postData() || '{}');
      expect(body.poolId).toBe('mock-token');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/launchpad/mock-token');
    await page.getByRole('button', { name: /Participate in Pool/i }).click();

    await page.getByLabel('Wallet Address').fill('wallet123');
    await page.getByLabel('Amount').fill('2');
    await page.getByRole('button', { name: 'Submit participation' }).click();

    await expect(page.getByText('Successfully participated with 2 SOL')).toBeVisible();
    expect(participateCalls).toBe(1);
  });
});

test.describe('participation modal state handling', () => {
  const tokenResponse: TokenResponse = {
    data: [secondaryToken],
    holders: [],
  };

  test.beforeEach(async ({ page }) => {
    await mockTokensEndpoint(page, {
      detail: tokenResponse,
      list: tokenResponse,
    });
  });

  test('participation flow success closes modal and shows toast', async ({ page }) => {
    await page.route('**/participate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/launchpad/mock-token');
    await page.getByRole('button', { name: /Participate in Pool/i }).click();
    await expect(page.getByText(/Wallet Address/i)).toBeVisible();

    await page.getByLabel('Wallet Address').fill('DemoWallet');
    await page.getByLabel('Amount').fill('3');
    await page.getByRole('button', { name: /Participate in Pool/i }).click();

    await expect(page.getByText(/Successfully participated/i)).toBeVisible();
    await expect(page.getByText(/Wallet Address/i)).toBeHidden();
  });

  test('participation failure shows error toast and keeps modal open', async ({ page }) => {
    await page.route('**/participate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Cap reached' }),
      });
    });

    await page.goto('/launchpad/mock-token');
    await page.getByRole('button', { name: /Participate in Pool/i }).click();
    await page.getByLabel('Wallet Address').fill('DemoWallet');
    await page.getByLabel('Amount').fill('3');
    await page.getByRole('button', { name: /Participate in Pool/i }).click();

    await expect(page.getByText(/Cap reached/i)).toBeVisible();
    await expect(page.getByText(/Wallet Address/i)).toBeVisible();
  });
});
