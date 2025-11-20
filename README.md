# Solana Mobile Vibe Kit

> **Comprehensive SDK for developing mobile Solana applications using Ionic, Capacitor, React and Privy integration**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/your-repo/solana-mobile-sdk)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Ionic](https://img.shields.io/badge/Ionic-7.x-blue.svg)](https://ionicframework.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Solana](https://img.shields.io/badge/Solana-1.98.x-purple.svg)](https://solana.com/)

## 📱 Overview

Solana Mobile Vibe Kit is a full-featured toolkit for vibe coding mobile applications on the Solana blockchain. The SDK provides a unified interface for wallet management, transaction execution, token operations, and integration with web wallets through Privy.

### ✨ Key Features

- **Multi-platform Wallet Management** - Support for email authorization via Privy and demo wallets
- **Transaction Management** - Send SOL, calculate fees, transaction history
- **Token Operations** - Get balances, transfer SPL tokens
- **Cross-platform** - iOS, Android and web via Ionic/Capacitor
- **Modern UI** - Responsive design with Ionic components
- **Security** - Privy integration for secure authentication
- **Multi-network** - Support for mainnet, testnet, devnet

## 📁 Project Architecture

```
src/
├── sdk/                   # Core SDK
│   ├── SolanaSDK.ts       # Main SDK class
│   ├── wallet.ts          # Wallet management
│   ├── transaction.ts     # Transactions
│   ├── token.ts           # Token operations
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utilities
│   └── index.ts           # Exports
├── context/               # React contexts
│   ├── SolanaContext.tsx  # Solana SDK context
│   └── PrivyContext.tsx   # Privy context
├── hooks/                 # Custom hooks
│   └── usePrivySolana.ts  # Privy-Solana integration
├── pages/                 # Application pages
│   ├── Tab1.tsx           # Wallet
│   ├── Tab2.tsx           # Tokens
│   └── Tab3.tsx           # History
├── components/            # Reusable components
└── theme/                 # Styles and themes
```

## 🛠 Technology Stack

### Core Technologies

- **React 18.2** - UI library
- **TypeScript 4.1** - Type safety
- **Ionic 7.x** - UI components and navigation
- **Capacitor 7.4** - Native capabilities

### Blockchain

- **@solana/web3.js 1.98** - Solana JavaScript SDK
- **@solana/wallet-adapter** - Wallet adapters
- **@privy-io/react-auth 2.20** - Web3 authentication

### Mobile Development

- **@capacitor/ios** - iOS platform
- **@capacitor/android** - Android platform
- **Cordova plugins** - Native capabilities

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 16+ and npm
node --version  # >= 16.0.0
npm --version   # >= 8.0.0

# For mobile development
# iOS: Xcode 12+ and iOS Simulator
# Android: Android Studio and Android SDK
```

#### iOS Development Requirements

**Ruby 3.4.5 and CocoaPods:**

```bash
# Check current Ruby version
ruby --version

# If version is older than 3.4.5, install via Homebrew
brew install ruby

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"

# Install CocoaPods with new Ruby version
gem install cocoapods

# Verify installation
pod --version
```

**Important:** System Ruby version (2.6.x) is incompatible with modern CocoaPods versions. Always use Ruby 3.4.5+ from Homebrew.

> 🚨 **Quick Fix:** See [RUBY_SETUP.md](RUBY_SETUP.md) for step-by-step Ruby setup

### Installation

```bash
# Clone repository
git clone brookunn/solana_mobile_vibe_kit.git
cd solana-mobile-sdk

# Install dependencies
npm install

# Run web version
npm start
```

### Mobile Platform Builds

#### iOS Build

```bash
# 1. Make sure you have Ruby 3.4.5 installed
ruby --version  # Should show 3.4.5

# 2. Build web application
npm run build

# 3. Manual iOS dependencies installation (if automatic fails)
cd ios/App
/opt/homebrew/lib/ruby/gems/3.4.0/bin/pod install
cd ../..

# 4. Sync and open in Xcode
npx cap copy ios
npx cap open ios

# Alternatively, if automatic sync works:
# npx cap sync ios
```

#### Android Build

```bash
# Build web application
npm run build

# Sync with Android
npx cap sync android
npx cap open android
```

## 💻 SDK Usage

### Initialization

```typescript
import { createSolanaSDK, defaultConfig } from './sdk';

// Create SDK instance
const sdk = createSolanaSDK({
  network: 'devnet',
  rpcEndpoint: 'https://api.devnet.solana.com',
  commitment: 'confirmed',
});

// Initialize with auto-connect
await sdk.initialize(true);
```

### Wallet Management

```typescript
// Connect demo wallet
await sdk.wallet.connectWallet('demo');

// Connect custom wallet (Privy)
await sdk.wallet.connectCustomWallet('Email Wallet', {
  publicKey: keypair.publicKey,
  signTransaction: async (tx) => {
    /* ... */
  },
  signAllTransactions: async (txs) => {
    /* ... */
  },
});

// Get balance
const balance = await sdk.wallet.getBalance();
console.log(`Balance: ${balance / 1e9} SOL`);

// Disconnect wallet
await sdk.wallet.disconnectWallet();
```

### Transactions

```typescript
// Send SOL
const result = await sdk.transaction.sendSol({
  recipientAddress: 'recipient_public_key',
  amount: 1000000000, // 1 SOL in lamports
  memo: 'Test transfer',
});

if (result.success) {
  console.log('Transaction sent:', result.signature);
}

// Get transaction history
const history = await sdk.transaction.getTransactionHistory(10);
console.log('History:', history);

// Estimate transaction fee
const fee = await sdk.transaction.estimateTransactionFee(transaction);
console.log(`Fee: ${fee} lamports`);
```

### Token Operations

```typescript
// Get token balances
const tokenBalances = await sdk.token.getTokenBalances();
console.log('Tokens:', tokenBalances);

// Transfer tokens
const transferResult = await sdk.token.transferToken({
  recipientAddress: 'recipient_address',
  amount: 1000000, // Considering decimals
  mint: 'token_mint_address',
  decimals: 6,
});

// Create token (demo)
const createResult = await sdk.token.createToken({
  name: 'MyToken',
  symbol: 'MTK',
  decimals: 9,
  supply: 1000000,
});
```

## 🔗 Privy Integration

### Setup

```typescript
// App.tsx
import { PrivyProvider } from './context/PrivyContext';

function App() {
  return (
    <PrivyProvider>
      <SolanaProvider>
        {/* Your application */}
      </SolanaProvider>
    </PrivyProvider>
  );
}
```

### Usage in Components

```typescript
import { usePrivyAuth } from '../context/PrivyContext';
import { usePrivySolana } from '../hooks/usePrivySolana';

function WalletComponent() {
  const { login, logout, authenticated, user } = usePrivyAuth();
  usePrivySolana(); // Automatic synchronization

  return (
    <div>
      {!authenticated ? (
        <button onClick={login}>Login with Email</button>
      ) : (
        <div>
          <p>Connected: {user?.email?.address}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
```

## 📱 UI Features

### Wallet Components

- **Wallet Connection** - Email via Privy or demo mode
- **Balance Display** - SOL with USD rate
- **Address Copying** - Convenient public key copying
- **Network Switching** - Mainnet, Testnet, Devnet

### Transaction Management

- **Send SOL** - Form with validation
- **Transaction History** - List of recent operations
- **Transaction Status** - Confirmation tracking

### Token Operations

- **Token List** - Display all balances
- **Token Transfer** - SPL token sending form
- **Token Creation** - Demo creation function

## ⚙️ Configuration

### Capacitor (capacitor.config.ts)

```typescript
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'my-solana-sdk',
  webDir: 'build',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};
```

### Privy

```typescript
// In PrivyContext.tsx
const config = {
  appId: 'your_privy_app_id',
  appearance: {
    theme: 'light',
    accentColor: '#676FFF',
  },
  loginMethods: ['email'],
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
};
```

### Solana Networks

```typescript
export const NETWORKS = {
  'mainnet-beta': {
    name: 'Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    chainId: 'mainnet-beta',
  },
  testnet: {
    name: 'Testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    chainId: 'testnet',
  },
  devnet: {
    name: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    chainId: 'devnet',
  },
};
```

## 🧪 Testing

```bash
# Run unit/integration tests
yarn test

# Run with coverage
yarn test -- --coverage

# Run end-to-end suite (Playwright)
yarn test:e2e

# Linting
yarn lint
```

## 📦 Build

### Web Version

```bash
npm run build
# Files in build/
```

### iOS

```bash
npm run build
npx cap sync ios
npx cap build ios
```

### Android

```bash
npm run build
npx cap sync android
npx cap build android
```

## 🔧 Development

### File Structure

```
my-solana-sdk/
├── android/          # Android native part
├── ios/              # iOS native part
├── public/           # Static files
├── src/              # Source code
├── docs/             # Documentation
│   ├── API.md        # API reference
│   └── TROUBLESHOOTING.md # Troubleshooting
├── capacitor.config.ts
├── ionic.config.json
├── RUBY_SETUP.md     # Ruby setup for iOS
├── CONTRIBUTING.md   # Developer guide
├── CHANGELOG.md      # Change history
└── package.json
```

### Adding New Features

1. **New SDK Module**: Create file in `src/sdk/`
2. **New UI Component**: Add to `src/components/`
3. **New Page**: Create in `src/pages/`
4. **New Hook**: Add to `src/hooks/`

### Code Style

- TypeScript with strict types
- ESLint for code checking
- Prettier for formatting
- JSDoc comments for documentation

## 📖 API Reference

### SolanaSDK

```typescript
class SolanaSDK {
  wallet: SolanaWalletManager;
  transaction: SolanaTransactionManager;
  token: SolanaTokenManager;

  constructor(config: SolanaSDKConfig);
  getConfig(): SolanaSDKConfig;
  updateConfig(config: Partial<SolanaSDKConfig>): void;
  initialize(autoConnect?: boolean): Promise<void>;
}
```

### SolanaWalletManager

```typescript
class SolanaWalletManager {
  // Wallet connection
  connectWallet(type: 'phantom' | 'solflare' | 'demo'): Promise<void>;
  connectCustomWallet(name: string, adapter: CustomWalletAdapter): Promise<void>;

  // State management
  disconnectWallet(): Promise<void>;
  getState(): WalletState;
  getBalance(): Promise<number>;

  // Network
  switchNetwork(network: 'mainnet-beta' | 'testnet' | 'devnet'): void;
  getCurrentNetwork(): NetworkInfo;

  // Events
  onStateChange(callback: (state: WalletState) => void): () => void;
}
```

## 🚨 Known Issues

1. **Ruby and CocoaPods on macOS** - Main iOS development issue

   **Problem:** System Ruby version (2.6.x) is incompatible with CocoaPods 1.16+

   ```bash
   # Error you might see:
   # uninitialized constant ActiveSupport::LoggerThreadSafeLevel::Logger (NameError)
   ```

   **Solution:**

   ```bash
   # 1. Install Ruby 3.4.5 via Homebrew
   brew install ruby

   # 2. Add to ~/.zshrc or ~/.bash_profile
   echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc

   # 3. Check Ruby version
   ruby --version  # Should show 3.4.5

   # 4. Install CocoaPods
   gem install cocoapods

   # 5. Install iOS dependencies
   cd ios/App && pod install
   ```

2. **Android SDK** - Requires proper ANDROID_HOME setup

   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **iOS Simulator** - Requires Xcode 12+ on macOS

   ```bash
   # Configure correct Xcode path
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

4. **Capacitor sync errors** - If `npx cap run ios` doesn't work
   ```bash
   # Use manual sync
   npm run build
   npx cap copy ios
   npx cap open ios
   # Then run from Xcode
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

## 🙏 Acknowledgments

- [Solana Labs](https://solana.com/) - For the amazing blockchain
- [Ionic Team](https://ionicframework.com/) - For mobile tools
- [Privy](https://privy.io/) - For Web3 authentication
- [React Team](https://reactjs.org/) - For the best UI library

## 📚 Useful Links

### Project Documentation

- [📖 API Documentation](docs/API.md) - Complete API documentation
- [🛠 Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Problem solving
- [🚨 Ruby Setup Guide](RUBY_SETUP.md) - Quick Ruby setup for iOS
- [🤝 Contributing Guide](CONTRIBUTING.md) - Developer guide
- [📋 Changelog](CHANGELOG.md) - Change history

### External Resources

- [Solana Docs](https://docs.solana.com/)
- [Ionic Docs](https://ionicframework.com/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Privy Docs](https://docs.privy.io/)
- [React Docs](https://reactjs.org/docs)
