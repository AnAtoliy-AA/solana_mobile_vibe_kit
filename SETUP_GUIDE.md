# Setup Guide - Solana Mobile Vibe Kit

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your Privy App ID:

```bash
# Get your App ID from https://dashboard.privy.io/
REACT_APP_PRIVY_APP_ID=your_privy_app_id_here

# Choose network: mainnet-beta, testnet, or devnet
REACT_APP_SOLANA_NETWORK=devnet
```

### 3. Set Up Privy (Required for Secure Wallets)

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Create an account or sign in
3. Create a new app
4. Copy your App ID to `.env`
5. **IMPORTANT:** Enable Solana support in your Privy app settings:
   - Go to Settings → Embedded Wallets
   - Enable "Solana" in supported chains
   - Save changes

### 4. Run the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## Environment Variables Reference

Create a `.env` file in the root directory with these variables:

```bash
# ============================================
# REQUIRED
# ============================================

# Privy App ID (get from https://dashboard.privy.io/)
REACT_APP_PRIVY_APP_ID=your_privy_app_id_here


# ============================================
# OPTIONAL
# ============================================

# Solana Network
# Options: mainnet-beta, testnet, devnet
# Default: devnet
REACT_APP_SOLANA_NETWORK=devnet

# Custom RPC Endpoint (optional)
# Leave empty to use default Solana public RPC
# For better performance, use a paid RPC provider:
# - QuickNode: https://www.quicknode.com/
# - Alchemy: https://www.alchemy.com/
# - Helius: https://helius.xyz/
REACT_APP_SOLANA_RPC_ENDPOINT=

# Explorer to use for transaction links
# Options: solana, solscan, solanabeach
# Default: solscan
REACT_APP_SOLANA_EXPLORER=solscan
```

---

## Privy Configuration

### Creating Your Privy App

1. **Sign up at Privy**
   - Visit https://dashboard.privy.io/
   - Create an account

2. **Create a New App**
   - Click "Create App"
   - Enter app name (e.g., "Solana Mobile SDK")
   - Select your app type

3. **Enable Solana**
   - Go to Settings → Embedded Wallets
   - Under "Supported Chains", enable **Solana**
   - Click Save

4. **Configure Login Methods**
   - Go to Settings → Login Methods
   - Enable "Email" (already configured in code)
   - Optionally enable other methods (Google, Twitter, etc.)

5. **Copy Your App ID**
   - Find your App ID in Settings → General
   - Copy it to your `.env` file

### Privy Environment Configuration

For development:
```bash
REACT_APP_PRIVY_APP_ID=your_dev_app_id
```

For production (separate app recommended):
```bash
REACT_APP_PRIVY_APP_ID=your_prod_app_id
```

---

## Network Configuration

### Development (Devnet)

Best for testing with free SOL from faucets:

```bash
REACT_APP_SOLANA_NETWORK=devnet
```

Get free devnet SOL:
- https://faucet.solana.com/
- https://solfaucet.com/

### Testing (Testnet)

For integration testing:

```bash
REACT_APP_SOLANA_NETWORK=testnet
```

### Production (Mainnet)

⚠️ **Only use mainnet when ready for production:**

```bash
REACT_APP_SOLANA_NETWORK=mainnet-beta
```

**Before deploying to mainnet:**
- Complete all TODO items in the code
- Remove or disable demo mode
- Conduct security audit
- Test thoroughly on devnet/testnet
- Review the [SECURITY.md](SECURITY.md) checklist

---

## Custom RPC Endpoints

For better performance and reliability, use a dedicated RPC provider:

### QuickNode
```bash
# Sign up at https://www.quicknode.com/
REACT_APP_SOLANA_RPC_ENDPOINT=https://your-endpoint.solana-mainnet.quiknode.pro/YOUR_TOKEN/
```

### Alchemy
```bash
# Sign up at https://www.alchemy.com/
REACT_APP_SOLANA_RPC_ENDPOINT=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### Helius
```bash
# Sign up at https://helius.xyz/
REACT_APP_SOLANA_RPC_ENDPOINT=https://rpc.helius.xyz/?api-key=YOUR_API_KEY
```

---

## Mobile Development Setup

### iOS Setup

**Prerequisites:**
- macOS with Xcode 12+
- Ruby 3.4.5+ (not system Ruby)
- CocoaPods

**Install Ruby and CocoaPods:**
```bash
# Install Ruby via Homebrew
brew install ruby

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify Ruby version
ruby --version  # Should be 3.4.5+

# Install CocoaPods
gem install cocoapods

# Verify installation
pod --version
```

**Build for iOS:**
```bash
# Build the web app
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Android Setup

**Prerequisites:**
- Android Studio
- Android SDK
- Java Development Kit (JDK)

**Environment Setup:**
```bash
# Add to ~/.zshrc or ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Build for Android:**
```bash
# Build the web app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

---

## Troubleshooting

### "REACT_APP_PRIVY_APP_ID not found" Warning

**Problem:** You see a warning about missing Privy App ID.

**Solution:**
1. Ensure you created a `.env` file (not `.env.example`)
2. Add your Privy App ID to `.env`
3. Restart the development server

### "No Solana embedded wallet found" Warning

**Problem:** Wallet doesn't connect after logging in with Privy.

**Solution:**
1. Go to Privy Dashboard → Settings → Embedded Wallets
2. Ensure "Solana" is checked under supported chains
3. Save and wait a few minutes for changes to propagate
4. Clear browser cache and try again

### CocoaPods Installation Fails (iOS)

**Problem:** `pod install` fails with Ruby errors.

**Solution:**
See [RUBY_SETUP.md](RUBY_SETUP.md) or:
```bash
# Use specific Ruby version
/opt/homebrew/lib/ruby/gems/3.4.0/bin/pod install
```

### Port 3000 Already in Use

**Problem:** Development server can't start.

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Build Errors After npm install

**Problem:** TypeScript or build errors after installing dependencies.

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
```

---

## Development vs Production

### Development Mode

What's enabled in development:
- ✅ Demo wallet option
- ✅ Mock transaction signatures
- ✅ Console warnings
- ✅ Devnet/Testnet networks
- ✅ Detailed error messages

### Production Mode

Before production deployment:
- [ ] Disable demo wallet code paths
- [ ] Implement real transaction signing and submission
- [ ] Remove or suppress console warnings
- [ ] Use mainnet-beta network
- [ ] Use production Privy App ID
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Review [SECURITY.md](SECURITY.md) checklist

---

## Next Steps

1. **Review Security Documentation**
   - Read [SECURITY.md](SECURITY.md)
   - Understand the security fixes applied
   - Follow the production checklist

2. **Explore the SDK**
   - Check [README.md](README.md) for API documentation
   - Review example code in `src/pages/`
   - Test wallet connection and transactions on devnet

3. **Customize Your App**
   - Update branding in `src/context/PrivyContext.tsx`
   - Modify UI in `src/pages/`
   - Add your custom features

4. **Deploy**
   - Test thoroughly on devnet
   - Complete production checklist
   - Deploy to hosting service (Vercel, Netlify, etc.)

---

## Support

- **Documentation**: Check [README.md](README.md) and [SECURITY.md](SECURITY.md)
- **Privy Support**: https://docs.privy.io/
- **Solana Documentation**: https://docs.solana.com/
- **Issues**: Report bugs via GitHub Issues

---

**Last Updated:** November 17, 2025
