import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonIcon,
  IonText,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { useUIStore } from '../../lib/stores/useUIStore';
import { useParticipate } from '../../hooks/usePools';
import { useTranslation } from '../../lib/i18n/useTranslation';
import './ParticipationModal.css';

export const ParticipationModal: React.FC = () => {
  const t = useTranslation();
  const isOpen = useUIStore((state) => state.isParticipationModalOpen);
  const poolId = useUIStore((state) => state.participationPoolId);
  const closeModal = useUIStore((state) => state.closeParticipationModal);
  const { mutateAsync, isPending } = useParticipate();

  const [amount, setAmount] = useState('1');
  const [walletAddress, setWalletAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('1');
      setWalletAddress('');
      setFormError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!poolId) {
      setFormError('Select a pool before participating.');
      return;
    }
    if (!walletAddress.trim()) {
      setFormError('Wallet address is required.');
      return;
    }
    setFormError(null);
    await mutateAsync({
      poolId,
      amount,
      walletAddress,
    });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={closeModal} className="participation-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t.participateInPool}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={closeModal} aria-label="Close participation modal">
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form className="participation-form" onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Wallet Address</IonLabel>
              <IonInput
                aria-label="Wallet Address"
                value={walletAddress}
                placeholder="Your Solana wallet"
                onIonInput={(event) => setWalletAddress(event.detail.value || '')}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Amount (SOL)</IonLabel>
              <IonInput
                aria-label="Amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onIonInput={(event) => setAmount(event.detail.value || '')}
              />
            </IonItem>
          </IonList>

          {formError && (
            <IonText color="danger">
              <p className="form-error">{formError}</p>
            </IonText>
          )}

          <IonButton
            type="submit"
            expand="block"
            disabled={isPending || !poolId}
            aria-label="Submit participation"
          >
            {isPending ? t.loadingTokens : t.participateInPool}
          </IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default ParticipationModal;
