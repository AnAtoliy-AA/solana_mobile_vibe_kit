import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import LaunchpadDetail from './LaunchpadDetail';
import { usePoolDetail } from '../hooks/usePools';

const mockRefetch = jest.fn().mockResolvedValue({ data: {} });
const mockOpenParticipationModal = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@ionic/react', () => require('../test-utils/mockIonicReact').default);

jest.mock('../hooks/usePools', () => ({
  usePoolDetail: jest.fn(),
}));

jest.mock('../hooks/useLiveUpdates', () => ({
  useLivePool: jest.fn(),
}));

jest.mock('../lib/stores/useUIStore', () => ({
  useUIStore: jest.fn((selector) =>
    selector({
      openParticipationModal: mockOpenParticipationModal,
      addToast: jest.fn(),
    })
  ),
}));

const mockMarketStore = {
  pools: [],
  setPools: jest.fn(),
};

jest.mock('../lib/stores/useMarketStore', () => ({
  __esModule: true,
  useMarketStore: (selector: (state: typeof mockMarketStore) => unknown) =>
    selector(mockMarketStore),
}));

const mockUsePoolDetail = usePoolDetail as jest.Mock;

const basePool = {
  id: 'pool-1',
  name: 'Pool 1',
  symbol: 'P1',
  status: 'active',
  progress: 0.5,
  tvl: '1000',
  participants: 100,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  targetAmount: '2000',
  currentAmount: '1000',
  tokenPrice: '0.1',
  tags: [],
};

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/launchpad/pool-1']}>
      <Route path="/launchpad/:id">
        <LaunchpadDetail />
      </Route>
    </MemoryRouter>
  );

describe('LaunchpadDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMarketStore.pools = [];
    mockMarketStore.setPools = jest.fn();
  });

  it('renders hero initials when image broken', () => {
    mockUsePoolDetail.mockReturnValue({
      data: { ...basePool, imageUrl: 'https://ipfs.io/ipfs/test.png' },
      isLoading: false,
      refetch: mockRefetch,
      isFetching: false,
    });

    renderDetail();

    const heroImage = screen.getByAltText('P1');
    fireEvent.error(heroImage);

    expect(screen.getByText('PO')).toBeInTheDocument();
  });

  it('disables refresh while fetching', () => {
    mockUsePoolDetail.mockReturnValue({
      data: basePool,
      isLoading: false,
      refetch: mockRefetch,
      isFetching: true,
    });

    renderDetail();
    const refreshButton = screen.getByLabelText(/refresh token details/i);
    expect(refreshButton).toBeDisabled();
  });
});
