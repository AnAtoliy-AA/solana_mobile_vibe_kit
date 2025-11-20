// Launchpad main page - Modern dashboard with table view

import React, { useState, useMemo, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  trendingUpOutline,
  copyOutline,
  openOutline,
  logoTwitter,
  globeOutline,
  swapHorizontalOutline,
  timeOutline,
} from 'ionicons/icons';
import { usePoolListInfinite } from '../hooks/usePools';
import { useLiveActivity } from '../hooks/useLiveUpdates';
import { useMarketStore } from '../lib/stores/useMarketStore';
import type { PoolWithTimestamp } from '../lib/stores/useMarketStore';
import { useTranslation } from '../lib/i18n/useTranslation';
import Tooltip from '../components/launchpad/Tooltip';
import LastUpdated from '../components/launchpad/LastUpdated';
import GlobalSettingsButton from '../components/settings/GlobalSettingsButton';
import './Launchpad.css';

const Launchpad: React.FC = () => {
  const history = useHistory();
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'finished'>('all');
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Enable live activity feed updates
  useLiveActivity();

  const status = activeTab === 'all' ? undefined : activeTab;
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    usePoolListInfinite(status);

  // Flatten all pages into single array
  const pools = React.useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  // Get live-updated pools from market store (merged with API data)
  const livePoolsFromStore = useMarketStore((state) => state.pools);
  const setPools = useMarketStore((state) => state.setPools);

  // Sync API pools to store when they load
  useEffect(() => {
    if (pools && pools.length > 0) {
      setPools(pools);
    }
  }, [pools, setPools]);

  // Infinite scroll: Intersection Observer to detect when user scrolls to bottom
  useEffect(() => {
    // Check if IntersectionObserver is available (not available in tests)
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before reaching bottom
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Merge API pools with live WebSocket updates from store
  const mergedPools = useMemo(() => {
    if (!pools) return livePoolsFromStore;

    // If store has no updates, return API pools as-is
    if (livePoolsFromStore.length === 0) return pools;

    // Create a set to track which pools we've already included
    const includedPoolIds = new Set<string>();
    const result: PoolWithTimestamp[] = [];

    // First, add all store pools (they have the latest data, including new WebSocket tokens)
    livePoolsFromStore.forEach((storePool) => {
      result.push(storePool);
      includedPoolIds.add(storePool.id);
    });

    // Then, add API pools that aren't in the store yet
    pools.forEach((apiPool) => {
      if (!includedPoolIds.has(apiPool.id)) {
        // Convert Pool to PoolWithTimestamp
        const poolWithTimestamp: PoolWithTimestamp = {
          ...apiPool,
          createdAt: apiPool.createdAt ? new Date(apiPool.createdAt).getTime() : undefined,
        };
        result.push(poolWithTimestamp);
      }
    });

    return result;
  }, [pools, livePoolsFromStore]);

  const handleRefresh = async (event: CustomEvent) => {
    await refetch();
    event.detail.complete();
  };

  const handlePoolClick = (poolId: string) => {
    history.push(`/launchpad/${poolId}`);
  };

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  const openBlockExplorer = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://solscan.io/token/${address}`, '_blank');
  };

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getFullNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins}${t.minutesAgo}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}${t.hoursAgo}`;
    return `${Math.floor(diffHours / 24)}${t.daysAgo}`;
  };

  const filteredPools = (mergedPools as PoolWithTimestamp[])?.filter((pool: PoolWithTimestamp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pool.name.toLowerCase().includes(query) ||
      pool.symbol.toLowerCase().includes(query) ||
      pool.id.toLowerCase().includes(query)
    );
  });

  return (
    <IonPage>
      <IonHeader className="launchpad-header">
        <IonToolbar className="launchpad-navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <span className="brand-icon">🚀</span>
              <span className="brand-text">Meme Launchpad</span>
            </div>
            <IonButtons className="navbar-menu">
              <IonButton onClick={() => history.push('/launchpad')} className="nav-btn">
                {t.home}
              </IonButton>
              <IonButton className="nav-btn">{t.createMeme}</IonButton>
              <IonButton className="nav-btn">
                <IonIcon icon={logoTwitter} slot="start" />
                {t.mentionsOnX}
              </IonButton>
              <GlobalSettingsButton className="nav-btn" />
              <IonButton className="nav-btn nav-btn-login" fill="solid" color="primary">
                {t.login}
              </IonButton>
            </IonButtons>
          </div>
        </IonToolbar>

        <IonToolbar className="launchpad-search-toolbar">
          <div className="search-container">
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(e.detail.value || '')}
              placeholder={t.searchPlaceholder}
              className="modern-searchbar"
              animated
            />
          </div>
        </IonToolbar>

        <IonToolbar className="launchpad-tabs-toolbar">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              {t.allTokens}
            </button>
            <button
              className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              {t.active}
            </button>
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              {t.upcoming}
            </button>
            <button
              className={`tab-btn ${activeTab === 'finished' ? 'active' : ''}`}
              onClick={() => setActiveTab('finished')}
            >
              {t.finished}
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="launchpad-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="dashboard-container">
          {isLoading ? (
            <div className="loading-state">
              <IonSpinner name="crescent" color="primary" />
              <IonText color="medium">
                <p>{t.loadingTokens}</p>
              </IonText>
            </div>
          ) : filteredPools && filteredPools.length > 0 ? (
            <div className="table-wrapper">
              <div className="table-scroll-wrapper">
                <table className="tokens-table">
                  <thead>
                    <tr>
                      <th>
                        <Tooltip content={t.tokenTooltip} position="bottom">
                          {t.token}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.contractTooltip} position="bottom">
                          {t.contractAddress}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.volumeTooltip} position="bottom">
                          {t.volume24h}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.marketCapTooltip} position="bottom">
                          {t.marketCap}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.progressTooltip} position="bottom">
                          {t.progress}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.holdersTooltip} position="bottom">
                          {t.holders}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.timeTooltip} position="bottom">
                          {t.time}
                        </Tooltip>
                      </th>
                      <th>
                        <Tooltip content={t.actionsTooltip} position="bottom">
                          {t.actions}
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPools.map((pool: PoolWithTimestamp) => (
                      <tr
                        key={pool.id}
                        className="token-row"
                        onClick={() => handlePoolClick(pool.id)}
                      >
                        <td className="token-info">
                          <Tooltip
                            content={`${pool.name} (${pool.symbol})\nClick to view details`}
                            position="bottom"
                          >
                            <div className="token-name-cell">
                              {pool.imageUrl ? (
                                <img src={pool.imageUrl} alt={pool.symbol} className="token-icon" />
                              ) : (
                                <div className="token-icon token-icon-placeholder">
                                  {pool.symbol?.charAt(0) || '?'}
                                </div>
                              )}
                              <div>
                                <div className="token-name">{pool.name}</div>
                                <div className="token-symbol">{pool.symbol}</div>
                              </div>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="contract-address">
                          <Tooltip
                            content={`Full Address:\n${pool.id}\n\nClick icons to copy or view on blockchain explorer`}
                            position="bottom"
                          >
                            <div className="address-cell">
                              <span className="address-text">{formatAddress(pool.id)}</span>
                              <Tooltip content={t.copyTooltip} position="bottom">
                                <IonIcon
                                  icon={copyOutline}
                                  className="action-icon"
                                  onClick={(e) => copyToClipboard(pool.id, e)}
                                />
                              </Tooltip>
                              <Tooltip content={t.viewOnSolscan} position="bottom">
                                <IonIcon
                                  icon={openOutline}
                                  className="action-icon"
                                  onClick={(e) => openBlockExplorer(pool.id, e)}
                                />
                              </Tooltip>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="volume">
                          <Tooltip
                            content={`24h Trading Volume\n\nTotal: ${getFullNumber(pool.tvl)}\nChange: +12.5% from previous 24h`}
                            position="bottom"
                          >
                            <div className="metric-cell">
                              <span className="metric-value">{formatNumber(pool.tvl)}</span>
                              <span className="metric-change positive">
                                <IonIcon icon={trendingUpOutline} />
                                +12.5%
                              </span>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="market-cap">
                          <Tooltip
                            content={`Market Capitalization\n\nTotal value of all tokens in circulation\n\nFull amount: ${getFullNumber(pool.tvl)}${pool.lastUpdated ? `\n\nLast updated: ${new Date(pool.lastUpdated).toLocaleString()}` : ''}${pool.createdAt ? `\nAdded: ${new Date(pool.createdAt).toLocaleString()}` : ''}`}
                            position="bottom"
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                              }}
                            >
                              <span className="metric-value bold">{formatNumber(pool.tvl)}</span>
                              {pool.lastUpdated && (
                                <LastUpdated timestamp={pool.lastUpdated} prefix="Updated" />
                              )}
                              {pool.createdAt && !pool.lastUpdated && (
                                <LastUpdated timestamp={pool.createdAt} prefix="Since" />
                              )}
                            </div>
                          </Tooltip>
                        </td>
                        <td className="progress">
                          <Tooltip
                            content={`Launch Progress\n\nRaised: ${getFullNumber(pool.currentAmount)}\nTarget: ${getFullNumber(pool.targetAmount)}\nCompletion: ${(pool.progress * 100).toFixed(1)}%`}
                            position="bottom"
                          >
                            <div className="progress-cell">
                              <div className="progress-bar-container">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${pool.progress * 100}%` }}
                                />
                              </div>
                              <span className="progress-text">
                                {(pool.progress * 100).toFixed(0)}%
                              </span>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="holders">
                          <Tooltip
                            content={`Token Holders\n\nTotal unique wallet addresses holding this token\n\nCurrent count: ${pool.participants.toLocaleString()} holders${pool.lastUpdated ? `\n\nLast updated: ${new Date(pool.lastUpdated).toLocaleString()}` : ''}${pool.createdAt ? `\nAdded: ${new Date(pool.createdAt).toLocaleString()}` : ''}`}
                            position="bottom"
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                              }}
                            >
                              <span className="metric-value">
                                {pool.participants.toLocaleString()}
                              </span>
                              {pool.lastUpdated && (
                                <LastUpdated timestamp={pool.lastUpdated} prefix="Updated" />
                              )}
                              {pool.createdAt && !pool.lastUpdated && (
                                <LastUpdated timestamp={pool.createdAt} prefix="Since" />
                              )}
                            </div>
                          </Tooltip>
                        </td>
                        <td className="time">
                          <Tooltip
                            content={`Launch Time\n\nStarted: ${new Date(pool.startTime).toLocaleString()}\nTime ago: ${getTimeAgo(pool.startTime)}`}
                            position="bottom"
                          >
                            <div className="time-cell">
                              <IonIcon icon={timeOutline} className="time-icon" />
                              <span>{getTimeAgo(pool.startTime)}</span>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="actions">
                          <div className="action-buttons">
                            <Tooltip content={t.tradeTooltip} position="bottom">
                              <IonButton
                                size="small"
                                fill="solid"
                                color="success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <IonIcon icon={swapHorizontalOutline} slot="start" />
                                {t.trade}
                              </IonButton>
                            </Tooltip>
                            {pool.twitterUrl && (
                              <Tooltip content={t.visitTwitter} position="bottom">
                                <IonButton
                                  size="small"
                                  fill="clear"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(pool.twitterUrl, '_blank');
                                  }}
                                >
                                  <IonIcon icon={logoTwitter} />
                                </IonButton>
                              </Tooltip>
                            )}
                            {pool.websiteUrl && (
                              <Tooltip content={t.visitWebsite} position="bottom">
                                <IonButton
                                  size="small"
                                  fill="clear"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(pool.websiteUrl, '_blank');
                                  }}
                                >
                                  <IonIcon icon={globeOutline} />
                                </IonButton>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Infinite scroll loading indicator */}
              <div
                ref={loadMoreRef}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '32px',
                  minHeight: '100px',
                }}
              >
                {isFetchingNextPage && (
                  <div style={{ textAlign: 'center' }}>
                    <IonSpinner name="crescent" color="primary" />
                    <IonText color="medium">
                      <p style={{ marginTop: '12px' }}>Loading more tokens...</p>
                    </IonText>
                  </div>
                )}
                {!hasNextPage && filteredPools && filteredPools.length > 0 && (
                  <IonText color="medium">
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                      🎉 You&apos;ve reached the end! No more tokens to load.
                    </p>
                  </IonText>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <IonText color="medium">
                <h2>{t.noTokensFound}</h2>
                <p>{t.noTokensFoundDesc}</p>
              </IonText>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Launchpad;
