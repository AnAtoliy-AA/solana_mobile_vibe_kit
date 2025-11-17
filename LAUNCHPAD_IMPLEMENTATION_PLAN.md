# Launchpad Implementation Plan (Option B)

**Project:** Solana Mobile Vibe Kit - Launchpad Trading Terminal
**Date:** November 17, 2025
**Architecture:** Extend Existing React/Ionic App

---

## 🎯 Architecture Decision: Extend Existing App

**Confirmed:** Integrate Launchpad into the existing React/Ionic/Capacitor application.

### Why This Approach?

1. ✅ **Seamless wallet integration** — Use existing Privy + Solana SDK
2. ✅ **Mobile-ready** — Capacitor already configured for iOS/Android
3. ✅ **Single codebase** — Easier deployment and maintenance
4. ✅ **Reuse existing UI** — Ionic components already styled
5. ✅ **Faster development** — No need to set up new project

### Trade-offs

- ⚠️ No SSR — Acceptable for real-time trading terminal
- ⚠️ All client-side — Still fast for WebSocket-heavy app
- ✅ Mobile-first — Perfect for spec requirements

---

## 📁 New File Structure

```
src/
├── pages/
│   ├── Tab1.tsx                    # EXISTING: Wallet
│   ├── Tab2.tsx                    # EXISTING: Tokens
│   ├── Tab3.tsx                    # EXISTING: History
│   ├── Tab4.tsx                    # EXISTING: Swap
│   ├── Launchpad.tsx               # NEW: Market list view
│   ├── LaunchpadDetail.tsx         # NEW: Pool detail page
│   └── LaunchpadActivity.tsx       # NEW: Activity feed
├── components/
│   ├── ExploreContainer.tsx        # EXISTING
│   └── launchpad/                  # NEW: Launchpad components
│       ├── PoolCard.tsx
│       ├── PoolList.tsx
│       ├── PoolFilters.tsx
│       ├── PoolChart.tsx
│       ├── ParticipationWidget.tsx
│       ├── ActivityFeed.tsx
│       ├── ActivityItem.tsx
│       └── ui/
│           ├── Card.tsx
│           ├── Badge.tsx
│           └── Button.tsx
├── sdk/
│   ├── SolanaSDK.ts                # EXISTING
│   ├── wallet.ts                   # EXISTING
│   ├── transaction.ts              # EXISTING
│   ├── token.ts                    # EXISTING
│   └── jupiter.ts                  # EXISTING
├── lib/                             # NEW: Launchpad logic
│   ├── api/
│   │   ├── client.ts               # REST API client
│   │   ├── pools.ts                # Pool endpoints
│   │   ├── user.ts                 # User endpoints
│   │   ├── types.ts                # TypeScript types
│   │   └── mocks.ts                # Mock data
│   ├── websocket/
│   │   ├── centrifuge.ts           # WebSocket client
│   │   ├── channels.ts             # Subscriptions
│   │   └── handlers.ts             # Message handlers
│   └── stores/
│       ├── useMarketStore.ts       # Zustand: market state
│       ├── useActivityStore.ts     # Zustand: activity state
│       └── useUIStore.ts           # Zustand: UI state
├── hooks/
│   ├── usePrivySolana.ts           # EXISTING
│   ├── usePoolList.ts              # NEW: React Query hook
│   ├── usePoolDetail.ts            # NEW: React Query hook
│   ├── useLivePrice.ts             # NEW: WebSocket hook
│   └── useLiveActivity.ts          # NEW: WebSocket hook
├── context/
│   ├── SolanaContext.tsx           # EXISTING
│   ├── PrivyContext.tsx            # EXISTING
│   └── LaunchpadContext.tsx        # NEW: Launchpad state
├── theme/
│   ├── variables.css               # EXISTING: Ionic vars
│   └── launchpad.css               # NEW: Custom styles
├── App.tsx                          # MODIFY: Add routes
└── index.tsx                        # EXISTING
```

