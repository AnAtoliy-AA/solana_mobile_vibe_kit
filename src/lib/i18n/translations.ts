// Translation files for internationalization

export interface Translations {
  // Navbar
  home: string;
  createMeme: string;
  mentionsOnX: string;
  login: string;
  settings: string;

  // Search
  searchPlaceholder: string;

  // Tabs
  allTokens: string;
  active: string;
  upcoming: string;
  finished: string;

  // Table headers
  token: string;
  contractAddress: string;
  volume24h: string;
  marketCap: string;
  progress: string;
  holders: string;
  time: string;
  actions: string;

  // Tooltips
  tokenTooltip: string;
  contractTooltip: string;
  volumeTooltip: string;
  marketCapTooltip: string;
  progressTooltip: string;
  holdersTooltip: string;
  timeTooltip: string;
  actionsTooltip: string;
  copyTooltip: string;
  viewOnSolscan: string;
  tradeTooltip: string;
  visitTwitter: string;
  visitWebsite: string;

  // Actions
  trade: string;
  participate: string;
  participateInPool: string;
  copy: string;
  view: string;
  refreshNow: string;
  autoRefreshLabel: string;
  refreshTokenDetails: string;
  refreshIntervalOff: string;
  refreshInterval5s: string;
  refreshInterval15s: string;
  refreshInterval60s: string;
  refreshInterval10m: string;
  manualRefreshError: string;
  refreshedPrefix: string;
  socialLinks: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  visitTelegram: string;
  visitDiscord: string;

  // Loading/Empty states
  loading: string;
  loadingTokens: string;
  noTokensFound: string;
  noTokensFoundDesc: string;

  // Pool detail
  fundingProgress: string;
  statistics: string;
  tokenPrice: string;
  totalValueLocked: string;
  tvlTooltip: string;
  participants: string;
  minMax: string;
  minMaxParticipation: string;
  timeline: string;
  startDate: string;
  endDate: string;
  distribution: string;
  faq: string;
  poolNotFound: string;
  refreshTokenTooltip: string;
  targetAmount: string;
  currentAmount: string;
  currentAmountTooltip: string;
  targetAmountTooltip: string;
  tradingActivity: string;
  buys: string;
  sells: string;
  totalTransactions: string;
  volumeSol: string;
  volumeUsd: string;
  buysTooltip: string;
  sellsTooltip: string;
  totalTransactionsTooltip: string;
  tokenEconomics: string;
  totalSupply: string;
  totalSupplyTooltip: string;
  decimalsLabel: string;
  decimalsTooltip: string;
  tokenTypeLabel: string;
  tokenTypeTooltip: string;
  poolAndCreator: string;
  poolAddress: string;
  poolAddressTooltip: string;
  creator: string;
  creatorTooltip: string;
  holdersClickHint: string;
  totalLabel: string;
  viewOnSolscanHint: string;
  tokenUnit: string;
  minimumLabel: string;
  maximumLabel: string;

  // Time
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;

  // Settings modal
  settingsTitle: string;
  languageLabel: string;
  themeLabel: string;
  close: string;
  save: string;

  // Languages
  english: string;
  german: string;
  french: string;

  // Themes
  defaultTheme: string;
  darkTheme: string;
  oceanTheme: string;
  sunsetTheme: string;

  // Wallet Page (Tab1)
  wallet: string;
  yourBalance: string;
  walletAddress: string;
  network: string;
  notConnected: string;
  sendSol: string;
  receive: string;
  quickActions: string;
  refreshBalance: string;
  switchNetwork: string;
  copyAddress: string;
  disconnect: string;
  welcomeToSolanaWallet: string;
  connectEmailDescription: string;
  loginWithEmail: string;
  welcomeBack: string;
  connecting: string;
  connectDemoWallet: string;
  recipientAddress: string;
  enterSolanaAddress: string;
  amount: string;
  amountSol: string;
  memoOptional: string;
  transactionMemo: string;
  sendTransaction: string;
  selectNetwork: string;
  cancel: string;
  mainnet: string;
  testnet: string;
  devnet: string;
  refreshing: string;
  failedToFetchBalance: string;
  addressCopiedToClipboard: string;
  failedToCopyAddress: string;
  pleaseFillInAllRequiredFields: string;
  transactionSent: string;
  transactionFailed: string;
  receiveComingSoon: string;

  // Tokens Page (Tab2)
  tokens: string;
  connectYourWallet: string;
  loginToViewTokenPortfolio: string;
  walletNotConnected: string;
  connectWalletToViewBalances: string;
  totalValue: string;
  change24h: string;
  manageTokens: string;
  addToken: string;
  searchTokens: string;
  yourTokens: string;
  tokensCount: string;
  unknown: string;
  unknownToken: string;
  noTokensFoundTitle: string;
  addTokensToGetStarted: string;
  searchResults: string;
  popularTokens: string;
  failedToLoadTokenData: string;
  pleaseEnterTokenAddress: string;
  tokenAddedSuccessfully: string;
  failedToAddToken: string;
  sent: string;
  successfully: string;
  failedToSendToken: string;
  swapComingSoon: string;
  add: string;
  comingSoon: string;
  tokenContractAddress: string;
  enterTokenMintAddress: string;
  enterRecipientAddress: string;
  available: string;
  sendToken: string;
  loadingTokensMsg: string;

