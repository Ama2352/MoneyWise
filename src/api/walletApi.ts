/**
 * Wallet API Client
 * Handles all wallet-related API operations
 */

import httpClient from './httpClient';
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from '../types/wallet';

// Wallet endpoints (matching backend WalletController)
const WALLET_ENDPOINTS = {
  BASE: '/Wallets',
  BY_ID: (id: string) => `/Wallets/${id}`,
} as const;

export const walletApi = {
  /**
   * Get all user wallets
   */
  getAll: async (acceptLanguage?: string): Promise<Wallet[]> => {
    const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};
    const response = await httpClient.get<Wallet[]>(WALLET_ENDPOINTS.BASE, { headers });
    return response.data;
  },

  /**
   * Get wallet by ID
   */
  getById: async (walletId: string): Promise<Wallet> => {
    const response = await httpClient.get<Wallet>(WALLET_ENDPOINTS.BY_ID(walletId));
    return response.data;
  },

  /**
   * Create new wallet
   */
  create: async (walletData: CreateWalletRequest): Promise<Wallet> => {
    const response = await httpClient.post<Wallet>(WALLET_ENDPOINTS.BASE, walletData);
    return response.data;
  },

  /**
   * Update existing wallet
   */
  update: async (walletData: UpdateWalletRequest): Promise<Wallet> => {
    const response = await httpClient.put<Wallet>(WALLET_ENDPOINTS.BASE, walletData);
    return response.data;
  },

  /**
   * Delete wallet
   */
  delete: async (walletId: string): Promise<string> => {
    const response = await httpClient.delete<string>(WALLET_ENDPOINTS.BY_ID(walletId));
    return response.data; // Returns the deleted wallet ID
  },
}; 