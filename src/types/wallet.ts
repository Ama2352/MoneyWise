/**
 * Wallet Types - Based on Backend DTOs
 */

// Wallet DTO from backend
export interface WalletDTO {
  walletId: string;
  walletName: string;
  balance: number;
}

// Create wallet request
export interface CreateWalletRequest {
  walletName: string;
  balance: number;
}

// Update wallet request
export interface UpdateWalletRequest {
  walletId: string;
  walletName: string;
  balance: number;
}

// Wallet with computed fields for UI
export interface WalletWithMeta extends WalletDTO {
  isActive?: boolean;
  lastActivity?: string;
  transactionCount?: number;
  isDefault?: boolean;
}
