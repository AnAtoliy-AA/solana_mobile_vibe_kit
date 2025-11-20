// Pool detail page

import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonText,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { usePoolDetail } from '../hooks/usePools';
import { useLivePool } from '../hooks/useLiveUpdates';
import { useUIStore } from '../lib/stores/useUIStore';
import { useMarketStore } from '../lib/stores/useMarketStore';
import GlobalSettingsButton from '../components/settings/GlobalSettingsButton';
import LastUpdated from '../components/launchpad/LastUpdated';
import './LaunchpadDetail.css';
import { getTokenInitials } from '../lib/utils/text';

interface RefreshOption {
  label: string;
  value: number;
}

const refreshOptions: RefreshOption[] = [
  { label: 'Off', value: 0 },
  { label: '5s', value: 5000 },
  { label: '15s', value: 15000 },
  { label: '60s', value: 60000 },
  { label: '10m', value: 600000 },
];

const LaunchpadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pool, isLoading, refetch, isFetching } = usePoolDetail(id);
  const openParticipationModal = useUIStore((state) => state.openParticipationModal);
  const addToast = useUIStore((state) => state.addToast);
  const [selectedRefreshInterval, setSelectedRefreshInterval] = React.useState<number>(0);
  const [isManualRefreshActive, setIsManualRefreshActive] = React.useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<number | undefined>();
  const [isHeroImageBroken, setIsHeroImageBroken] = React.useState(false);

  // Subscribe to live updates for this pool
  useLivePool(id);

  // Get live-updated pool data from store (if available)
  const livePoolsFromStore = useMarketStore((state) => state.pools);
  const livePool = livePoolsFromStore.find((p) => p.id === id);

  // Merge live updates with pool detail data (price, tvl updates from WebSocket)
  // Keep pool detail structure but update live fields
  const displayPool = pool
    ? {
        ...pool,
        ...(livePool && {
          tokenPrice: livePool.tokenPrice,
          tvl: livePool.tvl,
          currentAmount: livePool.currentAmount,
          progress: livePool.progress,
        }),
      }
    : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'warning';
      case 'finished':
        return 'medium';
      default:
        return 'primary';
    }
  };

  const formatNumber = (num: string) => {
    return parseFloat(num).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleManualRefresh = React.useCallback(async () => {
    if (isManualRefreshActive) {
      return;
    }

    setIsManualRefreshActive(true);
    try {
      const result = await refetch();
      if (result.data) {
        setLastRefreshedAt(Date.now());
      }
    } catch (error) {
      console.error('Manual refresh failed', error);
      addToast({
        type: 'error',
        message: 'Unable to refresh token details. Please try again.',
      });
    } finally {
      setIsManualRefreshActive(false);
    }
  }, [addToast, isManualRefreshActive, refetch]);

  React.useEffect(() => {
    if (!selectedRefreshInterval) {
      return;
    }

    const intervalId = setInterval(() => {
      refetch()
        .then((result) => {
          if (result.data) {
            setLastRefreshedAt(Date.now());
          }
        })
        .catch((error) => {
          console.error('Auto refresh failed', error);
        });
    }, selectedRefreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refetch, selectedRefreshInterval]);

  React.useEffect(() => {
    if (!pool) {
      return;
    }
    setLastRefreshedAt(Date.now());
  }, [pool]);

  if (isLoading || !displayPool) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/launchpad" />
            </IonButtons>
            <IonTitle>Loading...</IonTitle>
            <GlobalSettingsButton />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="pool-detail-loading">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!pool) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/launchpad" />
            </IonButtons>
            <IonTitle>Pool Not Found</IonTitle>
            <GlobalSettingsButton />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="pool-detail-error">
            <IonText color="danger">
              <h2>Pool not found</h2>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/launchpad" />
          </IonButtons>
          <IonTitle>{displayPool.symbol}</IonTitle>
          <GlobalSettingsButton />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="pool-detail-container">
          <div className="pool-refresh-controls">
            <div className="pool-refresh-actions">
              <IonButton
                color="primary"
                onClick={handleManualRefresh}
                disabled={isManualRefreshActive || isFetching}
                aria-label="Refresh token details"
              >
                {(isManualRefreshActive || isFetching) && (
                  <IonSpinner slot="start" name="crescent" />
                )}
                Refresh Now
              </IonButton>

              <IonSelect
                value={selectedRefreshInterval}
                interface="popover"
                aria-label="Auto refresh frequency"
                onIonChange={(event) => setSelectedRefreshInterval(event.detail.value)}
              >
                {refreshOptions.map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <LastUpdated timestamp={lastRefreshedAt || livePool?.lastUpdated} prefix="Refreshed" />
          </div>

          {/* Hero Section */}
          <IonCard className="pool-detail-hero">
            <IonCardHeader>
              <div className="pool-detail-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {displayPool.imageUrl && !isHeroImageBroken ? (
                    <img
                      src={displayPool.imageUrl}
                      alt={displayPool.symbol}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                      onError={() => setIsHeroImageBroken(true)}
                    />
                  ) : (
                    <div className="pool-detail-avatar">
                      {getTokenInitials(displayPool.name, displayPool.symbol)}
                    </div>
                  )}
                  <div>
                    <IonCardTitle>{displayPool.name}</IonCardTitle>
                    <p className="pool-detail-symbol">{displayPool.symbol}</p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--ion-color-medium)',
                        marginTop: '4px',
                      }}
                    >
                      {displayPool.id.slice(0, 8)}...{displayPool.id.slice(-6)}
                    </p>
                  </div>
                </div>
                <IonBadge color={getStatusColor(displayPool.status)}>
                  {displayPool.status.toUpperCase()}
                </IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {displayPool.description && (
                <p className="pool-detail-description">{displayPool.description}</p>
              )}

              {/* Tags */}
              {displayPool.tags && displayPool.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {displayPool.tags.map((tag, idx) => (
                    <IonBadge key={idx} color="secondary" style={{ fontSize: '0.75rem' }}>
                      {tag}
                    </IonBadge>
                  ))}
                </div>
              )}

              {/* Progress */}
              <div className="pool-detail-progress">
                <div className="pool-progress-header">
                  <span>
                    Funding Progress
                    <LastUpdated timestamp={livePool?.lastUpdated} />
                  </span>
                  <span className="pool-progress-percentage">
                    {(displayPool.progress * 100).toFixed(0)}%
                  </span>
                </div>
                <IonProgressBar value={displayPool.progress} color="primary" />
                <div className="pool-progress-amounts">
                  <span className="pool-amount-raised">
                    ${formatNumber(displayPool.currentAmount)}
                  </span>
                  <span className="pool-amount-target">
                    / ${formatNumber(displayPool.targetAmount)}
                  </span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Contract Address Card */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Contract Address</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <code
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--ion-color-light)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {displayPool.id}
                </code>
                <IonButton
                  size="small"
                  fill="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(displayPool.id);
                  }}
                >
                  Copy
                </IonButton>
                <IonButton
                  size="small"
                  fill="solid"
                  onClick={() => {
                    window.open(`https://solscan.io/token/${displayPool.id}`, '_blank');
                  }}
                >
                  View on Solscan
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Stats Grid */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Statistics</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <div className="stat-item">
                      <div className="stat-label">Token Price</div>
                      <div className="stat-value">
                        ${displayPool.tokenPrice}
                        <LastUpdated timestamp={livePool?.lastUpdated} prefix="" />
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="stat-item">
                      <div className="stat-label">Total Value Locked</div>
                      <div className="stat-value">
                        ${formatNumber(displayPool.tvl)}
                        <LastUpdated timestamp={livePool?.lastUpdated} prefix="" />
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6">
                    <div className="stat-item">
                      <div className="stat-label">Participants</div>
                      <div className="stat-value">
                        {displayPool.participants.toLocaleString()}
                        <LastUpdated timestamp={livePool?.lastUpdated} prefix="" />
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="stat-item">
                      <div className="stat-label">Target Amount</div>
                      <div className="stat-value">${formatNumber(displayPool.targetAmount)}</div>
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6">
                    <div className="stat-item">
                      <div className="stat-label">Current Amount</div>
                      <div className="stat-value">${formatNumber(displayPool.currentAmount)}</div>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="stat-item">
                      <div className="stat-label">Min/Max Participation</div>
                      <div className="stat-value">
                        ${displayPool.minParticipation || '10'} - $
                        {displayPool.maxParticipation || '10K'}
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Trading Statistics */}
          {(displayPool.buys ||
            displayPool.sells ||
            displayPool.txCount ||
            displayPool.volumeSol) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Trading Activity</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    {displayPool.buys !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <div className="stat-label">Buys</div>
                          <div className="stat-value" style={{ color: 'var(--ion-color-success)' }}>
                            {displayPool.buys.toLocaleString()}
                          </div>
                        </div>
                      </IonCol>
                    )}
                    {displayPool.sells !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <div className="stat-label">Sells</div>
                          <div className="stat-value" style={{ color: 'var(--ion-color-danger)' }}>
                            {displayPool.sells.toLocaleString()}
                          </div>
                        </div>
                      </IonCol>
                    )}
                  </IonRow>
                  <IonRow>
                    {displayPool.txCount !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <div className="stat-label">Total Transactions</div>
                          <div className="stat-value">{displayPool.txCount.toLocaleString()}</div>
                        </div>
                      </IonCol>
                    )}
                    {displayPool.volumeSol !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <div className="stat-label">Volume (SOL)</div>
                          <div className="stat-value">
                            {displayPool.volumeSol.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}{' '}
                            SOL
                          </div>
                        </div>
                      </IonCol>
                    )}
                  </IonRow>
                  {displayPool.volumeUsd !== undefined && (
                    <IonRow>
                      <IonCol size="12">
                        <div className="stat-item">
                          <div className="stat-label">Volume (USD)</div>
                          <div className="stat-value">
                            $
                            {displayPool.volumeUsd.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>
                  )}
                </IonGrid>
              </IonCardContent>
            </IonCard>
          )}

          {/* Token Economics */}
          {(displayPool.supply || displayPool.decimals || displayPool.tokenType) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Token Economics</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    {displayPool.supply && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <div className="stat-label">Total Supply</div>
                          <div className="stat-value">
                            {(
                              displayPool.supply / Math.pow(10, displayPool.decimals || 0)
                            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </IonCol>
                    )}
                    {displayPool.decimals !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <div className="stat-label">Decimals</div>
                          <div className="stat-value">{displayPool.decimals}</div>
                        </div>
                      </IonCol>
                    )}
                  </IonRow>
                  {displayPool.tokenType && (
                    <IonRow>
                      <IonCol size="12">
                        <div className="stat-item">
                          <div className="stat-label">Token Type</div>
                          <div className="stat-value">{displayPool.tokenType}</div>
                        </div>
                      </IonCol>
                    </IonRow>
                  )}
                </IonGrid>
              </IonCardContent>
            </IonCard>
          )}

          {/* Pool & Creator Info */}
          {(displayPool.pool || displayPool.creator) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Pool & Creator</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {displayPool.pool && (
                  <div style={{ marginBottom: '16px' }}>
                    <div className="stat-label" style={{ marginBottom: '8px' }}>
                      Pool Address
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'var(--ion-color-light)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          wordBreak: 'break-all',
                        }}
                      >
                        {displayPool.pool}
                      </code>
                      <IonButton
                        size="small"
                        fill="clear"
                        onClick={() => navigator.clipboard.writeText(displayPool.pool!)}
                      >
                        Copy
                      </IonButton>
                    </div>
                  </div>
                )}
                {displayPool.creator && (
                  <div>
                    <div className="stat-label" style={{ marginBottom: '8px' }}>
                      Creator
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'var(--ion-color-light)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          wordBreak: 'break-all',
                        }}
                      >
                        {displayPool.creator}
                      </code>
                      <IonButton
                        size="small"
                        fill="clear"
                        onClick={() => navigator.clipboard.writeText(displayPool.creator!)}
                      >
                        Copy
                      </IonButton>
                      <IonButton
                        size="small"
                        fill="clear"
                        onClick={() =>
                          window.open(`https://solscan.io/account/${displayPool.creator}`, '_blank')
                        }
                      >
                        View
                      </IonButton>
                    </div>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          )}

          {/* Holders List */}
          {(pool.holders && pool.holders.length > 0) ||
          (displayPool.topHoldersList && displayPool.topHoldersList.length > 0) ? (
            <IonCard>
              <IonCardHeader>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <IonCardTitle>
                    Holders ({pool.holders?.length || displayPool.topHoldersList?.length || 0})
                  </IonCardTitle>
                  <IonBadge color="primary">
                    Total: {displayPool.participants.toLocaleString()}
                  </IonBadge>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {(pool.holders || displayPool.topHoldersList || []).map((holder, idx) => (
                    <div
                      key={holder._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: idx % 2 === 0 ? 'var(--ion-color-light)' : 'transparent',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        window.open(`https://solscan.io/account/${holder.wallet}`, '_blank')
                      }
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '4px' }}
                        >
                          #{idx + 1}
                        </div>
                        <code
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--ion-color-medium)',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          {holder.wallet}
                        </code>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ion-color-medium)' }}>
                          Click to view on Solscan
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--ion-color-primary)',
                          }}
                        >
                          {(holder.percentage * 100).toFixed(2)}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ion-color-medium)' }}>
                          {holder.amount.toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--ion-color-medium)',
                            marginTop: '4px',
                          }}
                        >
                          {displayPool.decimals
                            ? (holder.amount / Math.pow(10, displayPool.decimals)).toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 2,
                                }
                              )
                            : holder.amount.toLocaleString()}{' '}
                          tokens
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          ) : null}

          {/* Social Links */}
          {(displayPool.websiteUrl ||
            displayPool.twitterUrl ||
            displayPool.discordUrl ||
            displayPool.telegramUrl) && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Social Links</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {displayPool.websiteUrl && (
                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={() => window.open(displayPool.websiteUrl, '_blank')}
                    >
                      Website
                    </IonButton>
                  )}
                  {displayPool.twitterUrl && (
                    <IonButton
                      expand="block"
                      fill="outline"
                      color="primary"
                      onClick={() => window.open(displayPool.twitterUrl, '_blank')}
                    >
                      Twitter
                    </IonButton>
                  )}
                  {displayPool.telegramUrl && (
                    <IonButton
                      expand="block"
                      fill="outline"
                      color="secondary"
                      onClick={() => window.open(displayPool.telegramUrl, '_blank')}
                    >
                      Telegram
                    </IonButton>
                  )}
                  {displayPool.discordUrl && (
                    <IonButton
                      expand="block"
                      fill="outline"
                      color="tertiary"
                      onClick={() => window.open(displayPool.discordUrl, '_blank')}
                    >
                      Discord
                    </IonButton>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Timeline */}
          {displayPool.timeline && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Timeline</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="timeline-item">
                  <span className="timeline-label">Start Date:</span>
                  <span className="timeline-value">
                    {formatDate(displayPool.timeline.startDate)}
                  </span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">End Date:</span>
                  <span className="timeline-value">{formatDate(displayPool.timeline.endDate)}</span>
                </div>
                {displayPool.timeline.distributionDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Distribution:</span>
                    <span className="timeline-value">
                      {formatDate(displayPool.timeline.distributionDate)}
                    </span>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          )}

          {/* FAQ */}
          {displayPool.faq && displayPool.faq.length > 0 && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>FAQ</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {displayPool.faq.map((item, index) => (
                  <div key={index} className="faq-item">
                    <h4 className="faq-question">{item.question}</h4>
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                ))}
              </IonCardContent>
            </IonCard>
          )}

          {/* Action Button */}
          {displayPool.status === 'active' && (
            <div className="pool-detail-action">
              <IonButton
                expand="block"
                size="large"
                onClick={() => openParticipationModal(displayPool.id)}
              >
                Participate in Pool
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LaunchpadDetail;
