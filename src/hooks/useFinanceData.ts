/**
 * SWR-based hooks for finance data
 * Following the development guide patterns
 */

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import {
  categoryApi,
  transactionApi,
  walletApi,
  statisticsApi,
} from '../api/financeApi';
import { SWR_KEYS } from '../config/swr';
import { useLanguageContext } from '../contexts';
import {
  type Wallet,
  type CreateWalletRequest,
  type Transaction,
  type CreateTransactionRequest,
  type SearchTransactionRequest,
  type Category,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
  type CashFlow,
} from '../types/finance';

export const useWalletMutations = () => {
  const { translations } = useLanguageContext();

  const createWallet = async (data: CreateWalletRequest) => {
    try {
      const newWallet = await walletApi.create(data);
      mutate(SWR_KEYS.WALLETS.ALL);
      return { success: true, data: newWallet };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || translations.errors.unexpected,
      };
    }
  };

  const updateWallet = async (data: Wallet) => {
    try {
      const updatedWallet = await walletApi.update(data);
      mutate(SWR_KEYS.WALLETS.ALL);
      return { success: true, data: updatedWallet };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || translations.errors.unexpected,
      };
    }
  };

  const deleteWallet = async (walletId: string) => {
    try {
      await walletApi.delete(walletId);
      mutate(SWR_KEYS.WALLETS.ALL);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || translations.errors.unexpected,
      };
    }
  };

  return {
    createWallet,
    updateWallet,
    deleteWallet,
  };
};

export const useWallet = (walletId: string | null) => {
  const { data, error, isLoading } = useSWR<Wallet>(
    walletId ? SWR_KEYS.WALLETS.BY_ID(walletId) : null,
    walletId ? () => walletApi.getById(walletId) : null
  );

  return {
    wallet: data,
    isLoading,
    error,
    refresh: () => walletId && mutate(SWR_KEYS.WALLETS.BY_ID(walletId)),
  };
};

/**
 * Hook to fetch all wallets using SWR
 */
export const useWallets = () => {
  console.log('💰 useWallets: Starting...');

  const { data, error, isLoading } = useSWR<Wallet[]>(
    SWR_KEYS.WALLETS.ALL,
    async () => {
      console.log('📡 API: Fetching wallets...');
      const result = await walletApi.getAll();
      console.log(`� API: Received ${result?.length || 0} wallets`);
      return result;
    }
  );

  return {
    wallets: data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.WALLETS.ALL),
  };
};

export const useTransactions = () => {
  console.log('🔄 useTransactions: Starting...');

  const { data, error, isLoading } = useSWR<Transaction[]>(
    SWR_KEYS.TRANSACTIONS.ALL,
    async () => {
      console.log('📡 API: Fetching transactions...');
      const result = await transactionApi.getAll();
      console.log(`� API: Received ${result?.length || 0} transactions`);
      return result;
    }
  );
  // Use useMemo to avoid reversing on every render and prevent mutation
  const transactions = useMemo(() => {
    if (!data) return [];
    return [...data].reverse(); // Create a new array before reversing
  }, [data]);

  return {
    transactions,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.TRANSACTIONS.ALL),
  };
};

export const useTransaction = (transactionId: string | null) => {
  const { data, error, isLoading } = useSWR<Transaction>(
    transactionId ? SWR_KEYS.TRANSACTIONS.BY_ID(transactionId) : null,
    transactionId ? () => transactionApi.getById(transactionId) : null
  );

  return {
    transaction: data,
    isLoading,
    error,
    refresh: () =>
      transactionId && mutate(SWR_KEYS.TRANSACTIONS.BY_ID(transactionId)),
  };
};

export const useTransactionMutations = () => {
  const { translations } = useLanguageContext();

  const createTransaction = async (data: CreateTransactionRequest) => {
    try {
      const newTransaction = await transactionApi.create(data);
      mutate(SWR_KEYS.TRANSACTIONS.ALL);
      return { success: true, data: newTransaction };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.errors.transactions.createError,
      };
    }
  };

  const updateTransaction = async (data: Transaction) => {
    try {
      const updatedTransaction = await transactionApi.update(data);
      mutate(SWR_KEYS.TRANSACTIONS.ALL);
      return { success: true, data: updatedTransaction };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.errors.transactions.updateError,
      };
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      await transactionApi.delete(transactionId);
      mutate(SWR_KEYS.TRANSACTIONS.ALL);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.errors.transactions.deleteError,
      };
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

