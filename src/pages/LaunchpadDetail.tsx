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
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { usePoolDetail } from '../hooks/usePools';
import { useLivePool } from '../hooks/useLiveUpdates';
import { useUIStore } from '../lib/stores/useUIStore';
import { useMarketStore } from '../lib/stores/useMarketStore';
import GlobalSettingsButton from '../components/settings/GlobalSettingsButton';
import LastUpdated from '../components/launchpad/LastUpdated';
import './LaunchpadDetail.css';

const LaunchpadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pool, isLoading } = usePoolDetail(id);
  const openParticipationModal = useUIStore((state) => state.openParticipationModal);

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
          {/* Hero Section */}
          <IonCard className="pool-detail-hero">
            <IonCardHeader>
              <div className="pool-detail-header">
                <div>
                  <IonCardTitle>{displayPool.name}</IonCardTitle>
                  <p className="pool-detail-symbol">{displayPool.symbol}</p>
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
                      <div className="stat-label">Min/Max</div>
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
