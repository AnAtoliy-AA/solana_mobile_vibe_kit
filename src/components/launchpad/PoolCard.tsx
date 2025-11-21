// Pool card component for market list

import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonProgressBar,
} from '@ionic/react';
import { Pool } from '../../lib/api/types';
import { useTranslation } from '../../lib/i18n/useTranslation';
import Tooltip from './Tooltip';
import './PoolCard.css';

interface PoolCardProps {
  pool: Pool;
  onClick?: () => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onClick }) => {
  const t = useTranslation();

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

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(4)}`;
  };

  return (
    <IonCard button onClick={onClick} className="pool-card">
      <IonCardHeader>
        <div className="pool-card-header">
          <div>
            <IonCardTitle>{pool.name}</IonCardTitle>
            <IonCardSubtitle>{pool.symbol}</IonCardSubtitle>
          </div>
          <IonBadge color={getStatusColor(pool.status)}>{pool.status.toUpperCase()}</IonBadge>
        </div>
      </IonCardHeader>

      <IonCardContent>
        {pool.description && <p className="pool-description">{pool.description}</p>}

        <div className="pool-stats">
          <div className="pool-stat">
            <Tooltip content={t.marketCapTooltip} position="top">
              <span className="pool-stat-label">TVL</span>
            </Tooltip>
            <Tooltip content={t.marketCapTooltip} position="top">
              <span className="pool-stat-value">${formatNumber(pool.tvl)}</span>
            </Tooltip>
          </div>
          <div className="pool-stat">
            <Tooltip content={t.tokenPrice} position="top">
              <span className="pool-stat-label">Price</span>
            </Tooltip>
            <Tooltip content={t.tokenPrice} position="top">
              <span className="pool-stat-value">{formatPrice(pool.tokenPrice)}</span>
            </Tooltip>
          </div>
          <div className="pool-stat">
            <Tooltip content={t.holdersTooltip} position="top">
              <span className="pool-stat-label">Participants</span>
            </Tooltip>
            <Tooltip content={t.holdersTooltip} position="top">
              <span className="pool-stat-value">{pool.participants}</span>
            </Tooltip>
          </div>
        </div>

        <div className="pool-progress">
          <div className="pool-progress-header">
            <Tooltip content={t.progressTooltip} position="top">
              <span>Progress</span>
            </Tooltip>
            <Tooltip content={t.progressTooltip} position="top">
              <span>{(pool.progress * 100).toFixed(0)}%</span>
            </Tooltip>
          </div>
          <Tooltip content={t.progressTooltip} position="top">
            <IonProgressBar value={pool.progress} color="primary" />
          </Tooltip>
          <div className="pool-progress-amounts">
            <Tooltip
              content={`Current amount raised: $${formatNumber(pool.currentAmount)}`}
              position="top"
            >
              <span>${formatNumber(pool.currentAmount)}</span>
            </Tooltip>
            <Tooltip content={`Target amount: $${formatNumber(pool.targetAmount)}`} position="top">
              <span className="pool-progress-target">/ ${formatNumber(pool.targetAmount)}</span>
            </Tooltip>
          </div>
        </div>

        {pool.tags && pool.tags.length > 0 && (
          <div className="pool-tags">
            {pool.tags.map((tag, index) => (
              <IonBadge key={index} color="light" className="pool-tag">
                {tag}
              </IonBadge>
            ))}
          </div>
        )}

        {pool.status === 'active' && (
          <IonButton expand="block" className="pool-action-btn">
            Participate
          </IonButton>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PoolCard;