  // History Page (Tab3)
  history: string;
  loginToViewHistory: string;
  connectWalletToViewHistory: string;
  total: string;
  confirmed: string;
  pending: string;
  filterTransactions: string;
  all: string;
  send: string;
  swap: string;
  recentActivity: string;
  transactionsCount: string;
  to: string;
  from: string;
  tokenSwapTransaction: string;
  unknownTransaction: string;
  failed: string;
  noTransactionsFound: string;
  transactionHistoryWillAppear: string;
  transactionDetails: string;
  type: string;
  status: string;
  signature: string;
  viewOnExplorer: string;
  copySignature: string;
  viewExplorer: string;
  failedToLoadTransactionHistory: string;
  copiedToClipboard: string;
  failedToCopy: string;
  loadingTransactions: string;

  // Swap Page (Tab4)
  pleaseLoginToTrade: string;
  connectWalletToTrade: string;
  balance: string;
  max: string;
  selectToken: string;
  rate: string;
  priceImpact: string;
  slippageTolerance: string;
  swapping: string;
  connectWallet: string;
  enterAmount: string;
  poweredByJupiter: string;
  swapSettings: string;
  slippageDescription: string;
  pleaseFillAllFields: string;
  successfullySwapped: string;
  swapFailed: string;
  insufficientBalance: string;
  failedToFetchTokenBalances: string;
}

