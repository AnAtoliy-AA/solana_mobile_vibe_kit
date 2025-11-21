// Optimized Pool Card Component with React.memo

import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import {
  copyOutline,
  openOutline,
  logoTwitter,
  globeOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import type { PoolWithTimestamp } from '../../lib/stores/useMarketStore';
import Tooltip from './Tooltip';
import LastUpdated from './LastUpdated';
import ChangeIndicator from './ChangeIndicator';
import TrendChart from './TrendChart';
import { getTokenInitials } from '../../lib/utils/text';
import { calculatePercentageChange } from '../../lib/utils/changeCalculators';
import { formatNumber, formatAddress, getCreatedAtTimestamp } from '../../lib/utils/formatters';

interface PoolCardProps {
  pool: PoolWithTimestamp;
  onPoolClick: (poolId: string) => void;
  onCopyAddress: (address: string, e: React.MouseEvent) => void;
  onOpenBlockExplorer: (address: string, e: React.MouseEvent) => void;
  onImageError: (poolId: string) => void;
  brokenImages: Record<string, boolean>;
  getTimeAgo: (date: string) => string;
  getStatusLabel: (status: string) => string;
  translations: {
    volume24h: string;
    volumeTooltip: string;
    marketCap: string;
    marketCapTooltip: string;
    holders: string;
    holdersTooltip: string;
    progress: string;
    progressTooltip: string;
    timeTooltip: string;
    copyAddress: string;
    viewOnSolscan: string;
    visitWebsite: string;
    viewOnTwitter: string;
    tradeOnRaydium: string;
  };
}

const PoolCardOptimized: React.FC<PoolCardProps> = React.memo(
  ({
    pool,
    onPoolClick,
    onCopyAddress,
    onOpenBlockExplorer,
    onImageError,
    brokenImages,
    getTimeAgo,
    getStatusLabel,
    translations: t,
  }) => {
    const showPlaceholder = !pool.imageUrl || brokenImages[pool.id];

    return (
      <div
        className="launchpad-card"
        onClick={() => onPoolClick(pool.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPoolClick(pool.id);
          }
        }}
      >
        <div className="card-body">
          <div className="card-header">
            <div className="card-token">
              {showPlaceholder ? (
                <div className="card-token-avatar placeholder">{getTokenInitials(pool.name)}</div>
              ) : (
                <img
                  src={pool.imageUrl}
                  alt={pool.name}
                  className="card-token-avatar"
                  onError={() => onImageError(pool.id)}
                  loading="lazy"
                />
              )}
              <div className="card-token-info">
                <div className="card-token-meta">
                  <h3 className="card-token-name">{pool.name}</h3>
                  <span className={`status-pill status-${pool.status}`}>
                    {getStatusLabel(pool.status)}
                  </span>
                </div>
                <p className="card-token-symbol">{pool.symbol}</p>
              </div>
            </div>
            <div className="card-address">
              <Tooltip content={t.copyAddress} position="top">
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={(e) => onCopyAddress(pool.id, e)}
                  aria-label="Copy address"
                >
                  <IonIcon icon={copyOutline} />
                  <span className="address-text">{formatAddress(pool.id)}</span>
                </IonButton>
              </Tooltip>
              <Tooltip content={t.viewOnSolscan} position="top">
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={(e) => onOpenBlockExplorer(pool.id, e)}
                  aria-label="View on Solscan"
                >
                  <IonIcon icon={openOutline} />
                </IonButton>
              </Tooltip>
            </div>
          </div>

          <div className="card-metrics">
            <div className="metric-block">
              <Tooltip content={t.volumeTooltip} position="top">
                <p className="metric-label">{t.volume24h}</p>
              </Tooltip>
              <Tooltip content={t.volumeTooltip} position="top">
                <p className="metric-value">
                  {pool.volumeUsd && pool.volumeUsd > 0
                    ? formatNumber(pool.volumeUsd)
                    : formatNumber(pool.tvl)}
                </p>
              </Tooltip>
              {pool.lastUpdated && <LastUpdated timestamp={pool.lastUpdated} prefix="Updated" />}
            </div>
            <div className="metric-block">
              <Tooltip content={t.marketCapTooltip} position="top">
                <p className="metric-label">{t.marketCap}</p>
              </Tooltip>
              <Tooltip content={t.marketCapTooltip} position="top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p className="metric-value">{formatNumber(pool.tvl)}</p>
                  {pool.previousTvl && pool.lastUpdated && (
                    <ChangeIndicator
                      change={calculatePercentageChange(pool.tvl, pool.previousTvl)}
                      size="small"
                      showPercent={true}
                      showArrow={true}
                    />
                  )}
                </div>
              </Tooltip>
              {pool.tvlHistory && pool.tvlHistory.length > 2 && (
                <TrendChart data={pool.tvlHistory} height={20} />
              )}
              {(() => {
                if (pool.lastUpdated) {
                  return <LastUpdated timestamp={pool.lastUpdated} prefix="Updated" />;
                }
                const createdAtTimestamp = getCreatedAtTimestamp(pool.createdAt);
                return createdAtTimestamp ? (
                  <LastUpdated timestamp={createdAtTimestamp} prefix="Since" />
                ) : null;
              })()}
            </div>
            <div className="metric-block">
              <Tooltip content={t.holdersTooltip} position="top">
                <p className="metric-label">{t.holders}</p>
              </Tooltip>
              <Tooltip content={t.holdersTooltip} position="top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p className="metric-value">{pool.participants.toLocaleString()}</p>
                  {pool.previousParticipants !== undefined && pool.lastUpdated && (
                    <ChangeIndicator
                      change={calculatePercentageChange(
                        pool.participants,
                        pool.previousParticipants
                      )}
                      size="small"
                      showPercent={true}
                      showArrow={true}
                    />
                  )}
                </div>
              </Tooltip>
              {pool.participantsHistory && pool.participantsHistory.length > 2 && (
                <TrendChart data={pool.participantsHistory} height={20} />
              )}
              {(() => {
                if (pool.lastUpdated) {
                  return <LastUpdated timestamp={pool.lastUpdated} prefix="Updated" />;
                }
                if (pool.startTime) {
                  return (
                    <Tooltip content={t.timeTooltip} position="top">
                      <span className="metric-footnote">{getTimeAgo(pool.startTime)}</span>
                    </Tooltip>
                  );
                }
                return null;
              })()}
            </div>
            <div className="metric-block">
              <Tooltip content={t.progressTooltip} position="top">
                <p className="metric-label">{t.progress}</p>
              </Tooltip>
              <Tooltip content={t.progressTooltip} position="top">
                <p className="metric-value">{(pool.progress * 100).toFixed(0)}%</p>
              </Tooltip>
              <Tooltip content={t.progressTooltip} position="top">
                <div className="card-progress-bar">
                  <div
                    className="card-progress-fill"
                    style={{ width: `${Math.min(pool.progress * 100, 100)}%` }}
                  />
                </div>
              </Tooltip>
              <Tooltip
                content={`Current: ${formatNumber(pool.currentAmount)} / Target: ${formatNumber(pool.targetAmount)}`}
                position="top"
              >
                <p className="metric-footnote">
                  {formatNumber(pool.currentAmount)} / {formatNumber(pool.targetAmount)}
                </p>
              </Tooltip>
            </div>
          </div>

          <div className="card-footer">
            <div className="card-social-links">
              {pool.websiteUrl && (
                <Tooltip content={t.visitWebsite} position="top">
                  <IonButton
                    fill="clear"
                    size="small"
                    href={pool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Visit website"
                  >
                    <IonIcon icon={globeOutline} />
                  </IonButton>
                </Tooltip>
              )}
              {pool.twitterUrl && (
                <Tooltip content={t.viewOnTwitter} position="top">
                  <IonButton
                    fill="clear"
                    size="small"
                    href={pool.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View on Twitter"
                  >
                    <IonIcon icon={logoTwitter} />
                  </IonButton>
                </Tooltip>
              )}
            </div>
            <Tooltip content={t.tradeOnRaydium} position="top">
              <IonButton
                fill="solid"
                size="small"
                color="primary"
                href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${pool.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Trade on Raydium"
              >
                <IonIcon icon={swapHorizontalOutline} slot="start" />
                Trade
              </IonButton>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
      prevProps.pool.id === nextProps.pool.id &&
      prevProps.pool.tvl === nextProps.pool.tvl &&
      prevProps.pool.participants === nextProps.pool.participants &&
      prevProps.pool.progress === nextProps.pool.progress &&
      prevProps.pool.lastUpdated === nextProps.pool.lastUpdated &&
      prevProps.brokenImages[prevProps.pool.id] === nextProps.brokenImages[nextProps.pool.id]
    );
  }
);

PoolCardOptimized.displayName = 'PoolCardOptimized';

export default PoolCardOptimized;
