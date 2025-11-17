import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration
 *
 * SECURITY: All values loaded from environment variables
 * Update your .env file to customize these values
 */
const appId = process.env.REACT_APP_CAPACITOR_APP_ID;
const appName = process.env.REACT_APP_CAPACITOR_APP_NAME;

if (!appId) {
  throw new Error('REACT_APP_CAPACITOR_APP_ID is required. Set it in your .env file.');
}

if (!appName) {
  throw new Error('REACT_APP_CAPACITOR_APP_NAME is required. Set it in your .env file.');
}

const config: CapacitorConfig = {
  appId,
  appName,
  webDir: 'build'
};

export default config;
