import { useEffect } from 'react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
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

  useEffect(() => {
    const handlePrivyAuth = async () => {
      if (authenticated && user) {
        try {
          // Find the Solana embedded wallet created by Privy
          // Privy embedded wallets have walletClientType === 'privy'
          // and address starting with Solana base58 format
          const solanaWallet = wallets.find(
            (wallet) => wallet.walletClientType === 'privy'
          );

          if (solanaWallet && solanaWallet.address) {
            // Convert Privy wallet address to Solana PublicKey
            const publicKey = new PublicKey(solanaWallet.address);

            // Connect Privy's secure embedded wallet to SDK
            await sdk.wallet.connectCustomWallet('Privy Embedded Wallet', {
              publicKey,
              signTransaction: async (tx: Transaction) => {
                // SECURITY: Signing happens in Privy's secure infrastructure
                // The private key is never exposed to the client
                const provider = await solanaWallet.getEthereumProvider();

                if (!provider || typeof provider.request !== 'function') {
                  throw new Error('Privy wallet provider not available');
                }

                // Serialize transaction for signing
                const serializedTx = tx.serialize({
                  requireAllSignatures: false,
                  verifySignatures: false,
                });

                // Request signature from Privy's secure infrastructure
                const signature = await provider.request({
                  method: 'signTransaction',
                  params: [serializedTx.toString('base64')],
                });

                // Deserialize signed transaction
                return Transaction.from(Buffer.from(signature as string, 'base64'));
              },
              signAllTransactions: async (txs: Transaction[]) => {
                // SECURITY: Batch signing through Privy's secure infrastructure
                const provider = await solanaWallet.getEthereumProvider();

                if (!provider || typeof provider.request !== 'function') {
                  throw new Error('Privy wallet provider not available');
                }

                const serializedTxs = txs.map((tx) =>
                  tx.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                  }).toString('base64')
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
          } else {
            console.warn('⚠️ No Solana embedded wallet found. Ensure Privy is configured for Solana.');
          }
        } catch (error) {
          console.error('❌ Failed to connect secure Privy wallet:', error);
        }
      } else if (!authenticated) {
        // Disconnect wallet on logout
        try {
          await sdk.wallet.disconnectWallet();
          console.info('✅ Wallet disconnected');
        } catch (error) {
          console.error('❌ Failed to disconnect wallet:', error);
        }
      }
    };

    handlePrivyAuth();
  }, [authenticated, user, wallets, sdk]);

  return { authenticated, user, wallets };
}; 