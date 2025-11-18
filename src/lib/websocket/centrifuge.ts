// Centrifuge WebSocket client for real-time updates

import {
  Centrifuge,
  Subscription,
  PublicationContext,
  SubscribedContext,
  UnsubscribedContext,
  SubscriptionErrorContext,
} from 'centrifuge';

const WS_URL = process.env.REACT_APP_LAUNCHPAD_WS_URL || 'wss://launch.meme/connection/websocket';
const CENTRIFUGE_KEY = process.env.REACT_APP_CENTRIFUGE_KEY || '';
const USE_MOCK = process.env.REACT_APP_LAUNCHPAD_USE_MOCK === 'true';
const RECONNECT_DELAY = parseInt(process.env.REACT_APP_WS_RECONNECT_DELAY || '1000');
const MAX_RECONNECT_ATTEMPTS = parseInt(process.env.REACT_APP_WS_MAX_RECONNECT_ATTEMPTS || '5');

type CentrifugeInstance = InstanceType<typeof Centrifuge>;

let centrifugeInstance: CentrifugeInstance | null = null;
let reconnectAttempts = 0;

/**
 * Initialize Centrifuge client
 */
export const initCentrifuge = (): CentrifugeInstance | null => {
  if (USE_MOCK) {
    if (process.env.NODE_ENV === 'development') {
      console.info('📡 WebSocket: Running in mock mode');
    }
    return null;
  }

  if (centrifugeInstance) {
    return centrifugeInstance;
  }

  if (!CENTRIFUGE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ REACT_APP_CENTRIFUGE_KEY not set - WebSocket disabled');
    }
    return null;
  }

  try {
    centrifugeInstance = new Centrifuge(WS_URL, {
      token: CENTRIFUGE_KEY,
      debug: process.env.NODE_ENV === 'development',
    });

    // Connection event handlers
    centrifugeInstance.on('connected', () => {
      reconnectAttempts = 0;
      if (process.env.NODE_ENV === 'development') {
        console.info('✅ WebSocket connected');
      }
    });

    centrifugeInstance.on('disconnected', (ctx) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ WebSocket disconnected:', ctx.reason);
      }
    });

    centrifugeInstance.on('error', (ctx) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ WebSocket error:', ctx);
      }

      // Handle reconnection with exponential backoff
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1);

        if (process.env.NODE_ENV === 'development') {
          console.info(
            `🔄 Reconnecting in ${delay}ms (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
          );
        }

        setTimeout(() => {
          centrifugeInstance?.connect();
        }, delay);
      } else if (process.env.NODE_ENV === 'development') {
        console.error('❌ Max reconnection attempts reached');
      }
    });

    // Connect to server
    centrifugeInstance.connect();

    return centrifugeInstance;
  } catch (error) {
    return null;
  }
};

/**
 * Get Centrifuge instance (initialize if needed)
 */
export const getCentrifuge = (): CentrifugeInstance | null => {
  if (!centrifugeInstance) {
    return initCentrifuge();
  }
  return centrifugeInstance;
};

/**
 * Subscribe to a channel
 */
export const subscribe = (
  channel: string,
  onMessage: (data: unknown) => void,
  onError?: (error: unknown) => void
): Subscription | null => {
  const centrifuge = getCentrifuge();

  if (!centrifuge) {
    return null;
  }

  try {
    const subscription = centrifuge.newSubscription(channel);

    subscription.on('publication', (ctx: PublicationContext) => {
      onMessage(ctx.data);
    });

    subscription.on('error', (ctx: SubscriptionErrorContext) => {
      onError?.(ctx.error);
    });

    subscription.on('subscribed', (_ctx: SubscribedContext) => {
      // Subscribed successfully
    });

    subscription.on('unsubscribed', (_ctx: UnsubscribedContext) => {
      // Unsubscribed successfully
    });

    subscription.subscribe();

    return subscription;
  } catch (error) {
    onError?.(error);
    return null;
  }
};

/**
 * Unsubscribe from a channel
 */
export const unsubscribe = (subscription: Subscription | null): void => {
  if (subscription) {
    subscription.unsubscribe();
  }
};

/**
 * Disconnect from Centrifuge
 */
export const disconnect = (): void => {
  if (centrifugeInstance) {
    centrifugeInstance.disconnect();
    centrifugeInstance = null;
  }
};

/**
 * Get connection state
 */
export const isConnected = (): boolean => {
  return centrifugeInstance?.state === 'connected';
};

export default {
  init: initCentrifuge,
  get: getCentrifuge,
  subscribe,
  unsubscribe,
  disconnect,
  isConnected,
};
