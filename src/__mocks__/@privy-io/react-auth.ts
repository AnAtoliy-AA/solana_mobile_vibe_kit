// Mock for @privy-io/react-auth
import React from 'react';

export const usePrivy = () => ({
  ready: true,
  authenticated: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  linkEmail: jest.fn(),
  linkWallet: jest.fn(),
  unlinkEmail: jest.fn(),
  unlinkWallet: jest.fn(),
  linkPhone: jest.fn(),
  unlinkPhone: jest.fn(),
  linkGoogle: jest.fn(),
  unlinkGoogle: jest.fn(),
  linkTwitter: jest.fn(),
  unlinkTwitter: jest.fn(),
  linkDiscord: jest.fn(),
  unlinkDiscord: jest.fn(),
  exportWallet: jest.fn(),
  createWallet: jest.fn(),
});

export const useWallets = () => ({
  wallets: [],
  ready: true,
  loading: false,
  addWallet: jest.fn(),
  removeWallet: jest.fn(),
});

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

export default {
  usePrivy,
  useWallets,
  PrivyProvider,
};
