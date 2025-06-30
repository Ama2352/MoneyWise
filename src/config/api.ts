/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Environment-based API base URL - Use relative path for Vite proxy
export const API_BASE_URL = '/api';

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 [CONFIG] API Configuration:', {
    API_BASE_URL,
    MODE: import.meta.env.MODE,
  });
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/Accounts/SignIn',
    REGISTER: '/Accounts/SignUp',
    REFRESH: '/Accounts/RefreshToken',
  },

  ACCOUNT: {
    BASE: '/Accounts',
    PROFILE: '/Accounts/profile',
    AVATAR: '/Accounts/avatar',
  },

  // Money Management specific endpoints
  TRANSACTIONS: {
    BASE: '/Transactions',
    SEARCH: '/Transactions/search',
  },
  CATEGORIES: {
    BASE: '/Categories',
  },

  WALLETS: {
    BASE: '/Wallets',
  },

  STATISTICS: {
    CASH_FLOW: '/Statistics/cash-flow',
    WALLET_BREAKDOWN: '/Statistics/wallet-breakdown',
  },

  BUDGETS: {
    BASE: '/Budgets',
    PROGRESS: '/Budgets/progress',
    SEARCH: '/Budgets/search',
  },

  SAVING_GOALS: {
    BASE: '/SavingGoals',
    PROGRESS: '/SavingGoals/progress',
    SEARCH: '/SavingGoals/search',
  },
} as const;
