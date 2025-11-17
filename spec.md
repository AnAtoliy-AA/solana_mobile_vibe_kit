# Launchpad — spec.md

## 1. Project Overview

Create a single-page trading terminal ("Launchpad") inspired by [https://launch.meme](https://launch.meme). The deliverable is a web-first responsive single-page app which also looks and behaves appropriately on mobile (Android/iOS). Optionally publish mobile wrappers later, but a responsive web app with a mobile-focused brand and layout is sufficient.

This project must:

* Use REST APIs and streaming data (WebSocket/Centrifuge) for live updates.
* Be a thoughtful original UI — don’t clone the reference; design your own visual language.
* Be deployed to Netlify / Render (or similar). Provide a public URL.
* Use mock data for missing parts (profile, PNL, positions) if needed.

APIs & docs:

* Base API: `https://launch.meme/api/`
* Swagger: `https://launch.meme/docs/`
* Websocket (Centrifuge): `wss://launch.meme/connection/websocket`
* Centrifuge key (for local/dev/test):
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3NTcxNjY4ODh9.VEvlNmvIFS3ARM5R0jlNN4fwDDRz94WnKv8LDmtipNE`

---

## 2. Goals & Success Criteria

**Primary goals**

* Real-time market/event data for launch pools, charts, and activity feed.
* Clear, usable trading/participation flows (connect wallet/login, participate/subscribe, view positions).
* Pleasant, accessible UI that scales across desktop and mobile.

**Success criteria**

* Live updates arrive via websockets and update UI components without full page refresh.
* REST endpoints used for authoritative state (user profile, open pools, history) and websockets for streaming (price ticks, pool status, chat/feed, notifications).
* App deployed and reachable via a public URL.
* Basic unit/integration tests and accessibility checks included.

---

## 3. Target Platforms

* Modern desktop browsers (Chrome, Firefox, Edge, Safari).
* Mobile browsers (Chrome on Android, Safari on iOS) responsive layout.
* Optional: Progressive Web App (PWA) support for home screen install behavior.

---

## 4. Tech Stack Recommendations

* Framework: React 18 — mandatory. Must integrate **solana_mobile_vibe_kit** for Solana wallet UX and mobile-friendly primitives.
* State management: React Query (TanStack Query) or SWR for REST caching; global state with Zustand (optional) for client-side realtime UI state.
* WebSocket / Realtime: use Centrifuge.js client or native WebSocket wrapper with auto-reconnect, heartbeat, and backoff.
* Styling: Tailwind CSS for fast responsive design or CSS modules + design tokens.
* Charts: Recharts, lightweight chart library, or chart.js wrapper (client-side only).
* Deployment: Netlify/Render if desired.
* Tests: Jest + React Testing Library, Playwright for E2E (optional).

---

## 5. High-level UX / Layout

Design intent: fast information density, clear hierarchy, and mobile-first interactions.

### Desktop layout (3-column adaptable)

* **Left column** — Navigation + Wallet/Profile panel (compact). Quick filters (Active, Upcoming, Finished).
* **Center column** — Primary workspace: selected launch/pool detail, large interactive chart, participation widget, tabs (Overview, Details, History, Social).
* **Right column** — Live orderbook / activity feed / leaderboard / token metrics. Collapsible for small screens.

### Mobile layout (single column, stacked)

* Top nav (logo, search, wallet).
* Primary card list (launches) with swipe gestures or tap-to-expand to details.
* Floating action / quick participate button.
* Bottom nav: Home / Search / My Pools / Activity / Profile.

---

## 6. Key Screens & Components

* **Home (Market list)**: list of launches with status badges, progress bar, TVL/participants, and action button.
* **Launch Detail page (modal or route)**: hero (title, tags), progress timeline, participation form (amount selector, wallet connect), live chart, news/trends, FAQ.
* **Chart component**: candlesticks or area chart + brush + tooltip + timeframe selector.
* **Realtime Activity Feed**: streaming list with infinite scroll + filters.
* **Notifications & Toasts**: for transaction updates, success/error.
* **Wallet / Auth**: connect wallet or email auth stub for prototypes.
* **Profile / Positions**: holdings, PnL (mock or real), transaction history.
* **Global header & footer**: search, settings, theme toggle (light/dark).

---

## 7. Data Flow & Realtime Strategy

* **Authoritative State**: Fetch initial state via REST (e.g., GET `/pools`, `/user/profile`).

* **Streaming**: Subscribe to Centrifuge channels for:

  * pool updates (progress, status changes)
  * market ticks (price/volume)
  * activity feed (new events)
  * user notifications

* **Pattern**:

  1. On page load, call REST endpoints to populate UI.
  2. Open websocket subscription(s) to receive deltas.
  3. Apply patches locally (optimistic UI for user actions) and reconcile with server snapshots periodically.

* **Backpressure & throttling**: aggregate high-frequency updates and batch UI re-renders (e.g., throttle updates to 200–500ms).

---

## 8. API Integration Checklist

* Read Swagger to map endpoints used. Minimum endpoints:

  * `/pools` — list of launches
  * `/pools/{id}` — detailed pool info
  * `/user/profile` — user details
  * `/orders` or participation endpoints — POST participation
  * `/history` — user events

* Implement robust error handling, retries with exponential backoff for REST and reconnect/backoff for WS.

---

## 9. Auth & Security

* Use wallet signatures for real participation flows; for prototype, provide a mock wallet or OAuth fallback.
* Never commit API keys in repo; use environment variables (Netlify/Render env settings).
* Sanitize websocket messages and validate with schemas.

---

## 10. Mocking & Local Dev

* Provide a `mocks/` module that exposes: sample pools, historic chart data, fake profile and PnL, and WebSocket mock server (simple broadcaster).
* Allow `REACT_APP_USE_MOCK=true` mode to run without hitting production API.

---

## 11. Performance & Accessibility

**Note on SSR:**
Because the project is built **inside the existing React/Ionic/Capacitor app**, **SSR is NOT possible**. Ionic + CRA-style architecture relies on client-side rendering, and extending the current codebase requires maintaining CSR. This is acceptable for a trading terminal, where:

* realtime data requires constant hydration
* SEO is not a priority (logged-in app)
* fast client-side routing and websocket-driven UI outweigh SSR benefits

Therefore:

* ❌ SSR is removed from the requirements
* ✅ CSR is the official rendering model
* ❗ Important: avoid heavy initial JS bundles, rely on code-splitting for charts, WebSocket modules, and analytics.

**Performance Guidelines (CSR-based app):**

* Keep initial bundle lightweight; lazy-load charts and heavy modules.
* Use React Query caching + background refresh.
* Throttle and batch websocket updates (200–500ms).
* Use skeleton loaders for initial page display.

**Accessibility:**

* Semantic HTML
* Keyboard navigation for all interactive components
* Color contrast ≥ 4.5:1 where applicable
* ARIA attributes for dynamic regions

---

## 12. Testing & QA

* Unit tests for presentation components and net-state logic.
* Integration tests that mock websocket + REST to assert live updates reflect in UI.
* Basic accessibility checks using axe-core in CI.

---

## 13. Deployment

* Provide build scripts and deploy to Netlify/Render.
* Environment variables: `API_BASE_URL`, `WS_URL`, `CENTRIFUGE_KEY`, `REACT_APP_USE_MOCK`.
* CI: use GitHub Actions to auto-deploy on push to `main`.

---

## 14. Deliverables

1. Source code repo (GitHub) with clear README and setup instructions.
2. Deployed public URL (Netlify / Render). Include build/deploy logs if issues.
3. `spec.md` (this file) and a short demo video or GIF (optional) showing core realtime flows.
4. List of mocked endpoints and sample data.

---

## 15. Timeline & Milestones (suggested)

* Day 0–1: Project scaffolding, design language, and layout wireframes.
* Day 2–3: Implement list view, REST integration, and navigation.
* Day 4–5: Launch detail page, participation flow (mockable), chart integration.
* Day 6: WebSocket subscriptions, live feed, and reconcile logic.
* Day 7: QA, testing, small polish, and deployment.

---

## 16. Acceptance Criteria

* App updates visible via websocket without manual refresh.
* Able to perform a participation flow (mock or real) and observe state updates.
* Deployed site accessible publicly and responsive on mobile.
* README includes how to switch to mock mode and how to configure Centrifuge key.

---

## 17. Nice-to-have / Bonus

* PWA capabilities and offline caching of recent data.
* Themeable UI with brand color tokens and simple animations.
* Small analytics dashboard (user-level PnL & exposure).
* Social/chat widget for live commentary on launches.

---

## 18. Notes & References

* Use the provided Centrifuge key only for development/testing and never commit it to public repository.
* Swagger link: `https://launch.meme/docs/` for endpoint discovery and contract details.

---

*End of spec.md*
