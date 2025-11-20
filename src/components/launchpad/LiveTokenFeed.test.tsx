import { render, screen } from '@testing-library/react';
import LiveTokenFeed from './LiveTokenFeed';
import { useTokenUpdateStore } from '../../lib/stores/useTokenUpdateStore';
import { useTimeAgo } from '../../hooks/useTimeAgo';

jest.mock('../../lib/stores/useTokenUpdateStore', () => ({
  useTokenUpdateStore: jest.fn(),
}));

jest.mock('../../hooks/useTimeAgo', () => ({
  useTimeAgo: jest.fn(),
}));

describe('LiveTokenFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTimeAgo as jest.Mock).mockReturnValue('2m ago');
  });

  it('shows empty state when no tokens', () => {
    (useTokenUpdateStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ tokenUpdates: new Map() })
    );

    render(<LiveTokenFeed />);
    expect(screen.getByText(/Waiting for websocket messages/i)).toBeInTheDocument();
  });

  it('renders sorted token updates with stats', () => {
    const now = Date.now();
    const updates = new Map([
      [
        'token-1',
        {
          token: 'token-1',
          lastMessageTime: now,
          holders: 120,
          isLive: true,
          price: 0.42,
          marketCap: 1200000,
          topHoldersPercentage: 0.12,
        },
      ],
    ]);

    (useTokenUpdateStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ tokenUpdates: updates })
    );

    render(<LiveTokenFeed />);
    expect(screen.getByText(/Live Token Updates/i)).toBeInTheDocument();
    expect(screen.getByText(/Holders: 120/)).toBeInTheDocument();
    expect(screen.getByText(/Market Cap: \$1.20M/)).toBeInTheDocument();
    expect(screen.getByText(/Top 10: 12.0%/)).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });
});
