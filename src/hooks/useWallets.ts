/**
 * Wallet Hooks - Data fetching and mutations for wallets
 */

import { useCallback } from 'react';
import useSWR from 'swr';
import { walletsApi } from '../api/walletsApi';
import { useToast } from './useToast';
import { useLanguageContext } from '../contexts/LanguageContext';
import type {
  CreateWalletRequest,
  UpdateWalletRequest,
} from '../types/wallet';

// Hook for fetching all wallets
export const useWallets = () => {
  const { language } = useLanguageContext();
  
  const { data, error, isLoading, mutate } = useSWR(
    ['wallets', language],
    () => walletsApi.getAllWallets(language === 'vi' ? 'vi' : 'en'),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
      errorRetryCount: 3,
    }
  );

  return {
    wallets: data || [],
    isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
};

// Hook for fetching single wallet
export const useWallet = (walletId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    walletId ? ['wallet', walletId] : null,
    () => walletsApi.getWalletById(walletId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      errorRetryCount: 3,
    }
  );

  return {
    wallet: data || null,
    isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
};

// Hook for wallet mutations (CRUD operations)
export const useWalletMutations = () => {
  const { showToast } = useToast();

  const createWallet = useCallback(
    async (data: CreateWalletRequest) => {
      try {
        const result = await walletsApi.createWallet(data);
        showToast(
          'Wallet created successfully',
          'success'
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create wallet';
        showToast(message, 'error');
        return { success: false, error: message };
      }
    },
    [showToast]
  );

  const updateWallet = useCallback(
    async (data: UpdateWalletRequest) => {
      try {
        const result = await walletsApi.updateWallet(data);
        showToast(
          'Wallet updated successfully',
          'success'
        );
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update wallet';
        showToast(message, 'error');
        return { success: false, error: message };
      }
    },
    [showToast]
  );

  const deleteWallet = useCallback(
    async (walletId: string) => {
      try {
        await walletsApi.deleteWallet(walletId);
        showToast(
          'Wallet deleted successfully',
          'success'
        );
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete wallet';
        showToast(message, 'error');
        return { success: false, error: message };
      }
    },
    [showToast]
  );

  return {
    createWallet,
    updateWallet,
    deleteWallet,
  };
};
