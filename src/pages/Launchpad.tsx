// Launchpad main page - Modern dashboard with table view

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  copyOutline,
  openOutline,
  logoTwitter,
  globeOutline,
  swapHorizontalOutline,
  timeOutline,
  menuOutline,
  closeOutline,
  settingsOutline,
} from 'ionicons/icons';
import { usePoolListInfinite } from '../hooks/usePools';
import { useLiveActivity } from '../hooks/useLiveUpdates';
import { useMarketStore } from '../lib/stores/useMarketStore';
import type { PoolWithTimestamp } from '../lib/stores/useMarketStore';
import type { Pool } from '../lib/api/types';
import { useTranslation } from '../lib/i18n/useTranslation';
import Tooltip from '../components/launchpad/Tooltip';
import LastUpdated from '../components/launchpad/LastUpdated';
import ChangeIndicator from '../components/launchpad/ChangeIndicator';
import TrendChart from '../components/launchpad/TrendChart';
import GlobalSettingsButton from '../components/settings/GlobalSettingsButton';
import SettingsModal from '../components/settings/SettingsModal';
import './Launchpad.css';
import { getTokenInitials } from '../lib/utils/text';
import { calculatePercentageChange } from '../lib/utils/changeCalculators';
import {
  formatNumber,
  formatAddress,
  getCreatedAtTimestamp,
  parseNumeric,
} from '../lib/utils/formatters';
import { useDebounce } from '../hooks/useDebounce';

type SortOption = 'newest' | 'volume' | 'progress' | 'holders';
type FilterOption = 'all' | 'hasTwitter' | 'hasWebsite' | 'highProgress';

