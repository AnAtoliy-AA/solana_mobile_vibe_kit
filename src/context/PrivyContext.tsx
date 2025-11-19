import React, { createContext, useContext, ReactNode } from 'react';
import { PrivyProvider as PrivyProviderBase, usePrivy, User } from '@privy-io/react-auth';

interface PrivyContextType {
  login: () => void;
  logout: () => void;
  authenticated: boolean;
  user: User | null;
  ready: boolean;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

interface PrivyProviderProps {
  children: ReactNode;
}

const PrivyAuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { login, logout, authenticated, user, ready } = usePrivy();

  const value: PrivyContextType = {
    login: () => login({ loginMethods: ['email'] }),
    logout,
    authenticated,
    user,
    ready,
  };

  return <PrivyContext.Provider value={value}>{children}</PrivyContext.Provider>;
};

export const PrivyProvider: React.FC<PrivyProviderProps> = ({ children }) => {
  // SECURITY: All configuration loaded from environment variables
  const privyAppId = process.env.REACT_APP_PRIVY_APP_ID;

  // Fallback mode when Privy configuration is missing (e.g., public demo builds)
  if (!privyAppId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'REACT_APP_PRIVY_APP_ID is not set. Privy authentication features are disabled.'
      );
    }

    const disabledValue: PrivyContextType = {
      login: () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Privy login requested but Privy is not configured.');
        }
      },
      logout: () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Privy logout requested but Privy is not configured.');
        }
      },
      authenticated: false,
      user: null,
      ready: false,
    };

    return <PrivyContext.Provider value={disabledValue}>{children}</PrivyContext.Provider>;
  }

  // Load optional configuration from environment
  const logoUrl = process.env.REACT_APP_PRIVY_LOGO_URL;
  const theme = process.env.REACT_APP_PRIVY_THEME;
  const accentColor = process.env.REACT_APP_PRIVY_ACCENT_COLOR;

  type PrivyTheme = 'light' | 'dark';
  let parsedTheme: PrivyTheme | undefined;

  if (theme && theme !== 'light' && theme !== 'dark') {
    throw new Error('REACT_APP_PRIVY_THEME must be either "light" or "dark" when provided.');
  }

  if (theme) {
    parsedTheme = theme as PrivyTheme;
  }

  // Validate accent color has # prefix
  if (accentColor && !accentColor.startsWith('#')) {
    throw new Error('REACT_APP_PRIVY_ACCENT_COLOR must start with # (e.g., #676FFF)');
  }

  const appearanceConfig = {
    ...(parsedTheme ? { theme: parsedTheme } : {}),
    ...(accentColor ? { accentColor: accentColor as `#${string}` } : {}),
    ...(logoUrl ? { logo: logoUrl } : {}),
  };

  return (
    <PrivyProviderBase
      appId={privyAppId}
      config={{
        appearance: appearanceConfig,
        loginMethods: ['email'],
        embeddedWallets: {
          // SECURITY: Enable Solana embedded wallet with secure key management
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <PrivyAuthWrapper>{children}</PrivyAuthWrapper>
    </PrivyProviderBase>
  );
};

export const usePrivyAuth = (): PrivyContextType => {
  const context = useContext(PrivyContext);
  if (context === undefined) {
    throw new Error('usePrivyAuth must be used within a PrivyProvider');
  }
  return context;
};
