import { render, screen } from '@testing-library/react';
import * as timeAgoHook from '../../hooks/useTimeAgo';
import LastUpdated from './LastUpdated';

jest.mock('../../hooks/useTimeAgo');

describe('LastUpdated component', () => {
  it('renders timestamp with prefix', () => {
    (timeAgoHook.useTimeAgo as jest.Mock).mockReturnValue('5m ago');
    render(<LastUpdated timestamp={Date.now()} prefix="Updated" />);
    expect(screen.getByText(/Updated 5m ago/i)).toBeInTheDocument();
  });

  it('returns null when no timestamp', () => {
    (timeAgoHook.useTimeAgo as jest.Mock).mockReturnValue('');
    render(<LastUpdated />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.queryByText(/Updated/i)).not.toBeInTheDocument();
  });
});
