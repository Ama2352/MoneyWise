/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Environment-based API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
    PROFILE: '/Accounts/profile',
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
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
  },
} as const;
