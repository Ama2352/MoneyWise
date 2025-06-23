/**
 * Wallet Management Type Definitions
 * Matching backend WalletController DTOs
 */

export interface Wallet {
  walletId: string; // UUID from backend
  walletName: string;
  balance: number; // BigDecimal from backend as number
}

export interface CreateWalletRequest {
  walletName: string;
  balance: number;
}

export interface UpdateWalletRequest {
  walletId: string;
  walletName: string;
  balance: number;
}

// UI-specific types for enhanced experience
export interface WalletWithMetadata extends Wallet {
  lastActivity?: string;
  type?: 'personal' | 'business' | 'savings';
  color?: string;
  isDefault?: boolean;
} 