import { render, fireEvent, screen } from '@testing-library/react';
import GlobalSettingsButton from './GlobalSettingsButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@ionic/react', () => require('../../test-utils/mockIonicReact').default);

jest.mock('./SettingsModal', () => {
  const MockSettingsModal = (props: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="settings-modal">
      <div data-testid="settings-modal-state">{props.isOpen ? 'open' : 'closed'}</div>
      <button onClick={props.onClose}>close</button>
    </div>
  );
  MockSettingsModal.displayName = 'MockSettingsModal';
  return {
    __esModule: true,
    default: MockSettingsModal,
  };
});

describe('GlobalSettingsButton', () => {
  it('toggles settings modal visibility', () => {
    render(<GlobalSettingsButton />);
    expect(screen.getByTestId('settings-modal-state')).toHaveTextContent('closed');

    fireEvent.click(screen.getByLabelText('Open settings'));
    expect(screen.getByTestId('settings-modal-state')).toHaveTextContent('open');

    fireEvent.click(screen.getByText('close'));
    expect(screen.getByTestId('settings-modal-state')).toHaveTextContent('closed');
  });
});