const Launchpad: React.FC = () => {
  const history = useHistory();
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search for performance
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'finished'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enable live activity feed updates
  useLiveActivity();

  const status = activeTab === 'all' ? undefined : activeTab;
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    usePoolListInfinite(status);

  // Flatten all pages into single array and deduplicate by ID
  const pools = React.useMemo(() => {
    const allPools = data?.pages.flat() || [];

    // Deduplicate tokens by ID (keep first occurrence)
    const uniquePoolsMap = new Map<string, Pool>();
    allPools.forEach((pool) => {
      if (!uniquePoolsMap.has(pool.id)) {
        uniquePoolsMap.set(pool.id, pool);
      }
    });

    return Array.from(uniquePoolsMap.values());
  }, [data]);

  // Get live-updated pools from market store (merged with API data)
  // Optimized selectors - only subscribe to specific data
  const livePoolsFromStore = useMarketStore(useCallback((state) => state.pools, []));
  const setPools = useMarketStore(useCallback((state) => state.setPools, []));

  // Sync API pools to store when they load
  useEffect(() => {
    if (pools && pools.length > 0 && typeof setPools === 'function') {
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

  // Merge API pools with live WebSocket updates from store (deduplicated)
  const mergedPools = useMemo(() => {
    const storePools = livePoolsFromStore ?? [];
    if (!pools) {
      return storePools;
    }

    // Use a Map to ensure uniqueness by ID
    const poolMap = new Map<string, PoolWithTimestamp>();

    // First, add all API pools
    pools.forEach((apiPool) => {
      const poolWithTimestamp: PoolWithTimestamp = {
        ...apiPool,
        createdAt: apiPool.createdAt ? new Date(apiPool.createdAt).getTime() : undefined,
      };
      poolMap.set(apiPool.id, poolWithTimestamp);
    });

    // Then, merge in live store pools (they override API data with latest updates)
    storePools.forEach((storePool) => {
      poolMap.set(storePool.id, storePool);
    });

    // Convert map back to array, maintaining insertion order
    return Array.from(poolMap.values());
  }, [pools, livePoolsFromStore]);

  // Memoized event handlers to prevent re-creation on every render
  const handleRefresh = useCallback(
    async (event: CustomEvent) => {
      await refetch();
      event.detail.complete();
    },
    [refetch]
  );

  const handlePoolClick = useCallback(
    (poolId: string) => {
      history.push(`/launchpad/${poolId}`);
    },
    [history]
  );

  const copyToClipboard = useCallback((text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  }, []);

  const handleImageError = useCallback((poolId: string) => {
    setBrokenImages((prev) => ({
      ...prev,
      [poolId]: true,
    }));
  }, []);

  const openBlockExplorer = useCallback((address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://solscan.io/token/${address}`, '_blank');
  }, []);

  // Memoized helper function for time display
  const getTimeAgo = useCallback(
    (date: string) => {
      const now = new Date();
      const past = new Date(date);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return t.justNow;
      if (diffMins < 60) return `${diffMins}${t.minutesAgo}`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}${t.hoursAgo}`;
      return `${Math.floor(diffHours / 24)}${t.daysAgo}`;
    },
    [t]
  );

  // Memoized getStatusLabel function
  const getStatusLabel = useCallback(
    (status: Pool['status']) => {
      if (status === 'active') return t.active;
      if (status === 'upcoming') return t.upcoming;
      if (status === 'finished') return t.finished;
      return status;
    },
    [t]
  );

  // Memoized filtered pools with debounced search
  const filteredPools = useMemo(() => {
    return (mergedPools as PoolWithTimestamp[])?.filter((pool: PoolWithTimestamp) => {
      if (!debouncedSearchQuery) return true;
      const query = debouncedSearchQuery.toLowerCase();
      return (
        pool.name.toLowerCase().includes(query) ||
        pool.symbol.toLowerCase().includes(query) ||
        pool.id.toLowerCase().includes(query)
      );
    });
  }, [mergedPools, debouncedSearchQuery]);

  const applyFilter = useMemo(() => {
    if (!filteredPools) return [];
    return filteredPools.filter((pool) => {
      if (filterOption === 'hasTwitter') {
        return Boolean(pool.twitterUrl);
      }
      if (filterOption === 'hasWebsite') {
        return Boolean(pool.websiteUrl);
      }
      if (filterOption === 'highProgress') {
        return pool.progress >= 0.5;
      }
      return true;
    });
  }, [filteredPools, filterOption]);

  // Memoized sorting of pools (imported parseNumeric from formatters)
  const preparedPools = useMemo(() => {
    return [...applyFilter].sort((a, b) => {
      if (sortOption === 'volume') {
        return parseNumeric(b.tvl) - parseNumeric(a.tvl);
      }
      if (sortOption === 'progress') {
        return (b.progress || 0) - (a.progress || 0);
      }
      if (sortOption === 'holders') {
        return (b.participants || 0) - (a.participants || 0);
      }
      const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
      const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
      return bTime - aTime;
    });
  }, [applyFilter, sortOption]);

  const filterChips = [
    { id: 'all' as FilterOption, label: 'All' },
    { id: 'hasTwitter' as FilterOption, label: 'Has X' },
    { id: 'hasWebsite' as FilterOption, label: 'Has Website' },
    { id: 'highProgress' as FilterOption, label: '50%+ Raised' },
  ];

  const sortChips = [
    { id: 'newest' as SortOption, label: 'Newest' },
    { id: 'volume' as SortOption, label: 'Volume' },
    { id: 'progress' as SortOption, label: 'Progress' },
    { id: 'holders' as SortOption, label: 'Holders' },
  ];

  const handleChipKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, callback: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback();
      }
    },
    []
  );

  return (
    <IonPage>
      <IonHeader className="launchpad-header">
        <IonToolbar className="launchpad-navbar">
          <div className="navbar-content">
            <div className="navbar-brand">
              <span className="brand-icon">🚀</span>
              <span className="brand-text">Meme Launchpad</span>
              <span className="brand-text-mobile">Launchpad</span>
            </div>
            <IonButtons className="navbar-menu">
              <IonButton
                onClick={() => history.push('/launchpad')}
                className="nav-btn nav-btn-desktop"
              >
                {t.home}
              </IonButton>
              <IonButton className="nav-btn nav-btn-desktop" disabled>
                {t.createMeme}
              </IonButton>
              <IonButton className="nav-btn nav-btn-desktop" disabled>
                <IonIcon icon={logoTwitter} slot="start" />
                {t.mentionsOnX}
              </IonButton>
              <GlobalSettingsButton className="nav-btn nav-btn-desktop" />
              <IonButton
                className="nav-btn nav-btn-login nav-btn-desktop"
                fill="solid"
                color="primary"
                disabled
              >
                {t.login}
              </IonButton>
              <IonButton
                className="nav-btn nav-btn-mobile-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <IonIcon icon={isMobileMenuOpen ? closeOutline : menuOutline} />
              </IonButton>
            </IonButtons>
          </div>
          {isMobileMenuOpen && (
            <div className="mobile-menu">
              <IonButton
                onClick={() => {
                  history.push('/launchpad');
                  setIsMobileMenuOpen(false);
                }}
                className="mobile-menu-item"
                fill="clear"
              >
                {t.home}
              </IonButton>
              <IonButton
                className="mobile-menu-item"
                fill="clear"
                disabled
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.createMeme}
              </IonButton>
              <IonButton
                className="mobile-menu-item"
                fill="clear"
                disabled
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IonIcon icon={logoTwitter} slot="start" />
                {t.mentionsOnX}
              </IonButton>
              <IonButton
                className="mobile-menu-item"
                fill="clear"
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <IonIcon icon={settingsOutline} slot="start" />
                {t.settings}
              </IonButton>
              <IonButton
                className="mobile-menu-item mobile-menu-login"
                fill="solid"
                color="primary"
                disabled
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.login}
              </IonButton>
            </div>
          )}
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
          ) : preparedPools && preparedPools.length > 0 ? (
            <>
              <div className="launchpad-controls">
                <div className="controls-group">
                  <span className="controls-label">Sort</span>
                  <div className="chip-group">
                    {sortChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className={`chip ${sortOption === chip.id ? 'active' : ''}`}
                        aria-pressed={sortOption === chip.id}
                        aria-label={`Sort by ${chip.label}`}
                        onClick={() => setSortOption(chip.id)}
                        onKeyDown={(event) =>
                          handleChipKeyDown(event, () => setSortOption(chip.id))
                        }
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="controls-group">
                  <span className="controls-label">Filter</span>
                  <div className="chip-group">
                    {filterChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className={`chip ${filterOption === chip.id ? 'active' : ''}`}
                        aria-pressed={filterOption === chip.id}
                        aria-label={`Filter ${chip.label}`}
                        onClick={() =>
                          setFilterOption((prev) => (prev === chip.id ? 'all' : chip.id))
                        }
                        onKeyDown={(event) =>
                          handleChipKeyDown(event, () =>
                            setFilterOption((prev) => (prev === chip.id ? 'all' : chip.id))
                          )
                        }
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cards-grid">
                {preparedPools.map((pool: PoolWithTimestamp) => (
                  <article
                    key={pool.id}
                    className="launchpad-card"
                    onClick={() => handlePoolClick(pool.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handlePoolClick(pool.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open details for ${pool.name}`}
                  >
                    <div className="card-body">
                      <div className="card-overview">
                        <div className="card-header">
                          <Tooltip content={t.tokenTooltip} position="top">
                            <div className="card-token">
                              {pool.imageUrl && !brokenImages[pool.id] ? (
                                <img
                                  src={pool.imageUrl}
                                  alt={pool.symbol}
                                  className="card-token-avatar"
                                  onError={(event) => {
                                    event.stopPropagation();
                                    handleImageError(pool.id);
                                  }}
                                />
                              ) : (
                                <div className="card-token-avatar placeholder">
                                  {getTokenInitials(pool.name, pool.symbol)}
                                </div>
                              )}
                              <div className="card-token-info">
                                <p className="card-token-name">{pool.name}</p>
                                <div className="card-token-meta">
                                  <p className="card-token-symbol">{pool.symbol}</p>
                                  <Tooltip
                                    content={`Status: ${getStatusLabel(pool.status)}`}
                                    position="top"
                                  >
                                    <span className={`status-pill status-${pool.status}`}>
                                      {getStatusLabel(pool.status)}
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                        </div>

                        <div className="card-address">
                          <Tooltip content={t.contractTooltip} position="top">
                            <div className="card-address-text">{formatAddress(pool.id)}</div>
                          </Tooltip>
                          <div className="card-address-actions">
                            <Tooltip content={t.copyTooltip} position="bottom">
                              <IonIcon
                                icon={copyOutline}
                                className="address-icon"
                                onClick={(event) => copyToClipboard(pool.id, event)}
                              />
                            </Tooltip>
                            <Tooltip content={t.viewOnSolscan} position="bottom">
                              <IonIcon
                                icon={openOutline}
                                className="address-icon"
                                onClick={(event) => openBlockExplorer(pool.id, event)}
                              />
                            </Tooltip>
                          </div>
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
                          {pool.lastUpdated && (
                            <LastUpdated timestamp={pool.lastUpdated} prefix="Updated" />
                          )}
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
                                  <span className="metric-footnote">
                                    {getTimeAgo(pool.startTime)}
                                  </span>
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
                    </div>

                    <div className="card-footer">
                      <Tooltip content={t.timeTooltip} position="top">
                        <div className="card-time">
                          <IonIcon icon={timeOutline} />
                          <span>{getTimeAgo(pool.startTime)}</span>
                        </div>
                      </Tooltip>
                      <div className="card-actions">
                        {pool.twitterUrl && (
                          <Tooltip content={t.visitTwitter} position="top">
                            <IonButton
                              size="small"
                              fill="clear"
                              onClick={(event) => {
                                event.stopPropagation();
                                window.open(pool.twitterUrl, '_blank');
                              }}
                              aria-label="Open Twitter"
                            >
                              <IonIcon icon={logoTwitter} />
                            </IonButton>
                          </Tooltip>
                        )}
                        {pool.websiteUrl && (
                          <Tooltip content={t.visitWebsite} position="top">
                            <IonButton
                              size="small"
                              fill="clear"
                              onClick={(event) => {
                                event.stopPropagation();
                                window.open(pool.websiteUrl, '_blank');
                              }}
                              aria-label="Open website"
                            >
                              <IonIcon icon={globeOutline} />
                            </IonButton>
                          </Tooltip>
                        )}
                        <Tooltip content={t.tradeTooltip} position="top">
                          <IonButton
                            size="small"
                            fill="solid"
                            color="success"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <IonIcon icon={swapHorizontalOutline} slot="start" />
                            {t.trade}
                          </IonButton>
                        </Tooltip>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div ref={loadMoreRef} className="load-more-trigger">
                {isFetchingNextPage && (
                  <div style={{ textAlign: 'center' }}>
                    <IonSpinner name="crescent" color="primary" />
                    <IonText color="medium">
                      <p style={{ marginTop: '12px' }}>Loading more tokens...</p>
                    </IonText>
                  </div>
                )}
                {!hasNextPage && preparedPools && preparedPools.length > 0 && (
                  <IonText color="medium">
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                      🎉 You&apos;ve reached the end! No more tokens to load.
                    </p>
                  </IonText>
                )}
              </div>
            </>
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
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </IonPage>
  );
};

export default Launchpad;
