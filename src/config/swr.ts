/**
 * SWR Configuration
 * Global configuration for SWR data fetching
 */

import type { SWRConfiguration } from 'swr';
import httpClient from '../api/httpClient';

/**
 * Global fetcher function for SWR
 * Uses our existing httpClient with authentication and error handling
 */
export const swrFetcher = async (url: string) => {
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Optimized SWR configuration for better performance
 * Reduced aggressive revalidation to prevent excessive re-renders
 */
export const swrConfig: SWRConfiguration = {
  fetcher: swrFetcher,

  // Increase deduping interval to reduce duplicate requests
  dedupingInterval: 10 * 60 * 1000, // 10 minutes instead of 5

  // Disable aggressive auto-refresh behaviors that cause re-renders
  revalidateOnFocus: false, // Disable focus-based refresh
  revalidateOnReconnect: true, // Keep network reconnect refresh

  // Reduce retry attempts to prevent cascading re-renders
  errorRetryCount: 2, // Reduced from 3
  errorRetryInterval: 3000, // Reduced from 5000ms

  // Disable background refresh for better performance
  refreshInterval: 0, // Disable automatic background refresh

  // Only revalidate if data is truly stale
  revalidateIfStale: false, // Prevent unnecessary refreshes

  // More conservative error handling
  shouldRetryOnError: error => {
    // Only retry on server errors, not client errors
    return error.status >= 500;
  },

  // Add additional performance optimizations
  compare: (a, b) => {
    // Custom comparison to prevent unnecessary re-renders
    // Only trigger re-render if data actually changed
    if (a === b) return true;
    if (!a || !b) return false;

    // For arrays, compare length and first item
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && (a.length === 0 || a[0]?.id === b[0]?.id);
    }

    return JSON.stringify(a) === JSON.stringify(b);
  },

  // Optimize loading states
  loadingTimeout: 3000, // 3 second timeout for loading states

  // Prevent unnecessary revalidation
  revalidateOnMount: true, // Only revalidate on mount, not on every prop change
};

/**
 * SWR keys for consistent caching
 * Use these constants instead of hardcoded strings
 */
export const SWR_KEYS = {
  CATEGORIES: {
    ALL: '/Categories',
    BY_ID: (categoryId: string) => `/Categories/${categoryId}`,
  },
  TRANSACTIONS: {
    ALL: '/Transactions',
    BY_ID: (transactionId: string) => `/Transactions/${transactionId}`,
    SEARCH: '/Transactions/search',
  },
  WALLETS: {
    ALL: '/Wallets',
    BY_ID: (walletId: string) => `/Wallets/${walletId}`,
  },
  STATISTICS: {
    CASH_FLOW: (startDate: string, endDate: string) =>
      `/Statistics/cash-flow?startDate=${startDate}&endDate=${endDate}`,
  },

  BUDGETS: {
    ALL: '/Budgets',
    BY_ID: (budgetId: string) => `/Budgets/${budgetId}`,
    PROGRESS: `/Budgets/progress`,
  },

  SAVING_GOALS: {
    ALL: '/SavingGoals',
    BY_ID: (savingGoalId: string) => `/SavingGoals/${savingGoalId}`,
    PROGRESS: `/SavingGoals/progress`,
    SEARCH: '/SavingGoals/search',
  },
} as const;
