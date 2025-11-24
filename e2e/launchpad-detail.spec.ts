/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';
import type { Page, Route, Request } from '@playwright/test';
import assert from 'assert';

const createMockToken = () => ({
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
});

const createTokenListResponse = () =>
  JSON.stringify({
    data: [createMockToken()],
  });

const createTokenDetailResponse = () =>
  JSON.stringify({
    data: [createMockToken()],
    holders: [],
  });

const fulfillTokenRequest = async (route: Route, postData: string) => {
  const body = postData.includes('id=') ? createTokenDetailResponse() : createTokenListResponse();
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body,
  });
};

test.beforeEach(async ({ page }: { page: Page }) => {
  await page.route('**/tokens', async (route: Route, request: Request) => {
    const postData = request.postData() || '';
    await fulfillTokenRequest(route, postData);
  });
});

test('detail auto-refresh control updates', async ({ page }: { page: Page }) => {
  await page.goto('/launchpad/mock-token');
  await expect(page.getByText('Funding Progress')).toBeVisible();

  await page.getByLabel('Auto refresh frequency').click();
  await page.getByRole('option', { name: '5s' }).click();

  await expect(page.getByLabel('Auto refresh frequency')).toHaveText('5s');
});

test('manual refresh triggers request', async ({ page }: { page: Page }) => {
  await page.unroute('**/tokens');
  let detailCalls = 0;
  await page.route('**/tokens', async (route: Route, request: Request) => {
    const postData = request.postData() || '';
    if (postData.includes('id=')) {
      detailCalls += 1;
    }
    await fulfillTokenRequest(route, postData);
  });

  await page.goto('/launchpad/mock-token');
  const refreshButton = page.getByRole('button', { name: /Refresh Now/i });
  await refreshButton.click();
  assert(detailCalls >= 1, `Expected detailCalls to be >= 1, but got ${detailCalls}`);
});
