import { useEffect, useMemo } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSolana } from '../context/SolanaContext';

/**
 * SECURE IMPLEMENTATION using Privy's Embedded Wallets
 *
 * This hook integrates Privy's secure embedded wallet with the Solana SDK.
 * Privy manages the private keys securely on their infrastructure with proper
 * encryption and key management - keys are NEVER exposed to the client.
 *
 * Security Features:
 * - Private keys stored encrypted in Privy's secure infrastructure
 * - MPC (Multi-Party Computation) for signing operations
 * - No client-side private key exposure
 * - Proper key derivation using industry standards
 */
export const usePrivySolana = () => {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { sdk } = useSolana();

  const walletSignature = useMemo(() => {
    if (!wallets || wallets.length === 0) {
      return 'empty';
    }

    return wallets
      .map((wallet) => {
        const clientType = wallet.walletClientType ?? 'unknown';
        const address = wallet.address ?? 'no-address';
        return `${clientType}:${address}`;
      })
      .sort()
      .join('|');
  }, [wallets]);

  useEffect(() => {
    const handlePrivyAuth = async () => {
      if (!sdk) {
        return;
      }

      if (!authenticated || !user) {
        if (!sdk.wallet.isConnected()) {
          return;
        }

        try {
          await sdk.wallet.disconnectWallet();
          console.info('✅ Wallet disconnected');
        } catch (error) {
          console.error('❌ Failed to disconnect wallet:', error);
        }
        return;
      }

      try {
        const solanaWallet = wallets.find(
          (wallet) => wallet.walletClientType === 'privy' && wallet.address
        );

        if (!solanaWallet || !solanaWallet.address) {
          console.warn(
            '⚠️ No Solana embedded wallet found. Ensure Privy is configured for Solana.'
          );
          return;
        }

        const currentState = sdk.wallet.getState();
        if (currentState.publicKey?.toBase58() === solanaWallet.address && currentState.connected) {
          return;
        }

        const publicKey = new PublicKey(solanaWallet.address);

        await sdk.wallet.connectCustomWallet('Privy Embedded Wallet', {
          publicKey,
          signTransaction: async (tx: Transaction) => {
            const provider = await solanaWallet.getEthereumProvider();

            if (!provider || typeof provider.request !== 'function') {
              throw new Error('Privy wallet provider not available');
            }

            const serializedTx = tx.serialize({
              requireAllSignatures: false,
              verifySignatures: false,
            });

            const signature = await provider.request({
              method: 'signTransaction',
              params: [serializedTx.toString('base64')],
            });

            return Transaction.from(Buffer.from(signature as string, 'base64'));
          },
          signAllTransactions: async (txs: Transaction[]) => {
            const provider = await solanaWallet.getEthereumProvider();

            if (!provider || typeof provider.request !== 'function') {
              throw new Error('Privy wallet provider not available');
            }

            const serializedTxs = txs.map((tx) =>
              tx
                .serialize({
                  requireAllSignatures: false,
                  verifySignatures: false,
                })
                .toString('base64')
            );

            const signatures = await provider.request({
              method: 'signAllTransactions',
              params: [serializedTxs],
            });

            return (signatures as string[]).map((sig) =>
              Transaction.from(Buffer.from(sig, 'base64'))
            );
          },
        });

        console.info('✅ Secure Privy wallet connected:', solanaWallet.address);
      } catch (error) {
        console.error('❌ Failed to connect secure Privy wallet:', error);
      }
    };

    handlePrivyAuth();
  }, [authenticated, user?.id, walletSignature, sdk]);

  return { authenticated, user, wallets };
};
