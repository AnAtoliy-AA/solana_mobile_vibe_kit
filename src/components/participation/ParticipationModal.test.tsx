import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ParticipationModal from './ParticipationModal';
import { useUIStore } from '../../lib/stores/useUIStore';
import { useParticipate } from '../../hooks/usePools';

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@ionic/react', () => require('../../test-utils/mockIonicReact').default);

jest.mock('../../lib/stores/useUIStore', () => ({
  useUIStore: jest.fn(),
}));

jest.mock('../../hooks/usePools', () => ({
  useParticipate: jest.fn(),
}));

jest.mock('../../lib/i18n/useTranslation', () => ({
  useTranslation: () => ({
    participateInPool: 'Participate in Pool',
    loadingTokens: 'Loading...',
  }),
}));

describe('ParticipationModal', () => {
  const closeModal = jest.fn();
  const mutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        isParticipationModalOpen: true,
        participationPoolId: 'pool-1',
        closeParticipationModal: closeModal,
      })
    );
    (useParticipate as jest.Mock).mockReturnValue({
      mutateAsync,
      isPending: false,
    });
  });

  it('renders form inputs when modal is open', () => {
    render(<ParticipationModal />);
    expect(screen.getByLabelText(/Wallet Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  });

  it('validates missing wallet address', async () => {
    render(<ParticipationModal />);
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '2' } });

    const submitButton = screen.getByLabelText(/Submit participation/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Wallet address is required/i)).toBeInTheDocument();
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('submits participation when inputs provided', async () => {
    render(<ParticipationModal />);

    fireEvent.change(screen.getByLabelText(/Wallet Address/i), {
      target: { value: 'wallet123' },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '2' },
    });

    const submitButton = screen.getByLabelText(/Submit participation/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        poolId: 'pool-1',
        walletAddress: 'wallet123',
        amount: '2',
      });
    });
  });
});