export const translations: Record<'en' | 'de' | 'fr', Translations> = {
  en: {
    // Navbar
    home: 'Home',
    createMeme: 'Create Meme',
    mentionsOnX: 'Mentions on X',
    login: 'Login',
    settings: 'Settings',

    // Search
    searchPlaceholder: 'Search by token name, ticker, or contract address...',

    // Tabs
    allTokens: 'All Tokens',
    active: 'Active',
    upcoming: 'Upcoming',
    finished: 'Finished',

    // Table headers
    token: 'Token',
    contractAddress: 'Contract Address',
    volume24h: 'Volume 24h',
    marketCap: 'Market Cap',
    progress: 'Progress',
    holders: 'Holders',
    time: 'Time',
    actions: 'Actions',

    // Tooltips
    tokenTooltip: 'Token name and symbol',
    contractTooltip: 'Solana blockchain contract address',
    volumeTooltip: 'Total trading volume in the last 24 hours',
    marketCapTooltip: 'Total market capitalization (circulating supply × price)',
    progressTooltip: 'Fundraising progress towards target goal',
    holdersTooltip: 'Number of unique wallet addresses holding this token',
    timeTooltip: 'Time since token launch',
    actionsTooltip: 'Available actions for this token',
    copyTooltip: 'Copy to clipboard',
    viewOnSolscan: 'View on Solscan',
    tradeTooltip: 'Trade this token on DEX',
    visitTwitter: 'Visit official Twitter/X',
    visitWebsite: 'Visit official website',

    // Actions
    trade: 'Trade',
    participate: 'Participate',
    participateInPool: 'Participate in Pool',
    copy: 'Copy',
    view: 'View',
    refreshNow: 'Refresh Now',
    autoRefreshLabel: 'Auto refresh frequency',
    refreshTokenDetails: 'Refresh token details',
    refreshIntervalOff: 'Off',
    refreshInterval5s: '5s',
    refreshInterval15s: '15s',
    refreshInterval60s: '60s',
    refreshInterval10m: '10m',
    manualRefreshError: 'Unable to refresh token details. Please try again.',
    refreshedPrefix: 'Refreshed',
    socialLinks: 'Social Links',
    website: 'Website',
    twitter: 'Twitter',
    telegram: 'Telegram',
    discord: 'Discord',
    visitTelegram: 'Visit Telegram channel',
    visitDiscord: 'Visit Discord server',

    // Loading/Empty states
    loading: 'Loading...',
    loadingTokens: 'Loading tokens...',
    noTokensFound: 'No tokens found',
    noTokensFoundDesc: 'Try adjusting your search or check back later for new launches',

    // Pool detail
    fundingProgress: 'Funding Progress',
    statistics: 'Statistics',
    tokenPrice: 'Token Price',
    totalValueLocked: 'Total Value Locked',
    tvlTooltip: 'Total value of assets locked in the pool',
    participants: 'Participants',
    minMax: 'Min/Max',
    minMaxParticipation: 'Min/Max Participation',
    timeline: 'Timeline',
    startDate: 'Start Date',
    endDate: 'End Date',
    distribution: 'Distribution',
    faq: 'FAQ',
    poolNotFound: 'Pool not found',
    refreshTokenTooltip: 'Refresh token details',
    targetAmount: 'Target Amount',
    currentAmount: 'Current Amount',
    currentAmountTooltip: 'Current amount raised',
    targetAmountTooltip: 'Target fundraising amount',
    tradingActivity: 'Trading Activity',
    buys: 'Buys',
    sells: 'Sells',
    totalTransactions: 'Total Transactions',
    volumeSol: 'Volume (SOL)',
    volumeUsd: 'Volume (USD)',
    buysTooltip: 'Number of buy transactions',
    sellsTooltip: 'Number of sell transactions',
    totalTransactionsTooltip: 'Total number of transactions',
    tokenEconomics: 'Token Economics',
    totalSupply: 'Total Supply',
    totalSupplyTooltip: 'Total token supply',
    decimalsLabel: 'Decimals',
    decimalsTooltip: 'Number of decimal places for the token',
    tokenTypeLabel: 'Token Type',
    tokenTypeTooltip: 'Type of token (e.g., SPL Token)',
    poolAndCreator: 'Pool & Creator',
    poolAddress: 'Pool Address',
    poolAddressTooltip: 'Pool contract address',
    creator: 'Creator',
    creatorTooltip: 'Creator wallet address',
    holdersClickHint: 'Click to view on Solscan',
    totalLabel: 'Total:',
    viewOnSolscanHint: 'View on Solscan',
    tokenUnit: 'tokens',
    minimumLabel: 'Minimum',
    maximumLabel: 'Maximum',

    // Time
    justNow: 'Just now',
    minutesAgo: 'm ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',

    // Settings modal
    settingsTitle: 'Settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    close: 'Close',
    save: 'Save',

    // Languages
    english: 'English',
    german: 'German',
    french: 'French',

    // Themes
    defaultTheme: 'Default',
    darkTheme: 'Dark',
    oceanTheme: 'Ocean',
    sunsetTheme: 'Sunset',

    // Wallet Page (Tab1)
    wallet: 'Wallet',
    yourBalance: 'Your Balance',
    walletAddress: 'Wallet Address',
    network: 'Network',
    notConnected: 'Not connected',
    sendSol: 'Send SOL',
    receive: 'Receive',
    quickActions: 'Quick Actions',
    refreshBalance: 'Refresh Balance',
    switchNetwork: 'Switch Network',
    copyAddress: 'Copy Address',
    disconnect: 'Disconnect',
    welcomeToSolanaWallet: 'Welcome to Solana Wallet',
    connectEmailDescription:
      'Connect your email to access wallet features and manage your Solana assets',
    loginWithEmail: 'Login with Email',
    welcomeBack: 'Welcome back!',
    connecting: 'Connecting...',
    connectDemoWallet: 'Connect Demo Wallet',
    recipientAddress: 'Recipient Address',
    enterSolanaAddress: 'Enter Solana address',
    amount: 'Amount',
    amountSol: 'Amount (SOL)',
    memoOptional: 'Memo (Optional)',
    transactionMemo: 'Transaction memo',
    sendTransaction: 'Send Transaction',
    selectNetwork: 'Select Network',
    cancel: 'Cancel',
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    devnet: 'Devnet',
    refreshing: 'Refreshing...',
    failedToFetchBalance: 'Failed to fetch balance',
    addressCopiedToClipboard: 'Address copied to clipboard',
    failedToCopyAddress: 'Failed to copy address',
    pleaseFillInAllRequiredFields: 'Please fill in all required fields',
    transactionSent: 'Transaction sent!',
    transactionFailed: 'Transaction failed',
    receiveComingSoon: 'Receive functionality coming soon!',

    // Tokens Page (Tab2)
    tokens: 'Tokens',
    connectYourWallet: 'Connect Your Wallet',
    loginToViewTokenPortfolio: 'Login to view and manage your token portfolio',
    walletNotConnected: 'Wallet Not Connected',
    connectWalletToViewBalances: 'Connect your wallet to view your token balances',
    totalValue: 'Total Value',
    change24h: '24h Change',
    manageTokens: 'Manage Tokens',
    addToken: 'Add Token',
    searchTokens: 'Search tokens...',
    yourTokens: 'Your Tokens',
    tokensCount: ' tokens',
    unknown: 'Unknown',
    unknownToken: 'Unknown Token',
    noTokensFoundTitle: 'No Tokens Found',
    addTokensToGetStarted: 'Add some tokens to your wallet to get started',
    searchResults: 'Search Results',
    popularTokens: 'Popular Tokens',
    failedToLoadTokenData: 'Failed to load token data',
    pleaseEnterTokenAddress: 'Please enter a token address',
    tokenAddedSuccessfully: 'Token added successfully!',
    failedToAddToken: 'Failed to add token',
    sent: 'Sent',
    successfully: ' successfully!',
    failedToSendToken: 'Failed to send token',
    swapComingSoon: 'Swap coming soon!',
    add: 'Add',
    comingSoon: ' coming soon!',
    tokenContractAddress: 'Token Contract Address',
    enterTokenMintAddress: 'Enter token mint address',
    enterRecipientAddress: 'Enter recipient address',
    available: 'Available: ',
    sendToken: 'Send Token',
    loadingTokensMsg: 'Loading tokens...',

    // History Page (Tab3)
    history: 'History',
    loginToViewHistory: 'Login to view your transaction history and activity',
    connectWalletToViewHistory: 'Connect your wallet to view transaction history',
    total: 'Total',
    confirmed: 'Confirmed',
    pending: 'Pending',
    filterTransactions: 'Filter Transactions',
    all: 'All',
    send: 'Send',
    swap: 'Swap',
    recentActivity: 'Recent Activity',
    transactionsCount: ' transactions',
    to: 'To: ',
    from: 'From: ',
    tokenSwapTransaction: 'Token swap transaction',
    unknownTransaction: 'Unknown transaction',
    failed: 'failed',
    noTransactionsFound: 'No Transactions Found',
    transactionHistoryWillAppear:
      'Your transaction history will appear here once you start using your wallet',
    transactionDetails: 'Transaction Details',
    type: 'Type',
    status: 'Status',
    signature: 'Signature',
    viewOnExplorer: 'View on Explorer',
    copySignature: 'Copy Signature',
    viewExplorer: 'View Explorer',
    failedToLoadTransactionHistory: 'Failed to load transaction history',
    copiedToClipboard: 'Copied to clipboard',
    failedToCopy: 'Failed to copy',
    loadingTransactions: 'Loading transactions...',

    // Swap Page (Tab4)
    pleaseLoginToTrade: 'Please login to start trading',
    connectWalletToTrade: 'Please connect your wallet to trade',
    balance: 'Balance: ',
    max: 'MAX',
    selectToken: 'Select token',
    rate: 'Rate',
    priceImpact: 'Price Impact',
    slippageTolerance: 'Slippage Tolerance',
    swapping: 'Swapping...',
    connectWallet: 'Connect Wallet',
    enterAmount: 'Enter Amount',
    poweredByJupiter: 'Powered by Jupiter - Best price guaranteed',
    swapSettings: 'Swap Settings',
    slippageDescription:
      'Your transaction will revert if the price changes unfavorably by more than this percentage',
    pleaseFillAllFields: 'Please connect wallet and fill all fields',
    successfullySwapped: 'Successfully swapped ',
    swapFailed: 'Swap failed. Please try again.',
    insufficientBalance: 'Insufficient balance',
    failedToFetchTokenBalances: 'Failed to fetch token balances',
  },
  de: {
    // Navbar
    home: 'Startseite',
    createMeme: 'Meme Erstellen',
    mentionsOnX: 'Erwähnungen auf X',
    login: 'Anmelden',
    settings: 'Einstellungen',

    // Search
    searchPlaceholder: 'Suche nach Token-Name, Ticker oder Vertragsadresse...',

    // Tabs
    allTokens: 'Alle Token',
    active: 'Aktiv',
    upcoming: 'Bevorstehend',
    finished: 'Beendet',

    // Table headers
    token: 'Token',
    contractAddress: 'Vertragsadresse',
    volume24h: 'Volumen 24h',
    marketCap: 'Marktkapitalisierung',
    progress: 'Fortschritt',
    holders: 'Inhaber',
    time: 'Zeit',
    actions: 'Aktionen',

    // Tooltips
    tokenTooltip: 'Token-Name und Symbol',
    contractTooltip: 'Solana Blockchain Vertragsadresse',
    volumeTooltip: 'Gesamtes Handelsvolumen in den letzten 24 Stunden',
    marketCapTooltip: 'Gesamte Marktkapitalisierung (Umlaufmenge × Preis)',
    progressTooltip: 'Fundraising-Fortschritt zum Ziel',
    holdersTooltip: 'Anzahl eindeutiger Wallet-Adressen mit diesem Token',
    timeTooltip: 'Zeit seit Token-Start',
    actionsTooltip: 'Verfügbare Aktionen für diesen Token',
    copyTooltip: 'In Zwischenablage kopieren',
    viewOnSolscan: 'Auf Solscan anzeigen',
    tradeTooltip: 'Diesen Token auf DEX handeln',
    visitTwitter: 'Offizielles Twitter/X besuchen',
    visitWebsite: 'Offizielle Website besuchen',

    // Actions
    trade: 'Handeln',
    participate: 'Teilnehmen',
    participateInPool: 'Am Pool teilnehmen',
    copy: 'Kopieren',
    view: 'Anzeigen',
    refreshNow: 'Jetzt aktualisieren',
    autoRefreshLabel: 'Automatische Aktualisierung',
    refreshTokenDetails: 'Token-Details aktualisieren',
    refreshIntervalOff: 'Aus',
    refreshInterval5s: '5s',
    refreshInterval15s: '15s',
    refreshInterval60s: '60s',
    refreshInterval10m: '10 Min.',
    manualRefreshError: 'Token-Details konnten nicht aktualisiert werden. Bitte erneut versuchen.',
    refreshedPrefix: 'Aktualisiert',
    socialLinks: 'Soziale Links',
    website: 'Website',
    twitter: 'Twitter',
    telegram: 'Telegram',
    discord: 'Discord',
    visitTelegram: 'Telegram-Kanal besuchen',
    visitDiscord: 'Discord-Server besuchen',

    // Loading/Empty states
    loading: 'Lädt...',
    loadingTokens: 'Lade Token...',
    noTokensFound: 'Keine Token gefunden',
    noTokensFoundDesc: 'Passen Sie Ihre Suche an oder schauen Sie später für neue Starts vorbei',

    // Pool detail
    fundingProgress: 'Finanzierungsfortschritt',
    statistics: 'Statistiken',
    tokenPrice: 'Token-Preis',
    totalValueLocked: 'Gesamt gesperrter Wert',
    tvlTooltip: 'Gesamter Wert der im Pool gesperrten Vermögenswerte',
    participants: 'Teilnehmer',
    minMax: 'Min/Max',
    minMaxParticipation: 'Min/Max Teilnahme',
    timeline: 'Zeitplan',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    distribution: 'Verteilung',
    faq: 'FAQ',
    poolNotFound: 'Pool nicht gefunden',
    refreshTokenTooltip: 'Token-Details aktualisieren',
    targetAmount: 'Zielbetrag',
    currentAmount: 'Aktueller Betrag',
    currentAmountTooltip: 'Aktueller eingesammelter Betrag',
    targetAmountTooltip: 'Zielbetrag der Finanzierung',
    tradingActivity: 'Handelsaktivität',
    buys: 'Käufe',
    sells: 'Verkäufe',
    totalTransactions: 'Gesamttransaktionen',
    volumeSol: 'Volumen (SOL)',
    volumeUsd: 'Volumen (USD)',
    buysTooltip: 'Anzahl der Kauftransaktionen',
    sellsTooltip: 'Anzahl der Verkaufstransaktionen',
    totalTransactionsTooltip: 'Gesamtzahl der Transaktionen',
    tokenEconomics: 'Token-Ökonomie',
    totalSupply: 'Gesamtangebot',
    totalSupplyTooltip: 'Gesamtes Token-Angebot',
    decimalsLabel: 'Dezimalstellen',
    decimalsTooltip: 'Anzahl der Dezimalstellen des Tokens',
    tokenTypeLabel: 'Tokentyp',
    tokenTypeTooltip: 'Art des Tokens (z. B. SPL Token)',
    poolAndCreator: 'Pool & Ersteller',
    poolAddress: 'Pool-Adresse',
    poolAddressTooltip: 'Pool-Vertragsadresse',
    creator: 'Ersteller',
    creatorTooltip: 'Wallet-Adresse des Erstellers',
    holdersClickHint: 'Zum Anzeigen auf Solscan klicken',
    totalLabel: 'Gesamt:',
    viewOnSolscanHint: 'Auf Solscan ansehen',
    tokenUnit: 'Token',
    minimumLabel: 'Minimum',
    maximumLabel: 'Maximum',

    // Time
    justNow: 'Gerade eben',
    minutesAgo: ' Min. her',
    hoursAgo: ' Std. her',
    daysAgo: ' T. her',

    // Settings modal
    settingsTitle: 'Einstellungen',
    languageLabel: 'Sprache',
    themeLabel: 'Design',
    close: 'Schließen',
    save: 'Speichern',

    // Languages
    english: 'Englisch',
    german: 'Deutsch',
    french: 'Französisch',

    // Themes
    defaultTheme: 'Standard',
    darkTheme: 'Dunkel',
    oceanTheme: 'Ozean',
    sunsetTheme: 'Sonnenuntergang',

    // Wallet Page (Tab1)
    wallet: 'Wallet',
    yourBalance: 'Ihr Guthaben',
    walletAddress: 'Wallet-Adresse',
    network: 'Netzwerk',
    notConnected: 'Nicht verbunden',
    sendSol: 'SOL Senden',
    receive: 'Empfangen',
    quickActions: 'Schnellaktionen',
    refreshBalance: 'Guthaben aktualisieren',
    switchNetwork: 'Netzwerk wechseln',
    copyAddress: 'Adresse kopieren',
    disconnect: 'Trennen',
    welcomeToSolanaWallet: 'Willkommen bei Solana Wallet',
    connectEmailDescription:
      'Verbinden Sie Ihre E-Mail, um auf Wallet-Funktionen zuzugreifen und Ihre Solana-Assets zu verwalten',
    loginWithEmail: 'Mit E-Mail anmelden',
    welcomeBack: 'Willkommen zurück!',
    connecting: 'Verbinde...',
    connectDemoWallet: 'Demo-Wallet verbinden',
    recipientAddress: 'Empfängeradresse',
    enterSolanaAddress: 'Solana-Adresse eingeben',
    amount: 'Betrag',
    amountSol: 'Betrag (SOL)',
    memoOptional: 'Memo (Optional)',
    transactionMemo: 'Transaktionsmemo',
    sendTransaction: 'Transaktion senden',
    selectNetwork: 'Netzwerk auswählen',
    cancel: 'Abbrechen',
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    devnet: 'Devnet',
    refreshing: 'Aktualisiere...',
    failedToFetchBalance: 'Guthaben konnte nicht abgerufen werden',
    addressCopiedToClipboard: 'Adresse in Zwischenablage kopiert',
    failedToCopyAddress: 'Adresse konnte nicht kopiert werden',
    pleaseFillInAllRequiredFields: 'Bitte füllen Sie alle Pflichtfelder aus',
    transactionSent: 'Transaktion gesendet!',
    transactionFailed: 'Transaktion fehlgeschlagen',
    receiveComingSoon: 'Empfangen-Funktion demnächst verfügbar!',

    // Tokens Page (Tab2)
    tokens: 'Token',
    connectYourWallet: 'Verbinden Sie Ihr Wallet',
    loginToViewTokenPortfolio:
      'Melden Sie sich an, um Ihr Token-Portfolio anzuzeigen und zu verwalten',
    walletNotConnected: 'Wallet Nicht Verbunden',
    connectWalletToViewBalances: 'Verbinden Sie Ihr Wallet, um Ihre Token-Guthaben anzuzeigen',
    totalValue: 'Gesamtwert',
    change24h: '24h Änderung',
    manageTokens: 'Token Verwalten',
    addToken: 'Token Hinzufügen',
    searchTokens: 'Token suchen...',
    yourTokens: 'Ihre Token',
    tokensCount: ' Token',
    unknown: 'Unbekannt',
    unknownToken: 'Unbekannter Token',
    noTokensFoundTitle: 'Keine Token Gefunden',
    addTokensToGetStarted: 'Fügen Sie Token zu Ihrem Wallet hinzu, um zu beginnen',
    searchResults: 'Suchergebnisse',
    popularTokens: 'Beliebte Token',
    failedToLoadTokenData: 'Token-Daten konnten nicht geladen werden',
    pleaseEnterTokenAddress: 'Bitte geben Sie eine Token-Adresse ein',
    tokenAddedSuccessfully: 'Token erfolgreich hinzugefügt!',
    failedToAddToken: 'Token konnte nicht hinzugefügt werden',
    sent: 'Gesendet',
    successfully: ' erfolgreich!',
    failedToSendToken: 'Token konnte nicht gesendet werden',
    swapComingSoon: 'Swap demnächst verfügbar!',
    add: 'Hinzufügen',
    comingSoon: ' demnächst verfügbar!',
    tokenContractAddress: 'Token-Vertragsadresse',
    enterTokenMintAddress: 'Token-Mint-Adresse eingeben',
    enterRecipientAddress: 'Empfängeradresse eingeben',
    available: 'Verfügbar: ',
    sendToken: 'Token Senden',
    loadingTokensMsg: 'Lade Token...',

    // History Page (Tab3)
    history: 'Verlauf',
    loginToViewHistory: 'Melden Sie sich an, um Ihren Transaktionsverlauf anzuzeigen',
    connectWalletToViewHistory: 'Verbinden Sie Ihr Wallet, um den Transaktionsverlauf anzuzeigen',
    total: 'Gesamt',
    confirmed: 'Bestätigt',
    pending: 'Ausstehend',
    filterTransactions: 'Transaktionen Filtern',
    all: 'Alle',
    send: 'Senden',
    swap: 'Tauschen',
    recentActivity: 'Letzte Aktivität',
    transactionsCount: ' Transaktionen',
    to: 'An: ',
    from: 'Von: ',
    tokenSwapTransaction: 'Token-Tausch-Transaktion',
    unknownTransaction: 'Unbekannte Transaktion',
    failed: 'fehlgeschlagen',
    noTransactionsFound: 'Keine Transaktionen Gefunden',
    transactionHistoryWillAppear:
      'Ihr Transaktionsverlauf wird hier angezeigt, sobald Sie Ihr Wallet verwenden',
    transactionDetails: 'Transaktionsdetails',
    type: 'Typ',
    status: 'Status',
    signature: 'Signatur',
    viewOnExplorer: 'Im Explorer Anzeigen',
    copySignature: 'Signatur Kopieren',
    viewExplorer: 'Explorer Anzeigen',
    failedToLoadTransactionHistory: 'Transaktionsverlauf konnte nicht geladen werden',
    copiedToClipboard: 'In Zwischenablage kopiert',
    failedToCopy: 'Kopieren fehlgeschlagen',
    loadingTransactions: 'Lade Transaktionen...',

    // Swap Page (Tab4)
    pleaseLoginToTrade: 'Bitte melden Sie sich an, um mit dem Handel zu beginnen',
    connectWalletToTrade: 'Bitte verbinden Sie Ihr Wallet zum Handeln',
    balance: 'Guthaben: ',
    max: 'MAX',
    selectToken: 'Token auswählen',
    rate: 'Kurs',
    priceImpact: 'Preisauswirkung',
    slippageTolerance: 'Slippage-Toleranz',
    swapping: 'Tausche...',
    connectWallet: 'Wallet Verbinden',
    enterAmount: 'Betrag Eingeben',
    poweredByJupiter: 'Powered by Jupiter - Bester Preis garantiert',
    swapSettings: 'Swap-Einstellungen',
    slippageDescription:
      'Ihre Transaktion wird rückgängig gemacht, wenn sich der Preis ungünstig um mehr als diesen Prozentsatz ändert',
    pleaseFillAllFields: 'Bitte verbinden Sie Wallet und füllen Sie alle Felder aus',
    successfullySwapped: 'Erfolgreich getauscht ',
    swapFailed: 'Swap fehlgeschlagen. Bitte versuchen Sie es erneut.',
    insufficientBalance: 'Unzureichendes Guthaben',
    failedToFetchTokenBalances: 'Token-Guthaben konnten nicht abgerufen werden',
  },
  fr: {
    // Navbar
    home: 'Accueil',
    createMeme: 'Créer un Meme',
    mentionsOnX: 'Mentions sur X',
    login: 'Connexion',
    settings: 'Paramètres',

    // Search
    searchPlaceholder: 'Rechercher par nom de token, ticker ou adresse de contrat...',

    // Tabs
    allTokens: 'Tous les Tokens',
    active: 'Actif',
    upcoming: 'À venir',
    finished: 'Terminé',

    // Table headers
    token: 'Token',
    contractAddress: 'Adresse du Contrat',
    volume24h: 'Volume 24h',
    marketCap: 'Capitalisation',
    progress: 'Progression',
    holders: 'Détenteurs',
    time: 'Temps',
    actions: 'Actions',

    // Tooltips
    tokenTooltip: 'Nom et symbole du token',
    contractTooltip: 'Adresse du contrat blockchain Solana',
    volumeTooltip: 'Volume total de trading dans les dernières 24 heures',
    marketCapTooltip: 'Capitalisation boursière totale (offre en circulation × prix)',
    progressTooltip: "Progression de la collecte de fonds vers l'objectif",
    holdersTooltip: "Nombre d'adresses de portefeuille uniques détenant ce token",
    timeTooltip: 'Temps écoulé depuis le lancement du token',
    actionsTooltip: 'Actions disponibles pour ce token',
    copyTooltip: 'Copier dans le presse-papiers',
    viewOnSolscan: 'Voir sur Solscan',
    tradeTooltip: 'Échanger ce token sur DEX',
    visitTwitter: 'Visiter Twitter/X officiel',
    visitWebsite: 'Visiter le site officiel',

    // Actions
    trade: 'Échanger',
    participate: 'Participer',
    participateInPool: 'Participer au Pool',
    copy: 'Copier',
    view: 'Voir',
    refreshNow: 'Actualiser maintenant',
    autoRefreshLabel: "Fréquence d'actualisation auto",
    refreshTokenDetails: 'Actualiser les détails du token',
    refreshIntervalOff: 'Arrêt',
    refreshInterval5s: '5s',
    refreshInterval15s: '15s',
    refreshInterval60s: '60s',
    refreshInterval10m: '10 min',
    manualRefreshError: "Impossible d'actualiser les détails du token. Réessayez.",
    refreshedPrefix: 'Actualisé',
    socialLinks: 'Liens sociaux',
    website: 'Site web',
    twitter: 'Twitter',
    telegram: 'Telegram',
    discord: 'Discord',
    visitTelegram: 'Visiter le canal Telegram',
    visitDiscord: 'Visiter le serveur Discord',

    // Loading/Empty states
    loading: 'Chargement...',
    loadingTokens: 'Chargement des tokens...',
    noTokensFound: 'Aucun token trouvé',
    noTokensFoundDesc:
      "Essayez d'ajuster votre recherche ou revenez plus tard pour de nouveaux lancements",

    // Pool detail
    fundingProgress: 'Progression du Financement',
    statistics: 'Statistiques',
    tokenPrice: 'Prix du Token',
    totalValueLocked: 'Valeur Totale Verrouillée',
    tvlTooltip: 'Valeur totale des actifs verrouillés dans le pool',
    participants: 'Participants',
    minMax: 'Min/Max',
    minMaxParticipation: 'Participation Min/Max',
    timeline: 'Calendrier',
    startDate: 'Date de Début',
    endDate: 'Date de Fin',
    distribution: 'Distribution',
    faq: 'FAQ',
    poolNotFound: 'Pool non trouvé',
    refreshTokenTooltip: 'Actualiser les détails du token',
    targetAmount: 'Montant cible',
    currentAmount: 'Montant actuel',
    currentAmountTooltip: 'Montant levé actuel',
    targetAmountTooltip: 'Montant de financement cible',
    tradingActivity: 'Activité de trading',
    buys: 'Achats',
    sells: 'Ventes',
    totalTransactions: 'Transactions totales',
    volumeSol: 'Volume (SOL)',
    volumeUsd: 'Volume (USD)',
    buysTooltip: "Nombre d'opérations d'achat",
    sellsTooltip: "Nombre d'opérations de vente",
    totalTransactionsTooltip: 'Nombre total de transactions',
    tokenEconomics: 'Économie du Token',
    totalSupply: 'Offre totale',
    totalSupplyTooltip: 'Offre totale de tokens',
    decimalsLabel: 'Décimales',
    decimalsTooltip: 'Nombre de décimales du token',
    tokenTypeLabel: 'Type de token',
    tokenTypeTooltip: 'Type de token (ex. SPL Token)',
    poolAndCreator: 'Pool & Créateur',
    poolAddress: 'Adresse du pool',
    poolAddressTooltip: 'Adresse du contrat du pool',
    creator: 'Créateur',
    creatorTooltip: 'Adresse du portefeuille du créateur',
    holdersClickHint: 'Cliquez pour voir sur Solscan',
    totalLabel: 'Total :',
    viewOnSolscanHint: 'Voir sur Solscan',
    tokenUnit: 'tokens',
    minimumLabel: 'Minimum',
    maximumLabel: 'Maximum',

    // Time
    justNow: "À l'instant",
    minutesAgo: ' min',
    hoursAgo: ' h',
    daysAgo: ' j',

    // Settings modal
    settingsTitle: 'Paramètres',
    languageLabel: 'Langue',
    themeLabel: 'Thème',
    close: 'Fermer',
    save: 'Enregistrer',

    // Languages
    english: 'Anglais',
    german: 'Allemand',
    french: 'Français',

    // Themes
    defaultTheme: 'Par Défaut',
    darkTheme: 'Sombre',
    oceanTheme: 'Océan',
    sunsetTheme: 'Coucher de Soleil',

    // Wallet Page (Tab1)
    wallet: 'Portefeuille',
    yourBalance: 'Votre Solde',
    walletAddress: 'Adresse du Portefeuille',
    network: 'Réseau',
    notConnected: 'Non connecté',
    sendSol: 'Envoyer SOL',
    receive: 'Recevoir',
    quickActions: 'Actions Rapides',
    refreshBalance: 'Actualiser le Solde',
    switchNetwork: 'Changer de Réseau',
    copyAddress: "Copier l'Adresse",
    disconnect: 'Déconnecter',
    welcomeToSolanaWallet: 'Bienvenue sur Solana Wallet',
    connectEmailDescription:
      'Connectez votre e-mail pour accéder aux fonctionnalités du portefeuille et gérer vos actifs Solana',
    loginWithEmail: 'Se Connecter avec E-mail',
    welcomeBack: 'Bon retour !',
    connecting: 'Connexion...',
    connectDemoWallet: 'Connecter le Portefeuille Démo',
    recipientAddress: 'Adresse du Destinataire',
    enterSolanaAddress: "Entrez l'adresse Solana",
    amount: 'Montant',
    amountSol: 'Montant (SOL)',
    memoOptional: 'Mémo (Facultatif)',
    transactionMemo: 'Mémo de transaction',
    sendTransaction: 'Envoyer la Transaction',
    selectNetwork: 'Sélectionner le Réseau',
    cancel: 'Annuler',
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    devnet: 'Devnet',
    refreshing: 'Actualisation...',
    failedToFetchBalance: 'Échec de la récupération du solde',
    addressCopiedToClipboard: 'Adresse copiée dans le presse-papiers',
    failedToCopyAddress: "Échec de la copie de l'adresse",
    pleaseFillInAllRequiredFields: 'Veuillez remplir tous les champs obligatoires',
    transactionSent: 'Transaction envoyée !',
    transactionFailed: 'Transaction échouée',
    receiveComingSoon: 'Fonctionnalité de réception bientôt disponible !',

    // Tokens Page (Tab2)
    tokens: 'Tokens',
    connectYourWallet: 'Connectez Votre Portefeuille',
    loginToViewTokenPortfolio: 'Connectez-vous pour voir et gérer votre portefeuille de tokens',
    walletNotConnected: 'Portefeuille Non Connecté',
    connectWalletToViewBalances: 'Connectez votre portefeuille pour voir vos soldes de tokens',
    totalValue: 'Valeur Totale',
    change24h: 'Changement 24h',
    manageTokens: 'Gérer les Tokens',
    addToken: 'Ajouter un Token',
    searchTokens: 'Rechercher des tokens...',
    yourTokens: 'Vos Tokens',
    tokensCount: ' tokens',
    unknown: 'Inconnu',
    unknownToken: 'Token Inconnu',
    noTokensFoundTitle: 'Aucun Token Trouvé',
    addTokensToGetStarted: 'Ajoutez des tokens à votre portefeuille pour commencer',
    searchResults: 'Résultats de Recherche',
    popularTokens: 'Tokens Populaires',
    failedToLoadTokenData: 'Échec du chargement des données de token',
    pleaseEnterTokenAddress: 'Veuillez entrer une adresse de token',
    tokenAddedSuccessfully: 'Token ajouté avec succès !',
    failedToAddToken: "Échec de l'ajout du token",
    sent: 'Envoyé',
    successfully: ' avec succès !',
    failedToSendToken: "Échec de l'envoi du token",
    swapComingSoon: 'Échange bientôt disponible !',
    add: 'Ajouter',
    comingSoon: ' bientôt disponible !',
    tokenContractAddress: 'Adresse du Contrat Token',
    enterTokenMintAddress: "Entrez l'adresse de mint du token",
    enterRecipientAddress: "Entrez l'adresse du destinataire",
    available: 'Disponible : ',
    sendToken: 'Envoyer le Token',
    loadingTokensMsg: 'Chargement des tokens...',

    // History Page (Tab3)
    history: 'Historique',
    loginToViewHistory: 'Connectez-vous pour voir votre historique de transactions',
    connectWalletToViewHistory:
      "Connectez votre portefeuille pour voir l'historique des transactions",
    total: 'Total',
    confirmed: 'Confirmé',
    pending: 'En Attente',
    filterTransactions: 'Filtrer les Transactions',
    all: 'Tous',
    send: 'Envoyer',
    swap: 'Échanger',
    recentActivity: 'Activité Récente',
    transactionsCount: ' transactions',
    to: 'À : ',
    from: 'De : ',
    tokenSwapTransaction: "Transaction d'échange de token",
    unknownTransaction: 'Transaction inconnue',
    failed: 'échoué',
    noTransactionsFound: 'Aucune Transaction Trouvée',
    transactionHistoryWillAppear:
      'Votre historique de transactions apparaîtra ici une fois que vous commencerez à utiliser votre portefeuille',
    transactionDetails: 'Détails de la Transaction',
    type: 'Type',
    status: 'Statut',
    signature: 'Signature',
    viewOnExplorer: "Voir sur l'Explorateur",
    copySignature: 'Copier la Signature',
    viewExplorer: "Voir l'Explorateur",
    failedToLoadTransactionHistory: "Échec du chargement de l'historique des transactions",
    copiedToClipboard: 'Copié dans le presse-papiers',
    failedToCopy: 'Échec de la copie',
    loadingTransactions: 'Chargement des transactions...',

    // Swap Page (Tab4)
    pleaseLoginToTrade: 'Veuillez vous connecter pour commencer à trader',
    connectWalletToTrade: 'Veuillez connecter votre portefeuille pour trader',
    balance: 'Solde : ',
    max: 'MAX',
    selectToken: 'Sélectionner un token',
    rate: 'Taux',
    priceImpact: 'Impact sur le Prix',
    slippageTolerance: 'Tolérance au Glissement',
    swapping: 'Échange en cours...',
    connectWallet: 'Connecter le Portefeuille',
    enterAmount: 'Entrer le Montant',
    poweredByJupiter: 'Propulsé par Jupiter - Meilleur prix garanti',
    swapSettings: "Paramètres d'Échange",
    slippageDescription:
      'Votre transaction sera annulée si le prix change défavorablement de plus que ce pourcentage',
    pleaseFillAllFields: 'Veuillez connecter le portefeuille et remplir tous les champs',
    successfullySwapped: 'Échange réussi ',
    swapFailed: 'Échange échoué. Veuillez réessayer.',
    insufficientBalance: 'Solde insuffisant',
    failedToFetchTokenBalances: 'Échec de la récupération des soldes de tokens',
  },
};
