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
 * Global SWR configuration
 */
export const swrConfig: SWRConfiguration = {
  fetcher: swrFetcher,

  // Cache data for 5 minutes before considering it stale
  dedupingInterval: 5 * 60 * 1000,

  // Auto-refresh data when window gets focus
  revalidateOnFocus: true,

  // Auto-refresh data when network reconnects
  revalidateOnReconnect: true,

  // Retry failed requests
  errorRetryCount: 3,
  errorRetryInterval: 5000,

  // Background refresh interval (10 minutes)
  refreshInterval: 10 * 60 * 1000,

  // Don't refresh when device is offline
  revalidateIfStale: true,

  // Show error boundaries for unhandled errors
  shouldRetryOnError: error => {
    // Don't retry on 4xx errors (client errors)
    return error.status >= 500;
  },
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
} as const;