/**
 * Hook to fetch all categories using SWR
 * Auto-caches and shares data between components
 */
export const useCategories = () => {
  console.log('🏷️ useCategories: Starting...');

  const { data, error, isLoading } = useSWR<Category[]>(
    SWR_KEYS.CATEGORIES.ALL,
    async () => {
      console.log('📡 API: Fetching categories...');
      const result = await categoryApi.getAll();
      console.log(`� API: Received ${result?.length || 0} categories`);
      return result;
    }
  );

  return {
    categories: data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.CATEGORIES.ALL),
  };
};

/**
 * Hook to fetch a single category by ID using SWR
 */
export const useCategory = (categoryId: string | null) => {
  const { data, error, isLoading } = useSWR<Category>(
    categoryId ? SWR_KEYS.CATEGORIES.BY_ID(categoryId) : null,
    categoryId ? () => categoryApi.getById(categoryId) : null
  );

  return {
    category: data,
    isLoading,
    error,
    // Function to manually refresh this category
    refresh: () => categoryId && mutate(SWR_KEYS.CATEGORIES.BY_ID(categoryId)),
  };
};

/**
 * Hook for category CRUD operations
 * Automatically refreshes SWR cache after mutations
 */
export const useCategoryMutations = () => {
  const { translations } = useLanguageContext();

  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      const newCategory = await categoryApi.create(data);

      // Refresh categories list in SWR cache
      mutate(SWR_KEYS.CATEGORIES.ALL);

      return { success: true, data: newCategory };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.categories.notifications.createError,
      };
    }
  };

  const updateCategory = async (data: UpdateCategoryRequest) => {
    try {
      const updatedCategory = await categoryApi.update(data);

      // Refresh categories list in SWR cache
      mutate(SWR_KEYS.CATEGORIES.ALL);

      return { success: true, data: updatedCategory };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.categories.notifications.updateError,
      };
    }
  };
  const deleteCategory = async (categoryId: string) => {
    try {
      await categoryApi.delete(categoryId);

      // Refresh categories list in SWR cache
      mutate(SWR_KEYS.CATEGORIES.ALL);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.categories.notifications.deleteError,
      };
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

/**
 * Hook to fetch cash flow statistics for a specific date range
 * with optional auto-refresh
 */
export const useCashFlow = (
  startDate: string | null,
  endDate: string | null,
  refreshInterval?: number
) => {
  const { data, error, isLoading } = useSWR<CashFlow>(
    startDate && endDate
      ? SWR_KEYS.STATISTICS.CASH_FLOW(startDate, endDate)
      : null,
    startDate && endDate
      ? () => statisticsApi.getCashFlow(startDate, endDate)
      : null,
    {
      refreshInterval: refreshInterval || 5 * 60 * 1000, // Default 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    cashFlow: data,
    isLoading,
    error,
    refresh: () =>
      startDate &&
      endDate &&
      mutate(SWR_KEYS.STATISTICS.CASH_FLOW(startDate, endDate)),
  };
};

export const useTransactionSearch = (filters?: SearchTransactionRequest) => {
  const cacheKey =
    filters && Object.keys(filters).length > 0
      ? `${SWR_KEYS.TRANSACTIONS.SEARCH}?${JSON.stringify(filters)}`
      : null;

  const { data, error, isLoading } = useSWR<Transaction[]>(cacheKey, () =>
    transactionApi.search(filters!)
  );

  // Use useMemo here too to prevent mutation and unnecessary re-computation
  const transactions = useMemo(() => {
    if (!data) return [];
    return [...data].reverse(); // Create a new array before reversing
  }, [data]);

  return {
    transactions,
    isLoading,
    error,
    refresh: () => cacheKey && mutate(cacheKey),
  };
};
