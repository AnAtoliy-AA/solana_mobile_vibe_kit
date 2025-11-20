import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Launchpad from './Launchpad';
import { Pool } from '../lib/api/types';

const mockHistoryPush = jest.fn();
const mockMarketStore = {
  pools: [] as Pool[],
  setPools: jest.fn(),
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@ionic/react', () => require('../test-utils/mockIonicReact').default);

jest.mock('../hooks/usePools', () => ({
  usePoolListInfinite: jest.fn(),
}));

jest.mock('../hooks/useLiveUpdates', () => ({
  useLiveActivity: jest.fn(),
}));

jest.mock('../lib/stores/useMarketStore', () => ({
  __esModule: true,
  useMarketStore: (selector: (state: typeof mockMarketStore) => unknown) =>
    selector(mockMarketStore),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockUsePoolListInfinite = require('../hooks/usePools').usePoolListInfinite as jest.Mock;

const basePool: Pool = {
  id: 'test-pool',
  name: 'Meme Token',
  symbol: 'MT',
  status: 'active',
  progress: 0.4,
  tvl: '1000',
  participants: 100,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  targetAmount: '2000',
  currentAmount: '800',
  tokenPrice: '0.01',
  tags: [],
};

describe('Launchpad page', () => {
  const renderLaunchpad = () =>
    render(
      <MemoryRouter>
        <Launchpad />
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockMarketStore.pools = [];
    mockMarketStore.setPools = jest.fn();
  });

  it('renders placeholder initials when image missing', () => {
    mockUsePoolListInfinite.mockReturnValue({
      data: { pages: [[basePool]] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    renderLaunchpad();
    expect(screen.getByText('ME')).toBeInTheDocument();
  });

  it('falls back to initials when image fails to load', () => {
    mockUsePoolListInfinite.mockReturnValue({
      data: { pages: [[{ ...basePool, imageUrl: 'https://ipfs.io/ipfs/test.png' }]] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    renderLaunchpad();

    const image = screen.getByAltText('MT');
    fireEvent.error(image);

    expect(screen.getByText('ME')).toBeInTheDocument();
  });
});
