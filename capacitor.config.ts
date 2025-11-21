import type { CapacitorConfig } from '@capacitor/cli';

interface DotenvConfigResult {
  parsed?: Record<string, string>;
}

let dotenvResult: DotenvConfigResult | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv') as typeof import('dotenv');
  dotenvResult = dotenv.config();
} catch (error) {
  console.warn(
    '⚠️  dotenv is not installed. Environment variables from .env will not be loaded for Capacitor CLI commands.'
  );
}

// Load environment variables from .env file
// This is required because Capacitor CLI commands run outside of React's build process
// which doesn't automatically load .env files
// dotenv.config() safely handles missing .env files - it won't throw errors

/**
 * Capacitor Configuration
 *
 * These values use defaults if not set in environment variables.
 * This allows Capacitor CLI commands to work during initial setup
 * before the .env file is created.
 *
 * To customize, create a .env file and set:
 * - REACT_APP_CAPACITOR_APP_ID
 * - REACT_APP_CAPACITOR_APP_NAME
 */
const appId = process.env.REACT_APP_CAPACITOR_APP_ID || 'io.ionic.starter';
const appName = process.env.REACT_APP_CAPACITOR_APP_NAME || 'my-solana-sdk';

// Only warn if .env file exists but variables are missing (not during initial setup)
// This prevents warnings during legitimate setup workflows
if (dotenvResult?.parsed && !process.env.REACT_APP_CAPACITOR_APP_ID) {
  console.warn(
    '⚠️  REACT_APP_CAPACITOR_APP_ID not set in .env, using default: io.ionic.starter\n' +
      '   Set REACT_APP_CAPACITOR_APP_ID in your .env file to customize.'
  );
}

if (dotenvResult?.parsed && !process.env.REACT_APP_CAPACITOR_APP_NAME) {
  console.warn(
    '⚠️  REACT_APP_CAPACITOR_APP_NAME not set in .env, using default: my-solana-sdk\n' +
      '   Set REACT_APP_CAPACITOR_APP_NAME in your .env file to customize.'
  );
}

const config: CapacitorConfig = {
  appId,
  appName,
  webDir: 'build',
};

export default config;
