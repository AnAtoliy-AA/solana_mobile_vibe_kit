// Mock for @coinbase/wallet-sdk
interface CoinbaseWalletConfig {
  appName?: string;
  appLogoUrl?: string;
  darkMode?: boolean;
}

export class CoinbaseWalletSDK {
  private readonly config: CoinbaseWalletConfig;

  constructor(config: CoinbaseWalletConfig = {}) {
    this.config = config;
  }

  makeWeb3Provider() {
    return {
      appName: this.config.appName ?? 'Test App',
      appLogoUrl: this.config.appLogoUrl ?? '',
      darkMode: this.config.darkMode ?? false,
    };
  }
}

export default CoinbaseWalletSDK;
