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
  savingGoalApi,
  budgetApi,
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
  type SavingGoalProgress,
  type BudgetProgress,
  type CreateSavingGoalRequest,
  type UpdateSavingGoalRequest,
  type CreateBudgetRequest,
  type UpdateBudgetRequest,
  type SavingGoal,
  type Budget,
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
  const { data, error, isLoading } = useSWR<Wallet[]>(
    SWR_KEYS.WALLETS.ALL,
    async () => {
      const result = await walletApi.getAll();
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
  const { data, error, isLoading } = useSWR<Transaction[]>(
    SWR_KEYS.TRANSACTIONS.ALL,
    async () => {
      const result = await transactionApi.getAll();

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
  const { data, error, isLoading } = useSWR<Category[]>(
    SWR_KEYS.CATEGORIES.ALL,
    async () => {
      const result = await categoryApi.getAll();

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

export const useSavingGoalProgress = (language?: string) => {
  // Include language in SWR key to force refetch when language changes
  const swrKey = language 
    ? `${SWR_KEYS.SAVING_GOALS.PROGRESS}?lang=${language}`
    : SWR_KEYS.SAVING_GOALS.PROGRESS;
    
  const { data, error, isLoading, mutate: mutateSavingGoals } = useSWR<SavingGoalProgress[]>(
    swrKey,
    async () => {
      const result = await savingGoalApi.getAllSavingGoalProgress();
      return result;
    }
  );

  return {
    savingGoalProgress: data,
    isLoading,
    error,
    refresh: () => mutateSavingGoals(undefined, { revalidate: true }),
  };
};

export const useBudgetProgress = () => {
  const { data, error, isLoading } = useSWR<BudgetProgress[]>(
    SWR_KEYS.BUDGETS.PROGRESS,
    async () => {
      const result = await budgetApi.getAllBudgetProgress();
      return result;
    }
  );

  return {
    budgetProgress: data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.BUDGETS.PROGRESS),
  };
};

export const useSavingGoalMutations = () => {
  const { translations } = useLanguageContext();

  const createSavingGoal = async (data: CreateSavingGoalRequest) => {
    try {
      const newGoal = await savingGoalApi.createSavingGoal(data);
      mutate(SWR_KEYS.SAVING_GOALS.PROGRESS);
      return { success: true, data: newGoal };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.savingGoals.notifications.createError,
      };
    }
  };

  const updateSavingGoal = async (data: UpdateSavingGoalRequest) => {
    try {
      const updatedGoal = await savingGoalApi.updateSavingGoal(data);
      mutate(SWR_KEYS.SAVING_GOALS.PROGRESS);
      return { success: true, data: updatedGoal };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.savingGoals.notifications.updateError,
      };
    }
  };

  const deleteSavingGoal = async (goalId: string) => {
    try {
      await savingGoalApi.deleteSavingGoal(goalId);
      mutate(SWR_KEYS.SAVING_GOALS.PROGRESS);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.savingGoals.notifications.deleteError,
      };
    }
  };

  return {
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
  };
};

export const useBudgetMutations = () => {
  const { translations } = useLanguageContext();

  const createBudget = async (data: CreateBudgetRequest) => {
    try {
      const newBudget = await budgetApi.createBudget(data);
      mutate(SWR_KEYS.BUDGETS.PROGRESS);
      return { success: true, data: newBudget };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.budgets.notifications.createError,
      };
    }
  };

  const updateBudget = async (data: UpdateBudgetRequest) => {
    try {
      const updatedBudget = await budgetApi.updateBudget(data);
      mutate(SWR_KEYS.BUDGETS.PROGRESS);
      return { success: true, data: updatedBudget };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.budgets.notifications.updateError,
      };
    }
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      await budgetApi.deleteBudget(budgetId);
      mutate(SWR_KEYS.BUDGETS.PROGRESS);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          translations.budgets.notifications.deleteError,
      };
    }
  };

  return {
    createBudget,
    updateBudget,
    deleteBudget,
  };
};

export const useSavingGoal = (goalId: string | null) => {
  const { data, error, isLoading } = useSWR<SavingGoal>(
    goalId ? SWR_KEYS.SAVING_GOALS.BY_ID(goalId) : null,
    goalId ? () => savingGoalApi.getSavingGoalById(goalId) : null
  );

  return {
    savingGoal: data,
    isLoading,
    error,
    refresh: () => goalId && mutate(SWR_KEYS.SAVING_GOALS.BY_ID(goalId)),
  };
};

export const useBudget = (budgetId: string | null) => {
  const { data, error, isLoading } = useSWR<Budget>(
    budgetId ? SWR_KEYS.BUDGETS.BY_ID(budgetId) : null,
    budgetId ? () => budgetApi.getBudgetById(budgetId) : null
  );

  return {
    budget: data,
    isLoading,
    error,
    refresh: () => budgetId && mutate(SWR_KEYS.BUDGETS.BY_ID(budgetId)),
  };
};
