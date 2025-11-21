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
import Tooltip from '../components/launchpad/Tooltip';
import ChangeIndicator from '../components/launchpad/ChangeIndicator';
import TrendChart from '../components/launchpad/TrendChart';
import { useTranslation } from '../lib/i18n/useTranslation';
import './LaunchpadDetail.css';
import { getTokenInitials } from '../lib/utils/text';
import { calculatePercentageChange } from '../lib/utils/changeCalculators';

interface RefreshOption {
  label: string;
  value: number;
}

const LaunchpadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslation();
  const { data: pool, isLoading, refetch, isFetching } = usePoolDetail(id);
  const openParticipationModal = useUIStore((state) => state.openParticipationModal);
  const addToast = useUIStore((state) => state.addToast);
  const [selectedRefreshInterval, setSelectedRefreshInterval] = React.useState<number>(0);
  const [isManualRefreshActive, setIsManualRefreshActive] = React.useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<number | undefined>();
  const [isHeroImageBroken, setIsHeroImageBroken] = React.useState(false);
  const refreshOptions = React.useMemo<RefreshOption[]>(
    () => [
      { label: t.refreshIntervalOff, value: 0 },
      { label: t.refreshInterval5s, value: 5000 },
      { label: t.refreshInterval15s, value: 15000 },
      { label: t.refreshInterval60s, value: 60000 },
      { label: t.refreshInterval10m, value: 600000 },
    ],
    [t]
  );

  // Subscribe to live updates for this pool
  useLivePool(id);

  // Get live-updated pool data from store (if available)
  const livePoolsFromStore = useMarketStore((state) => state.pools) || [];
  const livePool = livePoolsFromStore.find((p) => p.id === id);

  // Merge live updates with pool detail data (price, tvl updates from WebSocket)
  // Keep pool detail structure but update live fields
  const displayPool = pool
    ? {
        ...pool,
        ...(livePool && {
          ...(livePool.tokenPrice !== undefined && { tokenPrice: livePool.tokenPrice }),
          ...(livePool.tvl !== undefined && { tvl: livePool.tvl }),
          ...(livePool.currentAmount !== undefined && { currentAmount: livePool.currentAmount }),
          ...(livePool.progress !== undefined && { progress: livePool.progress }),
          ...(livePool.participants !== undefined && { participants: livePool.participants }),
          // Include historical data for change tracking
          ...(livePool.previousPrice !== undefined && { previousPrice: livePool.previousPrice }),
          ...(livePool.previousTvl !== undefined && { previousTvl: livePool.previousTvl }),
          ...(livePool.previousParticipants !== undefined && {
            previousParticipants: livePool.previousParticipants,
          }),
          ...(livePool.previousProgress !== undefined && {
            previousProgress: livePool.previousProgress,
          }),
          ...(livePool.priceHistory && { priceHistory: livePool.priceHistory }),
          ...(livePool.tvlHistory && { tvlHistory: livePool.tvlHistory }),
          ...(livePool.participantsHistory && {
            participantsHistory: livePool.participantsHistory,
          }),
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

  const getStatusLabel = React.useCallback(
    (status: string) => {
      switch (status) {
        case 'active':
          return t.active;
        case 'upcoming':
          return t.upcoming;
        case 'finished':
          return t.finished;
        default:
          return status;
      }
    },
    [t]
  );

  const formatNumber = (num: string) => {
    return parseFloat(num).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const formatPrice = (price: string | undefined): string => {
    if (!price || price === 'undefined' || isNaN(parseFloat(price))) {
      return '$0.0000';
    }
    return `$${parseFloat(price).toFixed(4)}`;
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
        message: t.manualRefreshError,
      });
    } finally {
      setIsManualRefreshActive(false);
    }
  }, [addToast, isManualRefreshActive, refetch, t]);

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
        <IonHeader className="launchpad-detail-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/launchpad" />
            </IonButtons>
            <IonTitle>{t.loading}</IonTitle>
            <GlobalSettingsButton />
          </IonToolbar>
        </IonHeader>
        <IonContent className="launchpad-detail-content">
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
        <IonHeader className="launchpad-detail-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/launchpad" />
            </IonButtons>
            <IonTitle>{t.poolNotFound}</IonTitle>
            <GlobalSettingsButton />
          </IonToolbar>
        </IonHeader>
        <IonContent className="launchpad-detail-content">
          <div className="pool-detail-error">
            <IonText color="danger">
              <h2>{t.poolNotFound}</h2>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="launchpad-detail-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/launchpad" />
          </IonButtons>
          <IonTitle>{displayPool.symbol}</IonTitle>
          <GlobalSettingsButton />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="launchpad-detail-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{displayPool.symbol}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="pool-detail-container">
          <div className="pool-refresh-controls">
            <div className="pool-refresh-actions">
              <Tooltip content={t.refreshTokenTooltip} position="top">
                <IonButton
                  color="primary"
                  onClick={handleManualRefresh}
                  disabled={isManualRefreshActive || isFetching}
                  aria-label={t.refreshTokenDetails}
                >
                  {(isManualRefreshActive || isFetching) && (
                    <IonSpinner slot="start" name="crescent" />
                  )}
                  {t.refreshNow}
                </IonButton>
              </Tooltip>
              <IonSelect
                value={selectedRefreshInterval}
                interface="popover"
                aria-label={t.autoRefreshLabel}
                onIonChange={(event) => setSelectedRefreshInterval(event.detail.value)}
              >
                {refreshOptions.map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <LastUpdated
              timestamp={lastRefreshedAt || livePool?.lastUpdated}
              prefix={t.refreshedPrefix}
            />
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
                  <div className="pool-detail-token-info">
                    <IonCardTitle>{displayPool.name}</IonCardTitle>
                    <div className="pool-detail-meta">
                      <p className="pool-detail-symbol">{displayPool.symbol}</p>
                      <IonBadge color={getStatusColor(displayPool.status)}>
                        {getStatusLabel(displayPool.status)}
                      </IonBadge>
                    </div>
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
                  <Tooltip content={t.progressTooltip} position="top">
                    <span>
                      {t.fundingProgress}
                      <LastUpdated timestamp={livePool?.lastUpdated} prefix={t.refreshedPrefix} />
                    </span>
                  </Tooltip>
                  <Tooltip content={t.progressTooltip} position="top">
                    <span className="pool-progress-percentage">
                      {(displayPool.progress * 100).toFixed(0)}%
                    </span>
                  </Tooltip>
                </div>
                <Tooltip content={t.progressTooltip} position="top">
                  <IonProgressBar value={displayPool.progress} color="primary" />
                </Tooltip>
                <div className="pool-progress-amounts">
                  <Tooltip
                    content={`${t.currentAmountTooltip}: $${formatNumber(displayPool.currentAmount)}`}
                    position="top"
                  >
                    <span className="pool-amount-raised">
                      ${formatNumber(displayPool.currentAmount)}
                    </span>
                  </Tooltip>
                  <Tooltip
                    content={`${t.targetAmountTooltip}: $${formatNumber(displayPool.targetAmount)}`}
                    position="top"
                  >
                    <span className="pool-amount-target">
                      / ${formatNumber(displayPool.targetAmount)}
                    </span>
                  </Tooltip>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Contract Address Card */}
          <IonCard>
            <IonCardHeader>
              <Tooltip content={t.contractTooltip} position="bottom">
                <IonCardTitle>{t.contractAddress}</IonCardTitle>
              </Tooltip>
            </IonCardHeader>
            <IonCardContent>
              <div className="contract-address-container">
                <Tooltip content={t.contractTooltip} position="top">
                  <code className="contract-address-code">{displayPool.id}</code>
                </Tooltip>
                <div className="contract-address-actions">
                  <Tooltip content={t.copyTooltip} position="top">
                    <IonButton
                      size="small"
                      fill="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(displayPool.id);
                      }}
                    >
                      {t.copy}
                    </IonButton>
                  </Tooltip>
                  <Tooltip content={t.viewOnSolscan} position="top">
                    <IonButton
                      size="small"
                      fill="solid"
                      onClick={() => {
                        window.open(`https://solscan.io/token/${displayPool.id}`, '_blank');
                      }}
                    >
                      {t.viewOnSolscan}
                    </IonButton>
                  </Tooltip>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Stats Grid */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{t.statistics}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <div className="stat-item">
                      <Tooltip content={t.tokenPrice} position="top">
                        <div className="stat-label">{t.tokenPrice}</div>
                      </Tooltip>
                      <Tooltip content={t.tokenPrice} position="top">
                        <div className="stat-value">
                          <div className="value-with-change">
                            <span>{formatPrice(displayPool.tokenPrice)}</span>
                            {displayPool.previousPrice && livePool?.lastUpdated && (
                              <ChangeIndicator
                                change={calculatePercentageChange(
                                  displayPool.tokenPrice,
                                  displayPool.previousPrice
                                )}
                                size="medium"
                                showPercent={true}
                                showArrow={true}
                              />
                            )}
                          </div>
                          <LastUpdated timestamp={livePool?.lastUpdated} prefix="" />
                        </div>
                      </Tooltip>
                      {displayPool.priceHistory &&
                        displayPool.priceHistory.length > 2 &&
                        (() => {
                          const history = displayPool.priceHistory;
                          const data =
                            Array.isArray(history) && typeof history[0] === 'object'
                              ? (history as Array<{ price: number }>).map((p) => p.price)
                              : (history as number[]);
                          return <TrendChart data={data} height={30} />;
                        })()}
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="stat-item">
                      <Tooltip content={t.tvlTooltip} position="top">
                        <div className="stat-label">{t.totalValueLocked}</div>
                      </Tooltip>
                      <Tooltip content={t.tvlTooltip} position="top">
                        <div className="stat-value">
                          <div className="value-with-change">
                            <span>${formatNumber(displayPool.tvl)}</span>
                            {displayPool.previousTvl && livePool?.lastUpdated && (
                              <ChangeIndicator
                                change={calculatePercentageChange(
                                  displayPool.tvl,
                                  displayPool.previousTvl
                                )}
                                size="medium"
                                showPercent={true}
                                showArrow={true}
                              />
                            )}
                          </div>
                          <LastUpdated timestamp={livePool?.lastUpdated} prefix="" />
                        </div>
                      </Tooltip>
                      {displayPool.tvlHistory && displayPool.tvlHistory.length > 2 && (
                        <TrendChart data={displayPool.tvlHistory} height={30} />
                      )}
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6">
                    <div className="stat-item">
                      <Tooltip content={t.holdersTooltip} position="top">
                        <div className="stat-label">{t.participants}</div>
                      </Tooltip>
                      <Tooltip content={t.holdersTooltip} position="top">
                        <div className="stat-value">
                          <div className="value-with-change">
                            <span>{displayPool.participants.toLocaleString()}</span>
                            {displayPool.previousParticipants !== undefined &&
                              livePool?.lastUpdated && (
                                <ChangeIndicator
                                  change={calculatePercentageChange(
                                    displayPool.participants,
                                    displayPool.previousParticipants
                                  )}
                                  size="medium"
                                  showPercent={true}
                                  showArrow={true}
                                />
                              )}
                          </div>
                          <LastUpdated timestamp={livePool?.lastUpdated} prefix="" />
                        </div>
                      </Tooltip>
                      {displayPool.participantsHistory &&
                        displayPool.participantsHistory.length > 2 && (
                          <TrendChart data={displayPool.participantsHistory} height={30} />
                        )}
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="stat-item">
                      <Tooltip
                        content={`${t.targetAmountTooltip}: $${formatNumber(displayPool.targetAmount)}`}
                        position="top"
                      >
                        <div className="stat-label">{t.targetAmount}</div>
                      </Tooltip>
                      <Tooltip
                        content={`${t.targetAmountTooltip}: $${formatNumber(displayPool.targetAmount)}`}
                        position="top"
                      >
                        <div className="stat-value">${formatNumber(displayPool.targetAmount)}</div>
                      </Tooltip>
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6">
                    <div className="stat-item">
                      <Tooltip
                        content={`${t.currentAmountTooltip}: $${formatNumber(displayPool.currentAmount)}`}
                        position="top"
                      >
                        <div className="stat-label">{t.currentAmount}</div>
                      </Tooltip>
                      <Tooltip
                        content={`${t.currentAmountTooltip}: $${formatNumber(displayPool.currentAmount)}`}
                        position="top"
                      >
                        <div className="stat-value">${formatNumber(displayPool.currentAmount)}</div>
                      </Tooltip>
                    </div>
                  </IonCol>
                  <IonCol size="6">
                    <div className="stat-item">
                      <Tooltip content={t.minMaxParticipation} position="top">
                        <div className="stat-label">{t.minMaxParticipation}</div>
                      </Tooltip>
                      <Tooltip
                        content={`${t.minimumLabel}: $${displayPool.minParticipation || '10'}, ${t.maximumLabel}: $${displayPool.maxParticipation || '10K'}`}
                        position="top"
                      >
                        <div className="stat-value">
                          ${displayPool.minParticipation || '10'} - $
                          {displayPool.maxParticipation || '10K'}
                        </div>
                      </Tooltip>
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
                <IonCardTitle>{t.tradingActivity}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    {displayPool.buys !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <Tooltip content={t.buysTooltip} position="top">
                            <div className="stat-label">{t.buys}</div>
                          </Tooltip>
                          <Tooltip content={t.buysTooltip} position="top">
                            <div
                              className="stat-value"
                              style={{ color: 'var(--ion-color-success)' }}
                            >
                              {displayPool.buys.toLocaleString()}
                            </div>
                          </Tooltip>
                        </div>
                      </IonCol>
                    )}
                    {displayPool.sells !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <Tooltip content={t.sellsTooltip} position="top">
                            <div className="stat-label">{t.sells}</div>
                          </Tooltip>
                          <Tooltip content={t.sellsTooltip} position="top">
                            <div
                              className="stat-value"
                              style={{ color: 'var(--ion-color-danger)' }}
                            >
                              {displayPool.sells.toLocaleString()}
                            </div>
                          </Tooltip>
                        </div>
                      </IonCol>
                    )}
                  </IonRow>
                  <IonRow>
                    {displayPool.txCount !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <Tooltip content={t.totalTransactionsTooltip} position="top">
                            <div className="stat-label">{t.totalTransactions}</div>
                          </Tooltip>
                          <Tooltip content={t.totalTransactionsTooltip} position="top">
                            <div className="stat-value">{displayPool.txCount.toLocaleString()}</div>
                          </Tooltip>
                        </div>
                      </IonCol>
                    )}
                    {displayPool.volumeSol !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <Tooltip content={t.volumeTooltip} position="top">
                            <div className="stat-label">{t.volumeSol}</div>
                          </Tooltip>
                          <Tooltip content={t.volumeTooltip} position="top">
                            <div className="stat-value">
                              {displayPool.volumeSol.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}{' '}
                              SOL
                            </div>
                          </Tooltip>
                        </div>
                      </IonCol>
                    )}
                  </IonRow>
                  {displayPool.volumeUsd !== undefined && (
                    <IonRow>
                      <IonCol size="12">
                        <div className="stat-item">
                          <Tooltip content={t.volumeTooltip} position="top">
                            <div className="stat-label">{t.volumeUsd}</div>
                          </Tooltip>
                          <Tooltip content={t.volumeTooltip} position="top">
                            <div className="stat-value">
                              $
                              {displayPool.volumeUsd.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </Tooltip>
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
                <IonCardTitle>{t.tokenEconomics}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    {displayPool.supply && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <Tooltip content={t.totalSupplyTooltip} position="top">
                            <div className="stat-label">{t.totalSupply}</div>
                          </Tooltip>
                          <Tooltip content={t.totalSupplyTooltip} position="top">
                            <div className="stat-value">
                              {(
                                displayPool.supply / Math.pow(10, displayPool.decimals || 0)
                              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                          </Tooltip>
                        </div>
                      </IonCol>
                    )}
                    {displayPool.decimals !== undefined && (
                      <IonCol size="6">
                        <div className="stat-item">
                          <Tooltip content={t.decimalsTooltip} position="top">
                            <div className="stat-label">{t.decimalsLabel}</div>
                          </Tooltip>
                          <Tooltip content={t.decimalsTooltip} position="top">
                            <div className="stat-value">{displayPool.decimals}</div>
                          </Tooltip>
                        </div>
                      </IonCol>
                    )}
                  </IonRow>
                  {displayPool.tokenType && (
                    <IonRow>
                      <IonCol size="12">
                        <div className="stat-item">
                          <Tooltip content={t.tokenTypeTooltip} position="top">
                            <div className="stat-label">{t.tokenTypeLabel}</div>
                          </Tooltip>
                          <Tooltip content={t.tokenTypeTooltip} position="top">
                            <div className="stat-value">{displayPool.tokenType}</div>
                          </Tooltip>
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
                <IonCardTitle>{t.poolAndCreator}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {displayPool.pool && (
                  <div style={{ marginBottom: '16px' }}>
                    <Tooltip content={t.poolAddressTooltip} position="top">
                      <div className="stat-label" style={{ marginBottom: '8px' }}>
                        {t.poolAddress}
                      </div>
                    </Tooltip>
                    <div className="pool-address-container">
                      <Tooltip content={t.poolAddressTooltip} position="top">
                        <code className="pool-address-code">{displayPool.pool}</code>
                      </Tooltip>
                      <Tooltip content={t.copyTooltip} position="top">
                        <IonButton
                          size="small"
                          fill="clear"
                          onClick={() => {
                            if (!displayPool.pool) {
                              return;
                            }
                            navigator.clipboard.writeText(displayPool.pool);
                          }}
                        >
                          {t.copy}
                        </IonButton>
                      </Tooltip>
                    </div>
                  </div>
                )}
                {displayPool.creator && (
                  <div>
                    <Tooltip content={t.creatorTooltip} position="top">
                      <div className="stat-label" style={{ marginBottom: '8px' }}>
                        {t.creator}
                      </div>
                    </Tooltip>
                    <div className="pool-address-container">
                      <Tooltip content={t.creatorTooltip} position="top">
                        <code className="pool-address-code">{displayPool.creator}</code>
                      </Tooltip>
                      <Tooltip content={t.copyTooltip} position="top">
                        <IonButton
                          size="small"
                          fill="clear"
                          onClick={() => {
                            if (!displayPool.creator) {
                              return;
                            }
                            navigator.clipboard.writeText(displayPool.creator);
                          }}
                        >
                          {t.copy}
                        </IonButton>
                      </Tooltip>
                      <Tooltip content={t.viewOnSolscan} position="top">
                        <IonButton
                          size="small"
                          fill="clear"
                          onClick={() =>
                            window.open(
                              `https://solscan.io/account/${displayPool.creator}`,
                              '_blank'
                            )
                          }
                        >
                          {t.view}
                        </IonButton>
                      </Tooltip>
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
                    {t.holders} ({pool.holders?.length || displayPool.topHoldersList?.length || 0})
                  </IonCardTitle>
                  <IonBadge color="primary">
                    {t.totalLabel} {displayPool.participants.toLocaleString()}
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
                          {t.holdersClickHint}
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
                          {t.tokenUnit}
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
                <IonCardTitle>{t.socialLinks}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {displayPool.websiteUrl && (
                    <Tooltip content={t.visitWebsite} position="top">
                      <IonButton
                        expand="block"
                        fill="outline"
                        onClick={() => window.open(displayPool.websiteUrl, '_blank')}
                      >
                        {t.website}
                      </IonButton>
                    </Tooltip>
                  )}
                  {displayPool.twitterUrl && (
                    <Tooltip content={t.visitTwitter} position="top">
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="primary"
                        onClick={() => window.open(displayPool.twitterUrl, '_blank')}
                      >
                        {t.twitter}
                      </IonButton>
                    </Tooltip>
                  )}
                  {displayPool.telegramUrl && (
                    <Tooltip content={t.visitTelegram} position="top">
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="secondary"
                        onClick={() => window.open(displayPool.telegramUrl, '_blank')}
                      >
                        {t.telegram}
                      </IonButton>
                    </Tooltip>
                  )}
                  {displayPool.discordUrl && (
                    <Tooltip content={t.visitDiscord} position="top">
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="tertiary"
                        onClick={() => window.open(displayPool.discordUrl, '_blank')}
                      >
                        {t.discord}
                      </IonButton>
                    </Tooltip>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Timeline */}
          {displayPool.timeline && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{t.timeline}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="timeline-item">
                  <Tooltip content={t.startDate} position="top">
                    <span className="timeline-label">{`${t.startDate}:`}</span>
                  </Tooltip>
                  <Tooltip content={t.startDate} position="top">
                    <span className="timeline-value">
                      {formatDate(displayPool.timeline.startDate)}
                    </span>
                  </Tooltip>
                </div>
                <div className="timeline-item">
                  <Tooltip content={t.endDate} position="top">
                    <span className="timeline-label">{`${t.endDate}:`}</span>
                  </Tooltip>
                  <Tooltip content={t.endDate} position="top">
                    <span className="timeline-value">
                      {formatDate(displayPool.timeline.endDate)}
                    </span>
                  </Tooltip>
                </div>
                {displayPool.timeline.distributionDate && (
                  <div className="timeline-item">
                    <Tooltip content={t.distribution} position="top">
                      <span className="timeline-label">{`${t.distribution}:`}</span>
                    </Tooltip>
                    <Tooltip content={t.distribution} position="top">
                      <span className="timeline-value">
                        {formatDate(displayPool.timeline.distributionDate)}
                      </span>
                    </Tooltip>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          )}

          {/* FAQ */}
          {displayPool.faq && displayPool.faq.length > 0 && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{t.faq}</IonCardTitle>
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
                {t.participateInPool}
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LaunchpadDetail;
