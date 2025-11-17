import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair
} from '@solana/web3.js';
import { 
  TransactionResult, 
  SendTransactionParams, 
  TransactionHistoryItem 
} from './types';
import { SolanaWalletManager } from './wallet';

export class SolanaTransactionManager {
  private walletManager: SolanaWalletManager;
  private connection: Connection;

  constructor(walletManager: SolanaWalletManager) {
    this.walletManager = walletManager;
    this.connection = walletManager.getConnection();
  }

  /**
   * Send SOL to another address
   *
   * ⚠️ DEMO MODE: Currently returns mock signatures
   *
   * TODO for production:
   * 1. Sign the transaction using the wallet adapter
   * 2. Send the signed transaction to the network
   * 3. Confirm the transaction
   * 4. Return the real transaction signature
   *
   * Example production implementation:
   * ```
   * const signedTx = await this.walletManager.signTransaction(transaction);
   * const signature = await this.connection.sendRawTransaction(signedTx.serialize());
   * await this.connection.confirmTransaction(signature);
   * return { signature, success: true };
   * ```
   */
  async sendSol(params: SendTransactionParams): Promise<TransactionResult> {
    const walletState = this.walletManager.getState();

    if (!walletState.connected || !walletState.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const recipientPubkey = new PublicKey(params.recipientAddress);
      const senderPubkey = walletState.publicKey;

      // Create transaction
      const transaction = new Transaction();

      // Add transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: recipientPubkey,
        lamports: params.amount,
      });

      transaction.add(transferInstruction);

      // Add memo if provided
      if (params.memo) {
        const memoInstruction = new TransactionInstruction({
          keys: [{ pubkey: senderPubkey, isSigner: true, isWritable: false }],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
          data: Buffer.from(params.memo, 'utf8'),
        });
        transaction.add(memoInstruction);
      }

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPubkey;

      // ⚠️ DEMO MODE: Simulating a successful transaction
      // TODO: Implement actual transaction signing and sending for production
      console.warn('⚠️ DEMO MODE: Transaction not actually sent. Returning mock signature.');
      const signature = this.generateMockSignature();

      return {
        signature,
        success: true
      };

    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get transaction history for the connected wallet
   */
  async getTransactionHistory(limit = 10): Promise<TransactionHistoryItem[]> {
    const walletState = this.walletManager.getState();
    
    if (!walletState.connected || !walletState.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // For demo purposes, return mock transaction history
      // In a real implementation, you would fetch from the RPC
      return this.generateMockTransactionHistory(limit);
      
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  /**
   * Estimate transaction fee
   */
  async estimateTransactionFee(params: SendTransactionParams): Promise<number> {
    try {
      const recipientPubkey = new PublicKey(params.recipientAddress);
      const walletState = this.walletManager.getState();
      
      if (!walletState.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Create a mock transaction to estimate fees
      const transaction = new Transaction();
      
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: walletState.publicKey,
        toPubkey: recipientPubkey,
        lamports: params.amount,
      });
      
      transaction.add(transferInstruction);

      if (params.memo) {
        const memoInstruction = new TransactionInstruction({
          keys: [{ pubkey: walletState.publicKey, isSigner: true, isWritable: false }],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
          data: Buffer.from(params.memo, 'utf8'),
        });
        transaction.add(memoInstruction);
      }

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletState.publicKey;

      // Estimate fee
      const fee = await this.connection.getFeeForMessage(transaction.compileMessage());
      return fee.value || 5000; // Default to 5000 lamports if estimation fails

    } catch (error) {
      console.error('Error estimating transaction fee:', error);
      return 5000; // Default fee
    }
  }

  /**
   * Get transaction details by signature
   */
  async getTransactionDetails(signature: string): Promise<any> {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  }

  /**
   * Check if transaction is confirmed
   */
  async confirmTransaction(signature: string): Promise<boolean> {
    try {
      const confirmation = await this.connection.confirmTransaction(signature);
      return !confirmation.value.err;
    } catch (error) {
      console.error('Error confirming transaction:', error);
      return false;
    }
  }

  /**
   * ⚠️ DEMO ONLY: Generate a mock transaction signature for demo purposes
   *
   * SECURITY WARNING: This generates FAKE signatures for development/testing only.
   * These signatures are NOT real blockchain transactions.
   * Remove or disable this method before production deployment.
   */
  private generateMockSignature(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * ⚠️ DEMO ONLY: Generate mock transaction history for demo purposes
   *
   * SECURITY WARNING: This returns FAKE transaction history for development/testing.
   * In production, this should fetch real transaction data from the blockchain.
   *
   * Production implementation should use:
   * ```
   * const signatures = await this.connection.getSignaturesForAddress(
   *   walletState.publicKey,
   *   { limit }
   * );
   * return signatures;
   * ```
   */
  private generateMockTransactionHistory(limit: number): TransactionHistoryItem[] {
    console.warn('⚠️ DEMO MODE: Showing mock transaction history. Not real blockchain data.');

    const transactions: TransactionHistoryItem[] = [];
    const now = Math.floor(Date.now() / 1000);

    for (let i = 0; i < limit; i++) {
      transactions.push({
        signature: this.generateMockSignature(),
        slot: 200000000 + i,
        blockTime: now - (i * 3600), // One hour apart
        confirmationStatus: 'finalized',
        err: null,
        memo: i % 3 === 0 ? `Demo transaction ${i + 1}` : undefined
      });
    }

    return transactions;
  }
} 