import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonToast,
  IonLoading,
  IonChip,
  IonModal,
  IonButtons,
  IonAlert,
  IonItem,
  IonSpinner,
  IonText,
} from '@ionic/react';
import {
  wallet,
  send,
  copy,
  refresh,
  close,
  swapHorizontal,
  mail,
  person,
  logOut,
} from 'ionicons/icons';
import { useSolana } from '../context/SolanaContext';
import { usePrivyAuth } from '../context/PrivyContext';
import { usePrivySolana } from '../hooks/usePrivySolana';
import { formatSol, shortenAddress } from '../sdk/utils';
import GlobalSettingsButton from '../components/settings/GlobalSettingsButton';
import { useTranslation } from '../lib/i18n/useTranslation';
import './Tab1.css';

const Tab1: React.FC = () => {
  const t = useTranslation();
  const { sdk, walletState, isLoading, error, connectWallet, disconnectWallet, switchNetwork } =
    useSolana();

  const { login, logout, authenticated, user, ready } = usePrivyAuth();
  usePrivySolana();

  const [balance, setBalance] = useState<number>(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showNetworkAlert, setShowNetworkAlert] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (walletState.connected) {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [walletState.connected]);

  const fetchBalance = async () => {
    try {
      const balanceInLamports = await sdk.wallet.getBalance();
      setBalance(balanceInLamports);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      showToastMessage(t.failedToFetchBalance);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setRefreshing(false);
  };

  const handleCopyAddress = async () => {
    if (walletState.publicKey) {
      try {
        await navigator.clipboard.writeText(walletState.publicKey.toString());
        setCopied(true);
        showToastMessage(t.addressCopiedToClipboard);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        showToastMessage(t.failedToCopyAddress);
      }
    }
  };

  const handleSendTransaction = async () => {
    if (!sendAddress || !sendAmount) {
      showToastMessage(t.pleaseFillInAllRequiredFields);
      return;
    }

    try {
      const amountInLamports = parseFloat(sendAmount) * 1000000000;

      const result = await sdk.transaction.sendSol({
        recipientAddress: sendAddress,
        amount: amountInLamports,
        memo: sendMemo || undefined,
      });

      if (result.success) {
        showToastMessage(`${t.transactionSent} ${result.signature.substring(0, 8)}...`);
        setShowSendModal(false);
        setSendAddress('');
        setSendAmount('');
        setSendMemo('');
        await fetchBalance();
      } else {
        showToastMessage(`${t.transactionFailed}: ${result.error}`);
      }
    } catch (err) {
      showToastMessage(t.transactionFailed);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const currentNetwork = sdk.wallet.getCurrentNetwork();
  const balanceInSol = balance * 0.000000001;
  const balanceInUsd = balanceInSol * 180; // Mock price

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t.wallet}</IonTitle>
          <IonButtons slot="end">
            {walletState.connected && (
              <IonButton fill="clear" onClick={handleRefresh} disabled={refreshing}>
                <IonIcon icon={refresh} />
              </IonButton>
            )}
            <IonButton fill="clear" onClick={() => setShowNetworkAlert(true)}>
              <IonChip color="primary">{currentNetwork.name}</IonChip>
            </IonButton>
            <GlobalSettingsButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="wallet-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t.wallet}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="wallet-container">
          {/* Error Display */}
          {error && (
            <div
              className="connection-banner"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.2)',
              }}
            >
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            </div>
          )}

          {/* Login Section */}
          {!authenticated && ready && (
            <div className="login-section">
              <div className="login-title">{t.welcomeToSolanaWallet}</div>
              <div className="login-subtitle">{t.connectEmailDescription}</div>
              <IonButton className="login-button" onClick={login} disabled={!ready}>
                <IonIcon icon={mail} slot="start" />
                {!ready ? t.loading : t.loginWithEmail}
              </IonButton>
            </div>
          )}

          {/* User Info */}
          {authenticated && user?.email?.address && (
            <div className="user-info-card">
              <div className="user-header">
                <div className="user-avatar">
                  <IonIcon icon={person} />
                </div>
                <div className="user-details">
                  <h3>{t.welcomeBack}</h3>
                  <p>{user.email.address}</p>
                </div>
                <IonButton fill="clear" onClick={logout} color="danger" size="small">
                  <IonIcon icon={logOut} />
                </IonButton>
              </div>

              {!walletState.connected && (
                <IonButton
                  className="action-button primary"
                  onClick={() => connectWallet()}
                  disabled={isLoading}
                  expand="block"
                >
                  <IonIcon icon={wallet} slot="start" />
                  {isLoading ? t.connecting : t.connectDemoWallet}
                </IonButton>
              )}
            </div>
          )}

          {/* Wallet Dashboard */}
          {authenticated && walletState.connected && (
            <>
              {/* Balance Card */}
              <div className="wallet-card">
                <div className="balance-section">
                  <div className="balance-label">{t.yourBalance}</div>
                  <div className="balance-amount">
                    {refreshing ? <IonSpinner name="dots" /> : `${formatSol(balance)} SOL`}
                  </div>
                  <div className="balance-usd">
                    ≈ ${refreshing ? '...' : balanceInUsd.toFixed(2)} USD
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="wallet-info">
                  <div className="wallet-address">
                    <span className="wallet-address-label">{t.walletAddress}</span>
                    <span className="wallet-address-value">
                      {walletState.publicKey
                        ? shortenAddress(walletState.publicKey.toString())
                        : t.notConnected}
                    </span>
                    {walletState.publicKey && (
                      <IonButton className="copy-button" fill="clear" onClick={handleCopyAddress}>
                        <IonIcon
                          icon={copied ? close : copy}
                          color={copied ? 'success' : 'primary'}
                        />
                      </IonButton>
                    )}
                  </div>

                  <div className="network-info">
                    <span className="network-label">{t.network}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IonChip className="network-chip" color="primary">
                        {currentNetwork.name}
                      </IonChip>
                      <IonButton
                        fill="clear"
                        size="small"
                        onClick={() => setShowNetworkAlert(true)}
                      >
                        <IonIcon icon={swapHorizontal} />
                      </IonButton>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <IonButton
                    className="action-button primary"
                    onClick={() => setShowSendModal(true)}
                    disabled={balance === 0}
                  >
                    <IonIcon icon={send} slot="start" />
                    {t.sendSol}
                  </IonButton>
                  <IonButton
                    className="action-button secondary"
                    onClick={() => showToastMessage(t.receiveComingSoon)}
                  >
                    <IonIcon icon={wallet} slot="start" />
                    {t.receive}
                  </IonButton>
                </div>
              </div>
            </>
          )}

          {/* Quick Actions */}
          {authenticated && walletState.connected && (
            <div className="quick-actions">
              <div className="quick-actions-title">{t.quickActions}</div>
              <div className="quick-actions-grid">
                <div className="quick-action-item" onClick={handleRefresh}>
                  <div className="quick-action-icon">
                    <IonIcon icon={refresh} />
                  </div>
                  <div className="quick-action-label">{t.refreshBalance}</div>
                </div>
                <div className="quick-action-item" onClick={() => setShowNetworkAlert(true)}>
                  <div className="quick-action-icon">
                    <IonIcon icon={swapHorizontal} />
                  </div>
                  <div className="quick-action-label">{t.switchNetwork}</div>
                </div>
                <div className="quick-action-item" onClick={handleCopyAddress}>
                  <div className="quick-action-icon">
                    <IonIcon icon={copy} />
                  </div>
                  <div className="quick-action-label">{t.copyAddress}</div>
                </div>
                <div
                  className="quick-action-item"
                  onClick={async () => {
                    if (authenticated) await logout();
                    await disconnectWallet();
                  }}
                >
                  <div className="quick-action-icon">
                    <IonIcon icon={logOut} />
                  </div>
                  <div className="quick-action-label">{t.disconnect}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Send Modal */}
        <IonModal isOpen={showSendModal} onDidDismiss={() => setShowSendModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{t.sendSol}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowSendModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="wallet-content">
            <div className="wallet-container">
              <div className="wallet-card">
                <IonItem>
                  <IonLabel position="stacked">{t.recipientAddress}</IonLabel>
                  <IonInput
                    value={sendAddress}
                    onIonChange={(event) => setSendAddress(event.detail.value ?? '')}
                    placeholder={t.enterSolanaAddress}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">{t.amountSol}</IonLabel>
                  <IonInput
                    type="number"
                    value={sendAmount}
                    onIonChange={(event) => setSendAmount(event.detail.value ?? '')}
                    placeholder="0.00"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">{t.memoOptional}</IonLabel>
                  <IonInput
                    value={sendMemo}
                    onIonChange={(event) => setSendMemo(event.detail.value ?? '')}
                    placeholder={t.transactionMemo}
                  />
                </IonItem>

                <IonButton
                  className="action-button primary"
                  onClick={handleSendTransaction}
                  disabled={!sendAddress || !sendAmount}
                  expand="block"
                  style={{ marginTop: '20px' }}
                >
                  <IonIcon icon={send} slot="start" />
                  {t.sendTransaction}
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

        {/* Network Selection Alert */}
        <IonAlert
          isOpen={showNetworkAlert}
          onDidDismiss={() => setShowNetworkAlert(false)}
          header={t.selectNetwork}
          buttons={[
            {
              text: t.cancel,
              role: 'cancel',
            },
            {
              text: t.mainnet,
              handler: () => switchNetwork('mainnet-beta'),
            },
            {
              text: t.testnet,
              handler: () => switchNetwork('testnet'),
            },
            {
              text: t.devnet,
              handler: () => switchNetwork('devnet'),
            },
          ]}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />

        <IonLoading isOpen={refreshing} message={t.refreshing} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