---

## 🛠️ Implementation Steps

### Phase 1: Setup & Dependencies (Day 1)

**Install Required Packages:**

```bash
npm install @tanstack/react-query zustand centrifuge recharts
npm install -D @types/recharts
```

**Dependencies:**
- ✅ `@tanstack/react-query` — REST API caching
- ✅ `zustand` — Lightweight state management
- ✅ `centrifuge` — WebSocket client
- ✅ `recharts` — Charts for price/volume

**Tasks:**
- [ ] Install dependencies
- [ ] Create `lib/api/` directory structure
- [ ] Create `lib/websocket/` directory structure
- [ ] Create mock data files
- [ ] Set up React Query provider
- [ ] Set up Zustand stores

### Phase 2: API Client & Mocks (Day 2)

**Files to Create:**

**`lib/api/client.ts`** — REST client with axios
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_LAUNCHPAD_API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
});

export default apiClient;
```

**`lib/api/mocks.ts`** — Comprehensive mock data
```typescript
export const mockPools = [
  {
    id: 'pool_1',
    name: 'Solana Meme Token',
    symbol: 'SMT',
    status: 'active',
    progress: 0.65,
    tvl: '1250000',
    participants: 1234,
    // ... more fields
  },
  // ... more pools
];
```

**`lib/api/pools.ts`** — Pool endpoints
```typescript
import apiClient from './client';
import { mockPools } from './mocks';

export const getPoolList = async () => {
  const useMock = process.env.REACT_APP_LAUNCHPAD_USE_MOCK === 'true';

  if (useMock) {
    return { data: { pools: mockPools } };
  }

  return apiClient.get('/pools');
};
```

**Tasks:**
- [ ] Create API client with axios
- [ ] Create comprehensive mock data
- [ ] Implement pool API functions
- [ ] Implement user API functions
- [ ] Add mock mode toggle
- [ ] Add error handling

### Phase 3: WebSocket Client (Day 2)

**`lib/websocket/centrifuge.ts`** — Centrifuge client
```typescript
import Centrifuge from 'centrifuge';

const centrifuge = new Centrifuge(
  process.env.REACT_APP_LAUNCHPAD_WS_URL!,
  {
    token: process.env.REACT_APP_CENTRIFUGE_KEY,
  }
);

centrifuge.connect();

export default centrifuge;
```

**Tasks:**
- [ ] Set up Centrifuge client
- [ ] Create subscription manager
- [ ] Add auto-reconnect logic
- [ ] Create message handlers
- [ ] Add connection status tracking

### Phase 4: State Management (Day 3)

**Zustand Stores:**

**`lib/stores/useMarketStore.ts`**
```typescript
import { create } from 'zustand';

interface MarketState {
  pools: Pool[];
  selectedPool: Pool | null;
  setPool: (pool: Pool) => void;
  updatePoolPrice: (id: string, price: number) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  pools: [],
  selectedPool: null,
  setPool: (pool) => set({ selectedPool: pool }),
  updatePoolPrice: (id, price) => set((state) => ({
    pools: state.pools.map((p) =>
      p.id === id ? { ...p, price } : p
    ),
  })),
}));
```

**Tasks:**
- [ ] Create market store (pools, prices)
- [ ] Create activity store (feed, events)
- [ ] Create UI store (modals, loading states)
- [ ] Integrate with React Query

### Phase 5: UI Components (Days 3-4)

**Launchpad Pages:**

**`pages/Launchpad.tsx`** — Market list
- Header with wallet button
- Filter bar (Active/Upcoming/Finished)
- Grid/List of pool cards
- Infinite scroll
- Loading states

**`pages/LaunchpadDetail.tsx`** — Pool detail
- Hero section (name, status, progress)
- Participation widget
- Chart component
- Tabs (Overview, Details, History)
- Live price updates

**`pages/LaunchpadActivity.tsx`** — Activity feed
- Real-time event list
- Filters (All/My Activity)
- User avatars
- Time stamps

**Tasks:**
- [ ] Create Launchpad market list page
- [ ] Create pool detail page
- [ ] Create activity feed page
- [ ] Build PoolCard component
- [ ] Build PoolChart component
- [ ] Build ParticipationWidget
- [ ] Build ActivityFeed component
- [ ] Add loading skeletons
- [ ] Add error boundaries

### Phase 6: Routing (Day 4)

**Modify `App.tsx`:**

```typescript
import Launchpad from './pages/Launchpad';
import LaunchpadDetail from './pages/LaunchpadDetail';
import LaunchpadActivity from './pages/LaunchpadActivity';

