import React from 'react';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useUIStore } from '../../lib/stores/useUIStore';
import './ToastContainer.css';

const ToastContainer: React.FC = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-message">{toast.message}</div>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => removeToast(toast.id)}
          >
            <IonIcon icon={close} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
