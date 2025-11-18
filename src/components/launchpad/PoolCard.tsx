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
import './PoolCard.css';

interface PoolCardProps {
  pool: Pool;
  onClick?: () => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onClick }) => {
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
            <span className="pool-stat-label">TVL</span>
            <span className="pool-stat-value">${formatNumber(pool.tvl)}</span>
          </div>
          <div className="pool-stat">
            <span className="pool-stat-label">Price</span>
            <span className="pool-stat-value">{formatPrice(pool.tokenPrice)}</span>
          </div>
          <div className="pool-stat">
            <span className="pool-stat-label">Participants</span>
            <span className="pool-stat-value">{pool.participants}</span>
          </div>
        </div>

        <div className="pool-progress">
          <div className="pool-progress-header">
            <span>Progress</span>
            <span>{(pool.progress * 100).toFixed(0)}%</span>
          </div>
          <IonProgressBar value={pool.progress} color="primary" />
          <div className="pool-progress-amounts">
            <span>${formatNumber(pool.currentAmount)}</span>
            <span className="pool-progress-target">/ ${formatNumber(pool.targetAmount)}</span>
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