// Add routes
<Route path="/launchpad" component={Launchpad} exact />
<Route path="/launchpad/:id" component={LaunchpadDetail} />
<Route path="/launchpad/activity" component={LaunchpadActivity} />
```

**Update Bottom Tab Bar:**
- Add "Launchpad" tab to bottom navigation
- Update tab icons

**Tasks:**
- [ ] Add routes to App.tsx
- [ ] Update tab bar navigation
- [ ] Add route guards (wallet required?)
- [ ] Add route transitions

### Phase 7: Real-time Features (Day 5)

**React Query + WebSocket Integration:**

**`hooks/useLivePrice.ts`**
```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import centrifuge from '../lib/websocket/centrifuge';

export const useLivePrice = (poolId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = centrifuge.subscribe(`pool:${poolId}`, (message) => {
      if (message.data.type === 'price') {
        queryClient.setQueryData(['pool', poolId], (old: any) => ({
          ...old,
          price: message.data.price,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [poolId]);
};
```

**Tasks:**
- [ ] Create live price hooks
- [ ] Create live activity hooks
- [ ] Integrate with React Query cache
- [ ] Add optimistic updates
- [ ] Handle reconnection
- [ ] Add latency indicators

### Phase 8: Participation Flow (Day 5-6)

**Integrate with Existing Wallet:**

```typescript
import { useSolana } from '../context/SolanaContext';

const handleParticipate = async (amount: number) => {
  const { sdk } = useSolana();

  // 1. Create participation transaction
  // 2. Sign with wallet (via Privy)
  // 3. Submit to network
  // 4. Update UI optimistically
  // 5. Confirm on-chain
};
```

**Tasks:**
- [ ] Build participation form
- [ ] Validate amounts
- [ ] Integrate wallet signing
- [ ] Create transactions
- [ ] Handle success/error states
- [ ] Show transaction status
- [ ] Add toasts/notifications

### Phase 9: Mobile Optimization (Day 6)

**Responsive Design:**
- Mobile-first layouts
- Touch-friendly interactions
- Swipe gestures
- Bottom sheets for modals
- Pull-to-refresh

**Tasks:**
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Optimize touch targets
- [ ] Add swipe gestures
- [ ] Mobile navigation
- [ ] Responsive charts

### Phase 10: Testing & Polish (Day 7)

**Testing:**
- [ ] Unit tests for API client
- [ ] Unit tests for stores
- [ ] Component tests
- [ ] WebSocket mock tests
- [ ] Integration tests
- [ ] Manual E2E testing

**Polish:**
- [ ] Loading states everywhere
- [ ] Error messages
- [ ] Empty states
- [ ] Accessibility (ARIA labels)
- [ ] Performance optimization
- [ ] Bundle size check

---

## 📦 Package Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "centrifuge": "^5.0.0",
    "recharts": "^2.10.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/recharts": "^2.10.0"
  }
}
```

---

## 🎨 Styling Strategy

### Use Existing Ionic Components

```tsx
import { IonCard, IonButton, IonChip, IonBadge } from '@ionic/react';

// Leverage Ionic's mobile-optimized components
<IonCard>
  <PoolCard data={pool} />
</IonCard>
```

### Add Custom Styles with Tailwind (Optional)

Or just use Ionic's CSS variables + custom CSS:

```css
/* theme/launchpad.css */
.pool-card {
  background: var(--ion-color-light);
  border-radius: 12px;
  padding: 16px;
}

.pool-card--active {
  border-left: 4px solid var(--ion-color-success);
}
```

---

## 🔌 API Integration Status

**Current:** Mock mode enabled (`REACT_APP_LAUNCHPAD_USE_MOCK=true`)

**Mock Data Includes:**
- ✅ Pool list with various statuses
- ✅ Pool details with price history
- ✅ User profile with positions
- ✅ Activity feed events
- ✅ WebSocket message simulations

**Switch to Real API:**
1. Update API URLs in `.env`
2. Set `REACT_APP_LAUNCHPAD_USE_MOCK=false`
3. Test endpoints work
4. Update types if needed
5. Handle authentication if required

---

## 🚀 Deployment

### Build for Web

```bash
npm run build
# Deploy build/ to Render
```

### Build for Mobile

```bash
# iOS
npm run build
npx cap sync ios
npx cap open ios

# Android
npm run build
npx cap sync android
npx cap open android
```

---

## ✅ Success Criteria

### Functional
- [ ] Market list loads and displays pools
- [ ] Can filter by status (Active/Upcoming/Finished)
- [ ] Pool detail page shows all info
- [ ] Chart displays price data
- [ ] Can connect wallet (existing Privy)
- [ ] Participation flow works end-to-end
- [ ] Activity feed shows live updates
- [ ] WebSocket receives messages
- [ ] Reconnection works on disconnect

### Performance
- [ ] Page load < 2s
- [ ] WebSocket latency < 500ms
- [ ] Smooth animations
- [ ] No layout shifts
- [ ] Works offline (cached data)

### Mobile
- [ ] Responsive on all screen sizes
- [ ] Touch interactions work
- [ ] Bottom nav accessible
- [ ] Swipe gestures smooth
- [ ] iOS/Android tested

---

## 📋 Daily Milestones

### Day 1: Foundation
- ✅ Updated spec.md
- ✅ Created API_STATUS.md
- ✅ Added Centrifuge key to .env
- [ ] Install dependencies
- [ ] Create file structure
- [ ] Set up React Query
- [ ] Create mock data

### Day 2: API & WebSocket
- [ ] Build API client
- [ ] Create all mock endpoints
- [ ] Set up Centrifuge client
- [ ] Test WebSocket connection
- [ ] Create Zustand stores

### Day 3: Core UI
- [ ] Market list page
- [ ] Pool card component
- [ ] Filters and search
- [ ] Loading states

### Day 4: Detail Page
- [ ] Pool detail layout
- [ ] Chart integration
- [ ] Participation widget
- [ ] Add routes to App.tsx

### Day 5: Real-time
- [ ] WebSocket subscriptions
- [ ] Live price updates
- [ ] Activity feed
- [ ] Notifications

### Day 6: Participation & Mobile
- [ ] Participation flow
- [ ] Wallet integration
- [ ] Transaction handling
- [ ] Mobile optimization

### Day 7: Testing & Deploy
- [ ] Unit tests
- [ ] Integration tests
- [ ] Bug fixes
- [ ] Deploy to Render

---

## 🔐 Security Checklist

- [ ] Validate all WebSocket messages
- [ ] Sanitize user input
- [ ] Rate limit API calls
- [ ] Handle authentication errors
- [ ] Secure wallet operations
- [ ] No secrets in code (all in .env)
- [ ] XSS protection
- [ ] CORS configured

---

**Status:** 📝 Ready to Start Development

**Next Steps:**
1. Install dependencies
2. Create directory structure
3. Build mock API client
4. Start with market list UI

---

*Created: November 17, 2025*
*Architecture: Extend Existing React/Ionic App*
*Timeline: 7 days*
